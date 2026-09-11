import express from 'express';
import { getApplicationData, getApplicationGaps } from '../services/dataService.js';
import { applications, jobs, companies } from '../services/dataService.js';

const router = express.Router();

router.get('/', (req, res) => {
  if (req.query.studentId) {
    return res.json(getApplicationData(req.query.studentId));
  }
  res.json(applications);
});

router.get('/gaps', (req, res) => {
  res.json(getApplicationGaps());
});

export default router;
