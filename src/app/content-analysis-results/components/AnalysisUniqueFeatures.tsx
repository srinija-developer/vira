'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { mockAnalysisResult } from '@/lib/mockData';

interface BlockBarProps {
  value: number;
  color?: string;
}

function BlockBar({ value, color = 'bg-primary' }: BlockBarProps) {
  const filled = Math.round((value / 100) * 10);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={`block-${i}`}
          className={`h-3 flex-1 rounded-sm transition-all duration-700 ${
            i < filled ? color : 'bg-muted'
          }`}
          style={{ transitionDelay: `${i * 60}ms` }}
        />
      ))}
    </div>
  );
}

export default function AnalysisUniqueFeatures() {
  const { scores, contentDNA } = mockAnalysisResult;
  const [weakestFixed, setWeakestFixed] = useState(false);

  const scrollStopMetrics = [
    { label: 'STOP POWER', value: 86, color: 'bg-primary' },
    { label: 'HOOK', value: scores.hook, color: 'bg-positive' },
    { label: 'CLARITY', value: scores.clarity, color: 'bg-accent' },
    { label: 'CTA', value: scores.cta, color: 'bg-warning' },
  ];

  const dnaMetrics = [
    { label: 'Professional', value: contentDNA.professional, color: 'bg-primary' },
    { label: 'Emotional', value: contentDNA.emotional, color: 'bg-pink-500' },
    { label: 'Educational', value: contentDNA.educational, color: 'bg-accent' },
    { label: 'Confident', value: contentDNA.confident, color: 'bg-positive' },
    { label: 'Urgent', value: contentDNA.urgent, color: 'bg-warning' },
    { label: 'Creative', value: contentDNA.creative, color: 'bg-purple-400' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
      {/* 1. Scroll Stop Simulator */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="bg-card border border-border rounded-2xl p-5 card-glow"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="StopCircleIcon" size={14} className="text-primary" />
          </div>
          <h3 className="text-sm font-bold text-foreground">Scroll Stop Simulator</h3>
        </div>
        <p className="text-2xs text-muted-foreground mb-4">AI heuristic quality visualization</p>

        <div className="space-y-3">
          {scrollStopMetrics.map((m) => (
            <div key={`scroll-${m.label}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-2xs font-bold tracking-wider text-muted-foreground">{m.label}</span>
                <span className="text-xs font-bold font-tabular text-foreground">{m.value}%</span>
              </div>
              <BlockBar value={m.value} color={m.color} />
            </div>
          ))}
        </div>
        <p className="text-2xs text-muted-foreground mt-4 pt-3 border-t border-border">
          Not actual platform engagement data
        </p>
      </motion.div>

      {/* 2. Content DNA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-5 card-glow"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
            <Icon name="FingerPrintIcon" size={14} className="text-accent" />
          </div>
          <h3 className="text-sm font-bold text-foreground">Content DNA</h3>
        </div>
        <p className="text-2xs text-muted-foreground mb-4">Your content&apos;s personality profile</p>

        <div className="space-y-3">
          {dnaMetrics.map((m) => (
            <div key={`dna-${m.label}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-foreground">{m.label}</span>
                <span className="text-xs font-bold font-tabular text-muted-foreground">{m.value}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${m.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${m.value}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 3. Weakest Link Detector */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-card border border-warning/30 rounded-2xl p-5 bg-warning/3"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-warning/10 flex items-center justify-center">
            <Icon name="ExclamationTriangleIcon" size={14} className="text-warning" />
          </div>
          <h3 className="text-sm font-bold text-foreground">Weakest Link</h3>
        </div>
        <p className="text-2xs text-muted-foreground mb-5">Your single biggest improvement</p>

        <div className="bg-warning/8 border border-warning/20 rounded-xl p-4 mb-4">
          <p className="text-2xs font-bold uppercase tracking-wider text-warning mb-1">Your Weakest Link</p>
          <p className="text-lg font-extrabold text-foreground mb-1">CTA Strength</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black font-tabular text-warning">58</span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Your CTA is a generic question that doesn&apos;t drive specific action. Fixing this alone could lift your overall score by ~8 points.
        </p>

        {weakestFixed ? (
          <div className="flex items-center gap-2 text-positive text-xs font-semibold">
            <Icon name="CheckCircleIcon" size={14} />
            Opening rewrite assistant...
          </div>
        ) : (
          <Link href="/content-optimizer">
            <button
              onClick={() => setWeakestFixed(true)}
              className="w-full bg-warning/10 border border-warning/30 text-warning text-sm font-bold py-2.5 rounded-xl hover:bg-warning/15 transition-colors active:scale-95"
            >
              Fix This →
            </button>
          </Link>
        )}
      </motion.div>

      {/* 4. AI Content Doctor */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-5 card-glow"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-positive/10 flex items-center justify-center">
            <Icon name="HeartIcon" size={14} className="text-positive" />
          </div>
          <h3 className="text-sm font-bold text-foreground">AI Content Doctor</h3>
        </div>
        <p className="text-2xs text-muted-foreground mb-4">Diagnostic assessment</p>

        <div className="bg-positive/8 border border-positive/20 rounded-xl px-3 py-2 mb-4 flex items-center gap-2">
          <Icon name="CheckBadgeIcon" size={16} className="text-positive" />
          <div>
            <p className="text-2xs font-bold uppercase tracking-wider text-positive">Content Status</p>
            <p className="text-sm font-bold text-foreground">Healthy but improvable</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-2xs font-bold uppercase tracking-wider text-positive mb-1.5">Strengths</p>
            <ul className="space-y-1">
              {['Strong hook', 'Clear topic', 'Good readability', 'Positive tone'].map((s) => (
                <li key={`doctor-strength-${s}`} className="text-xs text-foreground flex items-center gap-2">
                  <Icon name="CheckCircleIcon" size={12} className="text-positive flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-2xs font-bold uppercase tracking-wider text-warning mb-1.5">Issues</p>
            <ul className="space-y-1">
              {['Weak CTA', 'Generic ending', 'Generic hashtags'].map((s) => (
                <li key={`doctor-issue-${s}`} className="text-xs text-foreground flex items-center gap-2">
                  <Icon name="ExclamationCircleIcon" size={12} className="text-warning flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-muted rounded-xl px-3 py-2.5 mt-2">
            <p className="text-2xs font-bold uppercase tracking-wider text-accent mb-1">Prescription</p>
            <p className="text-xs text-foreground leading-relaxed">
              &ldquo;Add a specific action-oriented CTA with a clear benefit statement.&rdquo;
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}