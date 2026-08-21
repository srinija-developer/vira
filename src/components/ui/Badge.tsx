import React from 'react';

type BadgeVariant = 'high' | 'medium' | 'low' | 'platform' | 'default' | 'accent';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  high: 'bg-positive/10 text-positive border border-positive/20',
  medium: 'bg-warning/10 text-warning border border-warning/20',
  low: 'bg-negative/10 text-negative border border-negative/20',
  platform: 'bg-primary/10 text-primary border border-primary/20',
  accent: 'bg-accent/10 text-accent border border-accent/20',
  default: 'bg-muted text-muted-foreground border border-border',
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}