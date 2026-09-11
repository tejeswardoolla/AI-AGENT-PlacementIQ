import { useEffect, useState } from 'react';
import { Users, TrendingUp, Building2, Briefcase, DollarSign, Award, AlertTriangle, Zap } from 'lucide-react';
import { analyticsApi, agentApi } from '../services/api.js';
import { PageLoading, StatCard, AIResponseCard, SectionHeader } from '../components/UI.jsx';
import {
  RadialBarChart, RadialBar, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const DEPT_COLORS = {
  CSE: '#6366f1', ECE: '#06b6d4', EEE: '#f59e0b', MECH: '#10b981', CIVIL: '#f43f5e'
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-surface-card border border-surface-border rounded-lg p-2 text-xs shadow-xl">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: p.fill || p.stroke }} />
            <span className="text-gray-300">{p.name}: </span>
            <span className="text-white font-bold">{p.value}{p.name?.includes('%') || p.dataKey === 'placementPercentage' ? '%' : ''}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ManagementDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [priorities, setPriorities] = useState(null);
  const [loading, setLoading] = useState(true);
  const [priLoading, setPriLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getAll().then(data => { setAnalytics(data); setLoading(false); });
    agentApi.getPriorities().then(data => { setPriorities(data); setPriLoading(false); });
  }, []);

  if (loading) return <PageLoading />;

  const { overview, departments } = analytics;
  const deptChartData = departments.map(d => ({
    name: d.department,
    placementPercentage: d.placementPercentage,
    placed: d.placed,
    unplaced: d.unplaced,
    avgSalary: Math.round(d.avgSalary / 100000 * 10) / 10,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Placement Dashboard"
        subtitle={`Real-time overview · Current Season 2026 · ${overview.companiesHiring} companies active`}
        icon={LayoutDashboardIcon}
      />

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={overview.total} icon={Users} color="brand" />
        <StatCard title="Students Placed" value={overview.placed} subtitle={`${overview.placementPercentage}% overall`} icon={Award} color="emerald" />
        <StatCard title="Students Unplaced" value={overview.unplaced} subtitle="Seeking positions" icon={AlertTriangle} color="amber" />
        <StatCard title="Avg Salary" value={`₹${(overview.avgSalary/100000).toFixed(1)}L`} subtitle={`Peak: ₹${(overview.highestSalary/100000).toFixed(1)}L`} icon={DollarSign} color="cyan" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Companies Hiring" value={overview.companiesHiring} icon={Building2} color="violet" />
        <StatCard title="Open Positions" value={overview.openPositions} icon={Briefcase} color="brand" />
        <StatCard title="Highest Salary" value={`₹${(overview.highestSalary/100000).toFixed(1)}L`} icon={TrendingUp} color="emerald" />
        <StatCard title="Placement Rate" value={`${overview.placementPercentage}%`} subtitle="Current season" icon={TrendingUp} color="cyan" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Department placement bar chart */}
        <div className="card">
          <h3 className="section-title">Placement % by Department</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="placementPercentage" name="Placement %" radius={[4,4,0,0]}>
                {deptChartData.map((entry) => (
                  <Cell key={entry.name} fill={DEPT_COLORS[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Placed vs Unplaced pie */}
        <div className="card">
          <h3 className="section-title">Placement Distribution</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={[{ name: 'Placed', value: overview.placed }, { name: 'Unplaced', value: overview.unplaced }]}
                  cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {departments.map(d => (
                <div key={d.department}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-gray-400">{d.department}</span>
                    <span className="font-medium" style={{ color: DEPT_COLORS[d.department] }}>{d.placementPercentage}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.placementPercentage}%`, background: DEPT_COLORS[d.department] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Average salary by dept */}
      <div className="card">
        <h3 className="section-title">Average Salary by Department (₹L)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={deptChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avgSalary" name="Avg Salary (₹L)" radius={[4,4,0,0]}>
              {deptChartData.map(entry => <Cell key={entry.name} fill={DEPT_COLORS[entry.name]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Priorities */}
      <div className="card border-brand-500/40 bg-brand-500/5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-brand-400" />
          <h3 className="text-lg font-bold text-white">🤖 AI PRIORITIES — Actions to Take Now</h3>
        </div>
        <AIResponseCard result={priorities} loading={priLoading} />
      </div>
    </div>
  );
}

function LayoutDashboardIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/></svg>;
}
