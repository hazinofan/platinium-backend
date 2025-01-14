const express = require('express');
const router = express.Router();
const BlogController = require('../controllers/BlogController');
const { verifyAdmin } = require('../middleware/authMiddleware'); // Using your existing auth middleware

// Public Routes
router.get('/all', BlogController.getAllBlogs);
router.get('/:id', BlogController.getBlogById);

// Admin Protected Routes
router.post('/add', verifyAdmin, BlogController.createBlog);
router.patch('/update/:id', verifyAdmin, BlogController.updateBlog);
router.delete('/delete/:id', verifyAdmin, BlogController.deleteBlog);

module.exports = router;
