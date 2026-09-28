const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const logActivity = require('../utils/logActivity');

const applyForJob = async (req, res) => {
  try {
    const { jobId, coverletter, resume, resumeName } = req.body;

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      student: req.userId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    const application = new Application({
      job: jobId,
      student: req.userId,
      coverletter,
      resume,
      resumeName
    });

    await application.save();

    // Also update student's profile resume if provided
    if (resume) {
      await User.findByIdAndUpdate(req.userId, { resume });
    }

    const [student, job] = await Promise.all([
      User.findById(req.userId).select('name'),
      Job.findById(jobId).populate('company', 'name')
    ]);
    const studentName = student?.name || 'A student';
    const jobTitle = job?.title;
    const companyName = job?.company?.name;
    let message = `${studentName} submitted an application`;
    if (jobTitle && companyName) {
      message = `${studentName} applied for ${jobTitle} at ${companyName}`;
    } else if (jobTitle) {
      message = `${studentName} applied for ${jobTitle}`;
    }

    await logActivity({
      type: 'application.submitted',
      actorId: req.userId,
      actorName: studentName,
      message,
      metadata: { applicationId: application._id, jobId },
      sourceKey: `application.submitted:${application._id}`
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getApplications = async (req, res) => {
  try {
    if (req.userRole === 'student') {
      const applications = await Application.find({ student: req.userId })
        .populate({
          path: 'job',
          populate: { path: 'company' }
        });
      return res.json(applications);
    } else if (req.userRole === 'recruiter' || req.userRole === 'admin') {
      const Company = require('../models/Company');
      const Job = require('../models/Job');

      if (req.userRole === 'admin') {
        // Admin sees EVERYTHING
        const applications = await Application.find()
          .populate('student', 'name email phone resume skills')
          .populate({
            path: 'job',
            populate: { path: 'company' }
          });
        return res.json(applications);
      }

      // Recruiter sees only their company's apps
      const company = await Company.findOne({ recruiter: req.userId });
      if (!company) return res.json([]);

      const jobs = await Job.find({ company: company._id });
      const jobIds = jobs.map(job => job._id);

      const applications = await Application.find({ job: { $in: jobIds } })
        .populate('student', 'name email phone resume skills')
        .populate({
          path: 'job',
          populate: { path: 'company' }
        });

      return res.json(applications);
    } else {
      return res.status(403).json({ message: 'Unknown role' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    if (req.userRole !== 'recruiter' && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Only recruiters can update status' });
    }

    const { status, notes } = req.body; // Added notes support
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true }
    ).populate('student', 'name').populate({ path: 'job', populate: { path: 'company', select: 'name' } });
    if (application) {
      const studentName = application.student?.name || 'A candidate';
      const jobTitle = application.job?.title;
      await logActivity({
        type: 'application.status_updated',
        actorId: req.userId,
        actorName: studentName,
        message: jobTitle
          ? `${studentName}'s application for ${jobTitle} was updated to ${status}`
          : `${studentName}'s application was updated to ${status}`,
        metadata: { applicationId: application._id, status }
      });
    }
    res.json({ message: 'Application status updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { applyForJob, getApplications, updateApplicationStatus };
