const { AppError } = require('../middleware/errorHandler');

// @desc    Verify token and return user profile
// @route   POST /api/auth/verify
// @access  Private
const verifyAuth = async (req, res, next) => {
  try {
    // req.user is set by the protect middleware
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: req.user.id,
          firebaseUid: req.user.firebaseUid,
          email: req.user.email,
          displayName: req.user.displayName,
          photoURL: req.user.photoURL,
          totalInterviews: req.user.totalInterviews
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyAuth
};
