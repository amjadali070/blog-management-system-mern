const express = require('express');
const { body } = require('express-validator');
const {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    getMyPosts
} = require('../controllers/postController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getPosts)
    .post(protect, [
        body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
        body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters')
    ], createPost);

router.get('/my-posts', protect, getMyPosts);

router.route('/:id')
    .get(getPost)
    .put(protect, updatePost)
    .delete(protect, deletePost);

module.exports = router;
