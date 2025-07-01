const { body, param, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Validation rules for user registration
const validateRegister = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    handleValidationErrors
];

// Validation rules for user login
const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    handleValidationErrors
];

// Validation rules for post creation
const validatePost = [
    body('caption')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Caption cannot exceed 200 characters'),
    
    handleValidationErrors
];

// Validation rules for comments
const validateComment = [
    body('text')
        .trim()
        .notEmpty()
        .withMessage('Comment text is required')
        .isLength({ max: 100 })
        .withMessage('Comment cannot exceed 100 characters'),
    
    handleValidationErrors
];

// Validation rules for notification ID
const validateNotificationId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid notification ID format'),
    
    handleValidationErrors
];

// Validation rules for change password
const validateChangePassword = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Password confirmation does not match new password');
            }
            return true;
        }),
    
    handleValidationErrors
];

// Validation rules for forgot password
const validateForgotPassword = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    handleValidationErrors
];

// Validation rules for reset password
const validateResetPassword = [
    body('token')
        .notEmpty()
        .withMessage('Reset token is required'),
    
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Password confirmation does not match new password');
            }
            return true;
        }),
    
    handleValidationErrors
];

// Validation rules for email verification (6-digit code)
const validateEmailVerification = [
    body('code')
        .notEmpty()
        .withMessage('Verification code is required')
        .isLength({ min: 6, max: 6 })
        .withMessage('Verification code must be 6 digits')
        .isNumeric()
        .withMessage('Verification code must be numeric'),
    
    handleValidationErrors
];

// Validation rules for user search
const validateUserSearch = [
    body('q')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Search query must be at least 2 characters long'),
    
    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validatePost,
    validateComment,
    validateNotificationId,
    validateChangePassword,
    validateForgotPassword,
    validateResetPassword,
    validateEmailVerification,
    validateUserSearch,
    handleValidationErrors
}; 