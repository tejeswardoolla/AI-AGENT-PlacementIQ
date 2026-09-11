import express from 'express';
import { getAtRiskStudents } from '../services/dataService.js';

const router = express.Router();

router.get('/', (req, res) => {
  const atRisk = getAtRiskStudents();
  const level = req.query.level;
  if (level) return res.json(atRisk.filter(r => r.riskLevel === level));
  res.json(atRisk);
});

export default router;
