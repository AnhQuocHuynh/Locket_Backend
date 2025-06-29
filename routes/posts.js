const express = require('express');
const Post = require('../models/Post');
const { authenticate } = require('../middleware/auth');
const { validatePost, validateComment } = require('../middleware/validation');
const Friendship = require('../models/Friendship');
const { classifyImage } = require('../services/geminiService');

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts (feed)
// @access  Private
router.get('/', authenticate, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find({ isActive: true })
            .populate('user', 'username profilePicture')
            .populate('likes.user', 'username')
            .populate('comments.user', 'username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Post.countDocuments({ isActive: true });

        res.json({
            success: true,
            data: posts,
            pagination: {
                page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching posts',
            error: error.message
        });
    }
});

// @route   GET /api/posts/friends
// @desc    Get all posts by friends (feed)
// @access  Private
// @route   GET /api/posts/category/:categoryName
// @desc    Get posts by friends from a specific category
// @access  Private
router.get('/category/:categoryName', authenticate, async (req, res) => {
    try {
        const { categoryName } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // 1. Find all accepted friendships for the current user
        const friendships = await Friendship.find({
            $or: [{ requester: req.user.id }, { recipient: req.user.id }],
            status: 'accepted'
        });

        // 2. Extract friend IDs
        const friendIds = friendships.map(friendship => 
            friendship.requester.toString() === req.user.id.toString()
                ? friendship.recipient
                : friendship.requester
        );
        
        // Include user's own posts
        const userAndFriendIds = [...friendIds, req.user.id];

        // 3. Find posts from friends (and user) in the specified category
        const posts = await Post.find({
            user: { $in: userAndFriendIds },
            category: categoryName,
            isActive: true
        })
        .populate('user', 'username profilePicture')
        .populate('likes.user', 'username')
        .populate('comments.user', 'username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const total = await Post.countDocuments({
            user: { $in: userAndFriendIds },
            category: categoryName,
            isActive: true
        });

        res.json({
            success: true,
            data: posts,
            pagination: {
                page,
                pages: Math.ceil(total / limit),
                total
            }
        });

    } catch (error) {
        console.error(`Get posts by category error:`, error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching posts by category',
            error: error.message
        });
    }
});

// @route   GET /api/posts/friends
// @desc    Get all posts by friends (feed)
// @access  Private
router.get('/friends', authenticate, async (req, res) => {
    try {
        // Lấy danh sách bạn bè từ model Friendship
        const friendships = await Friendship.getFriendsList(req.user.id);

        // Lấy ID của bạn bè.
        // Logic này được sửa lại để xử lý đúng dữ liệu trả về từ getFriendsList,
        // vốn là một danh sách các document Friendship.
        const friendIds = friendships.map(friend => friend._id)

        // Lấy post của bạn bè (và có thể cả chính user)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find({
            user: { $in: [...friendIds, req.user.id] },
            isActive: true
        })
        .populate('user', 'username profilePicture')
        .populate('likes.user', 'username')
        .populate('comments.user', 'username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const total = await Post.countDocuments({
            user: { $in: [...friendIds, req.user.id] },
            isActive: true
        });

        res.json({
            success: true,
            data: posts,
            pagination: {
                page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Get friends posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching friends posts',
            error: error.message
        });
    }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', authenticate, validatePost, async (req, res) => {
    try {
        const { imageUrl, caption } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required'
            });
        }

        const post = await Post.create({
            user: req.user.id,
            imageUrl,
            caption: caption || ''
        });

        // Populate user data before sending the response
        await post.populate('user', 'username profilePicture');

        // Asynchronously classify the image without blocking the response.
        // The classification will be saved in the background.
        classifyImage(post.imageUrl)
            .then(category => {
                post.category = category;
                // This save is async and won't block anything.
                return post.save();
            })
            .then(() => {
                console.log(`Post ${post._id} classified and saved successfully as ${post.category}`);
            })
            .catch(error => {
                // Log the error but don't crash the request.
                // The post is already created, just without a category.
                console.error(`Failed to classify image for post ${post._id}:`, error.message);
            });

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: post
        });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating post',
            error: error.message
        });
    }
});

// @route   GET /api/posts/:id
// @desc    Get single post by ID
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('user', 'username profilePicture')
            .populate('likes.user', 'username')
            .populate('comments.user', 'username');

        if (!post || !post.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        console.error('Get post error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching post',
            error: error.message
        });
    }
});

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Private
router.put('/:id', authenticate, validatePost, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post || !post.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check if user owns the post
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this post'
            });
        }

        const { caption } = req.body;
        post.caption = caption;
        await post.save();

        await post.populate('user', 'username profilePicture');

        res.json({
            success: true,
            message: 'Post updated successfully',
            data: post
        });
    } catch (error) {
        console.error('Update post error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating post',
            error: error.message
        });
    }
});

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post || !post.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check if user owns the post
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this post'
            });
        }

        // Soft delete
        post.isActive = false;
        await post.save();

        res.json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting post',
            error: error.message
        });
    }
});

// @route   POST /api/posts/:id/like
// @desc    Like/unlike a post
// @access  Private
router.post('/:id/like', authenticate, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post || !post.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check if post is already liked by user
        const likeIndex = post.likes.findIndex(like => 
            like.user.toString() === req.user.id
        );

        if (likeIndex > -1) {
            // Unlike post
            post.likes.splice(likeIndex, 1);
            await post.save();

            res.json({
                success: true,
                message: 'Post unliked',
                liked: false,
                likesCount: post.likes.length
            });
        } else {
            // Like post
            post.likes.push({ user: req.user.id });
            await post.save();

            res.json({
                success: true,
                message: 'Post liked',
                liked: true,
                likesCount: post.likes.length
            });
        }
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error liking post',
            error: error.message
        });
    }
});

// @route   POST /api/posts/:id/comment
// @desc    Add comment to post
// @access  Private
router.post('/:id/comment', authenticate, validateComment, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post || !post.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const { text } = req.body;

        const newComment = {
            user: req.user.id,
            text
        };

        post.comments.push(newComment);
        await post.save();

        // Populate the new comment
        await post.populate('comments.user', 'username');

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            comment: post.comments[post.comments.length - 1]
        });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error adding comment',
            error: error.message
        });
    }
});

// @route   GET /api/posts/user/:userId
// @desc    Get posts by user ID
// @access  Private
router.get('/user/:userId', authenticate, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find({ 
            user: req.params.userId, 
            isActive: true 
        })
        .populate('user', 'username profilePicture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const total = await Post.countDocuments({ 
            user: req.params.userId, 
            isActive: true 
        });

        res.json({
            success: true,
            data: posts,
            pagination: {
                page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Get user posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching user posts',
            error: error.message
        });
    }
});

module.exports = router; 