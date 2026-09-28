const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  salary: {
    min: Number,
    max: Number
  },
  location: String,
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship'],
    default: 'Full-time'
  },
  skills: [String],
  minCGPA: Number,
  positions: Number,
  experienceLevel: {
    type: String,
    enum: ['Entry Level', 'Mid Level', 'Senior Level'],
    default: 'Entry Level'
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  deadline: Date,
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);
