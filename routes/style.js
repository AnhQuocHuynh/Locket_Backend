const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { transformImage, imageUrlToBase64 } = require('../services/imageStyleService');

// @route   POST /api/style/transform
// @desc    Biến đổi hình ảnh theo một phong cách
// @access  Private
router.post('/transform', authenticate, async (req, res) => {
    const { imageUrl, style } = req.body;

    if (!imageUrl || !style) {
        return res.status(400).json({ 
            success: false, 
            message: 'Cần có imageUrl và style.' 
        });
    }

    try {
        // Tạo prompt dựa trên style người dùng chọn
        const stylePrompt = `Transform this image into ${style} style.`;

        // Tải ảnh và chuyển sang base64
        const base64Image = await imageUrlToBase64(imageUrl);

        // Gọi service để biến đổi ảnh
        const transformedImageBase64 = await transformImage(base64Image, stylePrompt);

        // Gửi lại ảnh đã biến đổi dưới dạng base64
        res.status(200).json({
            success: true,
            data: {
                base64Image: transformedImageBase64
            }
        });

    } catch (error) {
        console.error('Lỗi trong quá trình biến đổi ảnh:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi Server khi biến đổi ảnh.'
        });
    }
});

module.exports = router;
