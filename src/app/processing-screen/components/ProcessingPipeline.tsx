'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';

interface Stage {
  id: string;
  number: string;
  label: string;
  description: string;
  icon: string;
  duration: number;
}

const stages: Stage[] = [
  {
    id: 'stage-read',
    number: '01',
    label: 'Reading content',
    description: 'Loading file into memory and validating format integrity',
    icon: 'DocumentArrowUpIcon',
    duration: 1200,
  },
  {
    id: 'stage-extract',
    number: '02',
    label: 'Extracting text',
    description: 'Running PDF.js parser / Tesseract OCR with image preprocessing',
    icon: 'MagnifyingGlassIcon',
    duration: 1800,
  },
  {
    id: 'stage-structure',
    number: '03',
    label: 'Understanding structure',
    description: 'Identifying paragraphs, headings, CTAs, and content sections',
    icon: 'RectangleGroupIcon',
    duration: 1200,
  },
  {
    id: 'stage-tone',
    number: '04',
    label: 'Detecting tone',
    description: 'Classifying tone, sentiment, and emotional signals',
    icon: 'FaceSmileIcon',
    duration: 1400,
  },
  {
    id: 'stage-engagement',
    number: '05',
    label: 'Evaluating engagement',
    description: 'Scoring hook strength, readability, CTA, and originality',
    icon: 'ChartBarSquareIcon',
    duration: 1600,
  },
  {
    id: 'stage-recommendations',
    number: '06',
    label: 'Generating recommendations',
    description: 'Building prioritized improvement suggestions with AI',
    icon: 'SparklesIcon',
    duration: 1400,
  },
];

export default function ProcessingPipeline() {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState(0);
  const [completedStages, setCompletedStages] = useState<Set<number>>(new Set());
  const [overallProgress, setOverallProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let stageIndex = 0;
    let totalElapsed = 0;
    const totalDuration = stages.reduce((sum, s) => sum + s.duration, 0);

    const runStage = () => {
      if (stageIndex >= stages.length) {
        setIsComplete(true);
        setOverallProgress(100);
        setTimeout(() => router.push('/content-analysis-results'), 1200);
        return;
      }

      setCurrentStage(stageIndex);
      const stageDuration = stages[stageIndex].duration;

      // Animate progress during this stage
      const startProgress = Math.round((totalElapsed / totalDuration) * 100);
      const endProgress = Math.round(((totalElapsed + stageDuration) / totalDuration) * 100);
      const steps = 20;
      let step = 0;

      const progressInterval = setInterval(() => {
        step++;
        const p = Math.round(startProgress + ((endProgress - startProgress) * step) / steps);
        setOverallProgress(Math.min(p, 99));
        if (step >= steps) clearInterval(progressInterval);
      }, stageDuration / steps);

      setTimeout(() => {
        setCompletedStages((prev) => new Set([...prev, stageIndex]));
        totalElapsed += stageDuration;
        stageIndex++;
        runStage();
      }, stageDuration);
    };

    runStage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (overallProgress / 100) * circumference;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-card border border-border rounded-3xl p-8 md:p-10 card-glow"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={isComplete ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
          >
            {isComplete ? (
              <Icon name="CheckCircleIcon" size={14} className="text-positive" />
            ) : (
              <Icon name="SparklesIcon" size={14} className="animate-pulse" />
            )}
            {isComplete ? 'Analysis Complete!' : 'Analyzing Your Content'}
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isComplete ? 'Your report is ready' : 'VIRA is reading your content'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isComplete
              ? 'Redirecting to your intelligence report...' :'Running 6-stage content intelligence pipeline'}
          </p>
        </div>

        {/* Progress Ring */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32">
            <svg width="128" height="128" className="-rotate-90">
              <circle cx="64" cy="64" r="54" fill="none" stroke="var(--muted)" strokeWidth="8" />
              <circle
                cx="64"
                cy="64"
                r="54"
                fill="none"
                stroke={isComplete ? 'var(--positive)' : 'var(--primary)'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 0.3s ease, stroke 0.5s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`progress-${overallProgress}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-2xl font-black font-tabular text-foreground"
                >
                  {overallProgress}%
                </motion.span>
              </AnimatePresence>
              <span className="text-2xs text-muted-foreground font-medium mt-0.5">complete</span>
            </div>
          </div>
        </div>

        {/* Stages */}
        <div className="space-y-3">
          {stages.map((stage, i) => {
            const isDone = completedStages.has(i);
            const isActive = currentStage === i && !isDone;
            const isPending = !isDone && !isActive;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                  isDone
                    ? 'stage-complete'
                    : isActive
                    ? 'stage-active' :'stage-pending opacity-50'
                }`}
              >
                {/* Stage indicator */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isDone
                      ? 'bg-positive/20'
                      : isActive
                      ? 'bg-primary/20' :'bg-muted'
                  }`}
                >
                  {isDone ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <Icon name="CheckIcon" size={16} className="text-positive" />
                    </motion.div>
                  ) : isActive ? (
                    <Icon name={stage.icon as Parameters<typeof Icon>[0]['name']} size={16} className="text-primary animate-pulse" />
                  ) : (
                    <span className="text-xs font-bold font-tabular text-muted-foreground">{stage.number}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm font-semibold ${
                        isDone ? 'text-positive' : isActive ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {stage.label}
                    </p>
                    {isActive && (
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        className="text-2xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full"
                      >
                        Running
                      </motion.span>
                    )}
                  </div>
                  {(isDone || isActive) && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{stage.description}</p>
                  )}
                </div>

                {/* Active spinner */}
                {isActive && (
                  <div className="flex-shrink-0">
                    <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* File info */}
        <div className="mt-6 pt-5 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Icon name="DocumentTextIcon" size={14} />
            <span>linkedin-post-q3-campaign.pdf</span>
          </div>
          <span>LinkedIn · Post</span>
        </div>
      </motion.div>
    </div>
  );
}