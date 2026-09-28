const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'user.signup',
      'user.deleted',
      'job.created',
      'job.updated',
      'job.deleted',
      'company.created',
      'application.submitted',
      'application.status_updated'
    ]
  },
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  actorName: String,
  message: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  sourceKey: {
    type: String,
    sparse: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

activitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
