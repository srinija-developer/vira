'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import Badge from '@/components/ui/Badge';
import { mockAnalysisResult } from '@/lib/mockData';

const platformColors: Record<string, string> = {
  LinkedIn: 'text-accent border-accent/30 bg-accent/10',
  Instagram: 'text-pink-400 border-pink-400/30 bg-pink-400/10',
  'X/Twitter': 'text-foreground border-border bg-muted',
  Facebook: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  General: 'text-muted-foreground border-border bg-muted',
};

export default function AnalysisResultsHeader() {
  const analysis = mockAnalysisResult;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-2xl p-6 card-glow"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <Icon name="DocumentTextIcon" size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground mb-1">{analysis.filename}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${platformColors[analysis.platform]}`}>
                {analysis.platform}
              </span>
              <Badge variant="default">{analysis.contentType}</Badge>
              <Badge variant="default">{analysis.fileType.toUpperCase()}</Badge>
              {analysis.pageCount && (
                <span className="text-xs text-muted-foreground">{analysis.pageCount} page · {analysis.characterCount.toLocaleString()} chars</span>
              )}
              {analysis.ocrConfidence && (
                <span className="text-xs font-semibold text-positive bg-positive/10 border border-positive/20 px-2 py-0.5 rounded-full">
                  {analysis.ocrConfidence}% confidence
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/content-optimizer" className="btn-primary text-sm flex items-center gap-2 py-2.5">
            <Icon name="BoltIcon" size={15} />
            Optimize Content
          </Link>
          <button className="btn-secondary text-sm flex items-center gap-2 py-2.5">
            <Icon name="ArrowDownTrayIcon" size={15} />
            Export PDF
          </button>
          <button className="btn-ghost text-sm flex items-center gap-2 py-2.5">
            <Icon name="ShareIcon" size={15} />
            Share
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
        <Icon name="InformationCircleIcon" size={14} className="text-muted-foreground flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">AI Content Quality Estimate</span> — Scores reflect content quality heuristics, not actual platform engagement predictions.
        </p>
      </div>
    </motion.div>
  );
}