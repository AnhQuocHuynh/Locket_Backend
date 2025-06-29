const express = require('express');
const mongoose = require('mongoose');
const Friendship = require('../models/Friendship');
const { authenticate } = require('../middleware/auth');
const crypto = require('crypto');
const User = require('../models/User');
const FriendshipToken = require('../models/FriendshipToken');

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
        await Friendship.removeFriendship(req.user.id, req.params.id);
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

// @route   POST /api/friendship/generate-link
// @desc    Tạo link mời kết bạn
// @access  Private
router.post('/generate-link', authenticate, async (req, res) => {
    try {
        const senderId = req.user.id;

        // Tạo một token ngẫu nhiên, an toàn
        const token = crypto.randomBytes(16).toString('hex');

        // Lưu token vào database
        await FriendshipToken.create({
            token: token,
            sender: senderId,
        });

        // Lấy base URL từ biến môi trường, với giá trị mặc định cho local
        const port = process.env.PORT || 3000;
        const baseUrl = process.env.APP_BASE_URL || `http://localhost:${port}`;
        const shareableLink = `${baseUrl}/add-friend/${token}`;

        res.status(200).json({ 
            success: true, 
            link: shareableLink 
        });

    } catch (error) {
        console.error('Lỗi khi tạo link mời:', error.message);
        res.status(500).json({ success: false, message: 'Lỗi Server' });
    }
});

// @route   POST /api/friendship/accept-link
// @desc    Chấp nhận lời mời kết bạn qua link
// @access  Private
router.post('/accept-link', authenticate, async (req, res) => {
    const { token } = req.body;
    const recipientId = req.user.id; // Người nhận là người dùng đang đăng nhập

    if (!token) {
        return res.status(400).json({ success: false, message: 'Token là bắt buộc.' });
    }

    try {
        // Tìm token trong DB
        const friendshipToken = await FriendshipToken.findOne({ token });

        if (!friendshipToken) {
            return res.status(404).json({ success: false, message: 'Link mời không hợp lệ hoặc đã hết hạn.' });
        }

        const senderId = friendshipToken.sender;

        // Không thể tự kết bạn với chính mình
        if (senderId.toString() === recipientId.toString()) {
            return res.status(400).json({ success: false, message: 'Bạn không thể tự kết bạn với chính mình.' });
        }

        // Kiểm tra xem đã là bạn bè chưa
        const existingFriendship = await Friendship.findOne({
            $or: [
                { requester: senderId, recipient: recipientId },
                { requester: recipientId, recipient: senderId },
            ],
        });

        if (existingFriendship) {
            // Xóa token sau khi sử dụng
            // await friendshipToken.deleteOne();
            return res.status(400).json({ success: false, message: 'Hai bạn đã là bạn bè.' });
        }

        // Tạo mối quan hệ bạn bè mới, mặc định là 'accepted'
        await Friendship.create({
            requester: senderId,
            recipient: recipientId,
            status: 'accepted',
        });

        // Xóa token sau khi đã sử dụng thành công
        // await friendshipToken.deleteOne();

        const sender = await User.findById(senderId).select('username profilePicture');

        res.status(200).json({ 
            success: true, 
            message: `Bạn đã kết bạn thành công với ${sender.username}.`,
            friend: sender
        });

    } catch (error) {
        console.error('Lỗi khi chấp nhận link mời:', error.message);
        res.status(500).json({ success: false, message: 'Lỗi Server' });
    }
});

module.exports = router;
