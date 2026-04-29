const { z } = require('zod');

const createCommentSchema = z.object({
  ticketId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ticket ID'),
  message: z.string().min(1, 'Comment cannot be empty'),
  isInternal: z.boolean().default(false),
});

module.exports = { createCommentSchema };
