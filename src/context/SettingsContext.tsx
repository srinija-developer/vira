'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Theme = 'dark' | 'light';
export type ExportFormat = 'pdf' | 'json' | 'csv';
export type NotificationChannel = 'email' | 'browser' | 'none';

export interface NotificationPreferences {
  analysisComplete: boolean;
  weeklyDigest: boolean;
  productUpdates: boolean;
  channel: NotificationChannel;
}

export interface ExportDefaults {
  format: ExportFormat;
  includeBranding: boolean;
  includeRawText: boolean;
  includeRecommendations: boolean;
  includeScoreBreakdown: boolean;
}

export interface ApiKeys {
  openai: string;
  gemini: string;
  anthropic: string;
  perplexity: string;
}

export interface AccountInfo {
  displayName: string;
  email: string;
  avatarInitials: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface DataPrivacySettings {
  saveHistory: boolean;
  allowAnalytics: boolean;
  retentionDays: number;
  autoDeleteUploads: boolean;
}

export interface Settings {
  theme: Theme;
  notifications: NotificationPreferences;
  exportDefaults: ExportDefaults;
  apiKeys: ApiKeys;
  account: AccountInfo;
  dataPrivacy: DataPrivacySettings;
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  notifications: {
    analysisComplete: true,
    weeklyDigest: false,
    productUpdates: true,
    channel: 'browser',
  },
  exportDefaults: {
    format: 'pdf',
    includeBranding: true,
    includeRawText: false,
    includeRecommendations: true,
    includeScoreBreakdown: true,
  },
  apiKeys: {
    openai: '',
    gemini: '',
    anthropic: '',
    perplexity: '',
  },
  account: {
    displayName: 'Content Manager',
    email: 'user@example.com',
    avatarInitials: 'CM',
    plan: 'pro',
  },
  dataPrivacy: {
    saveHistory: true,
    allowAnalytics: false,
    retentionDays: 30,
    autoDeleteUploads: true,
  },
};

interface SettingsContextValue {
  settings: Settings;
  updateTheme: (theme: Theme) => void;
  updateNotifications: (prefs: Partial<NotificationPreferences>) => void;
  updateExportDefaults: (defaults: Partial<ExportDefaults>) => void;
  updateApiKey: (provider: keyof ApiKeys, value: string) => void;
  updateAccount: (info: Partial<AccountInfo>) => void;
  updateDataPrivacy: (privacy: Partial<DataPrivacySettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

const STORAGE_KEY = 'vira_settings';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<Settings>;
        setSettings((prev) => ({
          ...prev,
          ...parsed,
          notifications: { ...prev.notifications, ...parsed.notifications },
          exportDefaults: { ...prev.exportDefaults, ...parsed.exportDefaults },
          apiKeys: { ...prev.apiKeys, ...parsed.apiKeys },
          account: { ...prev.account, ...parsed.account },
          dataPrivacy: { ...prev.dataPrivacy, ...parsed.dataPrivacy },
        }));
      }
    } catch {
      // ignore parse errors
    }
    setMounted(true);
  }, []);

  const persist = useCallback((next: Settings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  }, []);

  const updateTheme = useCallback((theme: Theme) => {
    setSettings((prev) => {
      const next = { ...prev, theme };
      persist(next);
      return next;
    });
  }, [persist]);

  const updateNotifications = useCallback((prefs: Partial<NotificationPreferences>) => {
    setSettings((prev) => {
      const next = { ...prev, notifications: { ...prev.notifications, ...prefs } };
      persist(next);
      return next;
    });
  }, [persist]);

  const updateExportDefaults = useCallback((defaults: Partial<ExportDefaults>) => {
    setSettings((prev) => {
      const next = { ...prev, exportDefaults: { ...prev.exportDefaults, ...defaults } };
      persist(next);
      return next;
    });
  }, [persist]);

  const updateApiKey = useCallback((provider: keyof ApiKeys, value: string) => {
    setSettings((prev) => {
      const next = { ...prev, apiKeys: { ...prev.apiKeys, [provider]: value } };
      persist(next);
      return next;
    });
  }, [persist]);

  const updateAccount = useCallback((info: Partial<AccountInfo>) => {
    setSettings((prev) => {
      const next = { ...prev, account: { ...prev.account, ...info } };
      persist(next);
      return next;
    });
  }, [persist]);

  const updateDataPrivacy = useCallback((privacy: Partial<DataPrivacySettings>) => {
    setSettings((prev) => {
      const next = { ...prev, dataPrivacy: { ...prev.dataPrivacy, ...privacy } };
      persist(next);
      return next;
    });
  }, [persist]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  if (!mounted) return null;

  return (
    <SettingsContext.Provider value={{
      settings,
      updateTheme,
      updateNotifications,
      updateExportDefaults,
      updateApiKey,
      updateAccount,
      updateDataPrivacy,
      resetSettings,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
