const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { classifyImage } = require('../services/geminiService');

// @route   POST api/gemini/classify-feed
// @desc    Phân loại tất cả các ảnh trong feed chưa được phân loại
// @access  Private (cần có cơ chế xác thực, tạm thời để public cho dễ test)
router.post('/classify-feed', async (req, res) => {
    try {
        // Tìm tất cả các bài đăng chưa có danh mục
        const postsToClassify = await Post.find({ category: { $in: [null, undefined, ''] } });

        if (postsToClassify.length === 0) {
            return res.status(200).json({ message: 'Không có ảnh mới để phân loại.' });
        }

        let classifiedCount = 0;
        // Lặp qua từng bài đăng và phân loại
        for (const post of postsToClassify) {
            try {
                const category = await classifyImage(post.imageUrl);
                post.category = category;
                await post.save();
                classifiedCount++;
            } catch (classifyError) {
                // Ghi lại lỗi cho bài đăng cụ thể nhưng vẫn tiếp tục với những bài khác
                console.error(`Lỗi khi phân loại ảnh cho bài đăng ${post._id}:`, classifyError.message);
            }
        }

        res.status(200).json({ 
            message: `Phân loại thành công ${classifiedCount}/${postsToClassify.length} ảnh.`
        });

    } catch (error) {
        console.error('Lỗi server khi thực hiện phân loại:', error);
        res.status(500).send('Lỗi Server');
    }
});

const { authenticate } = require('../middleware/auth');

// @route   GET api/gemini/categories
// @desc    Lấy danh sách tất cả các danh mục duy nhất
// @access  Private
router.get('/categories', authenticate, async (req, res) => {
    try {
        // Sử dụng distinct để lấy danh sách các giá trị duy nhất của trường 'category'
        // Lọc ra các giá trị null hoặc rỗng
        const categories = await Post.distinct('category', { category: { $ne: null, $ne: '' } });
        
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách danh mục:', error);
        res.status(500).send('Lỗi Server');
    }
});

module.exports = router;
