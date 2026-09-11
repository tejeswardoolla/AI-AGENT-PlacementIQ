import { AlertTriangle, User, BookOpen, Target } from 'lucide-react';
import { atRiskApi } from '../services/api.js';
import { useApi } from '../hooks/useApi.js';
import { PageLoading, SectionHeader, RiskBadge, SkillTag, ProgressBar } from '../components/UI.jsx';
import { useState } from 'react';
import clsx from 'clsx';

export default function AtRiskStudents() {
  const { data: atRisk, loading } = useApi(() => atRiskApi.getAll());
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  if (loading) return <PageLoading />;

  const filtered = atRisk?.filter(r => filter === 'all' || r.riskLevel === filter) || [];
  const high = atRisk?.filter(r => r.riskLevel === 'High').length || 0;
  const medium = atRisk?.filter(r => r.riskLevel === 'Medium').length || 0;
  const low = atRisk?.filter(r => r.riskLevel === 'Low').length || 0;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="At-Risk Students"
        subtitle={`${atRisk?.length || 0} unplaced students analysed · ${high} high risk · ${medium} medium risk`}
        icon={AlertTriangle}
      />

      {/* Risk summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { level: 'High', count: high, color: 'border-red-500/40 bg-red-500/5', textColor: 'text-red-400', desc: 'Immediate intervention needed' },
          { level: 'Medium', count: medium, color: 'border-amber-500/40 bg-amber-500/5', textColor: 'text-amber-400', desc: 'Proactive outreach recommended' },
          { level: 'Low', count: low, color: 'border-emerald-500/40 bg-emerald-500/5', textColor: 'text-emerald-400', desc: 'Monitor and support' },
        ].map(({ level, count, color, textColor, desc }) => (
          <div key={level} className={`card ${color} border`}>
            <p className={`text-3xl font-black ${textColor}`}>{count}</p>
            <p className="text-sm font-semibold text-white">{level} Risk</p>
            <p className="text-xs text-gray-400">{desc}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'High', 'Medium', 'Low'].map(l => (
          <button key={l} onClick={() => setFilter(l)}
            className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              filter === l ? 'bg-brand-600 text-white' : 'bg-surface-elevated text-gray-400 hover:text-white border border-surface-border'
            )}>
            {l === 'all' ? 'All' : l} {l !== 'all' && `Risk`}
          </button>
        ))}
      </div>

      {/* Risk table */}
      <div className="space-y-3">
        {filtered.map(({ student, riskLevel, riskScore, riskReasons, interventions, eligibleJobs, appliedCount, rejections, eligibleButNotApplied }) => (
          <div key={student.id} className={clsx('card border transition-all cursor-pointer',
            riskLevel === 'High' ? 'border-red-500/30 hover:border-red-500/50' :
            riskLevel === 'Medium' ? 'border-amber-500/30 hover:border-amber-500/50' :
            'border-surface-border hover:border-brand-500/30'
          )} onClick={() => setExpanded(expanded === student.id ? null : student.id)}>
            <div className="flex items-start gap-3">
              <div className={clsx('w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0',
                riskLevel === 'High' ? 'bg-red-500' : riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
              )}>
                {student.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-white">{student.name}</span>
                  <RiskBadge level={riskLevel} />
                  <span className="text-xs text-gray-500">{student.department} · CGPA {student.cgpa}</span>
                </div>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>Eligible: {eligibleJobs} jobs</span>
                  <span>Applied: {appliedCount}</span>
                  <span className="text-red-400">Rejected: {rejections}</span>
                  {eligibleButNotApplied > 0 && <span className="text-amber-400">{eligibleButNotApplied} eligible but not applied</span>}
                </div>
                <div className="mt-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <span>Risk Score: {riskScore}</span>
                  </div>
                  <div className="h-1.5 bg-surface-border rounded-full overflow-hidden w-32">
                    <div className={clsx('h-full rounded-full', riskLevel === 'High' ? 'bg-red-500' : riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500')}
                      style={{ width: `${Math.min(riskScore, 100)}%` }} />
                  </div>
                </div>
              </div>
              <div className={clsx('text-gray-500 transition-transform', expanded === student.id && 'rotate-90')}>▶</div>
            </div>

            {expanded === student.id && (
              <div className="mt-4 pt-4 border-t border-surface-border space-y-3 animate-fade-in">
                <div>
                  <p className="text-xs font-semibold text-red-400 mb-1">⚠️ Risk Factors</p>
                  <ul className="space-y-1">
                    {riskReasons.map((r, i) => <li key={i} className="text-xs text-gray-400 flex items-start gap-1"><span className="mt-0.5">•</span>{r}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-400 mb-1">✅ Recommended Interventions</p>
                  <ul className="space-y-1">
                    {interventions.map((r, i) => <li key={i} className="text-xs text-gray-400 flex items-start gap-1"><span className="mt-0.5">→</span>{r}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-400 mb-1">🛠️ Current Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {student.skills.map(s => <SkillTag key={s} skill={s} />)}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
