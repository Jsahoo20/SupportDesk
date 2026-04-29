const express = require('express');
const { createComment, getComments } = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { createCommentSchema } = require('../schemas/commentSchema');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/', authMiddleware, validateRequest(createCommentSchema), asyncHandler(createComment));
router.get('/:ticketId', authMiddleware, asyncHandler(getComments));

module.exports = router;
