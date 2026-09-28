const express = require('express');
const { getAllJobs, getJobById, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllJobs);
router.get('/recruiter/my-jobs', authMiddleware, require('../controllers/jobController').getJobsByRecruiter); // Add this
router.get('/:id', getJobById);
router.post('/', authMiddleware, createJob);
router.put('/:id', authMiddleware, updateJob);
router.delete('/:id', authMiddleware, deleteJob);

module.exports = router;
