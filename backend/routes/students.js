import express from 'express';
import { getStudents, getStudentProfile } from '../services/dataService.js';
import { analyzeStudentJobMatches } from '../agent/placementAgent.js';

const router = express.Router();

router.get('/', (req, res) => {
  const filters = {};
  if (req.query.department) filters.department = req.query.department;
  if (req.query.status) filters.placementStatus = req.query.status;
  if (req.query.minCGPA) filters.minCGPA = parseFloat(req.query.minCGPA);
  res.json(getStudents(filters));
});

router.get('/:id', (req, res) => {
  const student = getStudentProfile(req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

router.get('/:id/matches', (req, res) => {
  const result = analyzeStudentJobMatches(req.params.id);
  if (!result) return res.status(404).json({ error: 'Student not found' });
  res.json(result);
});

export default router;
