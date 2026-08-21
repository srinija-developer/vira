'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import Badge from '@/components/ui/Badge';
import { mockAnalysisResult } from '@/lib/mockData';
import type { Priority } from '@/types/analysis';

interface OptimizerSuggestionsProps {
  appliedSuggestions: Set<string>;
  onApply: (id: string, replacement: string) => void;
}

const rewriteModes = [
  { id: 'mode-hook', label: 'Improve Hook', icon: 'BoltIcon', color: 'text-primary' },
  { id: 'mode-engaging', label: 'More Engaging', icon: 'SparklesIcon', color: 'text-accent' },
  { id: 'mode-professional', label: 'Professional', icon: 'BriefcaseIcon', color: 'text-foreground' },
  { id: 'mode-shorter', label: 'Make Shorter', icon: 'ArrowsPointingInIcon', color: 'text-warning' },
  { id: 'mode-emotional', label: 'More Emotional', icon: 'HeartIcon', color: 'text-pink-400' },
  { id: 'mode-conversational', label: 'Conversational', icon: 'ChatBubbleLeftRightIcon', color: 'text-positive' },
  { id: 'mode-viral', label: 'Viral-Style', icon: 'FireIcon', color: 'text-orange-400' },
  { id: 'mode-cta', label: 'Add Strong CTA', icon: 'CursorArrowRaysIcon', color: 'text-accent' },
  { id: 'mode-grammar', label: 'Fix Grammar', icon: 'CheckCircleIcon', color: 'text-positive' },
  { id: 'mode-simplify', label: 'Simplify', icon: 'MinusCircleIcon', color: 'text-muted-foreground' },
  { id: 'mode-story', label: 'Storytelling', icon: 'BookOpenIcon', color: 'text-purple-400' },
];

const priorityConfig: Record<Priority, { variant: 'high' | 'medium' | 'low' }> = {
  HIGH: { variant: 'high' },
  MEDIUM: { variant: 'medium' },
  LOW: { variant: 'low' },
};

export default function OptimizerSuggestions({ appliedSuggestions, onApply }: OptimizerSuggestionsProps) {
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [customInstruction, setCustomInstruction] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { recommendations } = mockAnalysisResult;

  const handleModeClick = (modeId: string) => {
    setActiveMode(modeId === activeMode ? null : modeId);
    setIsGenerating(true);
    // Backend integration point: POST /api/rewrite with { mode: modeId, content }
    setTimeout(() => setIsGenerating(false), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col h-full card-glow"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2 mb-0.5">
          <Icon name="SparklesIcon" size={16} className="text-primary" />
          <span className="text-sm font-bold text-foreground">AI Suggestions</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {recommendations.length - appliedSuggestions.size} improvements remaining
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Rewrite Modes */}
        <div className="p-4 border-b border-border">
          <p className="text-2xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Rewrite Studio</p>
          <div className="flex flex-wrap gap-2">
            {rewriteModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleModeClick(mode.id)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all duration-150 active:scale-95 ${
                  activeMode === mode.id
                    ? 'bg-primary/10 border-primary/30 text-primary' :'bg-muted border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Icon name={mode.icon as Parameters<typeof Icon>[0]['name']} size={12} className={activeMode === mode.id ? 'text-primary' : mode.color} />
                {mode.label}
              </button>
            ))}
          </div>

          {/* Custom instruction */}
          <div className="mt-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                placeholder="Custom instruction..."
                className="input-base text-xs flex-1 py-2"
                aria-label="Custom rewrite instruction"
              />
              <button
                disabled={!customInstruction.trim()}
                className="bg-primary text-white text-xs font-bold px-3 py-2 rounded-xl disabled:opacity-40 hover:opacity-90 transition-opacity active:scale-95"
              >
                <Icon name="PaperAirplaneIcon" size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Generating state */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 py-3 border-b border-border bg-primary/5"
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span className="text-xs font-medium text-primary">Generating rewrite...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommendations */}
        <div className="p-4 space-y-3">
          <p className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">Priority Fixes</p>
          {recommendations.map((rec) => {
            const isApplied = appliedSuggestions.has(rec.id);
            return (
              <motion.div
                key={rec.id}
                layout
                className={`border rounded-xl p-4 transition-all duration-200 ${
                  isApplied
                    ? 'border-positive/20 bg-positive/5 opacity-60' :'border-border hover:border-primary/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className={`text-sm font-semibold ${isApplied ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {rec.what}
                  </p>
                  <Badge variant={isApplied ? 'high' : priorityConfig[rec.priority].variant}>
                    {isApplied ? '✓' : rec.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{rec.suggestion}</p>
                {!isApplied && (
                  <button
                    onClick={() => onApply(rec.id, rec.suggestion)}
                    className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary/15 transition-colors active:scale-95"
                  >
                    <Icon name="PlusIcon" size={12} />
                    Apply to Editor
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}