import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataPath = join(__dirname, '..', 'data');

const loadJSON = (filename) => {
  const raw = readFileSync(join(dataPath, filename), 'utf-8');
  return JSON.parse(raw);
};

// Load all data
export const students = loadJSON('students.json');
export const companies = loadJSON('companies.json');
export const jobs = loadJSON('jobs.json');
export const applications = loadJSON('applications.json');
export const placementHistory = loadJSON('placement_history.json');
export const skillsData = loadJSON('skills.json');

// ─── Agent Tools ────────────────────────────────────────────────────────────

export function getStudentProfile(studentId) {
  return students.find(s => s.id === studentId) || null;
}

export function getStudents(filters = {}) {
  let result = [...students];
  if (filters.department) result = result.filter(s => s.department === filters.department);
  if (filters.placementStatus) result = result.filter(s => s.placementStatus === filters.placementStatus);
  if (filters.minCGPA) result = result.filter(s => s.cgpa >= filters.minCGPA);
  return result;
}

export function getCompanies() {
  return companies;
}

export function getJobOpenings(filters = {}) {
  let result = [...jobs];
  if (filters.department) result = result.filter(j => j.department === filters.department);
  if (filters.companyId) result = result.filter(j => j.companyId === filters.companyId);
  return result;
}

export function checkEligibility(studentId, jobId) {
  const student = students.find(s => s.id === studentId);
  const job = jobs.find(j => j.id === jobId);
  if (!student || !job) return null;

  const cgpaOk = student.cgpa >= job.minCGPA;
  const deptOk = job.department === student.department || job.department === 'ALL';
  const matchedSkills = job.requiredSkills.filter(s =>
    student.skills.map(sk => sk.toLowerCase()).includes(s.toLowerCase())
  );
  const missingSkills = job.requiredSkills.filter(s =>
    !student.skills.map(sk => sk.toLowerCase()).includes(s.toLowerCase())
  );
  const eligible = cgpaOk && deptOk;

  return { eligible, cgpaOk, deptOk, matchedSkills, missingSkills, student, job };
}

export function calculateJobMatch(studentId, jobId) {
  const eligibility = checkEligibility(studentId, jobId);
  if (!eligibility) return null;

  const { student, job, cgpaOk, deptOk, matchedSkills, missingSkills } = eligibility;

  // Skill match score
  const requiredSkillScore = (matchedSkills.length / job.requiredSkills.length) * 50;

  // Preferred skill bonus
  const matchedPreferred = (job.preferredSkills || []).filter(s =>
    student.skills.map(sk => sk.toLowerCase()).includes(s.toLowerCase())
  );
  const preferredScore = Math.min((matchedPreferred.length / Math.max(job.preferredSkills?.length || 1, 1)) * 15, 15);

  // CGPA score (max 15)
  const cgpaScore = cgpaOk ? Math.min(((student.cgpa - job.minCGPA) / (10 - job.minCGPA)) * 15 + 10, 15) : 0;

  // Internship score (max 10)
  const internScore = student.internships?.length > 0 ? 10 : 0;

  // Certification score (max 10)
  const certScore = Math.min(student.certifications?.length * 3, 10);

  const rawScore = requiredSkillScore + preferredScore + cgpaScore + internScore + certScore;
  const matchPercentage = Math.min(Math.round(rawScore), 100);

  return {
    studentId, jobId, matchPercentage,
    breakdown: {
      skillMatch: Math.round(requiredSkillScore),
      preferredSkills: Math.round(preferredScore),
      cgpaScore: Math.round(cgpaScore),
      internshipScore: internScore,
      certificationScore: certScore
    },
    matchedRequiredSkills: matchedSkills,
    missingRequiredSkills: missingSkills,
    matchedPreferredSkills: matchedPreferred,
    eligible: eligibility.eligible
  };
}

export function getSkillDemand() {
  return skillsData.demandedSkills;
}

export function getDepartmentAnalytics() {
  const depts = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
  return depts.map(dept => {
    const deptStudents = students.filter(s => s.department === dept);
    const placed = deptStudents.filter(s => s.placementStatus === 'placed');
    const unplaced = deptStudents.filter(s => s.placementStatus === 'unplaced');
    const avgCGPA = deptStudents.reduce((sum, s) => sum + s.cgpa, 0) / deptStudents.length;
    const salaries = placed.filter(s => s.offeredSalary).map(s => s.offeredSalary);
    const avgSalary = salaries.length ? salaries.reduce((a, b) => a + b, 0) / salaries.length : 0;
    const highestSalary = salaries.length ? Math.max(...salaries) : 0;

    return {
      department: dept,
      total: deptStudents.length,
      placed: placed.length,
      unplaced: unplaced.length,
      placementPercentage: Math.round((placed.length / deptStudents.length) * 100),
      avgCGPA: Math.round(avgCGPA * 10) / 10,
      avgSalary: Math.round(avgSalary),
      highestSalary,
      skillGap: skillsData.departmentSkillGaps[dept] || {}
    };
  });
}

export function getPlacementTrends() {
  return placementHistory;
}

export function getApplicationData(studentId) {
  const studentApps = applications.filter(a => a.studentId === studentId);
  return studentApps.map(app => {
    const job = jobs.find(j => j.id === app.jobId);
    const company = companies.find(c => c.id === job?.companyId);
    return { ...app, job, company };
  });
}

export function getAtRiskStudents() {
  const unplacedStudents = students.filter(s => s.placementStatus === 'unplaced');

  return unplacedStudents.map(student => {
    const studentApps = applications.filter(a => a.studentId === student.id);
    const eligibleJobs = jobs.filter(j => {
      const elig = checkEligibility(student.id, j.id);
      return elig && elig.eligible;
    });
    const rejections = studentApps.filter(a => a.result === 'rejected').length;
    const pendingApps = studentApps.filter(a => a.result === 'pending').length;
    const appliedCount = studentApps.filter(a => a.result !== 'not_applied').length;
    const eligibleButNotApplied = eligibleJobs.filter(j =>
      !studentApps.find(a => a.jobId === j.id)
    );

    // Risk scoring
    let riskScore = 0;
    const riskReasons = [];

    if (student.cgpa < 7.0) { riskScore += 25; riskReasons.push('CGPA below 7.0 limits eligibility for many companies'); }
    if (appliedCount === 0) { riskScore += 30; riskReasons.push('Has not applied to any positions'); }
    if (rejections >= 2) { riskScore += 20; riskReasons.push(`Rejected from ${rejections} interviews — may need skill improvement`); }
    if (student.skills.length < 4) { riskScore += 20; riskReasons.push('Limited skill set reduces job match rate'); }
    if (student.internships?.length === 0) { riskScore += 10; riskReasons.push('No internship experience'); }
    if (eligibleButNotApplied.length > 2) { riskScore += 15; riskReasons.push(`Eligible for ${eligibleButNotApplied.length} jobs but has not applied`); }
    if (student.certifications?.length === 0) { riskScore += 5; riskReasons.push('No certifications'); }

    const riskLevel = riskScore >= 60 ? 'High' : riskScore >= 35 ? 'Medium' : 'Low';

    const interventions = [];
    if (student.cgpa < 7.0) interventions.push('Academic counseling to understand CGPA impact');
    if (appliedCount === 0) interventions.push('Immediate application campaign — at least 5 applications');
    if (rejections >= 2) interventions.push('Mock interviews and technical preparation sessions');
    if (student.skills.length < 4) interventions.push(`Skill development workshops (focus: ${skillsData.departmentSkillGaps[student.department]?.topMissingSkills?.slice(0, 2).join(', ')})`);
    if (eligibleButNotApplied.length > 0) interventions.push(`Apply to ${eligibleButNotApplied.map(j => j.title).slice(0, 2).join(', ')} — eligible but not applied`);

    return {
      student,
      riskLevel,
      riskScore,
      riskReasons,
      interventions,
      eligibleJobs: eligibleJobs.length,
      appliedCount,
      rejections,
      pendingApps,
      eligibleButNotApplied: eligibleButNotApplied.length
    };
  }).sort((a, b) => b.riskScore - a.riskScore);
}

export function getRecruiterHistory() {
  return companies.map(company => {
    const companyJobs = jobs.filter(j => j.companyId === company.id);
    const companyApps = applications.filter(a => {
      const job = jobs.find(j => j.id === a.jobId);
      return job && job.companyId === company.id;
    });
    const selectedApps = companyApps.filter(a => a.result === 'selected');

    const totalPastHires = Object.values(company.previousYearHires || {}).reduce((sum, n) => sum + n, 0);
    const reEngagementPriority = calculateReEngagementPriority(company, selectedApps, totalPastHires);

    return {
      company,
      currentOpenings: companyJobs.length,
      currentApplications: companyApps.length,
      currentSelected: selectedApps.length,
      totalPastHires,
      reEngagementPriority,
      reEngagementReason: reEngagementPriority.reason
    };
  });
}

function calculateReEngagementPriority(company, selectedApps, totalPastHires) {
  let score = 0;
  let reason = '';

  if (totalPastHires >= 10) { score += 40; reason = 'Strong hiring history with our institution'; }
  else if (totalPastHires >= 5) { score += 25; reason = 'Good hiring track record'; }
  else { score += 10; reason = 'Emerging relationship'; }

  if (company.salaryRange.max >= 1500000) { score += 30; reason += ', offers premium compensation'; }
  else if (company.salaryRange.max >= 800000) { score += 15; reason += ', competitive salaries'; }

  if (selectedApps.length === 0 && totalPastHires > 0) {
    score += 20;
    reason += ' — has not hired yet this season despite past engagement';
  }

  const priority = score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low';
  return { priority, score, reason };
}

export function getCurrentPlacementStatus() {
  const total = students.length;
  const placed = students.filter(s => s.placementStatus === 'placed').length;
  const unplaced = students.filter(s => s.placementStatus === 'unplaced').length;
  const salaries = students.filter(s => s.offeredSalary).map(s => s.offeredSalary);
  const avgSalary = salaries.length ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length) : 0;
  const highestSalary = salaries.length ? Math.max(...salaries) : 0;

  return {
    total, placed, unplaced,
    placementPercentage: Math.round((placed / total) * 100),
    avgSalary, highestSalary,
    companiesHiring: companies.length,
    openPositions: jobs.reduce((sum, j) => sum + j.openings, 0),
    departmentBreakdown: getDepartmentAnalytics()
  };
}

export function getApplicationGaps() {
  return jobs.map(job => {
    const company = companies.find(c => c.id === job.companyId);
    const jobApps = applications.filter(a => a.jobId === job.id && a.result !== 'not_applied');
    const eligibleStudents = students.filter(s => {
      const elig = checkEligibility(s.id, job.id);
      return elig && elig.eligible;
    });
    const gap = eligibleStudents.length - jobApps.length;
    return {
      job, company,
      eligibleCount: eligibleStudents.length,
      applicantCount: jobApps.length,
      gap: Math.max(gap, 0),
      fillRate: eligibleStudents.length > 0 
        ? Math.round((jobApps.length / eligibleStudents.length) * 100) 
        : 0
    };
  }).filter(item => item.gap > 0 || item.fillRate < 50).sort((a, b) => b.gap - a.gap);
}
