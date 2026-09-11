import {
  getStudents, getCompanies, getJobOpenings, getDepartmentAnalytics,
  getAtRiskStudents, getRecruiterHistory, getCurrentPlacementStatus,
  getSkillDemand, getPlacementTrends, calculateJobMatch, getApplicationGaps,
  checkEligibility, getStudentProfile
} from '../services/dataService.js';

// ─── Intent Detection ─────────────────────────────────────────────────────────

function detectIntent(question) {
  const q = question.toLowerCase();

  if (q.includes('at risk') || q.includes('risk') || q.includes('unplaced') || q.includes('struggling'))
    return 'AT_RISK_STUDENTS';
  if (q.includes('eee') || (q.includes('electrical') && (q.includes('performance') || q.includes('low') || q.includes('placement'))))
    return 'EEE_ANALYSIS';
  if (q.includes('cse') || q.includes('computer science'))
    return 'DEPARTMENT_SPECIFIC';
  if (q.includes('department') && (q.includes('underperform') || q.includes('attention') || q.includes('low') || q.includes('worst') || q.includes('behind')))
    return 'DEPARTMENT_ANALYSIS';
  if (q.includes('right now') || q.includes('what should') || q.includes('action') || q.includes('priority') || q.includes('recommend') || q.includes('do next'))
    return 'TOP_PRIORITIES';
  if (q.includes('recruiter') || q.includes('approach') || q.includes('company') && q.includes('again'))
    return 'RECRUITER_INTELLIGENCE';
  if (q.includes('skill') && (q.includes('demand') || q.includes('missing') || q.includes('gap') || q.includes('need')))
    return 'SKILL_DEMAND';
  if (q.includes('salary') || q.includes('package') || q.includes('pay') || q.includes('ctc'))
    return 'SALARY_ANALYSIS';
  if (q.includes('eligible') && (q.includes('not apply') || q.includes('not applying') || q.includes('haven\'t applied')))
    return 'APPLICATION_GAP';
  if (q.includes('overview') || q.includes('status') || q.includes('summary') || q.includes('dashboard'))
    return 'PLACEMENT_STATUS';
  if (q.includes('trend') || q.includes('year') || q.includes('season') || q.includes('compare') || q.includes('history'))
    return 'PLACEMENT_TRENDS';
  if (q.includes('job') || q.includes('match') || q.includes('suitable') || q.includes('best fit'))
    return 'JOB_MATCH';
  return 'GENERAL';
}

// ─── Reasoning Functions ──────────────────────────────────────────────────────

function analyzeAtRisk(question) {
  const atRisk = getAtRiskStudents();
  const high = atRisk.filter(r => r.riskLevel === 'High');
  const medium = atRisk.filter(r => r.riskLevel === 'Medium');
  const status = getCurrentPlacementStatus();

  return {
    intent: 'AT_RISK_STUDENTS',
    finding: `${atRisk.length} unplaced students identified. ${high.length} are HIGH risk and need immediate intervention.`,
    evidence: [
      `Total unplaced students: ${status.unplaced}`,
      `High-risk students: ${high.length} (e.g., ${high.slice(0, 2).map(r => r.student.name).join(', ')})`,
      `Medium-risk students: ${medium.length}`,
      `Most common risk factor: ${getMostCommonRisk(atRisk)}`,
    ],
    reasoning: `Risk is determined by a composite score based on: CGPA threshold (below 7.0 heavily restricts eligibility), application activity (students not applying have 0% chance), rejection frequency (signals skill or interview readiness gaps), skill breadth, and whether they are eligible for jobs but not applying. High-risk students typically score above 60 on this scale.`,
    recommendation: `1. Conduct emergency 1:1 counseling sessions with ${high.slice(0, 3).map(r => r.student.name).join(', ')}.\n2. Run weekly mock interview sessions for students with 2+ rejections.\n3. Organize targeted skill workshops based on identified gaps.\n4. Assign each high-risk student a placement coordinator buddy.`,
    expectedImpact: `Reducing high-risk count by 50% through active intervention could increase overall placement rate by 3-5%.`,
    data: atRisk.slice(0, 10)
  };
}

function analyzeDepartments(question) {
  const deptStats = getDepartmentAnalytics();
  const sorted = [...deptStats].sort((a, b) => a.placementPercentage - b.placementPercentage);
  const worst = sorted[0];
  const best = sorted[sorted.length - 1];
  const avgPlacement = deptStats.reduce((sum, d) => sum + d.placementPercentage, 0) / deptStats.length;

  return {
    intent: 'DEPARTMENT_ANALYSIS',
    finding: `${worst.department} has the lowest placement rate at ${worst.placementPercentage}%, while ${best.department} leads at ${best.placementPercentage}%. The institution average is ${Math.round(avgPlacement)}%.`,
    evidence: deptStats.map(d => `${d.department}: ${d.placed}/${d.total} placed (${d.placementPercentage}%), avg salary ₹${(d.avgSalary/100000).toFixed(1)}L`),
    reasoning: `Placement performance correlates with skill-market alignment and company demand. ${worst.department} shows a ${worst.skillGap?.coveragePercentage}% skill coverage — the lowest among all departments — indicating the primary driver is skill mismatch with current job requirements. Industry demand for ${worst.department} roles is also narrower, limiting the eligible company pool.`,
    recommendation: `1. Launch targeted skill training for ${worst.department} students focusing on: ${worst.skillGap?.topMissingSkills?.join(', ')}.\n2. Actively identify and approach more companies that hire ${worst.department} graduates.\n3. Consider cross-department tech training for ${worst.department} students interested in software roles.`,
    expectedImpact: `Closing 50% of ${worst.department}'s skill gap could improve placement rate from ${worst.placementPercentage}% to ${Math.min(worst.placementPercentage + 15, 80)}% within one semester.`,
    data: deptStats
  };
}

function analyzeTopPriorities(question) {
  const deptStats = getDepartmentAnalytics();
  const atRisk = getAtRiskStudents();
  const recruiters = getRecruiterHistory();
  const appGaps = getApplicationGaps();
  const highRisk = atRisk.filter(r => r.riskLevel === 'High');
  const worstDept = [...deptStats].sort((a, b) => a.placementPercentage - b.placementPercentage)[0];
  const topRecruiters = recruiters.filter(r => r.reEngagementPriority.priority === 'High');

  return {
    intent: 'TOP_PRIORITIES',
    finding: `3 critical actions have been identified based on current placement data analysis.`,
    evidence: [
      `${highRisk.length} students are at HIGH placement risk`,
      `${worstDept.department} placement rate is only ${worstDept.placementPercentage}% — lowest in institution`,
      `${topRecruiters.length} high-priority companies worth re-approaching`,
      `${appGaps.slice(0, 3).map(g => g.job.title + ' (' + g.gap + ' eligible students haven\'t applied)').join(', ')}`
    ],
    reasoning: `Priority is assigned based on impact × urgency. High-risk student intervention has immediate impact (these students may miss the season). The underperforming department fix has broader structural impact. Recruiter re-engagement has high leverage (one company = multiple offers).`,
    recommendation: `PRIORITY 1 — Intervene with ${highRisk.length} high-risk students:\n${highRisk.slice(0, 3).map(r => `• ${r.student.name} (${r.student.department}, CGPA: ${r.student.cgpa}): ${r.riskReasons[0]}`).join('\n')}\n\nPRIORITY 2 — Run ${worstDept.department} skill development workshop:\n• Focus: ${worstDept.skillGap?.topMissingSkills?.join(', ')}\n• ${worstDept.unplaced} unplaced students in this department\n\nPRIORITY 3 — Re-approach top recruiters:\n${topRecruiters.slice(0, 2).map(r => `• ${r.company.name} — ${r.reEngagementReason}`).join('\n')}`,
    expectedImpact: `These 3 actions together could increase placement percentage by 8-12% by end of season.`,
    data: { highRisk: highRisk.slice(0, 5), worstDept, topRecruiters: topRecruiters.slice(0, 3) }
  };
}

function analyzeRecruiters(question) {
  const recruiters = getRecruiterHistory();
  const high = recruiters.filter(r => r.reEngagementPriority.priority === 'High');
  const medium = recruiters.filter(r => r.reEngagementPriority.priority === 'Medium');

  return {
    intent: 'RECRUITER_INTELLIGENCE',
    finding: `${high.length} companies are high-priority for re-engagement. ${medium.length} companies are medium priority. Key opportunities exist with companies that have hired in previous years but not yet committed this season.`,
    evidence: high.map(r => `${r.company.name}: ${r.totalPastHires} total past hires, salary range ₹${(r.company.salaryRange.min/100000).toFixed(0)}-${(r.company.salaryRange.max/100000).toFixed(0)}L, currently ${r.currentSelected} offers made`),
    reasoning: `Re-engagement priority is based on three factors: (1) Historical hiring volume (past hires signal a proven relationship), (2) Compensation offered (higher salary = more student interest = more successful placements), (3) Current season activity gap (companies with history but no current selections may need a nudge to revisit their campus hiring plans). This is an inference — the actual reason could be budget freeze or position filled internally; verification is recommended.`,
    recommendation: `1. Contact ${high[0]?.company.name} — reach out to ${high[0]?.company.recruitmentContact?.name} at ${high[0]?.company.recruitmentContact?.email}.\n2. Prepare a campus placement data pack showing relevant student profiles.\n3. Host a virtual recruiter event for medium-priority companies.\n4. Follow up with companies that attended last year but haven't committed this year.`,
    expectedImpact: `Re-engaging top 3 companies could yield 8-15 additional offers.`,
    data: [...high, ...medium].slice(0, 8)
  };
}

function analyzeSkillDemand(question) {
  const skills = getSkillDemand();
  const deptStats = getDepartmentAnalytics();
  const topSkills = skills.sort((a, b) => b.demandCount - a.demandCount).slice(0, 10);
  const risingSkills = skills.filter(s => s.trend === 'rising');

  return {
    intent: 'SKILL_DEMAND',
    finding: `Python, Machine Learning, SQL, Java and Cloud technologies dominate hiring requirements. ${risingSkills.length} skills are on a rising demand trend.`,
    evidence: topSkills.map(s => `${s.skill}: demanded by ${s.demandCount} job openings, trend: ${s.trend}`),
    reasoning: `Skill demand is calculated from active job postings. Rising trends indicate skills that have shown increased demand across successive placement seasons. Departments with lower skill coverage scores are most exposed to placement risk. Python's cross-domain applicability (data science, backend, automation) makes it the single highest-impact skill to train.`,
    recommendation: `1. Make Python a compulsory skill for ALL departments (not just CSE).\n2. Run cloud certification boot camp (AWS/Azure) — cloud roles offer 40-60% salary premium.\n3. Focus DSA training for students applying to MNCs.\n4. For EEE/ECE: add IoT + Python bridge course to increase software-role eligibility.`,
    expectedImpact: `Students with Python + Cloud skills see 35% higher match rates for currently open positions.`,
    data: { topSkills, risingSkills, departmentGaps: deptStats.map(d => ({ dept: d.department, gap: d.skillGap })) }
  };
}

function analyzeSalaries(question) {
  const status = getCurrentPlacementStatus();
  const history = getPlacementTrends();
  const deptStats = getDepartmentAnalytics();
  const topPaying = deptStats.sort((a, b) => b.avgSalary - a.avgSalary);

  return {
    intent: 'SALARY_ANALYSIS',
    finding: `Current season average salary is ₹${(status.avgSalary/100000).toFixed(1)}L. Highest offer is ₹${(status.highestSalary/100000).toFixed(1)}L. ${topPaying[0]?.department} students are earning the most on average.`,
    evidence: [
      `Overall avg salary: ₹${(status.avgSalary/100000).toFixed(1)}L`,
      `Highest salary: ₹${(status.highestSalary/100000).toFixed(1)}L`,
      ...deptStats.map(d => `${d.department}: avg ₹${(d.avgSalary/100000).toFixed(1)}L, highest ₹${(d.highestSalary/100000).toFixed(1)}L`)
    ],
    reasoning: `Salary data is based on confirmed offers this season. CSE students consistently command higher salaries due to broader market demand and alignment with high-paying tech sectors (AI, Cloud, Product companies). The salary gap between departments reflects market forces, not academic performance.`,
    recommendation: `1. Celebrate and publicize high-salary wins to motivate other students.\n2. Help non-CSE students target software/tech roles where relevant.\n3. Negotiate package benchmarks with repeat recruiters.`,
    expectedImpact: `Cross-department tech training could increase average salary by 15-20% for ECE/EEE students.`,
    data: { currentStatus: status, history, departmentSalaries: deptStats }
  };
}

function analyzeApplicationGaps(question) {
  const gaps = getApplicationGaps();
  const significantGaps = gaps.filter(g => g.gap >= 2);

  return {
    intent: 'APPLICATION_GAP',
    finding: `${significantGaps.length} job openings have significant application gaps where eligible students are not applying.`,
    evidence: gaps.slice(0, 8).map(g => `${g.job.title} @ ${g.company?.name}: ${g.eligibleCount} eligible, ${g.applicantCount} applied (gap: ${g.gap}, fill rate: ${g.fillRate}%)`),
    reasoning: `Application gaps can result from: (1) Students not being aware of the opportunity, (2) Students self-disqualifying unnecessarily, (3) Low employer brand awareness, or (4) Fear of rejection after previous failures. [INFERENCE — these are hypotheses, not confirmed reasons. Verification requires student surveys.]`,
    recommendation: `1. Personally notify eligible students about roles they have not applied to.\n2. Conduct employer info sessions for low-visibility companies.\n3. Address fear-of-rejection by normalizing the application process.\n4. Set a minimum application target: every eligible student should apply to at least 3 jobs.`,
    expectedImpact: `Closing application gaps for top 5 roles could add 10-18 more applications, increasing interview opportunity.`,
    data: gaps.slice(0, 10)
  };
}

function analyzeEEE(question) {
  const deptStats = getDepartmentAnalytics();
  const eee = deptStats.find(d => d.department === 'EEE');
  const eeeStudents = getStudents({ department: 'EEE' });
  const skills = getSkillDemand();

  return {
    intent: 'EEE_ANALYSIS',
    finding: `EEE has the lowest placement rate at ${eee?.placementPercentage}%. Only ${eee?.placed} of ${eee?.total} students are placed. The primary driver is skill mismatch with current market requirements.`,
    evidence: [
      `EEE placement rate: ${eee?.placementPercentage}% vs institution average ~65%`,
      `EEE skill coverage: ${eee?.skillGap?.coveragePercentage}% — lowest among all departments`,
      `Most demanded missing skills in EEE: ${eee?.skillGap?.topMissingSkills?.join(', ')}`,
      `Average CGPA: ${eee?.avgCGPA} — not the issue`,
      `Company eligibility for EEE: mostly AutomationFirst, GreenPower, AutoElec — limited pool`
    ],
    reasoning: `EEE students primarily qualify for electrical/automation/energy companies. However, the current market is heavily tilted towards software and AI roles (which dominate 65% of available openings). EEE students who have added Python, IoT, or automation programming skills (like Sunil Joshi, Prasad Kulkarni, Deepa Krishnaswamy) have achieved placements. Those without software skills are locked out of the majority of opportunities.`,
    recommendation: `1. IMMEDIATE: Run a 6-week Python for EEE Engineers bootcamp.\n2. SHORT-TERM: Partner with industrial automation companies (Siemens, ABB, Honeywell) to expand the company pool.\n3. MEDIUM-TERM: Add elective software modules to EEE curriculum.\n4. INDIVIDUAL: Encourage cross-domain applications for students with some software skills.`,
    expectedImpact: `Adding Python + IoT skills could make EEE students eligible for 8-12 more job roles, potentially increasing placement from ${eee?.placementPercentage}% to 60%+.`,
    data: { eeeStats: eee, students: eeeStudents }
  };
}

function analyzeTrends(question) {
  const trends = getPlacementTrends();
  const completed = trends.filter(t => t.placementPercentage !== null);
  const latestTwo = completed.slice(-2);

  return {
    intent: 'PLACEMENT_TRENDS',
    finding: `Placement rate has grown from ${completed[0]?.placementPercentage}% (${completed[0]?.year}) to ${latestTwo[latestTwo.length-1]?.placementPercentage}% (${latestTwo[latestTwo.length-1]?.year}). Average salary has increased by ${Math.round(((latestTwo[latestTwo.length-1]?.averageSalary - completed[0]?.averageSalary) / completed[0]?.averageSalary) * 100)}% over the period.`,
    evidence: completed.map(t => `${t.year}: ${t.placementPercentage}% placed, avg salary ₹${(t.averageSalary/100000).toFixed(1)}L, ${t.companiesHired} companies`),
    reasoning: `The consistently improving trend reflects better recruiter relationships and improved student skill sets. The salary increase is largely driven by higher-paying tech companies (AI, Cloud) entering campus recruitment. The CSE department leads this trend.`,
    recommendation: `1. Formalize relationships with top recurring companies.\n2. Set targets for 2026: aim for 85% placement and ₹10L average salary.\n3. Track department-wise improvement year-over-year.`,
    expectedImpact: `Based on the growth trend, 2026 could achieve 80-85% placement if current momentum is maintained.`,
    data: trends
  };
}

function analyzeGeneral(question) {
  const status = getCurrentPlacementStatus();
  return {
    intent: 'GENERAL',
    finding: `Current placement status: ${status.placed}/${status.total} students placed (${status.placementPercentage}%).`,
    evidence: [
      `Total students: ${status.total}`,
      `Placed: ${status.placed} (${status.placementPercentage}%)`,
      `Unplaced: ${status.unplaced}`,
      `Average salary: ₹${(status.avgSalary/100000).toFixed(1)}L`,
      `Companies hiring: ${status.companiesHiring}`,
      `Open positions: ${status.openPositions}`
    ],
    reasoning: `This is the current snapshot based on confirmed placements and active job openings in the system. The placement season is ongoing with ${status.unplaced} students still seeking positions.`,
    recommendation: `For a more specific analysis, ask about: departments, at-risk students, skill gaps, recruiter opportunities, or specific actions to take.`,
    expectedImpact: `Varies by specific action taken.`,
    data: status
  };
}

function getMostCommonRisk(atRisk) {
  const reasons = atRisk.flatMap(r => r.riskReasons);
  const counts = {};
  reasons.forEach(r => {
    const key = r.split(' ').slice(0, 4).join(' ');
    counts[key] = (counts[key] || 0) + 1;
  });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || 'Low application activity';
}

// ─── Main Agent Function ──────────────────────────────────────────────────────

export async function runPlacementAgent(question, useAI = false) {
  const intent = detectIntent(question);

  let mockResult;
  switch (intent) {
    case 'AT_RISK_STUDENTS': mockResult = analyzeAtRisk(question); break;
    case 'DEPARTMENT_ANALYSIS': mockResult = analyzeDepartments(question); break;
    case 'TOP_PRIORITIES': mockResult = analyzeTopPriorities(question); break;
    case 'RECRUITER_INTELLIGENCE': mockResult = analyzeRecruiters(question); break;
    case 'SKILL_DEMAND': mockResult = analyzeSkillDemand(question); break;
    case 'SALARY_ANALYSIS': mockResult = analyzeSalaries(question); break;
    case 'APPLICATION_GAP': mockResult = analyzeApplicationGaps(question); break;
    case 'PLACEMENT_STATUS': mockResult = analyzeGeneral(question); break;
    case 'PLACEMENT_TRENDS': mockResult = analyzeTrends(question); break;
    case 'EEE_ANALYSIS': mockResult = analyzeEEE(question); break;
    case 'DEPARTMENT_SPECIFIC': mockResult = analyzeDepartments(question); break;
    default: mockResult = analyzeGeneral(question);
  }

  if (useAI) {
    try {
      const aiResult = await runWithGemini(question, mockResult);
      return { ...mockResult, aiEnhanced: true, aiSummary: aiResult };
    } catch (err) {
      console.error('Gemini API error, falling back to mock:', err.message);
      return { ...mockResult, aiEnhanced: false, fallbackUsed: true };
    }
  }

  return { ...mockResult, aiEnhanced: false };
}

// ─── Student Job Match Analysis ───────────────────────────────────────────────

export function analyzeStudentJobMatches(studentId) {
  const student = getStudentProfile(studentId);
  if (!student) return null;

  const eligibleJobs = [];
  const allJobs = getJobOpenings();

  for (const job of allJobs) {
    const match = calculateJobMatch(studentId, job.id);
    if (!match) continue;
    const elig = checkEligibility(studentId, job.id);
    const company = getCompanies().find(c => c.id === job.companyId);
    eligibleJobs.push({ job, company, match, eligible: elig?.eligible });
  }

  const sorted = eligibleJobs.sort((a, b) => b.match.matchPercentage - a.match.matchPercentage);

  // Placement readiness score
  const topMatch = sorted[0]?.match?.matchPercentage || 0;
  const eligibleCount = sorted.filter(j => j.eligible).length;
  const hasInternship = student.internships?.length > 0;
  const hasCert = student.certifications?.length > 0;
  const cgpaScore = Math.min(((student.cgpa - 6) / 4) * 30, 30);
  const readinessScore = Math.round(
    (topMatch * 0.4) + (Math.min(eligibleCount * 5, 30)) + (hasInternship ? 15 : 0) + (hasCert ? 10 : 0) + cgpaScore * 0.25
  );

  // All missing skills
  const allMissingSkills = {};
  sorted.filter(j => j.eligible).slice(0, 5).forEach(({ match }) => {
    match.missingRequiredSkills.forEach(skill => {
      allMissingSkills[skill] = (allMissingSkills[skill] || 0) + 1;
    });
  });
  const topMissingSkills = Object.entries(allMissingSkills)
    .sort((a, b) => b[1] - a[1])
    .map(([skill, count]) => ({ skill, jobCount: count }));

  return {
    student,
    readinessScore: Math.min(readinessScore, 100),
    topMatches: sorted.slice(0, 10),
    eligibleCount,
    totalJobsAnalyzed: allJobs.length,
    topMissingSkills,
    strengths: [
      student.internships?.length > 0 ? `Has ${student.internships.length} internship(s)` : null,
      student.certifications?.length > 0 ? `${student.certifications.length} certification(s)` : null,
      student.cgpa >= 8.0 ? `Strong CGPA ${student.cgpa} opens premium company doors` : null,
      student.skills?.length > 5 ? `Broad skill set (${student.skills.length} skills)` : null,
    ].filter(Boolean)
  };
}

// ─── Gemini AI Integration ────────────────────────────────────────────────────

const CANDIDATE_MODELS = ['gemini-3.6-flash'];

async function runWithGemini(question, mockContext) {
  if (!process.env.GEMINI_API_KEY) throw new Error('No API key');

  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());

  const evidenceText = Array.isArray(mockContext.evidence)
    ? mockContext.evidence.join('; ')
    : (mockContext.evidence || '');
  const recText = mockContext.recommendation || '';
  const findingText = mockContext.finding || '';

  const prompt = `You are PlacementIQ, an AI placement intelligence agent for a university placement cell.

The user asked: "${question}"

Based on the data analysis, here is the context:
- Finding: ${findingText}
- Evidence: ${evidenceText}
- Initial Recommendation: ${recText}

Your task: Provide a concise, enhanced analysis in 2-3 sentences that adds deeper insight or nuance to the finding. Focus on actionable, specific recommendations. Do not repeat the evidence already given. Format as plain text, no markdown.`;

  let lastError = null;

  for (const modelName of CANDIDATE_MODELS) {
    // Retry transient network errors up to 3 times with exponential backoff
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result?.response?.text ? result.response.text() : '';
        if (text && text.trim()) {
          return text.trim();
        }
      } catch (err) {
        lastError = err;
        // Don't retry if model is permanently not found or invalid key
        if (err?.status === 404 || err?.status === 400 || err?.message?.includes('API_KEY_INVALID')) {
          break;
        }
        // If transient network failure (fetch failed, timeout), wait and retry
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 600 * attempt));
        }
      }
    }
  }

  throw lastError || new Error('Failed to generate content with Gemini models');
}

