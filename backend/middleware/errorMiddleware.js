const errorMiddleware = (err, req, res, next) => {
  // Determine status code
  const statusCode = res.statusCode !== 200 ? res.statusCode : err.statusCode || 500;

  // Log error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${req.requestId || 'NO-ID'}] Error:`, err);
  }

  // Construct standardized error response
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorMiddleware;
