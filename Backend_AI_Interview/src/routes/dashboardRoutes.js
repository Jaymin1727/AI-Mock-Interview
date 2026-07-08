const express = require('express');
const { getDashboardStats, getRecentInterviews } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/recent', getRecentInterviews);

module.exports = router;
