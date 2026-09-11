import express from 'express';
import { getDepartmentAnalytics, getCurrentPlacementStatus, getPlacementTrends } from '../services/dataService.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    overview: getCurrentPlacementStatus(),
    departments: getDepartmentAnalytics(),
    trends: getPlacementTrends()
  });
});

router.get('/overview', (req, res) => {
  res.json(getCurrentPlacementStatus());
});

router.get('/departments', (req, res) => {
  res.json(getDepartmentAnalytics());
});

router.get('/trends', (req, res) => {
  res.json(getPlacementTrends());
});

export default router;
