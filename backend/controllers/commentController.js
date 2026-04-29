const Comment = require('../models/Comment');
const Ticket = require('../models/Ticket');
const { USER_ROLE } = require('../config/constants');

const STAFF_ROLES = [USER_ROLE.SUPPORT, USER_ROLE.ADMIN];

const createComment = async (req, res) => {
  const { ticketId, message, isInternal } = req.validatedBody;
  const { userId, role } = req.user;

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    const error = new Error('Ticket not found');
    error.statusCode = 404;
    throw error;
  }

  if (isInternal && !STAFF_ROLES.includes(role)) {
    const error = new Error('Only Support/Admin can post internal comments');
    error.statusCode = 403;
    throw error;
  }

  const comment = new Comment({ ticketId, userId, message, isInternal });
  await comment.save();
  await comment.populate('userId', 'name email');

  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    data: comment,
  });
};

const getComments = async (req, res) => {
  const { ticketId } = req.params;
  const query = { ticketId };

  if (req.user.role === USER_ROLE.EMPLOYEE) {
    query.isInternal = false;
  }

  const comments = await Comment.find(query)
    .populate('userId', 'name email')
    .sort({ createdAt: 1 });

  res.json({
    success: true,
    message: 'Comments retrieved',
    data: comments,
  });
};

module.exports = { createComment, getComments };
