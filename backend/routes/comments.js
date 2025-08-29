const express = require('express');
const { body } = require('express-validator');
const {
    updateComment,
    deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Comment routes (comments are accessed via posts routes)
router.route('/:id')
    .put(protect, [
        body('content').trim().isLength({ min: 1 }).withMessage('Comment content is required')
    ], updateComment)
    .delete(protect, deleteComment);

module.exports = router;
