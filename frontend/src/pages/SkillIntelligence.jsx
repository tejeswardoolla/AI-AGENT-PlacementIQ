import { Brain, TrendingUp, ArrowUp, ArrowRight } from 'lucide-react';
import { skillsApi, analyticsApi } from '../services/api.js';
import { useApi } from '../hooks/useApi.js';
import { PageLoading, SectionHeader, ProgressBar } from '../components/UI.jsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const TREND_COLORS = { rising: 'text-emerald-400', stable: 'text-amber-400', falling: 'text-red-400' };
const TREND_ICONS = { rising: '↑', stable: '→', falling: '↓' };
const DEPT_COLORS = { CSE: '#6366f1', ECE: '#06b6d4', EEE: '#f59e0b', MECH: '#10b981', CIVIL: '#f43f5e' };

const CustomTooltip = ({ active, payload }) => active && payload?.length ? (
  <div className="bg-surface-card border border-surface-border rounded-lg p-2 text-xs shadow-xl">
    <p className="text-white font-bold">{payload[0]?.payload?.skill}</p>
    <p className="text-gray-400">Demand: {payload[0]?.value} jobs</p>
  </div>
) : null;

export default function SkillIntelligence() {
  const { data: skills, loading: skillsLoading } = useApi(() => skillsApi.getAll());
  const { data: depts, loading: deptsLoading } = useApi(() => analyticsApi.getDepartments());

  if (skillsLoading || deptsLoading) return <PageLoading />;

  const topSkills = skills?.demanded?.sort((a, b) => b.demandCount - a.demandCount).slice(0, 15) || [];
  const risingSkills = skills?.demanded?.filter(s => s.trend === 'rising') || [];
  const gaps = skills?.departmentGaps || {};

  const deptGapData = Object.entries(gaps).map(([dept, data]) => ({
    dept,
    coverage: data.coveragePercentage,
    missingCount: data.topMissingSkills?.length || 0,
  }));

  return (
    <div className="space-y-6">
      <SectionHeader title="Skill Intelligence" subtitle="Market demand analysis vs. student skill coverage" icon={Brain} />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-xs text-gray-500">Total Skills Tracked</p>
          <p className="text-2xl font-bold text-white">{skills?.demanded?.length || 0}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-gray-500">Rising Demand Skills</p>
          <p className="text-2xl font-bold text-emerald-400">{risingSkills.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-gray-500">Top Demanded Skill</p>
          <p className="text-lg font-bold text-white">{topSkills[0]?.skill}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-gray-500">Avg Dept Coverage</p>
          <p className="text-2xl font-bold text-amber-400">
            {Math.round(deptGapData.reduce((s, d) => s + d.coverage, 0) / deptGapData.length)}%
          </p>
        </div>
      </div>

      {/* Top demanded skills chart */}
      <div className="card">
        <h3 className="section-title">Top Skills Demanded by Companies</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={topSkills} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
            <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis type="category" dataKey="skill" tick={{ fill: '#d1d5db', fontSize: 11 }} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="demandCount" name="Jobs Requiring" radius={[0, 4, 4, 0]}>
              {topSkills.map((s, i) => (
                <Cell key={s.skill} fill={`hsl(${250 - i * 10}, 70%, 60%)`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Rising vs stable skills */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="section-title flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" />Rising Demand Skills</h3>
          <div className="space-y-2">
            {risingSkills.slice(0, 8).map(skill => (
              <div key={skill.skill} className="flex items-center gap-2">
                <span className={`text-xs font-medium w-20 ${TREND_COLORS[skill.trend]}`}>
                  {TREND_ICONS[skill.trend]} {skill.skill}
                </span>
                <div className="flex-1">
                  <ProgressBar value={skill.demandCount} max={25} color="emerald" />
                </div>
                <span className="text-xs text-gray-400 w-8 text-right">{skill.demandCount}</span>
                <span className="text-xs text-emerald-400 w-20 text-right">+₹{(skill.avgSalaryBoost/100000).toFixed(1)}L</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department coverage */}
        <div className="card">
          <h3 className="section-title">Skill Coverage by Department</h3>
          <div className="space-y-3">
            {deptGapData.map(d => (
              <div key={d.dept}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium" style={{ color: DEPT_COLORS[d.dept] }}>{d.dept}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">{gaps[d.dept]?.topMissingSkills?.slice(0, 2).join(', ')}</span>
                    <span className="font-bold text-white">{d.coverage}%</span>
                  </div>
                </div>
                <div className="h-2 bg-surface-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${d.coverage}%`, background: DEPT_COLORS[d.dept] }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department-wise missing skills */}
      <div className="card">
        <h3 className="section-title">Critical Skill Gaps by Department</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(gaps).map(([dept, data]) => (
            <div key={dept} className="bg-surface-elevated rounded-lg p-3 border border-surface-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white text-sm">{dept}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: DEPT_COLORS[dept] + '20', color: DEPT_COLORS[dept] }}>
                  {data.coveragePercentage}% covered
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-1.5">Missing skills to address:</p>
              <div className="flex flex-wrap gap-1">
                {data.topMissingSkills?.map(s => (
                  <span key={s} className="badge badge-warning text-xs">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Training Recommendations */}
      <div className="card border-brand-500/30 bg-brand-500/5">
        <h3 className="section-title flex items-center gap-2">🤖 AI Training Recommendations</h3>
        <div className="space-y-3">
          {[
            { priority: 1, action: 'Python Bootcamp for ALL departments', reason: 'Python is the #1 demanded skill across 24 job openings, yet coverage is low in ECE, EEE, MECH, CIVIL', impact: 'High' },
            { priority: 2, action: 'Cloud + Docker certification program (CSE focus)', reason: 'Cloud skills show a 35-50% salary premium. Docker/Kubernetes are growing rapidly in job requirements', impact: 'High' },
            { priority: 3, action: 'DSA + System Design workshops for CSE', reason: 'Core eligibility requirement for MNC and product companies. Students with rejections typically fail here', impact: 'Medium' },
            { priority: 4, action: 'IoT + Embedded Python for ECE/EEE', reason: 'Bridges the gap between traditional hardware skills and software job markets, doubling eligible job pool', impact: 'Medium' },
          ].map(item => (
            <div key={item.priority} className="flex gap-3 p-3 bg-surface rounded-lg border border-surface-border">
              <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                {item.priority}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{item.action}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.reason}</p>
                <span className={`badge mt-1 ${item.impact === 'High' ? 'badge-danger' : 'badge-warning'}`}>
                  {item.impact} Impact
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
