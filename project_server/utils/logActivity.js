const Activity = require('../models/Activity');

const logActivity = async ({ type, actorId, actorName, message, metadata, sourceKey, createdAt }) => {
  try {
    await Activity.create({
      type,
      actor: actorId || undefined,
      actorName,
      message,
      metadata: metadata || {},
      sourceKey,
      createdAt: createdAt || Date.now()
    });
  } catch (error) {
    if (error.code === 11000) return;
    console.error('Failed to log activity:', error.message);
  }
};

module.exports = logActivity;
