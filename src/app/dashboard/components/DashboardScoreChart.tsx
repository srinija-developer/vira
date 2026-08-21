'use client';
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Mock trend data for 30/60/90 day windows
const trendData30 = [
  { label: 'Jul 22', score: 61, hook: 65, engagement: 58 },
  { label: 'Jul 25', score: 67, hook: 70, engagement: 63 },
  { label: 'Jul 28', score: 63, hook: 66, engagement: 60 },
  { label: 'Aug 1',  score: 71, hook: 74, engagement: 68 },
  { label: 'Aug 5',  score: 74, hook: 78, engagement: 70 },
  { label: 'Aug 8',  score: 69, hook: 72, engagement: 66 },
  { label: 'Aug 12', score: 78, hook: 82, engagement: 74 },
  { label: 'Aug 15', score: 75, hook: 79, engagement: 72 },
  { label: 'Aug 18', score: 82, hook: 86, engagement: 78 },
  { label: 'Aug 21', score: 85, hook: 89, engagement: 81 },
];

const trendData60 = [
  { label: 'Jun 22', score: 52, hook: 55, engagement: 49 },
  { label: 'Jun 27', score: 57, hook: 60, engagement: 54 },
  { label: 'Jul 2',  score: 55, hook: 58, engagement: 52 },
  { label: 'Jul 7',  score: 60, hook: 63, engagement: 57 },
  { label: 'Jul 12', score: 63, hook: 67, engagement: 60 },
  { label: 'Jul 17', score: 61, hook: 64, engagement: 58 },
  { label: 'Jul 22', score: 67, hook: 70, engagement: 64 },
  { label: 'Jul 27', score: 70, hook: 74, engagement: 67 },
  { label: 'Aug 1',  score: 71, hook: 75, engagement: 68 },
  { label: 'Aug 6',  score: 74, hook: 78, engagement: 71 },
  { label: 'Aug 11', score: 78, hook: 82, engagement: 75 },
  { label: 'Aug 16', score: 80, hook: 84, engagement: 77 },
  { label: 'Aug 21', score: 85, hook: 89, engagement: 81 },
];

const trendData90 = [
  { label: 'May 23', score: 44, hook: 47, engagement: 41 },
  { label: 'Jun 2',  score: 48, hook: 51, engagement: 45 },
  { label: 'Jun 12', score: 51, hook: 54, engagement: 48 },
  { label: 'Jun 22', score: 54, hook: 57, engagement: 51 },
  { label: 'Jul 2',  score: 57, hook: 60, engagement: 54 },
  { label: 'Jul 12', score: 61, hook: 65, engagement: 58 },
  { label: 'Jul 22', score: 65, hook: 69, engagement: 62 },
  { label: 'Aug 1',  score: 71, hook: 75, engagement: 68 },
  { label: 'Aug 11', score: 78, hook: 82, engagement: 75 },
  { label: 'Aug 21', score: 85, hook: 89, engagement: 81 },
];

type Range = '30' | '60' | '90';

const rangeMap: Record<Range, typeof trendData30> = {
  '30': trendData30,
  '60': trendData60,
  '90': trendData90,
};

interface TooltipPayload {
  value: number;
  name: string;
  color: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-xl min-w-[140px]">
      <p className="text-xs text-muted-foreground mb-2 font-medium">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
            <span className="text-xs text-muted-foreground capitalize">{p.name}</span>
          </div>
          <span className="text-xs font-bold font-tabular" style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardScoreChart() {
  const [range, setRange] = useState<Range>('30');
  const data = rangeMap[range];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 card-glow">
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-base font-bold text-foreground">Score Trend Lines</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Overall · Hook · Engagement quality over time</p>
        </div>
        {/* 30/60/90 day selector */}
        <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1">
          {(['30', '60', '90'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                range === r
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[35, 100]}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1 }} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
              formatter={(value) => (
                <span style={{ color: 'var(--muted-foreground)', fontWeight: 500, textTransform: 'capitalize' }}>
                  {value}
                </span>
              )}
            />
            <Line
              type="monotone"
              dataKey="score"
              name="overall"
              stroke="var(--primary)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: 'var(--primary)', stroke: 'var(--card)', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="hook"
              name="hook"
              stroke="var(--accent)"
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={false}
              activeDot={{ r: 4, fill: 'var(--accent)', stroke: 'var(--card)', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="engagement"
              name="engagement"
              stroke="var(--positive)"
              strokeWidth={2}
              strokeDasharray="2 3"
              dot={false}
              activeDot={{ r: 4, fill: 'var(--positive)', stroke: 'var(--card)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}