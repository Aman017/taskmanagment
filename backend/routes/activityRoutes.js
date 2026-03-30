const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

router.get('/task/:taskId', activityController.getTaskActivities);

module.exports = router;