'use client';
import React, { useEffect, useState } from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  colorClass?: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--positive)';
  if (score >= 60) return 'var(--warning)';
  return 'var(--negative)';
}

function getScoreLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Strong';
  if (score >= 55) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Work';
}

export default function ScoreRing({
  score,
  size = 160,
  strokeWidth = 10,
  label,
  sublabel,
}: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
  const color = getScoreColor(score);
  const scoreLabel = label || getScoreLabel(score);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-bold font-tabular leading-none"
          style={{ fontSize: size * 0.22, color }}
        >
          {animatedScore}
        </span>
        <span
          className="font-medium"
          style={{ fontSize: size * 0.07, color: 'var(--muted-foreground)' }}
        >
          /100
        </span>
        <span
          className="font-semibold mt-1"
          style={{ fontSize: size * 0.08, color }}
        >
          {scoreLabel}
        </span>
        {sublabel && (
          <span
            className="text-center px-2"
            style={{ fontSize: size * 0.065, color: 'var(--muted-foreground)' }}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}