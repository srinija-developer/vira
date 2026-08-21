'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';

// Mini sparkline data per stat (last 7 data points, normalized 0-100)
const sparklines: Record<string, number[]> = {
  'stat-analyzed':    [10, 14, 12, 18, 20, 21, 24],
  'stat-engagement':  [68, 70, 72, 69, 73, 74, 76],
  'stat-hook':        [76, 78, 79, 80, 81, 80, 82],
  'stat-improvements':[30, 35, 38, 40, 42, 45, 47],
};

// Velocity: points gained per period
const velocities: Record<string, { value: number; label: string; direction: 'up' | 'down' | 'flat' }> = {
  'stat-analyzed':    { value: 3,  label: '+3/wk',  direction: 'up'   },
  'stat-engagement':  { value: 4,  label: '+4 pts',  direction: 'up'   },
  'stat-hook':        { value: 2,  label: '+2 pts',  direction: 'up'   },
  'stat-improvements':{ value: 0,  label: '~steady', direction: 'flat' },
};

const stats = [
  {
    id: 'stat-analyzed',
    label: 'Content Analyzed',
    value: '24',
    change: '+3 this week',
    trend: 'up',
    icon: 'DocumentTextIcon',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    sparkColor: 'var(--primary)',
  },
  {
    id: 'stat-engagement',
    label: 'Avg Engagement Score',
    value: '76',
    suffix: '/100',
    change: '+4 vs last week',
    trend: 'up',
    icon: 'ChartBarSquareIcon',
    color: 'text-positive',
    bg: 'bg-positive/10',
    border: 'border-positive/20',
    sparkColor: 'var(--positive)',
  },
  {
    id: 'stat-hook',
    label: 'Avg Hook Score',
    value: '82',
    suffix: '/100',
    change: '+2 vs last week',
    trend: 'up',
    icon: 'BoltIcon',
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/20',
    sparkColor: 'var(--accent)',
  },
  {
    id: 'stat-improvements',
    label: 'Improvements Generated',
    value: '47',
    change: '2 unreviewed',
    trend: 'warning',
    icon: 'SparklesIcon',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    sparkColor: 'var(--warning)',
  },
];

// SVG mini sparkline renderer
function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const w = 64;
  const h = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });

  const polyline = points.join(' ');
  const lastPoint = points[points.length - 1].split(',');
  const lx = parseFloat(lastPoint[0]);
  const ly = parseFloat(lastPoint[1]);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" className="overflow-visible">
      <polyline
        points={polyline}
        stroke={color}
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.8}
      />
      <circle cx={lx} cy={ly} r="2.5" fill={color} opacity={1} />
    </svg>
  );
}

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const vel = velocities[stat.id];
        const spark = sparklines[stat.id];
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className={`bg-card border ${stat.border} rounded-2xl p-5 card-glow relative overflow-hidden`}
          >
            {/* Top row: icon + change badge */}
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <Icon
                  name={stat.icon as Parameters<typeof Icon>[0]['name']}
                  size={18}
                  className={stat.color}
                />
              </div>
              <span
                className={`text-2xs font-semibold px-2 py-0.5 rounded-full ${
                  stat.trend === 'up' ?'text-positive bg-positive/10'
                    : stat.trend === 'warning' ?'text-warning bg-warning/10' :'text-negative bg-negative/10'
                }`}
              >
                {stat.change}
              </span>
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-1 mb-1">
              <span className={`text-3xl font-extrabold font-tabular ${stat.color}`}>
                {stat.value}
              </span>
              {stat.suffix && (
                <span className="text-sm text-muted-foreground font-medium">{stat.suffix}</span>
              )}
            </div>
            <p className="text-xs font-medium text-muted-foreground mb-3">{stat.label}</p>

            {/* Sparkline + velocity row */}
            <div className="flex items-end justify-between">
              <MiniSparkline data={spark} color={stat.sparkColor} />
              {/* Velocity indicator */}
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-2xs text-muted-foreground font-medium">velocity</span>
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold ${
                    vel.direction === 'up' ?'bg-positive/10 text-positive'
                      : vel.direction === 'down' ?'bg-negative/10 text-negative' :'bg-muted/50 text-muted-foreground'
                  }`}
                >
                  {vel.direction === 'up' ? '▲' : vel.direction === 'down' ? '▼' : '●'}
                  <span>{vel.label}</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}