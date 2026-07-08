const { Interview, Result, Question } = require('../models');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get user interview history
// @route   GET /api/history
// @access  Private
const getHistory = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const { count, rows } = await Interview.findAndCountAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      attributes: ['id', 'role', 'status', 'duration', 'overallScore', 'createdAt']
    });

    res.status(200).json({
      status: 'success',
      data: {
        total: count,
        page,
        pages: Math.ceil(count / limit),
        interviews: rows
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed result for a specific interview
// @route   GET /api/history/:id/result
// @access  Private
const getInterviewResult = async (req, res, next) => {
  try {
    const interviewId = req.params.id;

    const interview = await Interview.findOne({
      where: { id: interviewId, userId: req.user.id },
      include: [
        { model: Result, as: 'result' },
        { model: Question, as: 'questions', attributes: ['id', 'questionText', 'answer', 'score', 'feedback', 'orderIndex'] }
      ],
      order: [[{ model: Question, as: 'questions' }, 'orderIndex', 'ASC']]
    });

    if (!interview) {
      return next(new AppError(404, 'Interview not found'));
    }

    res.status(200).json({
      status: 'success',
      data: {
        interview
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHistory,
  getInterviewResult
};
