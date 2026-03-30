const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');
const aiService = require('../services/aiService');

// Validate status transition
const isValidTransition = (currentStatus, newStatus) => {
  const validTransitions = {
    'TODO': ['IN_PROGRESS'],
    'IN_PROGRESS': ['DONE'],
    'DONE': []
  };
  
  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

// Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      status: 'TODO'
    });
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Create Task Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get All Tasks with filtering and sorting
exports.getAllTasks = async (req, res) => {
  try {
    const { status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query = {};
    if (status && ['TODO', 'IN_PROGRESS', 'DONE'].includes(status)) {
      query.status = status;
    }
    
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const tasks = await Task.find(query).sort(sort);
    res.json(tasks);
  } catch (error) {
    console.error('Get All Tasks Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get Single Task
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Get Task By ID Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update Task Status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['TODO', 'IN_PROGRESS', 'DONE'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    if (!isValidTransition(task.status, status)) {
      return res.status(400).json({ 
        error: `Invalid status transition from ${task.status} to ${status}. Allowed transitions: TODO → IN_PROGRESS → DONE only.`
      });
    }
    
    const previousStatus = task.status;
    task.status = status;
    await task.save();
    
    // Create activity log
    await ActivityLog.create({
      taskId: task._id,
      previousStatus,
      newStatus: status
    });
    
    res.json(task);
  } catch (error) {
    console.error('Update Task Status Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Delete associated activity logs
    await ActivityLog.deleteMany({ taskId: req.params.id });
    
    res.json({ message: 'Task deleted successfully', taskId: req.params.id });
  } catch (error) {
    console.error('Delete Task Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Improve Task Description with AI
exports.improveDescription = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const improvedDescription = await aiService.improveDescription(
      task.title,
      task.description
    );
    
    task.description = improvedDescription;
    await task.save();
    
    res.json({ 
      description: improvedDescription,
      message: 'Description improved successfully'
    });
  } catch (error) {
    console.error('Improve Description Error:', error);
    res.status(500).json({ error: error.message || 'Failed to improve description. Please try again.' });
  }
};