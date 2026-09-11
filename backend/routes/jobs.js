import express from 'express';
import { getJobOpenings, checkEligibility, calculateJobMatch } from '../services/dataService.js';

const router = express.Router();

router.get('/', (req, res) => {
  const filters = {};
  if (req.query.department) filters.department = req.query.department;
  if (req.query.companyId) filters.companyId = req.query.companyId;
  res.json(getJobOpenings(filters));
});

router.get('/:id', (req, res) => {
  const job = getJobOpenings().find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

router.get('/eligibility/:studentId/:jobId', (req, res) => {
  const result = checkEligibility(req.params.studentId, req.params.jobId);
  if (!result) return res.status(404).json({ error: 'Student or job not found' });
  res.json(result);
});

router.get('/match/:studentId/:jobId', (req, res) => {
  const result = calculateJobMatch(req.params.studentId, req.params.jobId);
  if (!result) return res.status(404).json({ error: 'Student or job not found' });
  res.json(result);
});

export default router;
