const { Interview, sequelize } = require('../models');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Total interviews
    const totalInterviews = await Interview.count({ where: { userId } });

    // Completed interviews to calculate averages
    const completedInterviews = await Interview.findAll({
      where: { userId, status: 'completed' },
      attributes: ['overallScore', 'duration']
    });

    let avgScore = 0;
    let totalTimeSeconds = 0;
    let successRate = 0;

    if (completedInterviews.length > 0) {
      const totalScore = completedInterviews.reduce((acc, curr) => acc + (curr.overallScore || 0), 0);
      avgScore = Math.round(totalScore / completedInterviews.length);
      
      totalTimeSeconds = completedInterviews.reduce((acc, curr) => acc + (curr.duration || 0), 0);
      
      // Assume "success" is score >= 70
      const successful = completedInterviews.filter(i => i.overallScore >= 70).length;
      successRate = Math.round((successful / completedInterviews.length) * 100);
    }

    res.status(200).json({
      status: 'success',
      data: {
        totalInterviews,
        avgScore: `${avgScore}%`,
        timeSpent: totalTimeSeconds > 3600 
          ? `${(totalTimeSeconds / 3600).toFixed(1)}h` 
          : `${Math.round(totalTimeSeconds / 60)}m`,
        successRate: `${successRate}%`
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent interviews
// @route   GET /api/dashboard/recent
// @access  Private
const getRecentInterviews = async (req, res, next) => {
  try {
    const recent = await Interview.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 3,
      attributes: ['id', 'role', 'status', 'overallScore', 'createdAt']
    });

    res.status(200).json({
      status: 'success',
      data: {
        interviews: recent
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getRecentInterviews
};
