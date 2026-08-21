import React from 'react';
import AppLayout from '@/components/AppLayout';
import UploadStudio from './components/UploadStudio';

export default function ContentUploadStudioPage() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Content Upload Studio</h1>
          <p className="text-muted-foreground text-sm">
            Upload your social media content as a PDF or image. VIRA will extract and analyze it instantly.
          </p>
        </div>
        <UploadStudio />
      </div>
    </AppLayout>
  );
}