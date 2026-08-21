'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';

const actions = [
  {
    id: 'qa-upload',
    label: 'New Analysis',
    description: 'Upload PDF or image',
    href: '/content-upload-studio',
    icon: 'ArrowUpTrayIcon',
    primary: true,
  },
  {
    id: 'qa-results',
    label: 'View Results',
    description: 'Last analysis',
    href: '/content-analysis-results',
    icon: 'ChartBarSquareIcon',
    primary: false,
  },
  {
    id: 'qa-optimizer',
    label: 'Optimizer',
    description: 'Edit & improve',
    href: '/content-optimizer',
    icon: 'BoltIcon',
    primary: false,
  },
];

export default function DashboardQuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card border border-border rounded-2xl p-5 card-glow h-full"
    >
      <h3 className="text-sm font-bold text-foreground mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <Link key={action.id} href={action.href}>
            <div
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 cursor-pointer hover:-translate-y-0.5 ${
                action.primary
                  ? 'bg-primary/10 border-primary/30 hover:bg-primary/15' :'bg-muted border-border hover:bg-secondary'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  action.primary ? 'bg-primary' : 'bg-secondary'
                }`}
              >
                <Icon
                  name={action.icon as Parameters<typeof Icon>[0]['name']}
                  size={16}
                  className={action.primary ? 'text-white' : 'text-muted-foreground'}
                />
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-semibold ${action.primary ? 'text-primary' : 'text-foreground'}`}>
                  {action.label}
                </p>
                <p className="text-2xs text-muted-foreground">{action.description}</p>
              </div>
              <Icon name="ChevronRightIcon" size={14} className="text-muted-foreground ml-auto flex-shrink-0" />
            </div>
          </Link>
        ))}
      </div>

      {/* Demo mode */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-2xs text-muted-foreground font-medium mb-2">Try with demo content</p>
        <div className="space-y-1.5">
          {['LinkedIn Post', 'Instagram Caption', 'X/Twitter Thread'].map((demo) => (
            <Link key={`demo-${demo}`} href="/content-analysis-results">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors cursor-pointer">
                <span className="text-xs font-medium text-muted-foreground">{demo}</span>
                <span className="text-2xs text-accent font-semibold">Demo →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}