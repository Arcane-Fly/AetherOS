const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const generationRoutes = require('./routes/generation');

const app = express();
const PORT = process.env.GENERATION_SERVICE_PORT || 3002;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting - more restrictive for generation endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50 // limit each IP to 50 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/generate', generationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'generation-service' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Generation service running on port ${PORT}`);
});