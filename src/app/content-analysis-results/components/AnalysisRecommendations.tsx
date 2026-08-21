'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import Badge from '@/components/ui/Badge';
import { mockAnalysisResult } from '@/lib/mockData';
import type { Priority } from '@/types/analysis';

const priorityConfig: Record<Priority, { variant: 'high' | 'medium' | 'low'; label: string; icon: string }> = {
  HIGH: { variant: 'high', label: 'HIGH', icon: 'ExclamationCircleIcon' },
  MEDIUM: { variant: 'medium', label: 'MEDIUM', icon: 'MinusCircleIcon' },
  LOW: { variant: 'low', label: 'LOW', icon: 'InformationCircleIcon' },
};

export default function AnalysisRecommendations() {
  const { recommendations } = mockAnalysisResult;
  const [expanded, setExpanded] = useState<string | null>('rec-001');
  const [appliedRecs, setAppliedRecs] = useState<Set<string>>(new Set());

  const toggleRec = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const applyRec = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAppliedRecs((prev) => new Set([...prev, id]));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-2xl p-6 card-glow"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Icon name="SparklesIcon" size={18} className="text-primary" />
            AI Recommendations
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {recommendations.length} prioritized improvements · Apply directly in the Optimizer
          </p>
        </div>
        <Link href="/content-optimizer" className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
          <Icon name="BoltIcon" size={14} />
          Open Optimizer
        </Link>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, i) => {
          const config = priorityConfig[rec.priority];
          const isExpanded = expanded === rec.id;
          const isApplied = appliedRecs.has(rec.id);

          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className={`border rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${
                isApplied
                  ? 'border-positive/30 bg-positive/5'
                  : isExpanded
                  ? 'border-primary/30 bg-primary/3' :'border-border hover:border-primary/20 hover:bg-primary/2'
              }`}
              onClick={() => toggleRec(rec.id)}
            >
              <div className="flex items-center gap-4 p-4">
                <div className="flex-shrink-0">
                  {isApplied ? (
                    <div className="w-8 h-8 rounded-lg bg-positive/20 flex items-center justify-center">
                      <Icon name="CheckIcon" size={16} className="text-positive" />
                    </div>
                  ) : (
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      rec.priority === 'HIGH' ? 'bg-negative/10' : rec.priority === 'MEDIUM' ? 'bg-warning/10' : 'bg-muted'
                    }`}>
                      <Icon
                        name={config.icon as Parameters<typeof Icon>[0]['name']}
                        size={16}
                        className={rec.priority === 'HIGH' ? 'text-negative' : rec.priority === 'MEDIUM' ? 'text-warning' : 'text-muted-foreground'}
                      />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-bold ${isApplied ? 'text-positive line-through opacity-60' : 'text-foreground'}`}>
                      {rec.what}
                    </p>
                    <Badge variant={isApplied ? 'high' : config.variant}>
                      {isApplied ? '✓ Applied' : config.label}
                    </Badge>
                    <span className="text-2xs font-semibold text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full">
                      {rec.category}
                    </span>
                  </div>
                </div>

                <Icon
                  name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                  size={16}
                  className="text-muted-foreground flex-shrink-0"
                />
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3 border-t border-border pt-4">
                      <div>
                        <p className="text-2xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Why It Matters</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{rec.why}</p>
                      </div>
                      <div className="bg-muted rounded-xl p-4">
                        <p className="text-2xs font-bold uppercase tracking-wider text-accent mb-2">Suggestion</p>
                        <p className="text-sm text-foreground leading-relaxed font-medium">{rec.suggestion}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {!isApplied && (
                          <button
                            onClick={(e) => applyRec(rec.id, e)}
                            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                          >
                            <Icon name="CheckIcon" size={13} />
                            Mark Applied
                          </button>
                        )}
                        <Link
                          href="/content-optimizer"
                          onClick={(e) => e.stopPropagation()}
                          className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
                        >
                          <Icon name="PencilSquareIcon" size={13} />
                          Fix in Optimizer
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}