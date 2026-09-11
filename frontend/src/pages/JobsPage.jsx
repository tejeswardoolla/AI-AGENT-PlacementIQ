import { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Users, Search } from 'lucide-react';
import { jobsApi } from '../services/api.js';
import { useApi } from '../hooks/useApi.js';
import { PageLoading, SectionHeader, Badge, SkillTag } from '../components/UI.jsx';
import clsx from 'clsx';

export default function JobsPage() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const { data: jobs, loading } = useApi(() => jobsApi.getAll());

  if (loading) return <PageLoading />;

  const filtered = jobs?.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.companyName.toLowerCase().includes(search.toLowerCase()) ||
      j.requiredSkills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchDept = deptFilter === 'all' || j.department === deptFilter;
    return matchSearch && matchDept;
  }) || [];

  return (
    <div className="space-y-6">
      <SectionHeader title="Job Openings" subtitle={`${jobs?.length || 0} open positions across ${[...new Set(jobs?.map(j => j.companyId))].length || 0} companies`} icon={Briefcase} />

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input placeholder="Search title, company, or skill..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="input-field w-36">
          <option value="all">All Depts</option>
          {['CSE','ECE','EEE','MECH','CIVIL'].map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(job => (
          <div key={job.id} className="card-hover">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-white">{job.title}</h3>
                <p className="text-sm text-gray-400">{job.companyName}</p>
              </div>
              <Badge variant={job.status === 'open' ? 'success' : 'neutral'}>{job.status}</Badge>
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
              <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />₹{(job.salary/100000).toFixed(1)}L</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{job.applicants} applicants</span>
              <span className="bg-surface-elevated px-2 py-0.5 rounded">{job.department}</span>
              <span className="bg-surface-elevated px-2 py-0.5 rounded">Min CGPA: {job.minCGPA}</span>
            </div>

            <div className="mb-2">
              <p className="text-xs text-gray-500 mb-1">Required Skills</p>
              <div className="flex flex-wrap gap-1">
                {job.requiredSkills.map(s => <SkillTag key={s} skill={s} />)}
              </div>
            </div>

            {job.preferredSkills?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Preferred</p>
                <div className="flex flex-wrap gap-1">
                  {job.preferredSkills.map(s => (
                    <span key={s} className="badge badge-neutral">{s}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-surface-border flex items-center justify-between text-xs">
              <span className="text-gray-500">Deadline: {job.deadline}</span>
              <span className="text-amber-400">{job.openings} opening{job.openings !== 1 ? 's' : ''}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">No jobs match your filters</div>
      )}
    </div>
  );
}
