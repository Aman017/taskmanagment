const ActivityLog = require('../models/ActivityLog');

exports.getTaskActivities = async (req, res) => {
  try {
    const activities = await ActivityLog.find({ taskId: req.params.taskId })
      .sort({ changedAt: -1 });
    
    res.json(activities);
  } catch (error) {
    console.error('Get Task Activities Error:', error);
    res.status(500).json({ error: error.message });
  }
};