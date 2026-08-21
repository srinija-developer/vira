'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FeatureStat {
  name: string;
  shortName: string;
  uses: number;
  avgScore: number;
  trend: 'up' | 'down' | 'flat';
  trendValue: number;
  category: 'analysis' | 'optimizer' | 'generator';
}

const features: FeatureStat[] = [
  { name: 'Content Analysis',    shortName: 'Analysis',   uses: 47, avgScore: 82, trend: 'up',   trendValue: 8,  category: 'analysis'   },
  { name: 'Hook Battle Arena',   shortName: 'Hook Battle',uses: 38, avgScore: 88, trend: 'up',   trendValue: 12, category: 'analysis'   },
  { name: 'Red Flag Scanner',    shortName: 'Red Flags',  uses: 31, avgScore: 74, trend: 'up',   trendValue: 5,  category: 'analysis'   },
  { name: 'Content X-Ray',       shortName: 'X-Ray',      uses: 29, avgScore: 79, trend: 'flat', trendValue: 0,  category: 'analysis'   },
  { name: 'Golden Sentence',     shortName: 'Golden',     uses: 26, avgScore: 91, trend: 'up',   trendValue: 7,  category: 'analysis'   },
  { name: 'A/B Content Lab',     shortName: 'A/B Lab',    uses: 24, avgScore: 85, trend: 'up',   trendValue: 3,  category: 'optimizer'  },
  { name: 'Content Optimizer',   shortName: 'Optimizer',  uses: 22, avgScore: 77, trend: 'down', trendValue: -2, category: 'optimizer'  },
  { name: 'Audience Persona',    shortName: 'Persona',    uses: 19, avgScore: 83, trend: 'up',   trendValue: 9,  category: 'generator'  },
  { name: 'Content Remix',       shortName: 'Remix',      uses: 17, avgScore: 80, trend: 'up',   trendValue: 15, category: 'generator'  },
  { name: 'Analysis Archive',    shortName: 'Archive',    uses: 14, avgScore: 72, trend: 'flat', trendValue: 1,  category: 'analysis'   },
  { name: 'Content DNA',         shortName: 'DNA',        uses: 12, avgScore: 86, trend: 'down', trendValue: -4, category: 'analysis'   },
  { name: 'Garbage Collector',   shortName: 'Garbage',    uses: 9,  avgScore: 69, trend: 'down', trendValue: -6, category: 'optimizer'  },
];

const maxUses = Math.max(...features.map((f) => f.uses));

function getHeatColor(uses: number, max: number): string {
  const ratio = uses / max;
  if (ratio >= 0.8) return 'bg-primary/90 text-primary-foreground';
  if (ratio >= 0.6) return 'bg-primary/65 text-primary-foreground';
  if (ratio >= 0.4) return 'bg-primary/40 text-foreground';
  if (ratio >= 0.2) return 'bg-primary/20 text-foreground';
  return 'bg-primary/8 text-muted-foreground';
}

function getBarWidth(uses: number, max: number): string {
  return `${Math.round((uses / max) * 100)}%`;
}

const categoryColors: Record<string, string> = {
  analysis:  'bg-primary/15 text-primary border-primary/30',
  optimizer: 'bg-accent/15 text-accent border-accent/30',
  generator: 'bg-positive/15 text-positive border-positive/30',
};

const categoryLabels: Record<string, string> = {
  analysis:  'Analysis',
  optimizer: 'Optimizer',
  generator: 'Generator',
};

type SortKey = 'uses' | 'score';

export default function DashboardFeatureHeatmap() {
  const [sortBy, setSortBy] = useState<SortKey>('uses');
  const [filter, setFilter] = useState<string>('all');

  const filtered = features
    .filter((f) => filter === 'all' || f.category === filter)
    .sort((a, b) => sortBy === 'uses' ? b.uses - a.uses : b.avgScore - a.avgScore);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 card-glow">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
        <div>
          <h2 className="text-base font-bold text-foreground">Feature Performance Heatmap</h2>
          <p className="text-xs text-muted-foreground mt-0.5">AI tool engagement · Last 30 days</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category filter */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1">
            {['all', 'analysis', 'optimizer', 'generator'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 capitalize ${
                  filter === cat
                    ? 'bg-card border border-border text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat === 'all' ? 'All' : categoryLabels[cat]}
              </button>
            ))}
          </div>
          {/* Sort */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1">
            {(['uses', 'score'] as SortKey[]).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  sortBy === s
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s === 'uses' ? 'By Usage' : 'By Score'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-6">
        {filtered.map((feat, i) => (
          <motion.div
            key={feat.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
            className={`rounded-xl p-3 ${getHeatColor(feat.uses, maxUses)} border border-white/10 relative overflow-hidden`}
          >
            <div className="flex items-start justify-between mb-1.5">
              <span className="text-xs font-semibold leading-tight">{feat.shortName}</span>
              <span className={`text-2xs font-bold px-1.5 py-0.5 rounded-full border ${categoryColors[feat.category]}`}>
                {categoryLabels[feat.category][0]}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold font-tabular leading-none">{feat.uses}</span>
              <span className="text-2xs opacity-70">uses</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-2xs opacity-70">Score:</span>
              <span className="text-2xs font-bold font-tabular">{feat.avgScore}</span>
              <span
                className={`text-2xs font-semibold ml-auto ${
                  feat.trend === 'up' ? 'text-positive' : feat.trend === 'down' ? 'text-negative' : 'opacity-50'
                }`}
              >
                {feat.trend === 'up' ? `↑${feat.trendValue}%` : feat.trend === 'down' ? `↓${Math.abs(feat.trendValue)}%` : '→'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bar chart breakdown */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Usage Breakdown</p>
        {filtered.slice(0, 6).map((feat, i) => (
          <motion.div
            key={feat.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex items-center gap-3"
          >
            <span className="text-xs text-muted-foreground w-24 shrink-0 truncate">{feat.shortName}</span>
            <div className="flex-1 h-2 bg-muted/40 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: getBarWidth(feat.uses, maxUses) }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: 'easeOut' }}
                className="h-full rounded-full bg-primary"
              />
            </div>
            <span className="text-xs font-bold font-tabular text-foreground w-6 text-right shrink-0">{feat.uses}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
