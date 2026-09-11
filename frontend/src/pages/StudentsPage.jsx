import { useState } from 'react';
import { Search, Users, Filter } from 'lucide-react';
import { studentsApi } from '../services/api.js';
import { useApi } from '../hooks/useApi.js';
import { PageLoading, SectionHeader, Badge, SkillTag, ProgressBar } from '../components/UI.jsx';
import clsx from 'clsx';

const DEPT_COLORS = {
  CSE: 'badge-info', ECE: 'badge-success', EEE: 'badge-warning', MECH: 'badge-neutral', CIVIL: 'badge-danger'
};

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const { data: students, loading } = useApi(() => studentsApi.getAll());

  if (loading) return <PageLoading />;

  const filtered = students?.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.skills.some(sk => sk.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filter === 'all' || s.placementStatus === filter;
    const matchDept = deptFilter === 'all' || s.department === deptFilter;
    return matchSearch && matchStatus && matchDept;
  }) || [];

  return (
    <div className="space-y-6">
      <SectionHeader title="Students" subtitle={`${students?.length || 0} total students · ${students?.filter(s => s.placementStatus === 'placed').length} placed`} icon={Users} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input placeholder="Search name or skill..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field w-36">
          <option value="all">All Status</option>
          <option value="placed">Placed</option>
          <option value="unplaced">Unplaced</option>
        </select>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="input-field w-36">
          <option value="all">All Depts</option>
          {['CSE','ECE','EEE','MECH','CIVIL'].map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      <p className="text-sm text-gray-500">{filtered.length} students shown</p>

      {/* Students table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border">
              {['Student', 'Dept', 'CGPA', 'Skills', 'Internships', 'Applications', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((student, i) => (
              <tr key={student.id} className={clsx('border-b border-surface-border/50 hover:bg-surface-elevated transition-colors', i % 2 === 0 ? '' : 'bg-surface/30')}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {student.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-white">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.email?.split('@')[0]}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${DEPT_COLORS[student.department] || 'badge-neutral'}`}>{student.department}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={clsx('font-semibold', student.cgpa >= 8 ? 'text-emerald-400' : student.cgpa >= 7 ? 'text-amber-400' : 'text-red-400')}>
                    {student.cgpa}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {student.skills.slice(0, 3).map(s => <SkillTag key={s} skill={s} />)}
                    {student.skills.length > 3 && <span className="text-xs text-gray-500">+{student.skills.length - 3}</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-300">{student.internships?.length || 0}</td>
                <td className="px-4 py-3">
                  <div className="text-xs">
                    <span className="text-gray-300">{student.applicationsCount} apps</span>
                    {student.rejections > 0 && <span className="text-red-400 ml-1">· {student.rejections}R</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={student.placementStatus === 'placed' ? 'success' : 'warning'}>
                    {student.placementStatus === 'placed' ? '✓ Placed' : 'Seeking'}
                  </Badge>
                  {student.offeredSalary && (
                    <p className="text-xs text-emerald-400 mt-0.5">₹{(student.offeredSalary/100000).toFixed(1)}L</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">No students match your filters</div>
        )}
      </div>
    </div>
  );
}
