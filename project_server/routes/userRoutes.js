const express = require('express');
const { getUserProfile, updateUserProfile, getAllUsers, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);

// Admin Routes
router.get('/all', authMiddleware, getAllUsers);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
