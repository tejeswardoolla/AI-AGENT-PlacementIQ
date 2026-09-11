import express from 'express';
import { getRecruiterHistory } from '../services/dataService.js';

const router = express.Router();

router.get('/', (req, res) => {
  const recruiters = getRecruiterHistory();
  const priority = req.query.priority;
  if (priority) return res.json(recruiters.filter(r => r.reEngagementPriority.priority === priority));
  res.json(recruiters);
});

export default router;
