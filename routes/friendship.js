const express = require('express');
const mongoose = require('mongoose');
const Friendship = require('../models/Friendship');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Middleware to check for valid ObjectId
const checkObjectId = (idToCheck) => (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[idToCheck])) {
        return res.status(400).json({ success: false, message: 'Invalid ID' });
    }
    next();
};

// Gửi lời mời kết bạn
router.post('/request', authenticate, async (req, res) => {
    try {
        const { recipientId, requestMessage } = req.body;

        if (!recipientId) {
            return res.status(400).json({ success: false, message: 'Recipient ID is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(recipientId)) {
            return res.status(400).json({ success: false, message: 'Invalid Recipient ID' });
        }

        if (req.user.id.toString() === recipientId.toString()) {
            return res.status(400).json({ success: false, message: 'You cannot send a friend request to yourself' });
        }

        const friendship = await Friendship.createFriendship(req.user.id, recipientId, requestMessage);
        res.status(201).json({ success: true, message: 'Friend request sent', data: friendship });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Chấp nhận lời mời kết bạn
router.post('/accept/:id', authenticate, checkObjectId('id'), async (req, res) => {
    try {
        const friendship = await Friendship.acceptFriendship(req.params.id, req.user.id);
        res.json({ success: true, message: 'Friend request accepted', data: friendship });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Từ chối lời mời kết bạn
router.post('/decline/:id', authenticate, checkObjectId('id'), async (req, res) => {
    try {
        await Friendship.declineFriendship(req.params.id, req.user.id);
        res.json({ success: true, message: 'Friend request declined' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Hủy lời mời đã gửi
router.delete('/cancel/:id', authenticate, checkObjectId('id'), async (req, res) => {
    try {
        await Friendship.cancelFriendship(req.params.id, req.user.id);
        res.json({ success: true, message: 'Friend request canceled' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Xóa bạn
router.delete('/remove/:id', authenticate, checkObjectId('id'), async (req, res) => {
    try {
        await Friendship.removeFriendship(req.params.id, req.user.id);
        res.json({ success: true, message: 'Friend removed successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Lấy danh sách bạn bè
router.get('/list', authenticate, async (req, res) => {
    try {
        const friends = await Friendship.getFriendsList(req.user.id);
        res.json({ success: true, data: friends });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Lấy danh sách lời mời đã nhận
router.get('/pending/received', authenticate, async (req, res) => {
    try {
        const requests = await Friendship.find({ recipient: req.user.id, status: 'pending' })
            .populate('requester', 'username displayName profilePicture');
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Lấy danh sách lời mời đã gửi
router.get('/pending/sent', authenticate, async (req, res) => {
    try {
        const requests = await Friendship.find({ requester: req.user.id, status: 'pending' })
            .populate('recipient', 'username displayName profilePicture');
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
