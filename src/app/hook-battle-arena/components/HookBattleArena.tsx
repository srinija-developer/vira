'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import ScoreRing from '@/components/ui/ScoreRing';
import MetricBar from '@/components/ui/MetricBar';

interface Hook {
  id: 'A' | 'B';
  text: string;
  label: string;
}

interface HookScore {
  overall: number;
  attention: number;
  curiosity: number;
  emotion: number;
  clarity: number;
  urgency: number;
  verdict: string;
  strengths: string[];
  weaknesses: string[];
}

const defaultHooks: Hook[] = [
  {
    id: 'A',
    label: 'Hook A',
    text: 'Excited to share that our team just hit a major milestone — 10,000 customers in 18 months! 🎉',
  },
  {
    id: 'B',
    label: 'Hook B',
    text: '10,000 customers. 18 months. Zero outside funding. Here\'s what nobody tells you about building in silence.',
  },
];

const scoreHook = (text: string): HookScore => {
  const len = text.length;
  const hasNumber = /\d/.test(text);
  const hasQuestion = text.includes('?');
  const hasEmoji = /\p{Emoji}/u.test(text);
  const startsStrong = !text.toLowerCase().startsWith('excited') && !text.toLowerCase().startsWith('happy') && !text.toLowerCase().startsWith('proud');
  const hasContrast = text.includes('but') || text.includes('however') || text.includes('yet') || text.includes('Zero') || text.includes('nobody');
  const wordCount = text.split(' ').length;
  const isOptimalLength = wordCount >= 10 && wordCount <= 25;

  const attention = Math.min(100, 50 + (hasNumber ? 15 : 0) + (startsStrong ? 20 : 0) + (hasContrast ? 15 : 0));
  const curiosity = Math.min(100, 45 + (hasQuestion ? 20 : 0) + (hasContrast ? 20 : 0) + (text.includes('...') || text.includes('Here') ? 15 : 0));
  const emotion = Math.min(100, 40 + (hasEmoji ? 10 : 0) + (hasContrast ? 15 : 0) + (text.includes('nobody') || text.includes('silence') || text.includes('secret') ? 20 : 0));
  const clarity = Math.min(100, 60 + (isOptimalLength ? 20 : 0) + (len < 120 ? 10 : -10) + (hasNumber ? 10 : 0));
  const urgency = Math.min(100, 30 + (text.includes('!') ? 15 : 0) + (hasContrast ? 20 : 0) + (hasNumber ? 15 : 0));
  const overall = Math.round((attention + curiosity + emotion + clarity + urgency) / 5);

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (hasNumber) strengths.push('Uses specific numbers — creates credibility');
  if (startsStrong) strengths.push('Strong opening word — avoids weak starters');
  if (hasContrast) strengths.push('Contrast/tension creates curiosity');
  if (isOptimalLength) strengths.push('Optimal length for feed consumption');
  if (hasQuestion) strengths.push('Question format invites engagement');

  if (!startsStrong) weaknesses.push('Weak opener ("Excited/Happy/Proud") — loses attention');
  if (!hasContrast) weaknesses.push('No tension or contrast — feels flat');
  if (!isOptimalLength && wordCount > 25) weaknesses.push('Too long — readers may not finish');
  if (!hasNumber && !hasQuestion) weaknesses.push('No hook mechanism — number, question, or contrast needed');

  const verdict = overall >= 80 ? 'Scroll-Stopper' : overall >= 65 ? 'Above Average' : overall >= 50 ? 'Needs Work' : 'Weak Hook';

  return { overall, attention, curiosity, emotion, clarity, urgency, verdict, strengths, weaknesses };
};

export default function HookBattleArena() {
  const [hooks, setHooks] = useState<Hook[]>(defaultHooks);
  const [analyzed, setAnalyzed] = useState(false);
  const [scores, setScores] = useState<{ A: HookScore | null; B: HookScore | null }>({ A: null, B: null });
  const [winner, setWinner] = useState<'A' | 'B' | 'tie' | null>(null);

  const handleAnalyze = () => {
    const scoreA = scoreHook(hooks[0].text);
    const scoreB = scoreHook(hooks[1].text);
    setScores({ A: scoreA, B: scoreB });
    setWinner(scoreA.overall > scoreB.overall ? 'A' : scoreB.overall > scoreA.overall ? 'B' : 'tie');
    setAnalyzed(true);
  };

  const handleReset = () => {
    setAnalyzed(false);
    setScores({ A: null, B: null });
    setWinner(null);
  };

  const metrics: { key: keyof HookScore; label: string; color: string }[] = [
    { key: 'attention', label: 'Attention Grab', color: '#7C3AED' },
    { key: 'curiosity', label: 'Curiosity Gap', color: '#06B6D4' },
    { key: 'emotion', label: 'Emotional Pull', color: '#F59E0B' },
    { key: 'clarity', label: 'Clarity', color: '#10B981' },
    { key: 'urgency', label: 'Urgency', color: '#EF4444' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Icon name="BoltIcon" size={20} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Hook Battle Arena</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-xl">
            Pit two hooks head-to-head. AI scores each across 5 dimensions and declares a winner.
          </p>
        </div>
        {analyzed && (
          <button onClick={handleReset} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
            <Icon name="ArrowPathIcon" size={16} />
            New Battle
          </button>
        )}
      </div>

      {/* Winner Banner */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className={`rounded-2xl p-5 border flex items-center gap-4 ${
              winner === 'tie' ?'bg-warning/10 border-warning/30' :'bg-primary/10 border-primary/30'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Icon name="TrophyIcon" size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">
                {winner === 'tie' ? 'Dead Heat' : 'Winner'}
              </p>
              <p className="text-lg font-bold text-foreground">
                {winner === 'tie' ?'Both hooks are equally matched'
                  : `Hook ${winner} wins with ${scores[winner]?.overall}/100`}
              </p>
              {winner !== 'tie' && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {scores[winner]?.verdict} — leads by {Math.abs((scores.A?.overall ?? 0) - (scores.B?.overall ?? 0))} points
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Battle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hooks.map((hook, idx) => {
          const score = scores[hook.id];
          const isWinner = winner === hook.id;
          return (
            <motion.div
              key={hook.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-2xl border p-6 space-y-5 transition-all duration-300 ${
                isWinner
                  ? 'border-primary/50 bg-primary/5 card-glow-active' :'border-border bg-card card-glow'
              }`}
            >
              {/* Hook Label */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    hook.id === 'A' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                  }`}>
                    {hook.id}
                  </span>
                  <span className="font-semibold text-foreground">{hook.label}</span>
                </div>
                {isWinner && (
                  <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1">
                    <Icon name="TrophyIcon" size={12} />
                    Winner
                  </span>
                )}
              </div>

              {/* Text Input */}
              <textarea
                value={hook.text}
                onChange={(e) => {
                  const updated = [...hooks];
                  updated[idx] = { ...hook, text: e.target.value };
                  setHooks(updated);
                  if (analyzed) handleReset();
                }}
                rows={3}
                placeholder={`Enter Hook ${hook.id}...`}
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              />

              {/* Score Display */}
              {score && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <ScoreRing score={score.overall} size={80} strokeWidth={6} />
                    <div>
                      <p className="text-2xl font-bold text-foreground font-tabular">{score.overall}<span className="text-sm text-muted-foreground font-normal">/100</span></p>
                      <p className={`text-sm font-semibold mt-0.5 ${
                        score.overall >= 80 ? 'text-positive' : score.overall >= 65 ? 'text-accent' : 'text-warning'
                      }`}>{score.verdict}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {metrics.map((m) => (
                      <MetricBar
                        key={m.key}
                        label={m.label}
                        value={score[m.key] as number}
                        color={m.color}
                        showValue
                      />
                    ))}
                  </div>

                  {/* Strengths & Weaknesses */}
                  {score.strengths.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-positive uppercase tracking-widest">Strengths</p>
                      {score.strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                          <Icon name="CheckCircleIcon" size={14} className="text-positive mt-0.5 flex-shrink-0" />
                          {s}
                        </div>
                      ))}
                    </div>
                  )}
                  {score.weaknesses.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-warning uppercase tracking-widest">Opportunities</p>
                      {score.weaknesses.map((w, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                          <Icon name="ExclamationTriangleIcon" size={14} className="text-warning mt-0.5 flex-shrink-0" />
                          {w}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* VS Divider + CTA */}
      <div className="flex items-center justify-center gap-6">
        <div className="flex-1 h-px bg-border" />
        <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center text-sm font-bold text-muted-foreground">
          VS
        </div>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleAnalyze}
          disabled={!hooks[0].text.trim() || !hooks[1].text.trim()}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="BoltIcon" size={18} />
          {analyzed ? 'Re-Analyze Battle' : 'Start Battle'}
        </button>
      </div>

      {/* Metric Comparison Table */}
      {analyzed && scores.A && scores.B && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card card-glow overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Head-to-Head Comparison</h3>
          </div>
          <div className="divide-y divide-border">
            {metrics.map((m) => {
              const valA = scores.A![m.key] as number;
              const valB = scores.B![m.key] as number;
              const aWins = valA > valB;
              const bWins = valB > valA;
              return (
                <div key={m.key} className="px-6 py-3 flex items-center gap-4">
                  <div className={`text-right flex-1 font-tabular font-bold text-sm ${aWins ? 'text-primary' : 'text-muted-foreground'}`}>
                    {valA}
                  </div>
                  <div className="w-32 text-center text-xs font-medium text-muted-foreground">{m.label}</div>
                  <div className={`text-left flex-1 font-tabular font-bold text-sm ${bWins ? 'text-accent' : 'text-muted-foreground'}`}>
                    {valB}
                  </div>
                </div>
              );
            })}
            <div className="px-6 py-4 flex items-center gap-4 bg-muted/30">
              <div className={`text-right flex-1 font-tabular font-bold text-lg ${winner === 'A' ? 'text-primary' : 'text-muted-foreground'}`}>
                {scores.A.overall}
              </div>
              <div className="w-32 text-center text-xs font-semibold text-foreground uppercase tracking-widest">Overall</div>
              <div className={`text-left flex-1 font-tabular font-bold text-lg ${winner === 'B' ? 'text-accent' : 'text-muted-foreground'}`}>
                {scores.B.overall}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
