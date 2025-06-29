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

module.exports = router;
