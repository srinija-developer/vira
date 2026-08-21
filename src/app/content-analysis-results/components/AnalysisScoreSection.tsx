'use client';
import React from 'react';
import { motion } from 'framer-motion';
import ScoreRing from '@/components/ui/ScoreRing';
import MetricBar from '@/components/ui/MetricBar';
import { mockAnalysisResult } from '@/lib/mockData';

const scoreDescriptions: Record<string, string> = {
  hook: 'Opening line captures attention and creates curiosity',
  clarity: 'Message is clear, focused, and easy to understand',
  emotion: 'Content resonates emotionally and drives connection',
  readability: 'Sentence structure and language complexity are well-calibrated',
  cta: 'Call-to-action is specific, compelling, and actionable',
  originality: 'Voice feels fresh, non-generic, and distinctly human',
};

export default function AnalysisScoreSection() {
  const { scores, tone, sentiment } = mockAnalysisResult;

  const subScores = [
    { key: 'hook', label: 'Hook Strength', score: scores.hook },
    { key: 'clarity', label: 'Clarity', score: scores.clarity },
    { key: 'emotion', label: 'Emotional Impact', score: scores.emotion },
    { key: 'readability', label: 'Readability', score: scores.readability },
    { key: 'cta', label: 'CTA Strength', score: scores.cta },
    { key: 'originality', label: 'Originality', score: scores.originality },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center card-glow"
      >
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground mb-6">
          Overall Score
        </p>
        <ScoreRing score={scores.overall} size={180} strokeWidth={12} />
        <div className="mt-6 flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-medium mb-1">Tone</p>
            <p className="text-sm font-bold text-primary">{tone}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-medium mb-1">Sentiment</p>
            <p className="text-sm font-bold text-positive">{sentiment}</p>
          </div>
        </div>
      </motion.div>

      {/* Sub Scores */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 card-glow"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-foreground">Score Breakdown</h2>
          <span className="text-xs text-muted-foreground font-medium">AI Content Quality Estimate</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {subScores.map((s, i) => (
            <motion.div
              key={`score-${s.key}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
            >
              <MetricBar
                label={s.label}
                score={s.score}
                description={scoreDescriptions[s.key]}
                height={7}
              />
            </motion.div>
          ))}
        </div>

        {/* Content health summary */}
        <div className="mt-6 pt-5 border-t border-border grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-positive mb-2">✓ Strengths</p>
            <ul className="space-y-1">
              {['Strong opening hook', 'High readability score', 'Clear topic focus', 'Positive sentiment'].map((s) => (
                <li key={`strength-${s}`} className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-positive flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-warning mb-2">⚠ Opportunities</p>
            <ul className="space-y-1">
              {['CTA lacks specificity', 'Generic hashtags used', 'Closing is too broad', 'No concrete story'].map((s) => (
                <li key={`opportunity-${s}`} className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}