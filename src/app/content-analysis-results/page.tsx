import React from 'react';
import AppLayout from '@/components/AppLayout';
import AnalysisResultsHeader from './components/AnalysisResultsHeader';
import AnalysisScoreSection from './components/AnalysisScoreSection';
import AnalysisUniqueFeatures from './components/AnalysisUniqueFeatures';
import AnalysisRecommendations from './components/AnalysisRecommendations';
import AnalysisInsights from './components/AnalysisInsights';

export default function ContentAnalysisResultsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <AnalysisResultsHeader />
        <AnalysisScoreSection />
        <AnalysisUniqueFeatures />
        <AnalysisInsights />
        <AnalysisRecommendations />
      </div>
    </AppLayout>
  );
}