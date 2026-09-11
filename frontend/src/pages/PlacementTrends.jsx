import { TrendingUp, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { analyticsApi } from '../services/api.js';
import { useApi } from '../hooks/useApi.js';
import { PageLoading, SectionHeader } from '../components/UI.jsx';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Cell, Legend
} from 'recharts';

const DEPT_COLORS = { CSE: '#6366f1', ECE: '#06b6d4', EEE: '#f59e0b', MECH: '#10b981', CIVIL: '#f43f5e' };

const CustomTooltip = ({ active, payload, label }) => active && payload?.length ? (
  <div className="bg-surface-card border border-surface-border rounded-lg p-2 text-xs shadow-xl">
    <p className="text-white font-bold mb-1">{label}</p>
    {payload.map((p, i) => (
      <p key={i} style={{ color: p.color }} className="text-xs">{p.name}: {p.value}{p.name?.includes('%') ? '%' : p.name?.includes('₹') ? 'L' : ''}</p>
    ))}
  </div>
) : null;

export default function PlacementTrends() {
  const { data: analytics, loading } = useApi(() => analyticsApi.getAll());

  if (loading) return <PageLoading />;

  const completedYears = analytics?.trends?.filter(t => t.placementPercentage !== null) || [];
  const lineData = completedYears.map(t => ({
    year: t.year.toString(),
    'Placement %': t.placementPercentage,
    'Avg Salary (₹L)': +(t.averageSalary / 100000).toFixed(1),
    'Companies': t.companiesHired,
  }));

  // Dept trends
  const deptLineData = completedYears.map(t => {
    const row = { year: t.year.toString() };
    Object.entries(t.departmentStats).forEach(([dept, stats]) => {
      row[dept] = stats.percentage;
    });
    return row;
  });

  // Year-over-year comparison
  const latest = completedYears[completedYears.length - 1];
  const previous = completedYears[completedYears.length - 2];

  function Change({ curr, prev, suffix = '' }) {
    const diff = curr - prev;
    if (diff > 0) return <span className="text-emerald-400 flex items-center gap-0.5 text-xs"><ArrowUp className="w-3 h-3" />{diff.toFixed(1)}{suffix}</span>;
    if (diff < 0) return <span className="text-red-400 flex items-center gap-0.5 text-xs"><ArrowDown className="w-3 h-3" />{Math.abs(diff).toFixed(1)}{suffix}</span>;
    return <span className="text-gray-400 flex items-center gap-0.5 text-xs"><Minus className="w-3 h-3" />No change</span>;
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Placement Trends" subtitle="Multi-year analysis across 2023–2026 placement seasons" icon={TrendingUp} />

      {/* Season comparison */}
      {latest && previous && (
        <div className="card">
          <h3 className="section-title">Year-over-Year Comparison: {previous.year} vs {latest.year}</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Placement %', curr: latest.placementPercentage, prev: previous.placementPercentage, suffix: '%' },
              { label: 'Avg Salary', curr: +(latest.averageSalary/100000).toFixed(1), prev: +(previous.averageSalary/100000).toFixed(1), suffix: 'L', prefix: '₹' },
              { label: 'Peak Salary', curr: +(latest.highestSalary/100000).toFixed(1), prev: +(previous.highestSalary/100000).toFixed(1), suffix: 'L', prefix: '₹' },
              { label: 'Companies', curr: latest.companiesHired, prev: previous.companiesHired },
              { label: 'Total Offers', curr: latest.totalOffers, prev: previous.totalOffers },
            ].map(({ label, curr, prev, suffix = '', prefix = '' }) => (
              <div key={label} className="bg-surface-elevated rounded-lg p-3 text-center border border-surface-border">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-lg font-bold text-white">{prefix}{curr}{suffix}</p>
                <Change curr={curr} prev={prev} suffix={suffix} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main trends chart */}
      <div className="card">
        <h3 className="section-title">Placement % and Salary Trend</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={lineData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" />
            <XAxis dataKey="year" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fill: '#9ca3af', fontSize: 11 }} domain={[60, 100]} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line yAxisId="left" type="monotone" dataKey="Placement %" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: '#6366f1' }} />
            <Line yAxisId="right" type="monotone" dataKey="Avg Salary (₹L)" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4, fill: '#06b6d4' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Department trends */}
      <div className="card">
        <h3 className="section-title">Department-wise Placement % Trend</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={deptLineData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" />
            <XAxis dataKey="year" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} domain={[50, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {Object.keys(DEPT_COLORS).map(dept => (
              <Line key={dept} type="monotone" dataKey={dept} stroke={DEPT_COLORS[dept]} strokeWidth={2} dot={{ r: 3 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Historical summary table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-surface-border">
          <h3 className="section-title mb-0">Historical Summary</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border">
              {['Year', 'Students', 'Placed', 'Rate', 'Avg Salary', 'Peak Salary', 'Companies', 'Offers'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {completedYears.map((t, i) => (
              <tr key={t.year} className="border-b border-surface-border/50 hover:bg-surface-elevated">
                <td className="px-4 py-3 font-bold text-white">{t.year}</td>
                <td className="px-4 py-3 text-gray-300">{t.totalStudents}</td>
                <td className="px-4 py-3 text-emerald-400">{t.totalPlaced}</td>
                <td className="px-4 py-3">
                  <span className="font-bold text-brand-400">{t.placementPercentage}%</span>
                  {i > 0 && <Change curr={t.placementPercentage} prev={completedYears[i-1].placementPercentage} suffix="%" />}
                </td>
                <td className="px-4 py-3 text-gray-300">₹{(t.averageSalary/100000).toFixed(1)}L</td>
                <td className="px-4 py-3 text-gray-300">₹{(t.highestSalary/100000).toFixed(1)}L</td>
                <td className="px-4 py-3 text-gray-300">{t.companiesHired}</td>
                <td className="px-4 py-3 text-gray-300">{t.totalOffers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
