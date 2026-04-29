const express = require('express');
const { getStats } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/stats', authMiddleware, roleMiddleware(['Support', 'Admin']), asyncHandler(getStats));

module.exports = router;
