const Application = require('../models/Application');
const Job = require('../models/Job');

const getStats = async (req, res) => {
  try {
    const userId = req.userId;

    const totalApplications = await Application.countDocuments({ student: userId });
    const accepted = await Application.countDocuments({ student: userId, status: 'Accepted' });
    const inInterview = await Application.countDocuments({ student: userId, status: 'Interview' });
    const shortlisted = await Application.countDocuments({ student: userId, status: 'Shortlisted' });

    const jobs = await Job.find({ active: true }).sort({ createdAt: -1 }).limit(20).populate('company');

    res.json({ totalApplications, accepted, inInterview, shortlisted, jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getStats };
