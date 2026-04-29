/**
 * Validate request body against Zod schema
 * Usage: validateRequest(createTicketSchema)
 */
const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.validatedBody = validated;
      next();
    } catch (err) {
      const validationErrors = err.issues || err.errors;
      if (validationErrors) {
        return res.status(400).json({
          success: false,
          message: validationErrors[0]?.message || 'Request validation failed',
          details: validationErrors.map((e) => `${e.path.join('.')}: ${e.message}`),
        });
      }
      
      next(err);
    }
  };
};

module.exports = validateRequest;
