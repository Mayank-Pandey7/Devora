const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({ 
  origin: '*',
  credentials: false
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cached MongoDB connection helper for Serverless & Standalone
let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/devora';
  try {
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('✅ MongoDB connected successfully to database');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
  }
};

// Middleware to ensure DB connection on requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ── Devora REST API Routes ───────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/interviews', require('./routes/interviews'));
app.use('/api/resumes',    require('./routes/resumes'));
app.use('/api/notes',      require('./routes/notes'));
app.use('/api/dashboard',  require('./routes/dashboard'));

// Legacy routes fallback compatibility
try {
  app.use('/api/content',   require('./routes/content'));
  app.use('/api/trending',  require('./routes/trending'));
  app.use('/api/analytics', require('./routes/analytics'));
  app.use('/api/scheduler', require('./routes/scheduler'));
} catch (e) {
  // Ignored if legacy files are updated
}

// Health check endpoints for Render and cloud monitors
app.get('/', (req, res) => {
  res.json({ message: '🚀 Devora Developer Career API is running!', status: 'OK', environment: process.env.NODE_ENV || 'development' });
});

app.get('/api', (req, res) => {
  res.json({ message: '🚀 Devora API endpoints active', status: 'OK' });
});

app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// On persistent cloud hosts (Render, Heroku, Railway, VPS, Local)
if (!process.env.VERCEL) {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Devora Server actively listening on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });

  connectDB().catch(err => {
    console.error('❌ Initial MongoDB connection failed:', err.message);
  });
}

module.exports = app;
