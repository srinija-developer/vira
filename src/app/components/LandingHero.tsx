'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import ScoreRing from '@/components/ui/ScoreRing';
import MetricBar from '@/components/ui/MetricBar';

const floatingCards = [
  {
    id: 'card-hook',
    label: 'Hook Score',
    value: 91,
    icon: 'BoltIcon',
    color: 'text-positive',
    bg: 'bg-positive/10',
    delay: 0,
    position: 'top-[12%] left-[2%] xl:left-[8%]',
  },
  {
    id: 'card-readability',
    label: 'Readability',
    value: 88,
    icon: 'DocumentTextIcon',
    color: 'text-accent',
    bg: 'bg-accent/10',
    delay: 0.4,
    position: 'top-[40%] left-[0%] xl:left-[4%]',
  },
  {
    id: 'card-cta',
    label: 'CTA Strength',
    value: 72,
    icon: 'CursorArrowRaysIcon',
    color: 'text-warning',
    bg: 'bg-warning/10',
    delay: 0.8,
    position: 'top-[12%] right-[2%] xl:right-[8%]',
  },
  {
    id: 'card-sentiment',
    label: 'Sentiment',
    value: 'Positive',
    icon: 'FaceSmileIcon',
    color: 'text-positive',
    bg: 'bg-positive/10',
    delay: 1.2,
    position: 'top-[40%] right-[0%] xl:right-[4%]',
  },
];

const subScores = [
  { label: 'Hook', score: 91 },
  { label: 'Clarity', score: 86 },
  { label: 'Emotion', score: 78 },
  { label: 'Readability', score: 88 },
  { label: 'CTA', score: 72 },
];

export default function LandingHero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden bg-gradient-hero bg-grid-pattern">
      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-20 blur-[120px] bg-primary pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full opacity-15 blur-[80px] bg-accent pointer-events-none" />

      {/* Floating score cards */}
      {floatingCards.map((card) => (
        <motion.div
          key={card.id}
          className={`absolute ${card.position} hidden lg:block z-10`}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: card.delay + 0.8, duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4 + card.delay, repeat: Infinity, ease: 'easeInOut' }}
            className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl px-4 py-3 shadow-xl min-w-[140px]"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-7 h-7 rounded-lg ${card.bg} flex items-center justify-center`}>
                <Icon name={card.icon as Parameters<typeof Icon>[0]['name']} size={14} className={card.color} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
            </div>
            <div className={`text-xl font-bold font-tabular ${card.color}`}>
              {typeof card.value === 'number' ? card.value : card.value}
              {typeof card.value === 'number' && <span className="text-sm font-medium text-muted-foreground">/100</span>}
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* Main hero content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
        >
          <Icon name="SparklesIcon" size={14} />
          AI Content Intelligence
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
        >
          Your content deserves{' '}
          <span className="text-gradient-primary">more than a scroll.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Upload any social media content — PDF or image — and get an instant AI-powered analysis with engagement scores, improvement suggestions, and AI rewrites.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/content-upload-studio"
            className="btn-primary text-base px-8 py-4 flex items-center gap-2 glow-violet"
          >
            <Icon name="ArrowUpTrayIcon" size={18} />
            Analyze My Content Free
          </Link>
          <Link
            href="/dashboard"
            className="btn-secondary text-base px-8 py-4 flex items-center gap-2"
          >
            <Icon name="PlayIcon" size={18} />
            Try Demo
          </Link>
        </motion.div>

        {/* Mock Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative mx-auto max-w-3xl"
        >
          <div className="bg-card/60 backdrop-blur-md border border-border rounded-3xl p-6 shadow-2xl">
            {/* Mini header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-negative/70" />
                <div className="w-3 h-3 rounded-full bg-warning/70" />
                <div className="w-3 h-3 rounded-full bg-positive/70" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">AI Content Quality Estimate</span>
              <span className="badge-score-high text-xs">82 / 100</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Score Ring */}
              <div className="flex flex-col items-center justify-center bg-muted/30 rounded-2xl p-4">
                <ScoreRing score={82} size={120} strokeWidth={8} />
                <p className="text-xs text-muted-foreground mt-2 font-medium">Overall Score</p>
              </div>

              {/* Sub scores */}
              <div className="md:col-span-2 space-y-3">
                {subScores.map((s) => (
                  <MetricBar key={`hero-metric-${s.label}`} label={s.label} score={s.score} height={5} />
                ))}
              </div>
            </div>

            {/* Bottom row */}
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-3">
              {[
                { label: 'Tone', value: 'Inspirational', color: 'text-primary' },
                { label: 'Sentiment', value: 'Positive', color: 'text-positive' },
                { label: 'Platform Fit', value: 'LinkedIn ✓', color: 'text-accent' },
              ].map((item) => (
                <div key={`hero-stat-${item.label}`} className="text-center">
                  <p className="text-2xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 text-xs text-muted-foreground"
        >
          Supports PDF, PNG, JPG, JPEG · No sign-up required · Results in seconds
        </motion.p>
      </div>
    </section>
  );
}