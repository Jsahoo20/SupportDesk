const { z } = require('zod');
const { TICKET_CATEGORY } = require('../config/constants');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  department: z.enum(TICKET_CATEGORY),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase(),
  password: z.string(),
});

module.exports = { registerSchema, loginSchema };
