import clsx from 'clsx';

export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <div className={clsx('animate-spin rounded-full border-2 border-surface-border border-t-brand-500', sizes[size], className)} />
  );
}

export function PageLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-gray-500">Loading data...</p>
      </div>
    </div>
  );
}

export function StatCard({ title, value, subtitle, icon: Icon, color = 'brand', trend }) {
  const colors = {
    brand: 'text-brand-400 bg-brand-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    red: 'text-red-400 bg-red-500/10',
    cyan: 'text-cyan-400 bg-cyan-500/10',
    violet: 'text-violet-400 bg-violet-500/10',
  };

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          {trend && (
            <span className={clsx('text-xs font-medium mt-1 inline-block', trend > 0 ? 'text-emerald-400' : 'text-red-400')}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        {Icon && (
          <div className={clsx('p-2 rounded-lg', colors[color])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}

export function Badge({ variant = 'neutral', children }) {
  const variants = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    neutral: 'badge-neutral',
  };
  return <span className={variants[variant]}>{children}</span>;
}

export function SkillTag({ skill }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-brand-500/15 text-brand-300 border border-brand-500/20 font-medium">
      {skill}
    </span>
  );
}

export function RiskBadge({ level }) {
  const styles = {
    High: 'badge-danger',
    Medium: 'badge-warning',
    Low: 'badge-success',
  };
  return <span className={`badge ${styles[level] || 'badge-neutral'}`}>{level} Risk</span>;
}

export function ProgressBar({ value, max = 100, color = 'brand' }) {
  const pct = Math.min((value / max) * 100, 100);
  const colors = {
    brand: 'bg-brand-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    cyan: 'bg-cyan-500',
    gradient: 'bg-gradient-to-r from-brand-500 to-cyan-500',
  };
  return (
    <div className="progress-bar">
      <div
        className={clsx('progress-fill', colors[color])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function SectionHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-brand-400" />}
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}

export function AIResponseCard({ result, loading }) {
  if (loading) {
    return (
      <div className="card border-brand-500/30 ai-glow animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center">
            <span className="text-brand-400 text-sm">🤖</span>
          </div>
          <div className="h-4 bg-surface-elevated rounded w-32" />
        </div>
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className={`h-3 bg-surface-elevated rounded w-${['full','3/4','5/6'][i-1]}`} />)}
        </div>
      </div>
    );
  }

  if (!result) return null;

  const sections = [
    { label: '🔍 Finding', content: result.finding, color: 'text-cyan-300' },
    { label: '📊 Evidence', content: Array.isArray(result.evidence) ? result.evidence.join('\n• ') : result.evidence, isList: Array.isArray(result.evidence), color: 'text-gray-300' },
    { label: '🧠 Reasoning', content: result.reasoning, color: 'text-violet-300' },
    { label: '✅ Recommendation', content: result.recommendation, color: 'text-emerald-300' },
    { label: '📈 Expected Impact', content: result.expectedImpact, color: 'text-amber-300' },
  ];

  return (
    <div className="card border-brand-500/40 ai-glow animate-slide-up">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-surface-border">
        <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center">
          <span className="text-lg">🤖</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">PlacementIQ Agent</p>
          <p className="text-xs text-gray-500">
            {result.aiEnhanced ? '✨ Enhanced by Gemini AI' : '🔧 Mock AI Mode — data-driven analysis'}
          </p>
        </div>
        {result.aiEnhanced && (
          <span className="ml-auto badge badge-info">AI Enhanced</span>
        )}
      </div>

      <div className="space-y-4">
        {sections.map(({ label, content, color, isList }) => content && (
          <div key={label}>
            <p className={`text-xs font-semibold mb-1 ${color}`}>{label}</p>
            {isList ? (
              <ul className="text-sm text-gray-300 space-y-0.5 list-disc list-inside">
                {result.evidence.map((e, i) => <li key={i} className="text-gray-400">{e}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">{content}</p>
            )}
          </div>
        ))}

        {result.aiSummary && (
          <div className="pt-3 border-t border-surface-border">
            <p className="text-xs font-semibold text-brand-300 mb-1">✨ AI Enhanced Insight</p>
            <p className="text-sm text-gray-300 italic">{result.aiSummary}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-center">
      {Icon && <Icon className="w-8 h-8 text-gray-600 mb-2" />}
      <p className="text-sm font-medium text-gray-400">{title}</p>
      {description && <p className="text-xs text-gray-600 mt-1">{description}</p>}
    </div>
  );
}
