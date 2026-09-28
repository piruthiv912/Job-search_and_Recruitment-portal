const express = require('express');
const { getStats } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getStats);

module.exports = router;
