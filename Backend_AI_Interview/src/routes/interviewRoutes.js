const express = require('express');
const { startInterview, submitAnswer, finishInterview } = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes require auth

router.post('/start', startInterview);
router.post('/:id/answer', submitAnswer);
router.post('/:id/finish', finishInterview);

module.exports = router;
