import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Building2, 
  Brain, AlertTriangle, UserCheck, TrendingUp, 
  Terminal, ChevronLeft, Zap, Bell
} from 'lucide-react';
import clsx from 'clsx';
import { healthApi } from '../services/api';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/students', icon: Users, label: 'Students' },
  { path: '/jobs', icon: Briefcase, label: 'Jobs' },
  { path: '/companies', icon: Building2, label: 'Companies' },
  { path: '/skills', icon: Brain, label: 'Skill Intelligence' },
  { path: '/at-risk', icon: AlertTriangle, label: 'At-Risk Students' },
  { path: '/recruiters', icon: UserCheck, label: 'Recruiter Intel' },
  { path: '/trends', icon: TrendingUp, label: 'Placement Trends' },
  { path: '/ai-command', icon: Terminal, label: 'AI Command Center' },
];

export default function Layout({ children, onBack }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [aiMode, setAiMode] = useState('detecting');

  useEffect(() => {
    healthApi.check()
      .then(res => setAiMode(res?.aiMode || 'mock'))
      .catch(() => setAiMode('mock'));
  }, []);

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-surface-card border-r border-surface-border flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-surface-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">PlacementIQ</h1>
              <p className="text-xs text-gray-500">Management Mode</p>
            </div>
          </div>
          <button onClick={onBack} className="btn-secondary w-full justify-center text-xs py-1.5">
            <ChevronLeft className="w-3 h-3" />
            Switch Mode
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto space-y-0.5">
          {navItems.map(({ path, icon: Icon, label }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={clsx(
                location.pathname === path ? 'sidebar-link-active' : 'sidebar-link',
                'w-full text-left'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* AI Badge */}
        <div className="p-3 border-t border-surface-border">
          <div className="card p-3 bg-brand-600/10 border-brand-500/30">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-brand-300">
                {aiMode === 'gemini' ? '✨ Gemini AI Active' : 'AI Agent Active'}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {aiMode === 'gemini' ? 'Connected to Gemini API' : 'Mock mode — data-driven analysis'}
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-surface-card/80 backdrop-blur-sm border-b border-surface-border px-6 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-secondary p-2">
              <Bell className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 bg-surface-elevated rounded-lg px-3 py-1.5 border border-surface-border">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">P</div>
              <span className="text-xs text-gray-300">Placement Cell</span>
            </div>
          </div>
        </div>
        <div className="p-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
