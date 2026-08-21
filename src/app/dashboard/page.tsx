import React from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardStats from './components/DashboardStats';
import DashboardRecentAnalyses from './components/DashboardRecentAnalyses';
import DashboardQuickActions from './components/DashboardQuickActions';
import DashboardScoreChart from './components/DashboardScoreChart';
import DashboardFeatureHeatmap from './components/DashboardFeatureHeatmap';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Greeting */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Good morning 👋
            </h1>
            <p className="text-muted-foreground text-sm">
              Aug 21, 2026 · Here&apos;s your content intelligence overview.
            </p>
          </div>
        </div>

        {/* Stats + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-6">
          <div className="lg:col-span-3 xl:col-span-4 2xl:col-span-4">
            <DashboardStats />
          </div>
          <div className="lg:col-span-1 xl:col-span-1 2xl:col-span-1">
            <DashboardQuickActions />
          </div>
        </div>

        {/* Score Trend Lines (30/60/90 day) */}
        <DashboardScoreChart />

        {/* Feature Performance Heatmap */}
        <DashboardFeatureHeatmap />

        {/* Recent Analyses */}
        <DashboardRecentAnalyses />
      </div>
    </AppLayout>
  );
}