import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProcessingPipeline from './components/ProcessingPipeline';

export default function ProcessingScreenPage() {
  return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <ProcessingPipeline />
      </div>
    </AppLayout>
  );
}