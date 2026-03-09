import { useState, useCallback } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const TONES = [
  { id: 'professional', label: '💼 Professional' }, { id: 'casual', label: '😎 Casual' },
  { id: 'friendly', label: '🤗 Friendly' }, { id: 'assertive', label: '💪 Assertive' },
  { id: 'empathetic', label: '💖 Empathetic' }, { id: 'humorous', label: '😂 Humorous' },
  { id: 'diplomatic', label: '🤝 Diplomatic' }, { id: 'confident', label: '🔥 Confident' },
  { id: 'apologetic', label: '🙏 Apologetic' }, { id: 'enthusiastic', label: '🚀 Enthusiastic' },
  { id: 'formal', label: '🎩 Formal' }, { id: 'gen_z', label: '✨ Gen Z' },
];

function ShiftPage() {
  const [text, setText] = useState('');
  const [tone, setTone] = useState('professional');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const rewrite = useAction(api.ai.rewrite);
  const save = useMutation(api.functions.saveRewrite);

  const handleShift = useCallback(async () => {
    if (!text.trim()) return; setLoading(true); setResult(null);
    try {
      const r = await rewrite({ text: text.trim(), targetTone: tone });
      setResult(r.rewrittenText);
      await save({ originalText: text.trim(), targetTone: tone, rewrittenText: r.rewrittenText });
    } catch (e: any) { setResult(`Error: ${e.message}`); } finally { setLoading(false); }
  }, [text, tone, rewrite, save]);

  const handleCopy = () => { if (result) { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); } };

  return (
    <div className="main-content">
      <div className="shift-page">
        <h1 className="shift-title">Shift Your <span className="accent">Tone</span></h1>
        <p className="shift-subtitle">Paste any message and rewrite it in the perfect tone.</p>
        <div className="tone-grid">
          {TONES.map(t => (<button key={t.id} className={`tone-chip ${tone === t.id ? 'selected' : ''}`} onClick={() => setTone(t.id)}>{t.label}</button>))}
        </div>
        <textarea className="text-area" value={text} onChange={e => setText(e.target.value)} placeholder="Paste or type your message here..." rows={5} />
        <button className="btn-shift" disabled={!text.trim() || loading} onClick={handleShift}>{loading ? '⏳ Shifting...' : '🔄 Shift Tone'}</button>
        {loading && <div className="loading-dots"><span /><span /><span /></div>}
        {result && !loading && (
          <div className="result-box">
            <div className="result-label">Rewritten ({TONES.find(t => t.id === tone)?.label})</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{result}</div>
            <button className="copy-btn" onClick={handleCopy}>{copied ? '✅ Copied!' : '📋 Copy'}</button>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (<BrowserRouter><div className="app-container">
    <header className="header"><a href="/" className="header-logo"><span style={{ fontSize: '1.5rem' }}>🔄</span><div><h1>ToneShift</h1></div></a></header>
    <Routes><Route path="/" element={<ShiftPage />} /></Routes>
    <footer className="footer"><p>© {new Date().getFullYear()} ToneShift — An AVS Media App.</p></footer>
  </div></BrowserRouter>);
}
export default App;
