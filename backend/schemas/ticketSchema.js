const { z } = require('zod');
const {
  TICKET_CATEGORY,
  TICKET_PRIORITY_VALUES,
  TICKET_STATUS_VALUES,
} = require('../config/constants');

const createTicketSchema = z.object({
  category: z.enum(TICKET_CATEGORY),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(TICKET_PRIORITY_VALUES).default('medium'),
});

const updateTicketSchema = z.object({
  subject: z.string().min(5).optional(),
  description: z.string().min(10).optional(),
  priority: z.enum(TICKET_PRIORITY_VALUES).optional(),
});

const assignTicketSchema = z.object({
  assignedTo: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
});

const updateStatusSchema = z.object({
  status: z.enum(TICKET_STATUS_VALUES),
});

module.exports = {
  createTicketSchema,
  updateTicketSchema,
  assignTicketSchema,
  updateStatusSchema,
};
