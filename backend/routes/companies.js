import express from 'express';
import { getCompanies } from '../services/dataService.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(getCompanies());
});

router.get('/:id', (req, res) => {
  const company = getCompanies().find(c => c.id === req.params.id);
  if (!company) return res.status(404).json({ error: 'Company not found' });
  res.json(company);
});

export default router;
