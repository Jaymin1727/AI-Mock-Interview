const express = require('express');
const { verifyAuth } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/verify', protect, verifyAuth);

module.exports = router;
