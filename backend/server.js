import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import studentsRouter from './routes/students.js';
import companiesRouter from './routes/companies.js';
import jobsRouter from './routes/jobs.js';
import applicationsRouter from './routes/applications.js';
import analyticsRouter from './routes/analytics.js';
import skillsRouter from './routes/skills.js';
import atRiskRouter from './routes/atRisk.js';
import recruitersRouter from './routes/recruiters.js';
import agentRouter from './routes/agent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load backend/.env using explicit path so the key is available
// regardless of which directory `node server.js` is invoked from.
// SECURITY: process.env.GEMINI_API_KEY is only used server-side.
// It is never sent to the React frontend or included in any API response.
dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check — reports AI mode only, never exposes the key
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiMode: process.env.GEMINI_API_KEY ? 'gemini' : 'mock'
  });
});

// Routes
app.use('/api/students', studentsRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/at-risk', atRiskRouter);
app.use('/api/recruiters', recruitersRouter);
app.use('/api/agent', agentRouter);

// Error handler — never logs sensitive env values
app.use((err, req, res, next) => {
  console.error('[PlacementIQ Error]', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  // Log AI mode label only — the key value is never printed
  const aiLabel = process.env.GEMINI_API_KEY ? 'Gemini API ✓' : 'Mock mode (add GEMINI_API_KEY to backend/.env to enable)';
  console.log(`\n🚀 PlacementIQ Backend  →  http://localhost:${PORT}`);
  console.log(`🤖 AI Mode: ${aiLabel}`);
  console.log(`📊 API: /api/students | /api/companies | /api/jobs | /api/analytics | /api/agent\n`);
});

export default app;
