const express = require('express');
const User = require('../models/User');
const Friendship = require('../models/Friendship');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/friends/request
// @desc    Send friend request
// @access  Private
router.post('/request', authenticate, async (req, res) => {
    try {
        const { recipientId, message } = req.body;

        if (!recipientId) {
            return res.status(400).json({
                success: false,
                message: 'Recipient ID is required'
            });
        }

        // Check if recipient exists
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if trying to add yourself
        if (req.user.id === recipientId) {
            return res.status(400).json({
                success: false,
                message: 'Cannot send friend request to yourself'
            });
        }

        // Check if friendship already exists
        const existingFriendship = await Friendship.findOne({
            $or: [
                { requester: req.user.id, recipient: recipientId },
                { requester: recipientId, recipient: req.user.id }
            ]
        });

        if (existingFriendship) {
            if (existingFriendship.status === 'accepted') {
                return res.status(400).json({
                    success: false,
                    message: 'You are already friends with this user'
                });
            } else if (existingFriendship.status === 'pending') {
                return res.status(400).json({
                    success: false,
                    message: 'Friend request already sent'
                });
            }
        }

        // Create new friendship request
        const friendship = await Friendship.create({
            requester: req.user.id,
            recipient: recipientId,
            requestMessage: message || '',
            status: 'pending'
        });

        await friendship.populate('recipient', 'username displayName profilePicture');

        res.status(201).json({
            success: true,
            message: 'Friend request sent successfully',
            data: friendship
        });
    } catch (error) {
        console.error('Send friend request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error sending friend request',
            error: error.message
        });
    }
});

// @route   POST /api/friends/accept/:id
// @desc    Accept friend request
// @access  Private
router.post('/accept/:id', authenticate, async (req, res) => {
    try {
        const friendship = await Friendship.findById(req.params.id);

        if (!friendship) {
            return res.status(404).json({
                success: false,
                message: 'Friend request not found'
            });
        }

        // Check if user is the recipient
        if (friendship.recipient.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You can only accept requests sent to you'
            });
        }

        // Check if request is pending
        if (friendship.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Friend request is not pending'
            });
        }

        // Accept friendship
        friendship.status = 'accepted';
        await friendship.save();

        // Add users to each other's friends list
        await User.findByIdAndUpdate(friendship.requester, {
            $addToSet: { friends: friendship.recipient }
        });
        await User.findByIdAndUpdate(friendship.recipient, {
            $addToSet: { friends: friendship.requester }
        });

        await friendship.populate('requester recipient', 'username displayName profilePicture');

        res.json({
            success: true,
            message: 'Friend request accepted',
            data: friendship
        });
    } catch (error) {
        console.error('Accept friend request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error accepting friend request',
            error: error.message
        });
    }
});

// @route   GET /api/friends
// @desc    Get user's friends list
// @access  Private
router.get('/', authenticate, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Get accepted friendships
        const friendships = await Friendship.find({
            $or: [
                { requester: req.user.id, status: 'accepted' },
                { recipient: req.user.id, status: 'accepted' }
            ]
        })
        .populate('requester recipient', 'username displayName profilePicture bio location isVerified')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit);

        // Extract friend data
        const friends = friendships.map(friendship => {
            const friend = friendship.requester._id.toString() === req.user.id 
                ? friendship.recipient 
                : friendship.requester;
            return {
                ...friend.toObject(),
                friendshipId: friendship._id,
                friendsSince: friendship.updatedAt
            };
        });

        const total = await Friendship.countDocuments({
            $or: [
                { requester: req.user.id, status: 'accepted' },
                { recipient: req.user.id, status: 'accepted' }
            ]
        });

        res.json({
            success: true,
            data: friends,
            pagination: {
                page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Get friends error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching friends',
            error: error.message
        });
    }
});

// @route   GET /api/friends/requests
// @desc    Get pending friend requests
// @access  Private
router.get('/requests', authenticate, async (req, res) => {
    try {
        const requests = await Friendship.find({
            recipient: req.user.id,
            status: 'pending'
        })
        .populate('requester', 'username displayName profilePicture bio location isVerified')
        .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: requests,
            count: requests.length
        });
    } catch (error) {
        console.error('Get friend requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching friend requests',
            error: error.message
        });
    }
});

// @route   DELETE /api/friends/:id
// @desc    Remove friend
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const friendship = await Friendship.findById(req.params.id);

        if (!friendship) {
            return res.status(404).json({
                success: false,
                message: 'Friendship not found'
            });
        }

        // Check if user is involved in this friendship
        const isRequester = friendship.requester.toString() === req.user.id;
        const isRecipient = friendship.recipient.toString() === req.user.id;

        if (!isRequester && !isRecipient) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to modify this friendship'
            });
        }

        // If friendship is accepted, remove from both users' friends lists
        if (friendship.status === 'accepted') {
            await User.findByIdAndUpdate(friendship.requester, {
                $pull: { friends: friendship.recipient }
            });
            await User.findByIdAndUpdate(friendship.recipient, {
                $pull: { friends: friendship.requester }
            });
        }

        // Delete friendship record
        await Friendship.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Friend removed successfully'
        });
    } catch (error) {
        console.error('Remove friend error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error removing friend',
            error: error.message
        });
    }
});

module.exports = router; 