import { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Loader, Lightbulb, ChevronRight } from 'lucide-react';
import { agentApi, healthApi } from '../services/api.js';
import { SectionHeader, AIResponseCard } from '../components/UI.jsx';

const DEMO_QUESTIONS = [
  "Which departments are underperforming?",
  "Which students are at risk of remaining unplaced?",
  "Which companies are offering the highest salaries?",
  "What skills are companies currently demanding?",
  "Which recruiters should we approach again?",
  "Why is EEE placement performance low?",
  "Which students are eligible but not applying?",
  "What should management do right now?",
  "Compare placement trends across seasons",
  "What's our overall placement status?",
];

export default function AICommandCenter() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiMode, setAiMode] = useState('detecting');
  const bottomRef = useRef(null);

  useEffect(() => {
    healthApi.check()
      .then(res => setAiMode(res?.aiMode || 'mock'))
      .catch(() => setAiMode('mock'));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleAsk = async (q) => {
    const text = q || question.trim();
    if (!text || loading) return;

    setQuestion('');
    setMessages(prev => [...prev, { type: 'user', text, id: Date.now() }]);
    setLoading(true);

    try {
      const result = await agentApi.ask(text);
      setMessages(prev => [...prev, { type: 'agent', result, id: Date.now() + 1 }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        type: 'error', text: 'Agent failed to respond. Please check if the backend is running.',
        id: Date.now() + 1
      }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <SectionHeader
        title="AI Command Center"
        subtitle="Ask natural language questions — the agent analyses placement data and provides evidence-based answers"
        icon={Terminal}
      />

      <div className="flex flex-1 gap-4 min-h-0">
        {/* Suggestions panel */}
        <div className="w-64 flex-shrink-0 hidden lg:block">
          <div className="card h-full overflow-y-auto">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <p className="text-sm font-semibold text-white">Demo Questions</p>
            </div>
            <div className="space-y-1.5">
              {DEMO_QUESTIONS.map((q, i) => (
                <button key={i} onClick={() => handleAsk(q)} disabled={loading}
                  className="w-full text-left text-xs text-gray-400 hover:text-white p-2 rounded-lg hover:bg-surface-elevated transition-all flex items-start gap-2 group">
                  <ChevronRight className="w-3 h-3 text-brand-500 mt-0.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4">
                  <Terminal className="w-8 h-8 text-brand-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">PlacementIQ Agent</h3>
                <p className="text-sm text-gray-400 max-w-md">
                  Ask any question about placement data. The agent will analyse it, gather evidence,
                  and provide structured recommendations.
                </p>
                <p className="text-xs text-gray-500 mt-3">
                  {aiMode === 'gemini'
                    ? '✨ Powered by Google Gemini AI'
                    : '🔧 Running in Mock AI Mode — data-driven analysis'}
                </p>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id} className="animate-slide-up">
                {msg.type === 'user' && (
                  <div className="flex justify-end">
                    <div className="max-w-lg bg-brand-600 rounded-2xl rounded-tr-sm px-4 py-3">
                      <p className="text-sm text-white">{msg.text}</p>
                    </div>
                  </div>
                )}
                {msg.type === 'agent' && (
                  <div className="flex justify-start">
                    <div className="max-w-2xl w-full">
                      <AIResponseCard result={msg.result} />
                    </div>
                  </div>
                )}
                {msg.type === 'error' && (
                  <div className="flex justify-start">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
                      {msg.text}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center">
                  <span className="text-sm">🤖</span>
                </div>
                <div className="card flex items-center gap-2 py-3">
                  <Loader className="w-4 h-4 text-brand-400 animate-spin" />
                  <span className="text-sm text-gray-400">Agent is analysing...</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAsk()}
              placeholder="Ask a placement intelligence question..."
              className="input-field flex-1 py-3"
              disabled={loading}
            />
            <button onClick={() => handleAsk()} disabled={loading || !question.trim()}
              className="btn-primary px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile suggestions */}
          <div className="lg:hidden mt-3 flex gap-2 overflow-x-auto pb-1">
            {DEMO_QUESTIONS.slice(0, 5).map((q, i) => (
              <button key={i} onClick={() => handleAsk(q)} disabled={loading}
                className="flex-shrink-0 text-xs bg-surface-elevated border border-surface-border text-gray-400 hover:text-white px-3 py-1.5 rounded-full transition-colors">
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
