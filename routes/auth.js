const express = require('express');
const User = require('../models/User');
const { generateToken, authenticate } = require('../middleware/auth');
const { 
    validateRegister, 
    validateLogin, 
    validateChangePassword,
    validateForgotPassword,
    validateResetPassword,
    validateEmailVerification
} = require('../middleware/validation');
const crypto = require('crypto');
const { sendEmail } = require('../utils/emailService');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegister, async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username is already taken'
            });
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password
        });

        // Generate auth token
        const token = generateToken(user._id);

        // Create email verification code (6-digit) and send email
        const verificationCode = await User.createEmailVerificationToken(user._id);

        try {
            await sendEmail({
                to: user.email,
                subject: 'Verify your Picket account',
                html: `<p>Hi ${user.username},</p>
                       <p>Thank you for registering with Picket!</p>
                       <p>Your email verification code is:</p>
                       <h2>${verificationCode}</h2>
                       <p>This code will expire in 10 minutes.</p>`
            });
        } catch (emailErr) {
            console.error('Error sending verification email:', emailErr);
        }

        // Prepare response data
        const responseData = {
            success: true,
            message: 'User registered successfully. A verification email has been sent.',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture
            }
        };

        // Expose token in non-production environments for testing convenience
        if (process.env.NODE_ENV !== 'production') {
            responseData.devVerificationCode = verificationCode;
        }

        res.status(201).json(responseData);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists and include password field
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Validate password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
});

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            success: true,
            user: user
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching profile',
            error: error.message
        });
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, async (req, res) => {
    try {
        const { username, profilePicture } = req.body;
        const updateData = {};

        if (username) {
            // Check if username is already taken by another user
            const existingUser = await User.findOne({ 
                username, 
                _id: { $ne: req.user.id } 
            });
            
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Username is already taken'
                });
            }
            updateData.username = username;
        }

        if (profilePicture !== undefined) {
            updateData.profilePicture = profilePicture;
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: user
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating profile',
            error: error.message
        });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client should clear token)
// @access  Private
router.post('/logout', authenticate, async (req, res) => {
    try {
        // Update last seen time
        await User.findByIdAndUpdate(req.user.id, {
            lastSeen: new Date()
        });

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during logout',
            error: error.message
        });
    }
});

// @route   DELETE /api/auth/account
// @desc    Delete user account
// @access  Private
router.delete('/account', authenticate, async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required to delete account'
            });
        }

        // Get user with password
        const user = await User.findById(req.user.id).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // Delete user account
        await User.findByIdAndDelete(req.user.id);

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting account',
            error: error.message
        });
    }
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', authenticate, validateChangePassword, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get user with password
        const user = await User.findById(req.user.id).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error changing password',
            error: error.message
        });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', validateForgotPassword, async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal if email exists or not for security
            return res.json({
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Store reset token in user document
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // TODO: Send email with reset link
        // For now, just return the token (in production, send via email)
        console.log('Password reset token:', resetToken);

        res.json({
            success: true,
            message: 'If an account with that email exists, a password reset link has been sent'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error processing forgot password request',
            error: error.message
        });
    }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', validateResetPassword, async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Find user with valid reset token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        }).select('+password');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Update password and clear reset token
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error resetting password',
            error: error.message
        });
    }
});

// @route   POST /api/auth/verify-email
// @desc    Verify email with token
// @access  Public
router.post('/verify-email', validateEmailVerification, async (req, res) => {
    try {
        const { code } = req.body;

        // Find user with valid verification code
        const user = await User.findOne({
            emailVerificationToken: code,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification code'
            });
        }

        // Mark email as verified
        user.emailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error verifying email',
            error: error.message
        });
    }
});

// @route   POST /api/auth/send-verification-email
// @desc    Send or resend email verification token
// @access  Private
router.post('/send-verification-email', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.emailVerified) {
            return res.status(400).json({ success: false, message: 'Email is already verified' });
        }

        // Generate new verification code (6-digit)
        const verificationCode = await User.createEmailVerificationToken(user._id);

        try {
            await sendEmail({
                to: user.email,
                subject: 'Verify your Picket account',
                html: `<p>Hi ${user.username},</p>
                       <p>Your new email verification code is:</p>
                       <h2>${verificationCode}</h2>
                       <p>This code will expire in 10 minutes.</p>`
            });
        } catch (emailErr) {
            console.error('Error sending verification email:', emailErr);
        }

        const responseData = {
            success: true,
            message: 'Verification email sent successfully'
        };

        if (process.env.NODE_ENV !== 'production') {
            responseData.devVerificationCode = verificationCode;
        }

        res.json(responseData);
    } catch (error) {
        console.error('Send verification email error:', error);
        res.status(500).json({ success: false, message: 'Server error sending verification email', error: error.message });
    }
});

module.exports = router; 