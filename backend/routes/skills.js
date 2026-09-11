import express from 'express';
import { getSkillDemand, skillsData } from '../services/dataService.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    demanded: getSkillDemand(),
    departmentGaps: skillsData.departmentSkillGaps
  });
});

router.get('/demand', (req, res) => {
  res.json(getSkillDemand());
});

router.get('/gaps', (req, res) => {
  res.json(skillsData.departmentSkillGaps);
});

export default router;
