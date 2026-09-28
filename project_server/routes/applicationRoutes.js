const express = require('express');
const { applyForJob, getApplications, updateApplicationStatus } = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/apply', authMiddleware, applyForJob);
router.get('/', authMiddleware, getApplications);
router.put('/:id', authMiddleware, updateApplicationStatus);

module.exports = router;
