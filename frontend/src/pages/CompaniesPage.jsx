import { useState } from 'react';
import { Building2, Mail, Phone, Briefcase, DollarSign } from 'lucide-react';
import { companiesApi } from '../services/api.js';
import { useApi } from '../hooks/useApi.js';
import { PageLoading, SectionHeader, Badge } from '../components/UI.jsx';

export default function CompaniesPage() {
  const [filter, setFilter] = useState('all');
  const { data: companies, loading } = useApi(() => companiesApi.getAll());

  if (loading) return <PageLoading />;

  const filtered = companies?.filter(c => filter === 'all' || c.type === filter) || [];

  return (
    <div className="space-y-6">
      <SectionHeader title="Companies" subtitle={`${companies?.length || 0} companies recruiting this season`} icon={Building2} />

      <div className="flex gap-2 flex-wrap">
        {['all', 'MNC', 'Product', 'Startup', 'Mid-size'].map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === t ? 'bg-brand-600 text-white' : 'bg-surface-elevated text-gray-400 hover:text-white border border-surface-border'}`}
          >{t === 'all' ? 'All Types' : t}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(company => {
          const totalHires = Object.values(company.previousYearHires || {}).reduce((a, b) => a + b, 0);
          return (
            <div key={company.id} className="card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-elevated flex items-center justify-center text-brand-400 font-bold text-lg border border-surface-border">
                    {company.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{company.name}</h3>
                    <p className="text-xs text-gray-400">{company.industry}</p>
                  </div>
                </div>
                <Badge variant="info">{company.type}</Badge>
              </div>

              <p className="text-xs text-gray-400 mb-3 leading-relaxed">{company.description}</p>

              <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                <div className="bg-surface-elevated rounded-lg p-2">
                  <p className="text-xs text-gray-500">Min CGPA</p>
                  <p className="text-sm font-bold text-white">{company.minCGPA}</p>
                </div>
                <div className="bg-surface-elevated rounded-lg p-2">
                  <p className="text-xs text-gray-500">Past Hires</p>
                  <p className="text-sm font-bold text-emerald-400">{totalHires}</p>
                </div>
                <div className="bg-surface-elevated rounded-lg p-2">
                  <p className="text-xs text-gray-500">This Year</p>
                  <p className="text-sm font-bold text-brand-400">{company.totalOffersThisYear}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs mb-2">
                <span className="flex items-center gap-1 text-gray-400">
                  <DollarSign className="w-3 h-3" />
                  ₹{(company.salaryRange.min/100000).toFixed(0)}L–₹{(company.salaryRange.max/100000).toFixed(0)}L
                </span>
                <span className="text-gray-400">Depts: {company.hiringDepartments.join(', ')}</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {company.rolesOffered.map(r => (
                  <span key={r} className="badge badge-neutral text-xs">{r}</span>
                ))}
              </div>

              <div className="pt-2 border-t border-surface-border text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {company.recruitmentContact?.name} · {company.recruitmentContact?.email}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
