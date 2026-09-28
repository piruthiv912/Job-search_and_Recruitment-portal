const Activity = require('../models/Activity');
const User = require('../models/User');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const logActivity = require('../utils/logActivity');

const backfillFromExistingRecords = async () => {
  const existingCount = await Activity.countDocuments();
  if (existingCount > 0) return;

  const [users, companies, jobs, applications] = await Promise.all([
    User.find().select('name role createdAt').lean(),
    Company.find().select('name recruiter createdAt').lean(),
    Job.find().populate('company', 'name').select('title company postedDate createdAt').lean(),
    Application.find()
      .populate('student', 'name')
      .populate({ path: 'job', populate: { path: 'company', select: 'name' } })
      .select('student job status appliedAt')
      .lean()
  ]);

  const records = [];

  users.forEach((user) => {
    records.push({
      type: 'user.signup',
      actorId: user._id,
      actorName: user.name,
      message: `${user.name} joined as ${user.role}`,
      metadata: { role: user.role },
      sourceKey: `user.signup:${user._id}`,
      createdAt: user.createdAt
    });
  });

  companies.forEach((company) => {
    records.push({
      type: 'company.created',
      actorId: company.recruiter,
      actorName: company.name,
      message: `Company profile created for ${company.name}`,
      metadata: { companyId: company._id },
      sourceKey: `company.created:${company._id}`,
      createdAt: company.createdAt
    });
  });

  jobs.forEach((job) => {
    const companyName = job.company?.name;
    records.push({
      type: 'job.created',
      actorName: companyName,
      message: companyName
        ? `${companyName} posted ${job.title}`
        : `Job posted: ${job.title}`,
      metadata: { jobId: job._id, title: job.title },
      sourceKey: `job.created:${job._id}`,
      createdAt: job.postedDate || job.createdAt
    });
  });

  applications.forEach((app) => {
    const studentName = app.student?.name || 'A student';
    const jobTitle = app.job?.title;
    const companyName = app.job?.company?.name;
    let message = `${studentName} submitted an application`;
    if (jobTitle && companyName) {
      message = `${studentName} applied for ${jobTitle} at ${companyName}`;
    } else if (jobTitle) {
      message = `${studentName} applied for ${jobTitle}`;
    }

    records.push({
      type: 'application.submitted',
      actorId: app.student?._id,
      actorName: studentName,
      message,
      metadata: { applicationId: app._id, status: app.status },
      sourceKey: `application.submitted:${app._id}`,
      createdAt: app.appliedAt
    });
  });

  await Promise.all(records.map((record) => logActivity(record)));
};

const getActivities = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await backfillFromExistingRecords();

    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(40)
      .lean();

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getActivities };
