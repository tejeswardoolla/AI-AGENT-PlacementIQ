import express from 'express';
import { runPlacementAgent } from '../agent/placementAgent.js';

const router = express.Router();

router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const useAI = !!process.env.GEMINI_API_KEY;
    const result = await runPlacementAgent(question.trim(), useAI);
    res.json(result);
  } catch (err) {
    console.error('Agent error:', err);
    res.status(500).json({ error: 'Agent failed to process question', message: err.message });
  }
});

router.get('/priorities', async (req, res) => {
  try {
    const useAI = !!process.env.GEMINI_API_KEY;
    const result = await runPlacementAgent('What should management do right now?', useAI);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
