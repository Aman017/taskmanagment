const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  previousStatus: {
    type: String,
    enum: ['TODO', 'IN_PROGRESS', 'DONE'],
    required: true
  },
  newStatus: {
    type: String,
    enum: ['TODO', 'IN_PROGRESS', 'DONE'],
    required: true
  },
  changedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);