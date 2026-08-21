'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import ScoreRing from '@/components/ui/ScoreRing';

const defaultVariants = [
  {
    id: 'A',
    label: 'Version A — Direct',
    content: `10,000 customers. 18 months. Zero outside funding.

Here's what nobody tells you about building in silence:→ Obsessive customer focus beats clever marketing→ Shipping fast beats planning perfectly→ Radical transparency beats corporate polishWe believed in the problem. The market proved us right.What's your #1 lesson from building something from scratch? One sentence — I read every reply.

#B2BSaaS #FounderStory #StartupMilestone`,
  },
  {
    id: 'B',
    label: 'Version B — Story',
    content: `18 months ago, everyone told us the niche was too crowded.

We shipped anyway.

Today: 10,000 customers. No VC. No growth hacks. Just a team that listened harder than anyone else.

The three things that actually moved the needle weren't in any playbook:
→ Obsessive customer focus
→ Shipping fast and iterating faster  
→ Radical transparency — even when it was uncomfortable

To the early believers: you made this real.

What's the one thing you wish someone had told you before you started building?

#B2BSaaS #FounderStory #StartupMilestone`,
  },
];

const scoreVariant = (text: string): { overall: number; hook: number; clarity: number; emotion: number; cta: number } => {
  const words = text.split(/\s+/).filter(Boolean);
  const hasNumbers = /\d/.test(text);
  const hasQuestion = text.includes('?');
  const hasBullets = /[→•\-\*]/.test(text);
  const startsStrong = !text.toLowerCase().startsWith('excited') && !text.toLowerCase().startsWith('happy');
  const hasContrast = /\b(but|however|yet|zero|nobody|anyway)\b/i.test(text);
  const optimalLength = words.length >= 80 && words.length <= 250;

  const hook = Math.min(100, 50 + (startsStrong ? 20 : 0) + (hasNumbers ? 15 : 0) + (hasContrast ? 15 : 0));
  const clarity = Math.min(100, 55 + (hasBullets ? 20 : 0) + (optimalLength ? 15 : 0) + (words.length < 300 ? 10 : 0));
  const emotion = Math.min(100, 45 + (hasContrast ? 20 : 0) + (text.includes('anyway') || text.includes('silence') ? 15 : 0) + (hasNumbers ? 10 : 0));
  const cta = Math.min(100, 40 + (hasQuestion ? 25 : 0) + (text.includes('one sentence') || text.includes('one thing') ? 20 : 0) + (text.includes('reply') ? 15 : 0));
  const overall = Math.round((hook + clarity + emotion + cta) / 4);

  return { overall, hook, clarity, emotion, cta };
};

interface Variant {
  id: string;
  label: string;
  content: string;
}

export default function ABContentLab() {
  const [variants, setVariants] = useState<Variant[]>(defaultVariants);
  const [analyzed, setAnalyzed] = useState(false);
  const [scores, setScores] = useState<Record<string, ReturnType<typeof scoreVariant>>>({});
  const [winner, setWinner] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAnalyze = () => {
    const newScores: Record<string, ReturnType<typeof scoreVariant>> = {};
    variants.forEach(v => { newScores[v.id] = scoreVariant(v.content); });
    setScores(newScores);
    const sorted = [...variants].sort((a, b) => (newScores[b.id]?.overall ?? 0) - (newScores[a.id]?.overall ?? 0));
    setWinner(sorted[0].id);
    setAnalyzed(true);
  };

  const handleAddVariant = () => {
    if (variants.length >= 4) return;
    const ids = ['A', 'B', 'C', 'D'];
    const nextId = ids[variants.length];
    setVariants([...variants, { id: nextId, label: `Version ${nextId} — Custom`, content: '' }]);
    setAnalyzed(false);
  };

  const handleRemoveVariant = (id: string) => {
    if (variants.length <= 2) return;
    setVariants(variants.filter(v => v.id !== id));
    setAnalyzed(false);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const variantColors: Record<string, string> = { A: '#7C3AED', B: '#06B6D4', C: '#F59E0B', D: '#10B981' };
  const metrics: { key: keyof ReturnType<typeof scoreVariant>; label: string }[] = [
    { key: 'hook', label: 'Hook' },
    { key: 'clarity', label: 'Clarity' },
    { key: 'emotion', label: 'Emotion' },
    { key: 'cta', label: 'CTA' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-positive/15 flex items-center justify-center">
              <Icon name="BeakerIcon" size={20} className="text-positive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">A/B Content Lab</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-xl">
            Side-by-side variant testing workspace. Write up to 4 versions and let AI score them head-to-head.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {variants.length < 4 && (
            <button onClick={handleAddVariant} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
              <Icon name="PlusIcon" size={16} />
              Add Variant
            </button>
          )}
          <button onClick={handleAnalyze} disabled={variants.some(v => !v.content.trim())} className="btn-primary text-sm py-2 px-5 flex items-center gap-2 disabled:opacity-50">
            <Icon name="BeakerIcon" size={16} />
            Run Lab Test
          </button>
        </div>
      </div>

      {/* Winner Banner */}
      <AnimatePresence>
        {winner && analyzed && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-positive/30 bg-positive/5 p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-positive/20 flex items-center justify-center flex-shrink-0">
              <Icon name="TrophyIcon" size={24} className="text-positive" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">Lab Result</p>
              <p className="text-lg font-bold text-foreground">
                {variants.find(v => v.id === winner)?.label} wins with {scores[winner]?.overall}/100
              </p>
              <p className="text-sm text-muted-foreground">
                Leads on {metrics.filter(m => {
                  const winnerScore = scores[winner]?.[m.key] ?? 0;
                  return variants.filter(v => v.id !== winner).every(v => (scores[v.id]?.[m.key] ?? 0) < winnerScore);
                }).map(m => m.label).join(', ') || 'overall score'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Variant Grid */}
      <div className={`grid gap-6 ${variants.length === 2 ? 'grid-cols-1 lg:grid-cols-2' : variants.length === 3 ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-4'}`}>
        {variants.map((variant, idx) => {
          const score = scores[variant.id];
          const isWinner = winner === variant.id && analyzed;
          const color = variantColors[variant.id] || '#7C3AED';
          return (
            <motion.div
              key={variant.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`rounded-2xl border p-5 space-y-4 transition-all duration-300 ${
                isWinner ? 'border-positive/40 bg-positive/5' : 'border-border bg-card card-glow'
              }`}
            >
              {/* Label Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ backgroundColor: color + '20', color }}>
                    {variant.id}
                  </span>
                  <input
                    value={variant.label}
                    onChange={(e) => {
                      const updated = variants.map(v => v.id === variant.id ? { ...v, label: e.target.value } : v);
                      setVariants(updated);
                    }}
                    className="text-sm font-semibold text-foreground bg-transparent border-none outline-none w-full"
                  />
                </div>
                <div className="flex items-center gap-1">
                  {isWinner && <Icon name="TrophyIcon" size={14} className="text-positive" />}
                  {variants.length > 2 && (
                    <button onClick={() => handleRemoveVariant(variant.id)} className="p-1 rounded text-muted-foreground hover:text-negative transition-colors">
                      <Icon name="XMarkIcon" size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Textarea */}
              <textarea
                value={variant.content}
                onChange={(e) => {
                  const updated = variants.map(v => v.id === variant.id ? { ...v, content: e.target.value } : v);
                  setVariants(updated);
                  setAnalyzed(false);
                }}
                rows={8}
                placeholder={`Write Version ${variant.id} here...`}
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              />

              {/* Word count + copy */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/70">{variant.content.split(/\s+/).filter(Boolean).length} words</span>
                <button
                  onClick={() => handleCopy(variant.id, variant.content)}
                  className="text-xs text-foreground/70 hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <Icon name={copiedId === variant.id ? 'CheckIcon' : 'ClipboardDocumentIcon'} size={13} />
                  {copiedId === variant.id ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Score Display */}
              {score && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 pt-2 border-t border-border">
                  <div className="flex items-center gap-3">
                    <ScoreRing score={score.overall} size={64} strokeWidth={5} />
                    <div>
                      <p className="text-xl font-bold text-foreground font-tabular">{score.overall}<span className="text-xs text-muted-foreground">/100</span></p>
                      <p className="text-xs text-foreground/70">Overall Score</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {metrics.map((m) => {
                      const val = score[m.key];
                      const isTopForMetric = analyzed && variants.every(v => v.id === variant.id || (scores[v.id]?.[m.key] ?? 0) <= val);
                      return (
                        <div key={m.key} className={`rounded-lg p-2 text-center ${isTopForMetric ? 'bg-positive/10 border border-positive/20' : 'bg-muted/40'}`}>
                          <p className={`text-sm font-bold font-tabular ${isTopForMetric ? 'text-positive' : 'text-foreground'}`}>{val}</p>
                          <p className="text-xs text-foreground/70">{m.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Table */}
      {analyzed && Object.keys(scores).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card card-glow overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Score Comparison Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-widest">Metric</th>
                  {variants.map(v => (
                    <th key={v.id} className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-widest" style={{ color: variantColors[v.id] }}>
                      {v.id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[...metrics, { key: 'overall' as const, label: 'Overall' }].map((m) => (
                  <tr key={m.key} className={m.key === 'overall' ? 'bg-muted/30' : ''}>
                    <td className="px-6 py-3 font-medium text-foreground">{m.label}</td>
                    {variants.map(v => {
                      const val = scores[v.id]?.[m.key] ?? 0;
                      const isTop = variants.every(other => other.id === v.id || (scores[other.id]?.[m.key] ?? 0) <= val);
                      return (
                        <td key={v.id} className="px-6 py-3 text-center">
                          <span className={`font-bold font-tabular ${isTop ? '' : 'text-muted-foreground'} ${m.key === 'overall' ? 'text-base' : 'text-sm'}`} style={isTop ? { color: variantColors[v.id] } : {}}>
                            {val}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
