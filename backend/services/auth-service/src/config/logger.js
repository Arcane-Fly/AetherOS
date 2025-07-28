const winston = require('winston');
const path = require('path');

// Define log directory
const logDir = path.join(__dirname, '../../logs');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      service: 'auth-service',
      message,
      ...(stack && { stack }),
      ...meta
    });
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Add correlation ID support
logger.addCorrelationId = (req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || 
    req.headers['x-request-id'] || 
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  req.correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  
  // Override logger methods to include correlation ID
  req.logger = {
    error: (message, meta = {}) => logger.error(message, { correlationId, ...meta }),
    warn: (message, meta = {}) => logger.warn(message, { correlationId, ...meta }),
    info: (message, meta = {}) => logger.info(message, { correlationId, ...meta }),
    debug: (message, meta = {}) => logger.debug(message, { correlationId, ...meta })
  };
  
  next();
};

module.exports = logger;