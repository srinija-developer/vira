'use client';
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import OptimizerEditor from './OptimizerEditor';
import OptimizerSuggestions from './OptimizerSuggestions';
import OptimizerLiveScores from './OptimizerLiveScores';
import { mockAnalysisResult } from '@/lib/mockData';

// Backend integration point: POST /api/optimize with edited content for live score recalculation

export interface LiveScores {
  hook: number;
  clarity: number;
  readability: number;
  cta: number;
  overall: number;
}

function recalculateScores(text: string, base: LiveScores): LiveScores {
  // Simple heuristic recalculation based on text changes
  // Backend integration point: replace with POST /api/analyze for real AI scoring
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const hasQuestion = text.includes('?');
  const hasBullets = text.includes('→') || text.includes('•') || text.includes('-');
  const hasNumber = /\d+/.test(text);
  const hasHashtag = /#\w+/.test(text);
  const hasCTA = /\b(share|comment|reply|drop|tell|let me know|what do you|dm me)\b/i.test(text);

  const delta = {
    hook: (hasNumber ? 3 : 0) + (wordCount > 10 && wordCount < 30 ? 2 : 0),
    clarity: (hasBullets ? 4 : 0) + (wordCount < 200 ? 2 : -2),
    readability: wordCount > 50 && wordCount < 180 ? 2 : -1,
    cta: (hasQuestion ? 4 : 0) + (hasCTA ? 6 : 0),
    overall: 0,
  };

  const newScores = {
    hook: Math.min(100, Math.max(0, base.hook + delta.hook)),
    clarity: Math.min(100, Math.max(0, base.clarity + delta.clarity)),
    readability: Math.min(100, Math.max(0, base.readability + delta.readability)),
    cta: Math.min(100, Math.max(0, base.cta + delta.cta)),
    overall: 0,
  };
  newScores.overall = Math.round(
    (newScores.hook * 0.25 + newScores.clarity * 0.2 + newScores.readability * 0.2 + newScores.cta * 0.2 + base.hook * 0.15) / 1
  );
  newScores.overall = Math.min(100, Math.max(0, Math.round(
    (newScores.hook + newScores.clarity + newScores.readability + newScores.cta) / 4
  )));

  return newScores;
}

export default function OptimizerLayout() {
  const originalText = mockAnalysisResult.extractedText;
  const baseScores: LiveScores = {
    hook: mockAnalysisResult.scores.hook,
    clarity: mockAnalysisResult.scores.clarity,
    readability: mockAnalysisResult.scores.readability,
    cta: mockAnalysisResult.scores.cta,
    overall: mockAnalysisResult.scores.overall,
  };

  const [content, setContent] = useState(originalText);
  const [liveScores, setLiveScores] = useState<LiveScores>(baseScores);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());

  const handleContentChange = useCallback(
    (newText: string) => {
      setContent(newText);
      const newScores = recalculateScores(newText, baseScores);
      setLiveScores(newScores);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleApplySuggestion = useCallback((id: string, replacement: string) => {
    setContent((prev) => {
      const newText = prev + '\n\n' + replacement;
      const newScores = recalculateScores(newText, baseScores);
      setLiveScores(newScores);
      return newText;
    });
    setAppliedSuggestions((prev) => new Set([...prev, id]));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = useCallback(() => {
    setContent(originalText);
    setLiveScores(baseScores);
    setAppliedSuggestions(new Set());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalText]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[calc(100vh-16rem)]"
    >
      {/* LEFT: Editor */}
      <div className="lg:col-span-5 xl:col-span-5 2xl:col-span-5">
        <OptimizerEditor
          content={content}
          originalContent={originalText}
          onChange={handleContentChange}
          onReset={handleReset}
        />
      </div>

      {/* CENTER: Suggestions */}
      <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-4">
        <OptimizerSuggestions
          appliedSuggestions={appliedSuggestions}
          onApply={handleApplySuggestion}
        />
      </div>

      {/* RIGHT: Live Scores */}
      <div className="lg:col-span-3 xl:col-span-3 2xl:col-span-3">
        <OptimizerLiveScores
          scores={liveScores}
          baseScores={baseScores}
          appliedCount={appliedSuggestions.size}
        />
      </div>
    </motion.div>
  );
}