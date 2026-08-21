'use client';
import React, { useEffect, useState } from 'react';

interface MetricBarProps {
  label: string;
  score?: number;
  value?: number;
  maxScore?: number;
  description?: string;
  showValue?: boolean;
  height?: number;
  color?: string;
}

function getBarColor(score: number): string {
  if (score >= 80) return 'var(--positive)';
  if (score >= 60) return 'var(--warning)';
  return 'var(--negative)';
}

export default function MetricBar({
  label,
  score,
  value,
  maxScore = 100,
  description,
  showValue = true,
  height = 6,
  color,
}: MetricBarProps) {
  const resolvedScore = score ?? value ?? 0;
  const [width, setWidth] = useState(0);
  const pct = (resolvedScore / maxScore) * 100;
  const resolvedColor = color || getBarColor(resolvedScore);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 400);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        {label && <span className="text-sm font-medium text-foreground">{label}</span>}
        {showValue && (
          <span className="text-sm font-bold font-tabular" style={{ color: resolvedColor }}>
            {resolvedScore}
          </span>
        )}
      </div>
      <div
        className="w-full bg-muted rounded-full overflow-hidden"
        style={{ height }}
      >
        <div
          className="h-full rounded-full progress-bar-fill"
          style={{ width: `${width}%`, backgroundColor: resolvedColor }}
        />
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}