import { UserCheck, Mail, Phone, Star, TrendingUp } from 'lucide-react';
import { recruitersApi } from '../services/api.js';
import { useApi } from '../hooks/useApi.js';
import { PageLoading, SectionHeader, Badge } from '../components/UI.jsx';
import { useState } from 'react';
import clsx from 'clsx';

export default function RecruiterIntelligence() {
  const { data: recruiters, loading } = useApi(() => recruitersApi.getAll());
  const [filter, setFilter] = useState('all');

  if (loading) return <PageLoading />;

  const filtered = recruiters?.filter(r => filter === 'all' || r.reEngagementPriority.priority === filter) || [];
  const sorted = [...(filtered || [])].sort((a, b) => b.reEngagementPriority.score - a.reEngagementPriority.score);

  const high = recruiters?.filter(r => r.reEngagementPriority.priority === 'High').length || 0;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Recruiter Intelligence"
        subtitle={`${recruiters?.length || 0} companies analysed · ${high} high-priority for re-engagement`}
        icon={UserCheck}
      />

      {/* Priority stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'High Priority', count: high, color: 'text-red-400', bg: 'border-red-500/30 bg-red-500/5' },
          { label: 'Medium Priority', count: recruiters?.filter(r => r.reEngagementPriority.priority === 'Medium').length || 0, color: 'text-amber-400', bg: 'border-amber-500/30 bg-amber-500/5' },
          { label: 'Low Priority', count: recruiters?.filter(r => r.reEngagementPriority.priority === 'Low').length || 0, color: 'text-gray-400', bg: 'border-surface-border' },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className={`card border ${bg}`}>
            <p className={`text-2xl font-black ${color}`}>{count}</p>
            <p className="text-sm text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'High', 'Medium', 'Low'].map(p => (
          <button key={p} onClick={() => setFilter(p)}
            className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              filter === p ? 'bg-brand-600 text-white' : 'bg-surface-elevated text-gray-400 hover:text-white border border-surface-border'
            )}>
            {p === 'all' ? 'All Companies' : `${p} Priority`}
          </button>
        ))}
      </div>

      {/* Recruiter cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {sorted.map(({ company, currentOpenings, currentApplications, currentSelected, totalPastHires, reEngagementPriority }) => (
          <div key={company.id} className={clsx('card-hover', {
            'border-red-500/30': reEngagementPriority.priority === 'High',
            'border-amber-500/30': reEngagementPriority.priority === 'Medium',
          })}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-surface-elevated flex items-center justify-center text-brand-400 font-bold border border-surface-border">
                  {company.name[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{company.name}</h3>
                  <p className="text-xs text-gray-400">{company.industry} · {company.type}</p>
                </div>
              </div>
              <Badge variant={reEngagementPriority.priority === 'High' ? 'danger' : reEngagementPriority.priority === 'Medium' ? 'warning' : 'neutral'}>
                {reEngagementPriority.priority} Priority
              </Badge>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-2 mb-3 text-center">
              {[
                { label: 'Past Hires', value: totalPastHires, color: 'text-brand-400' },
                { label: 'This Season', value: currentSelected, color: 'text-emerald-400' },
                { label: 'Open Jobs', value: currentOpenings, color: 'text-cyan-400' },
                { label: 'Applications', value: currentApplications, color: 'text-amber-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-surface-elevated rounded-lg p-2">
                  <p className={`text-lg font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>

            {/* Salary */}
            <p className="text-xs text-gray-400 mb-2">
              Salary Range: <span className="text-emerald-400 font-medium">₹{(company.salaryRange.min/100000).toFixed(0)}L – ₹{(company.salaryRange.max/100000).toFixed(0)}L</span>
            </p>

            {/* Reason */}
            <div className="bg-surface rounded-lg p-2 border border-surface-border mb-2">
              <p className="text-xs text-gray-500 mb-0.5">Re-engagement reason:</p>
              <p className="text-xs text-gray-300">{reEngagementPriority.reason}</p>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-3 text-xs text-gray-400 pt-2 border-t border-surface-border">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{company.recruitmentContact?.name}</span>
              <span className="text-gray-600">·</span>
              <span>{company.recruitmentContact?.email}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
