const express = require('express');
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  assignTicket,
  updateStatus,
  deleteTicket,
} = require('../controllers/ticketController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  createTicketSchema,
  updateTicketSchema,
  assignTicketSchema,
  updateStatusSchema,
} = require('../schemas/ticketSchema');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  uploadMiddleware.array('files', 5),
  validateRequest(createTicketSchema),
  asyncHandler(createTicket)
);

router.get('/', authMiddleware, asyncHandler(getTickets));

router.get('/:id', authMiddleware, asyncHandler(getTicketById));

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['Support', 'Admin']),
  validateRequest(updateTicketSchema),
  asyncHandler(updateTicket)
);

router.put(
  '/:id/assign',
  authMiddleware,
  roleMiddleware(['Support', 'Admin']),
  validateRequest(assignTicketSchema),
  asyncHandler(assignTicket)
);

router.put(
  '/:id/status',
  authMiddleware,
  roleMiddleware(['Support', 'Admin']),
  validateRequest(updateStatusSchema),
  asyncHandler(updateStatus)
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['Admin']),
  asyncHandler(deleteTicket)
);

module.exports = router;
