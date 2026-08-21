import React from 'react';
import AppLayout from '@/components/AppLayout';
import OptimizerLayout from './components/OptimizerLayout';

export default function ContentOptimizerPage() {
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Content Optimizer</h1>
        <p className="text-sm text-muted-foreground">
          Edit your content and watch your scores update in real time. Apply AI suggestions with one click.
        </p>
      </div>
      <OptimizerLayout />
    </AppLayout>
  );
}