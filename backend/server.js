import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { rateLimiter, apiKeyValidator } from './middleware/auth.js';
import { errorHandler, asyncHandler } from './middleware/error.js';
import emergencyRoutes from './routes/emergency.js';
import analyticsRoutes from './routes/analytics.js';
import teamsRoutes from './routes/teams.js';
import demoRoutes from './routes/demo.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CRITICAL: API key is read from process.env at runtime
console.log('SENTINEL Backend Starting...');
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`API Key configured: ${process.env.GEMINI_API_KEY ? 'YES ✓' : 'NO ✗'}`);

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!process.env.GEMINI_API_KEY
  });
});

// API Routes
app.use('/api/emergency', apiKeyValidator, emergencyRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/demo', demoRoutes);

// Welcome endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'SENTINEL - AI Emergency Response Intelligence System',
    version: '1.0.0',
    endpoints: {
      emergency: '/api/emergency',
      analytics: '/api/analytics',
      teams: '/api/teams',
      demo: '/api/demo',
      health: '/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`\n✓ SENTINEL Backend running at http://localhost:${PORT}`);
  console.log(`✓ CORS enabled for: ${allowedOrigins.join(', ')}`);
  console.log(`✓ API endpoints ready for frontend connection`);
  console.log('\nAvailable endpoints:');
  console.log('  GET  /api - API information');
  console.log('  GET  /health - Health check');
  console.log('  POST /api/emergency - Create emergency');
  console.log('  GET  /api/analytics/predict - Get predictions');
  console.log('  GET  /api/demo/progress - Check demo progress');
  console.log('\n');
});
