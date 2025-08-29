const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// @desc    Get all posts for admin (including drafts)
// @route   GET /api/admin/posts
// @access  Private/Admin
exports.getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 50;
        const startIndex = (page - 1) * limit;

        let query = {};

        // Search functionality
        if (req.query.search) {
            query.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { content: { $regex: req.query.search, $options: 'i' } },
                { tags: { $in: [new RegExp(req.query.search, 'i')] } }
            ];
        }

        // Filter by status if specified
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Filter by author if specified
        if (req.query.author) {
            query.author = req.query.author;
        }

        const total = await Post.countDocuments(query);
        const posts = await Post.find(query)
            .populate('author', 'name avatar email role')
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

// @desc    Get all comments for admin (for moderation)
// @route   GET /api/admin/comments
// @access  Private/Admin
exports.getAllComments = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const startIndex = (page - 1) * limit;

        let query = {};

        // Filter by approval status if specified
        if (req.query.isApproved !== undefined) {
            query.isApproved = req.query.isApproved === 'true';
        }

        const total = await Comment.countDocuments(query);
        const comments = await Comment.find(query)
            .populate('author', 'name email')
            .populate('post', 'title slug')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(startIndex);

        res.json({
            success: true,
            count: comments.length,
            total,
            data: comments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const total = await User.countDocuments();
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(startIndex);

        res.json({
            success: true,
            count: users.length,
            total,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update user role (admin only)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!['author', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User role updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Don't allow admin to delete themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get dashboard stats (admin only)
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPosts = await Post.countDocuments();
        const publishedPosts = await Post.countDocuments({ status: 'published' });
        const draftPosts = await Post.countDocuments({ status: 'draft' });
        const totalComments = await Comment.countDocuments();
        const approvedComments = await Comment.countDocuments({ isApproved: true });
        const pendingComments = await Comment.countDocuments({ isApproved: false });

        // Complex MongoDB aggregation pipeline to get top authors with their post statistics
        // This pipeline groups posts by author, counts total and published posts,
        // joins with user data, and sorts by post count
        const topAuthors = await Post.aggregate([
            {
                // Group all posts by author ID and calculate statistics
                $group: {
                    _id: '$author',
                    postCount: { $sum: 1 },
                    publishedCount: {
                        // Conditional count: increment only if status is 'published'
                        $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
                    }
                }
            },
            {
                // Join with users collection to get author details
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                // Convert author array to single object (since _id is unique)
                $unwind: '$author'
            },
            {
                // Shape the output data structure
                $project: {
                    _id: 0,
                    author: {
                        id: '$author._id',
                        name: '$author.name',
                        email: '$author.email'
                    },
                    postCount: 1,
                    publishedCount: 1
                }
            },
            {
                // Sort by total post count in descending order
                $sort: { postCount: -1 }
            },
            {
                $limit: 5
            }
        ]);

        // Get recent posts
        const recentPosts = await Post.find()
            .populate('author', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    totalPosts,
                    publishedPosts,
                    draftPosts,
                    totalComments,
                    approvedComments,
                    pendingComments
                },
                topAuthors,
                recentPosts
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
