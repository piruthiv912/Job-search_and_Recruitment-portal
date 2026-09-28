const Job = require('../models/Job');
const logActivity = require('../utils/logActivity');

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ active: true }).populate('company');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('company');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createJob = async (req, res) => {
  try {
    // Check if user is recruiter
    if (req.userRole !== 'recruiter') {
      return res.status(403).json({ message: 'Access denied. Only recruiters can post jobs.' });
    }

    const { title, description, salary, location, jobType, skills, minCGPA, positions, deadline } = req.body;

    // Find company associated with this recruiter
    // Assumes 1 recruiter = 1 company for simplicity, or we let them select if they have multiple (advanced)
    // For now, let's find the company where recruiter is the current user.
    const Company = require('../models/Company');
    const company = await Company.findOne({ recruiter: req.userId });

    if (!company) {
      return res.status(400).json({ message: 'No company profile found for this recruiter. Please create a company profile first.' });
    }

    const job = new Job({
      title,
      description,
      company: company._id, // Auto-link
      salary,
      location,
      jobType,
      skills,
      minCGPA,
      positions,
      deadline
    });

    await job.save();
    await logActivity({
      type: 'job.created',
      actorId: req.userId,
      actorName: company.name,
      message: `${company.name} posted ${job.title}`,
      metadata: { jobId: job._id, title: job.title },
      sourceKey: `job.created:${job._id}`
    });
    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('company', 'name');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    await logActivity({
      type: 'job.updated',
      actorId: req.userId,
      actorName: job.company?.name,
      message: `Job updated: ${job.title}`,
      metadata: { jobId: job._id, title: job.title }
    });
    res.json({ message: 'Job updated successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    await logActivity({
      type: 'job.deleted',
      actorId: req.userId,
      message: `Job deleted: ${job.title}`,
      metadata: { jobId: job._id, title: job.title }
    });
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getJobsByRecruiter = async (req, res) => {
  try {
    if (req.userRole !== 'recruiter' && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    if (req.userRole === 'admin') {
      const jobs = await Job.find().populate('company');
      return res.json(jobs);
    }

    const Company = require('../models/Company');
    const company = await Company.findOne({ recruiter: req.userId });

    if (!company) {
      return res.json([]); // No company = no jobs
    }

    const jobs = await Job.find({ company: company._id }).populate('company');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = { getAllJobs, getJobById, createJob, updateJob, deleteJob, getJobsByRecruiter };
