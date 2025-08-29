const express = require('express');
const {
    getUsers,
    updateUserRole,
    deleteUser,
    getDashboardStats,
    getAllPosts
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.get('/posts', getAllPosts);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/stats', getDashboardStats);

module.exports = router;
