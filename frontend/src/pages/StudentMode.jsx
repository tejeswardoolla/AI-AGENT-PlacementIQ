import { useState } from 'react';
import { ChevronLeft, Search, User, Star, CheckCircle, XCircle, TrendingUp, Zap, BookOpen, Award } from 'lucide-react';
import { studentsApi } from '../services/api.js';
import { useApi } from '../hooks/useApi.js';
import { PageLoading, ProgressBar, SkillTag, Badge } from '../components/UI.jsx';
import clsx from 'clsx';

const DEMO_STUDENTS = [
  { id: 'S001', name: 'Teja Reddy', dept: 'CSE', cgpa: 8.2 },
  { id: 'S002', name: 'Priya Sharma', dept: 'CSE', cgpa: 9.1 },
  { id: 'S003', name: 'Ravi Kumar', dept: 'CSE', cgpa: 7.5 },
  { id: 'S009', name: 'Arjun Menon', dept: 'ECE', cgpa: 8.0 },
  { id: 'S016', name: 'Ganesh Murthy', dept: 'EEE', cgpa: 7.3 },
  { id: 'S023', name: 'Anil Desai', dept: 'MECH', cgpa: 7.4 },
  { id: 'S029', name: 'Ajay Bose', dept: 'CIVIL', cgpa: 7.2 },
];

function MatchBar({ pct }) {
  const color = pct >= 85 ? 'bg-emerald-500' : pct >= 70 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-surface-border rounded-full overflow-hidden">
        <div className={clsx('h-full rounded-full transition-all duration-700', color)} style={{ width: `${pct}%` }} />
      </div>
      <span className={clsx('text-sm font-bold w-10 text-right', pct >= 85 ? 'text-emerald-400' : pct >= 70 ? 'text-amber-400' : 'text-red-400')}>
        {pct}%
      </span>
    </div>
  );
}

export default function StudentMode({ onBack }) {
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: matchData, loading } = useApi(
    () => selectedStudentId ? studentsApi.getMatches(selectedStudentId) : Promise.resolve(null),
    [selectedStudentId]
  );

  const filtered = DEMO_STUDENTS.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedStudentId && (loading || matchData)) {
    return (
      <div className="min-h-screen bg-surface">
        {/* Header */}
        <div className="bg-surface-card border-b border-surface-border px-6 py-4 flex items-center gap-3">
          <button onClick={() => setSelectedStudentId(null)} className="btn-secondary p-2">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white">PlacementIQ</span>
            <span className="text-gray-500 text-sm">/ Student Report</span>
          </div>
        </div>

        {loading ? <PageLoading /> : matchData && <StudentReport data={matchData} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-surface-card border-b border-surface-border px-6 py-4 flex items-center gap-3">
        <button onClick={onBack} className="btn-secondary p-2">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white">PlacementIQ</span>
          <span className="text-xs text-brand-400 ml-2 bg-brand-500/20 px-2 py-0.5 rounded-full">Student Mode</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-3">Your Placement Intelligence</h1>
          <p className="text-gray-400">Select your profile to get AI-powered job matches, skill gap analysis, and placement readiness score</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or department..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input-field pl-9"
          />
        </div>

        {/* Student cards */}
        <div className="grid gap-3">
          {filtered.map(student => (
            <button
              key={student.id}
              onClick={() => setSelectedStudentId(student.id)}
              className="card-hover w-full text-left flex items-center gap-4 hover:border-brand-500/60 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                {student.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white">{student.name}</p>
                <p className="text-sm text-gray-400">{student.dept} · CGPA {student.cgpa}</p>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-500 rotate-180" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentReport({ data }) {
  const { student, readinessScore, topMatches, eligibleCount, topMissingSkills, strengths } = data;
  const [activeTab, setActiveTab] = useState('matches');

  const eligibleMatches = topMatches?.filter(m => m.eligible) || [];
  const tabs = [
    { id: 'matches', label: 'Job Matches' },
    { id: 'skills', label: 'Skill Analysis' },
    { id: 'profile', label: 'My Profile' },
  ];

  const readinessColor = readinessScore >= 80 ? 'text-emerald-400' : readinessScore >= 60 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Student hero */}
      <div className="card mb-6 bg-gradient-to-r from-surface-card to-surface-elevated border-brand-500/30 p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
              {student.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{student.name}</h2>
              <p className="text-gray-400">{student.department} · CGPA {student.cgpa}</p>
              <p className="text-sm text-gray-500">{student.internships?.length > 0 ? `${student.internships.length} Internship(s)` : 'No Internship'} · {student.certifications?.length} Cert(s)</p>
            </div>
          </div>
          <div className="md:ml-auto flex flex-col items-center">
            <div className="text-center">
              <div className={clsx('text-5xl font-black mb-1', readinessColor)}>{readinessScore}</div>
              <p className="text-sm text-gray-400">Readiness Score</p>
              <p className="text-xs text-gray-500">{eligibleCount} eligible jobs</p>
            </div>
          </div>
        </div>
        {strengths?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-surface-border flex flex-wrap gap-2">
            {strengths.map((s, i) => (
              <span key={i} className="badge badge-success"><CheckCircle className="w-3 h-3" />{s}</span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-card rounded-lg p-1 mb-6 border border-surface-border">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={clsx('flex-1 py-2 text-sm font-medium rounded-md transition-all', activeTab === tab.id ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'matches' && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-sm text-gray-400 mb-4">
            Analyzed {data.totalJobsAnalyzed} open positions. Showing top matches:
          </p>
          {eligibleMatches.slice(0, 8).map(({ job, company, match }) => (
            <div key={job.id} className="card-hover cursor-default">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-surface-elevated flex items-center justify-center text-brand-400 flex-shrink-0 font-bold text-sm">
                  {company?.name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-white">{job.title}</h4>
                    <span className="badge badge-success"><Star className="w-2.5 h-2.5" />{match.matchPercentage}% match</span>
                  </div>
                  <p className="text-sm text-gray-400">{company?.name} · {job.location} · ₹{(job.salary/100000).toFixed(1)}L</p>
                </div>
              </div>
              <MatchBar pct={match.matchPercentage} />
              <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-gray-500 mb-1">✅ You have</p>
                  <div className="flex flex-wrap gap-1">
                    {match.matchedRequiredSkills.map(s => <SkillTag key={s} skill={s} />)}
                  </div>
                </div>
                {match.missingRequiredSkills.length > 0 && (
                  <div>
                    <p className="text-gray-500 mb-1">⚠️ Missing</p>
                    <div className="flex flex-wrap gap-1">
                      {match.missingRequiredSkills.map(s => (
                        <span key={s} className="badge badge-warning">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card">
            <h3 className="section-title flex items-center gap-2"><Award className="w-4 h-4 text-brand-400" />Your Skills</h3>
            <div className="flex flex-wrap gap-2">
              {student.skills?.map(s => <SkillTag key={s} skill={s} />)}
            </div>
          </div>
          {topMissingSkills?.length > 0 && (
            <div className="card">
              <h3 className="section-title flex items-center gap-2"><TrendingUp className="w-4 h-4 text-amber-400" />Priority Skills to Learn</h3>
              <p className="text-sm text-gray-400 mb-4">These skills appear most frequently in jobs you're eligible for but missing:</p>
              <div className="space-y-3">
                {topMissingSkills.slice(0, 8).map(({ skill, jobCount }) => (
                  <div key={skill}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300 font-medium">{skill}</span>
                      <span className="text-amber-400">{jobCount} job(s) require it</span>
                    </div>
                    <ProgressBar value={jobCount} max={10} color="amber" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'CGPA', value: student.cgpa },
              { label: 'Department', value: student.department },
              { label: 'Graduation', value: student.graduationYear },
              { label: 'Status', value: student.placementStatus === 'placed' ? '✅ Placed' : '🔍 Seeking' },
            ].map(({ label, value }) => (
              <div key={label} className="card">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
          {student.internships?.length > 0 && (
            <div className="card">
              <h3 className="section-title">Internships</h3>
              {student.internships.map((intern, i) => (
                <div key={i} className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">{intern.role}</p>
                    <p className="text-xs text-gray-400">{intern.company} · {intern.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {student.projects?.length > 0 && (
            <div className="card">
              <h3 className="section-title">Projects</h3>
              <div className="flex flex-wrap gap-2">
                {student.projects.map(p => (
                  <span key={p} className="badge badge-info">{p}</span>
                ))}
              </div>
            </div>
          )}
          {student.certifications?.length > 0 && (
            <div className="card">
              <h3 className="section-title">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {student.certifications.map(c => (
                  <span key={c} className="badge badge-success"><Award className="w-3 h-3" />{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
