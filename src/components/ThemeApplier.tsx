'use client';
import { useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';

export default function ThemeApplier() {
  const { settings } = useSettings();

  useEffect(() => {
    const html = document.documentElement;
    if (settings?.theme === 'light') {
      html?.classList?.remove('dark');
      html?.classList?.add('light');
    } else {
      html?.classList?.remove('light');
      html?.classList?.add('dark');
    }
  }, [settings?.theme]);

  // Apply dark class on initial render (SSR default is dark)
  useEffect(() => {
    const html = document.documentElement;
    if (!html?.classList?.contains('light') && !html?.classList?.contains('dark')) {
      html?.classList?.add('dark');
    }
  }, []);

  return null;
}
