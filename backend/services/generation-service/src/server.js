require('dotenv').config({ path: '../../.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const expressWinston = require('express-winston');
const generationRoutes = require('./routes/generation');
const memoryGraphRoutes = require('./routes/memory-graph');
const logger = require('./config/logger');

const app = express();
const PORT = process.env.PORT || process.env.GENERATION_SERVICE_PORT || 3002;

// Create logs directory
const fs = require('fs');
const path = require('path');
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Request logging
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false; }
}));

// Correlation ID middleware
app.use(logger.addCorrelationId);

// Enhanced rate limiting for generation endpoints
const generationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 generation requests per windowMs
  message: { error: 'Too many generation requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => {
    // Allow health checks to bypass rate limiting
    return req.path === '/health';
  }
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs for other endpoints
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting
app.use('/api/generate', generationLimiter);
app.use('/api/memory-graph', generationLimiter); // Apply same limits to memory graph endpoints
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/generate', generationRoutes);
app.use('/api/memory-graph', memoryGraphRoutes);

// Enhanced health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'generation-service',
    version: '1.0.0',
    features: ['code-generation', 'memory-graph', 'multi-agent-reasoning'],
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    openai_configured: !!process.env.OPENAI_API_KEY
  });
});

// Error logging middleware
app.use(expressWinston.errorLogger({
  winstonInstance: logger
}));

// Error handling middleware
app.use((err, req, res, next) => {
  req.logger?.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  req.logger?.warn('Route not found', { method: req.method, url: req.originalUrl });
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = () => {
  try {
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`Generation service started successfully`, { port: PORT, env: process.env.NODE_ENV });
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
};

startServer();