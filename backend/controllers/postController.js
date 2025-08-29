const Post = require('../models/Post');
const { validationResult } = require('express-validator');

// @desc    Get all posts (with pagination and search)
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res) => {
    try {
        // Parse pagination parameters with defaults
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        let query = {};

        // Complex search functionality using MongoDB $or operator
        // Searches across title, content, and tags fields case-insensitively
        if (req.query.search) {
            query.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { content: { $regex: req.query.search, $options: 'i' } },
                { tags: { $in: [new RegExp(req.query.search, 'i')] } }
            ];
        }

        // Conditional status filtering based on user role
        // Public users only see published posts, admins can see all statuses
        if (!req.user || req.user.role !== 'admin') {
            query.status = 'published';
        } else if (req.query.status) {
            query.status = req.query.status;
        }

        // Filter by author (for author's own posts)
        if (req.query.author && req.user) {
            query.author = req.query.author;
        }

        // Filter by category using MongoDB $in operator for array fields
        if (req.query.category) {
            query.categories = { $in: [req.query.category] };
        }

        // Execute queries in parallel for better performance
        const total = await Post.countDocuments(query);
        const posts = await Post.find(query)
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(startIndex);

        // Build pagination metadata for frontend navigation
        const pagination = {};

        if (startIndex + limit < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        res.json({
            success: true,
            count: posts.length,
            total,
            pagination,
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name avatar bio');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check if user can view this post
        if (post.status === 'draft' && (!req.user || (req.user._id.toString() !== post.author._id.toString() && req.user.role !== 'admin'))) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this post'
            });
        }

        // Increment views for published posts
        if (post.status === 'published') {
            post.views += 1;
            await post.save();
        }

        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        // Add author to req.body
        req.body.author = req.user._id;

        const post = await Post.create(req.body);
        await post.populate('author', 'name avatar');

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Complex authorization logic: Check ownership or admin privileges
        // Convert ObjectIds to strings for proper comparison (strict equality)
        // Authors can only edit their own posts, admins can edit any post
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this post'
            });
        }

        post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('author', 'name avatar');

        res.json({
            success: true,
            message: 'Post updated successfully',
            data: post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check if user owns the post or is admin
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this post'
            });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get user's posts
// @route   GET /api/posts/my-posts
// @access  Private
exports.getMyPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        let query = { author: req.user._id };

        // Filter by status
        if (req.query.status) {
            query.status = req.query.status;
        }

        const total = await Post.countDocuments(query);
        const posts = await Post.find(query)
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(startIndex);

        res.json({
            success: true,
            count: posts.length,
            total,
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
