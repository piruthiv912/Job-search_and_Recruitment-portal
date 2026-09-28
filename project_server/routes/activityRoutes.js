const express = require('express');
const { getActivities } = require('../controllers/activityController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getActivities);

module.exports = router;
