'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import Badge from '@/components/ui/Badge';
import { mockRecentAnalyses } from '@/lib/mockData';

// Backend integration point: fetch GET /api/history for real analysis list
const analyses = mockRecentAnalyses;

const platformColors: Record<string, string> = {
  LinkedIn: 'text-accent border-accent/30 bg-accent/10',
  Instagram: 'text-pink-400 border-pink-400/30 bg-pink-400/10',
  'X/Twitter': 'text-foreground border-border bg-muted',
  Facebook: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  General: 'text-muted-foreground border-border bg-muted',
};

function getScoreVariant(score: number): 'high' | 'medium' | 'low' {
  if (score >= 75) return 'high';
  if (score >= 55) return 'medium';
  return 'low';
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function DashboardRecentAnalyses() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-foreground">Recent Analyses</h2>
        <Link
          href="/content-analysis-results"
          className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
        >
          View all <Icon name="ArrowRightIcon" size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
        {analyses.map((analysis, i) => (
          <motion.div
            key={analysis.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
          >
            <Link href="/content-analysis-results">
              <div className="bg-card border border-border rounded-2xl p-5 card-glow hover:card-glow-active transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Icon
                        name={analysis.fileType === 'pdf' ? 'DocumentTextIcon' : 'PhotoIcon'}
                        size={16}
                        className="text-muted-foreground"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate max-w-[140px]">
                        {analysis.filename}
                      </p>
                      <p className="text-2xs text-muted-foreground">{formatDate(analysis.uploadedAt)}</p>
                    </div>
                  </div>
                  <Badge variant={getScoreVariant(analysis.overallScore)}>
                    {analysis.overallScore}
                  </Badge>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-2xs font-semibold px-2 py-0.5 rounded-full border ${platformColors[analysis.platform]}`}>
                    {analysis.platform}
                  </span>
                  <span className="text-2xs font-medium text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full">
                    {analysis.contentType}
                  </span>
                  <span className="text-2xs font-medium text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full uppercase">
                    {analysis.fileType}
                  </span>
                </div>

                {/* Score bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xs text-muted-foreground font-medium">Engagement Score</span>
                    <span className="text-2xs font-bold font-tabular text-foreground">
                      {analysis.overallScore}/100
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${analysis.overallScore}%`,
                        backgroundColor:
                          analysis.overallScore >= 75
                            ? 'var(--positive)'
                            : analysis.overallScore >= 55
                            ? 'var(--warning)'
                            : 'var(--negative)',
                      }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}