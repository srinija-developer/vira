'use client';
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import type { LiveScores } from './OptimizerLayout';

interface OptimizerLiveScoresProps {
  scores: LiveScores;
  baseScores: LiveScores;
  appliedCount: number;
}

interface ScoreRowProps {
  label: string;
  score: number;
  baseScore: number;
}

function ScoreRow({ label, score, baseScore }: ScoreRowProps) {
  const delta = score - baseScore;
  const color =
    score >= 80 ? 'var(--positive)' : score >= 60 ? 'var(--warning)' : 'var(--negative)';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground">{label}</span>
        <div className="flex items-center gap-1.5">
          {delta !== 0 && (
            <span className={`text-2xs font-bold ${delta > 0 ? 'text-positive' : 'text-negative'}`}>
              {delta > 0 ? `+${delta}` : delta}
            </span>
          )}
          <span className="text-sm font-bold font-tabular" style={{ color }}>
            {score}
          </span>
        </div>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function OptimizerLiveScores({
  scores,
  baseScores,
  appliedCount,
}: OptimizerLiveScoresProps) {
  const prevScoresRef = useRef(scores);
  const overallDelta = scores.overall - baseScores.overall;

  useEffect(() => {
    prevScoresRef.current = scores;
  }, [scores]);

  const optimizationPct = Math.min(
    100,
    Math.round(((scores.overall - 60) / 40) * 100)
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col card-glow"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2 mb-0.5">
          <Icon name="BoltIcon" size={16} className="text-accent" />
          <span className="text-sm font-bold text-foreground">Live Score Panel</span>
        </div>
        <p className="text-xs text-muted-foreground">Updates as you edit</p>
      </div>

      <div className="p-5 space-y-6 flex-1">
        {/* Overall Score */}
        <div className="text-center bg-muted/40 rounded-2xl p-5">
          <p className="text-2xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Overall Score
          </p>
          <motion.div
            key={scores.overall}
            initial={{ scale: 0.9, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-5xl font-black font-tabular mb-1"
            style={{
              color:
                scores.overall >= 80
                  ? 'var(--positive)'
                  : scores.overall >= 60
                  ? 'var(--warning)'
                  : 'var(--negative)',
            }}
          >
            {scores.overall}
          </motion.div>
          <p className="text-sm text-muted-foreground">/100</p>
          {overallDelta !== 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`inline-flex items-center gap-1 mt-2 text-xs font-bold px-2.5 py-1 rounded-full ${
                overallDelta > 0
                  ? 'text-positive bg-positive/10' :'text-negative bg-negative/10'
              }`}
            >
              <Icon
                name={overallDelta > 0 ? 'ArrowTrendingUpIcon' : 'ArrowTrendingDownIcon'}
                size={12}
              />
              {overallDelta > 0 ? `+${overallDelta}` : overallDelta} from original
            </motion.div>
          )}
        </div>

        {/* Individual Scores */}
        <div className="space-y-4">
          <ScoreRow label="Hook Strength" score={scores.hook} baseScore={baseScores.hook} />
          <ScoreRow label="Clarity" score={scores.clarity} baseScore={baseScores.clarity} />
          <ScoreRow label="Readability" score={scores.readability} baseScore={baseScores.readability} />
          <ScoreRow label="CTA Strength" score={scores.cta} baseScore={baseScores.cta} />
        </div>

        {/* Optimization Meter */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground">Optimization Meter</span>
            <span className="text-xs font-bold font-tabular text-primary">{optimizationPct}%</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              animate={{ width: `${optimizationPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xs text-muted-foreground">64 baseline</span>
            <span className="text-2xs text-muted-foreground">89 target</span>
          </div>
        </div>

        {/* Applied count */}
        {appliedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-positive/8 border border-positive/20 rounded-xl px-3 py-2.5"
          >
            <Icon name="CheckCircleIcon" size={14} className="text-positive" />
            <span className="text-xs font-semibold text-positive">
              {appliedCount} suggestion{appliedCount > 1 ? 's' : ''} applied
            </span>
          </motion.div>
        )}

        {/* Actions */}
        <div className="space-y-2 pt-2 border-t border-border">
          <button className="w-full btn-primary text-sm py-2.5 flex items-center justify-center gap-2">
            <Icon name="ArrowDownTrayIcon" size={15} />
            Export Optimized
          </button>
          <Link href="/content-analysis-results" className="block">
            <button className="w-full btn-secondary text-sm py-2.5 flex items-center justify-center gap-2">
              <Icon name="ChartBarSquareIcon" size={15} />
              View Full Report
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}