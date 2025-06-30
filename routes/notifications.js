const express = require('express');
const Notification = require('../models/Notification');
const { authenticate } = require('../middleware/auth');
const { validateNotificationId } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user's notifications with pagination
// @access  Private
router.get('/', authenticate, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const type = req.query.type; // Optional filter by type

        let query = { recipient: req.user.id };
        if (type) {
            query.type = type;
        }

        const skip = (page - 1) * limit;
        
        const notifications = await Notification.find(query)
            .populate('sender', 'username displayName profilePicture')
            .populate('relatedPost', 'imageUrl caption')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Notification.countDocuments(query);
        const unreadCount = await Notification.getUnreadCount(req.user.id);

        res.json({
            success: true,
            data: {
                notifications,
                pagination: {
                    page,
                    pages: Math.ceil(total / limit),
                    total,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                },
                unreadCount
            }
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching notifications',
            error: error.message
        });
    }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark a specific notification as read
// @access  Private
router.put('/:id/read', authenticate, validateNotificationId, async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.user.id
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        if (notification.isRead) {
            return res.json({
                success: true,
                message: 'Notification already marked as read',
                data: notification
            });
        }

        notification.isRead = true;
        notification.readAt = new Date();
        await notification.save();

        res.json({
            success: true,
            message: 'Notification marked as read',
            data: notification
        });
    } catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error marking notification as read',
            error: error.message
        });
    }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', authenticate, async (req, res) => {
    try {
        const result = await Notification.markAllAsRead(req.user.id);

        res.json({
            success: true,
            message: 'All notifications marked as read',
            data: {
                modifiedCount: result.modifiedCount
            }
        });
    } catch (error) {
        console.error('Mark all notifications read error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error marking all notifications as read',
            error: error.message
        });
    }
});

// @route   GET /api/notifications/unread-count
// @desc    Get count of unread notifications
// @access  Private
router.get('/unread-count', authenticate, async (req, res) => {
    try {
        const unreadCount = await Notification.getUnreadCount(req.user.id);

        res.json({
            success: true,
            data: {
                unreadCount
            }
        });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching unread count',
            error: error.message
        });
    }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete a specific notification
// @access  Private
router.delete('/:id', authenticate, validateNotificationId, async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            recipient: req.user.id
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting notification',
            error: error.message
        });
    }
});

module.exports = router; 