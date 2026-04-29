const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorMiddleware = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const commentRoutes = require('./routes/commentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Security and Logging Middleware
app.use(helmet());
// Only log requests in development (not in production to save cost)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan(':method :url :status :response-time ms'));
}

// Request ID Tracer
app.use((req, res, next) => {
  req.requestId = Date.now().toString();
  next();
});

// Setup CORS - allow both local dev and production frontend
const allowedOrigins = [
  'http://localhost:5173',       // Vite local dev
  'http://localhost:3000',       // fallback local
  process.env.FRONTEND_URL,     // production domain (set in .env)
].filter(Boolean); // removes undefined if FRONTEND_URL is not set

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like Postman or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate limiting - protects the API from abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again in 15 minutes.' },
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler (MUST be last)
app.use(errorMiddleware);

module.exports = app;
