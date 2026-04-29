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

app.use(helmet());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan(':method :url :status :response-time ms'));
}

app.use((req, res, next) => {
  req.requestId = Date.now().toString();
  next();
});

const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  ...configuredOrigins,
];

app.use(cors({
  origin: (origin, callback) => {
    const normalizedOrigin = origin?.replace(/\/$/, '');
    if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again in 15 minutes.' },
});
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/dashboard', dashboardRoutes);

const healthResponse = {
  success: true,
  message: 'SupportDesk API is running',
  health: '/api/health',
};

app.get('/', (req, res) => {
  res.json(healthResponse);
});

app.get('/api/health', (req, res) => {
  res.json(healthResponse);
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use(errorMiddleware);

module.exports = app;
