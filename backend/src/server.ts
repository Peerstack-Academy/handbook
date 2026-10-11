import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { initializeDatabase, isPgConnected } from './db';
import calendarsRouter from './routes/calendars';
import resourcesRouter from './routes/resources';
import roadmapsRouter from './routes/roadmaps';
import socialsRouter from './routes/socials';
import authRouter from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true, // Allows reflective origin for cookie credentials
  credentials: true, // Required for httpOnly cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/calendars', calendarsRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/roadmaps', roadmapsRouter);
app.use('/api/socials', socialsRouter);
app.use('/api/auth', authRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: isPgConnected ? 'postgresql' : 'in-memory-fallback',
  });
});

// Root welcome
app.get('/', (_req, res) => {
  res.send('Peerstack Student Handbook API is running.');
});

// Initialize DB and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server işə düşdü: http://localhost:${PORT}`);
  });
});
