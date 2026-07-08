const express = require('express');
const { getHistory, getInterviewResult } = require('../controllers/historyController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getHistory);
router.get('/:id/result', getInterviewResult);

module.exports = router;
