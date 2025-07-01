const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/user/avatar
// @desc    Update user avatar with a URL
// @access  Private
router.post(
    '/avatar',
    authenticate,
    [
        body('avatarUrl', 'Avatar URL is required and must be a valid URL').isURL()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { avatarUrl } = req.body;

        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found.' });
            }

            user.profilePicture = avatarUrl;
            await user.save();

            res.json({
                success: true,
                message: 'Avatar updated successfully.',
                data: {
                    profilePicture: user.profilePicture
                }
            });
        } catch (error) {
            console.error('Avatar update error:', error);
            res.status(500).json({ success: false, message: 'Server error while updating avatar.' });
        }
    }
);

// @route   DELETE /api/user/avatar
// @desc    Delete user avatar
// @access  Private
router.delete('/avatar', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (!user.profilePicture) {
            return res.status(400).json({ success: false, message: 'No avatar to delete.' });
        }

        user.profilePicture = null;
        await user.save();

        res.json({
            success: true,
            message: 'Avatar deleted successfully.'
        });
    } catch (error) {
        console.error('Avatar delete error:', error);
        res.status(500).json({ success: false, message: 'Server error while deleting avatar.' });
    }
});
// @route   GET /api/users/search
// @desc    Search users by username, displayName, or bio
// @access  Private
router.get('/search', authenticate, async (req, res) => {
    try {
        const { q, page = 1, limit = 20 } = req.query;

        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Search query must be at least 2 characters long'
            });
        }

        const searchQuery = q.trim();
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Create search regex for case-insensitive search
        const searchRegex = new RegExp(searchQuery, 'i');

        // Build search query
        const query = {
            _id: { $ne: req.user.id }, // Exclude current user
            isActive: true,
            $or: [
                { username: searchRegex },
                { displayName: searchRegex },
                { bio: searchRegex }
            ]
        };

        // Get users with pagination
        const users = await User.find(query)
            .select('username displayName profilePicture bio friendsCount postsCount isPrivate isVerified')
            .sort({ friendsCount: -1, postsCount: -1 }) // Sort by popularity
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count
        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    page: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit)),
                    total,
                    hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
                    hasPrev: parseInt(page) > 1
                }
            }
        });
    } catch (error) {
        console.error('User search error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during user search',
            error: error.message
        });
    }
});

// @route   GET /api/users/suggestions
// @desc    Get user suggestions based on friends of friends and similar interests
// @access  Private
router.get('/suggestions', authenticate, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get current user's friends
        const currentUser = await User.findById(req.user.id).populate('friends');
        const friendIds = currentUser.friends.map(friend => friend._id);

        // Get friends of friends (excluding current user and their direct friends)
        const friendsOfFriends = await User.aggregate([
            {
                $match: {
                    _id: { $in: friendIds }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'friends',
                    foreignField: '_id',
                    as: 'friendsOfFriends'
                }
            },
            {
                $unwind: '$friendsOfFriends'
            },
            {
                $match: {
                    'friendsOfFriends._id': {
                        $nin: [req.user.id, ...friendIds]
                    }
                }
            },
            {
                $group: {
                    _id: '$friendsOfFriends._id',
                    user: { $first: '$friendsOfFriends' },
                    mutualFriends: { $sum: 1 }
                }
            },
            {
                $sort: { mutualFriends: -1 }
            },
            {
                $skip: skip
            },
            {
                $limit: parseInt(limit)
            }
        ]);

        // Get popular users (users with many friends/posts, excluding friends)
        const popularUsers = await User.find({
            _id: {
                $nin: [req.user.id, ...friendIds],
                $nin: friendsOfFriends.map(u => u._id)
            },
            isActive: true,
            isPrivate: false
        })
            .select('username displayName profilePicture bio friendsCount postsCount isVerified')
            .sort({ friendsCount: -1, postsCount: -1 })
            .limit(parseInt(limit) - friendsOfFriends.length);

        const suggestions = popularUsers; // simplified without friends feature
        res.json({
            success: true,
            data: {
                suggestions,
                pagination: {
                    page: parseInt(page),
                    hasNext: suggestions.length === parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('User suggestions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching user suggestions',
            error: error.message
        });
    }
});

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('username displayName profilePicture bio location website friendsCount postsCount isPrivate isVerified createdAt');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check privacy: deny access if profile is private and requester is not the owner
        if (user.isPrivate && user._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'This profile is private'
            });
        }

        res.json({
            success: true,
            data: {
                user: user.toPublicProfile()
            }
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching user profile',
            error: error.message
        });
    }
});

module.exports = router;
