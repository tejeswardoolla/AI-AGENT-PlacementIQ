import { Users, Building2, Brain, TrendingUp, ChevronRight, Zap, BarChart3, Shield } from 'lucide-react';

export default function LandingPage({ onSelectMode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-600/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-black text-white tracking-tight">PlacementIQ</h1>
              <p className="text-xs text-brand-400 font-medium">AI Placement Intelligence Agent</p>
            </div>
          </div>

          {/* Main heading */}
          <h2 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4">
            Placement Intelligence<br />
            <span className="bg-gradient-to-r from-brand-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h2>

          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Analyze placement data, identify at-risk students, discover job matches, and get AI-powered 
            actionable recommendations — all in one intelligence platform.
          </p>

          {/* Mode selection */}
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
            {/* Student Mode */}
            <button
              onClick={() => onSelectMode('student')}
              className="group card-hover p-6 text-left cursor-pointer border-brand-500/20 hover:border-brand-500/60 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center group-hover:bg-brand-500/30 transition-colors">
                  <Users className="w-5 h-5 text-brand-400" />
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-brand-400 transition-colors group-hover:translate-x-1 transform" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Student Mode</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Check your placement readiness, discover best-fit jobs, and identify skill gaps with AI-powered analysis.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Job Match %', 'Skill Gap', 'Ready Score'].map(f => (
                  <span key={f} className="text-xs px-2 py-0.5 bg-brand-500/10 text-brand-400 rounded-full border border-brand-500/20">{f}</span>
                ))}
              </div>
            </button>

            {/* Management Mode */}
            <button
              onClick={() => onSelectMode('management')}
              className="group card-hover p-6 text-left cursor-pointer border-violet-500/20 hover:border-violet-500/60 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center group-hover:bg-violet-500/30 transition-colors">
                  <Building2 className="w-5 h-5 text-violet-400" />
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-violet-400 transition-colors group-hover:translate-x-1 transform" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Management / Placement Cell</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Comprehensive dashboards, AI agent chat, department analytics, and actionable placement intelligence.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['AI Chat', 'Analytics', 'At-Risk', 'Recruiters'].map(f => (
                  <span key={f} className="text-xs px-2 py-0.5 bg-violet-500/10 text-violet-400 rounded-full border border-violet-500/20">{f}</span>
                ))}
              </div>
            </button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {[
              { icon: Brain, label: 'AI Agent', desc: 'Natural language Q&A' },
              { icon: BarChart3, label: 'Analytics', desc: 'Real-time dashboards' },
              { icon: Shield, label: 'At-Risk Detection', desc: 'Early intervention' },
              { icon: TrendingUp, label: 'Trend Analysis', desc: 'Multi-year insights' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="card p-3 text-center">
                <Icon className="w-5 h-5 text-brand-400 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-white">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 border-t border-surface-border">
        <p className="text-xs text-gray-600">PlacementIQ · AI-Powered University Placement Intelligence · Hackathon Demo 2026</p>
      </div>
    </div>
  );
}
