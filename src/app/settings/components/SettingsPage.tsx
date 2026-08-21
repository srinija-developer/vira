'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import { useSettings } from '@/context/SettingsContext';
import type { Theme, NotificationChannel, ExportFormat } from '@/context/SettingsContext';

type SettingsSection = 'appearance' | 'notifications' | 'export' | 'api-keys' | 'account' | 'privacy';

const sections: { id: SettingsSection; label: string; icon: string; description: string }[] = [
  { id: 'appearance', label: 'Appearance', icon: 'SwatchIcon', description: 'Theme & display' },
  { id: 'notifications', label: 'Notifications', icon: 'BellIcon', description: 'Alerts & digests' },
  { id: 'export', label: 'Export Defaults', icon: 'ArrowDownTrayIcon', description: 'Format & content' },
  { id: 'api-keys', label: 'API Keys', icon: 'KeyIcon', description: 'AI provider keys' },
  { id: 'account', label: 'Account', icon: 'UserCircleIcon', description: 'Profile & plan' },
  { id: 'privacy', label: 'Data & Privacy', icon: 'ShieldCheckIcon', description: 'Storage & analytics' },
];

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background flex-shrink-0 ${
        checked ? 'bg-primary' : 'bg-muted border border-border'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
      <div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function AppearanceSection() {
  const { settings, updateTheme } = useSettings();
  const themes: { value: Theme; label: string; icon: string }[] = [
    { value: 'dark', label: 'Dark', icon: 'MoonIcon' },
    { value: 'light', label: 'Light', icon: 'SunIcon' },
  ];

  return (
    <SectionCard title="Appearance" description="Choose how VIRA looks across all screens.">
      <div className="space-y-4">
        <p className="text-sm font-medium text-foreground">Theme</p>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => updateTheme(t.value)}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-150 ${
                settings.theme === t.value
                  ? 'border-primary bg-primary/10 text-primary' :'border-border bg-muted/30 text-muted-foreground hover:border-border/80 hover:text-foreground'
              }`}
            >
              <Icon name={t.icon as Parameters<typeof Icon>[0]['name']} size={20} variant={settings.theme === t.value ? 'solid' : 'outline'} />
              <span className="text-sm font-medium">{t.label}</span>
              {settings.theme === t.value && (
                <span className="ml-auto">
                  <Icon name="CheckCircleIcon" size={16} variant="solid" />
                </span>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Theme preference is saved and applied across all dashboard screens.</p>
      </div>
    </SectionCard>
  );
}

function NotificationsSection() {
  const { settings, updateNotifications } = useSettings();
  const { notifications } = settings;

  const channels: { value: NotificationChannel; label: string }[] = [
    { value: 'browser', label: 'Browser' },
    { value: 'email', label: 'Email' },
    { value: 'none', label: 'None' },
  ];

  return (
    <SectionCard title="Notification Preferences" description="Control when and how VIRA notifies you.">
      <div className="space-y-4 divide-y divide-border">
        <SettingRow label="Analysis complete" description="Notify when content analysis finishes">
          <Toggle checked={notifications.analysisComplete} onChange={(v) => updateNotifications({ analysisComplete: v })} label="Analysis complete" />
        </SettingRow>
        <div className="pt-4">
          <SettingRow label="Weekly digest" description="Summary of your content performance each week">
            <Toggle checked={notifications.weeklyDigest} onChange={(v) => updateNotifications({ weeklyDigest: v })} label="Weekly digest" />
          </SettingRow>
        </div>
        <div className="pt-4">
          <SettingRow label="Product updates" description="New features, improvements, and announcements">
            <Toggle checked={notifications.productUpdates} onChange={(v) => updateNotifications({ productUpdates: v })} label="Product updates" />
          </SettingRow>
        </div>
        <div className="pt-4 space-y-3">
          <p className="text-sm font-medium text-foreground">Delivery channel</p>
          <div className="flex gap-2 flex-wrap">
            {channels.map((c) => (
              <button
                key={c.value}
                onClick={() => updateNotifications({ channel: c.value })}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
                  notifications.channel === c.value
                    ? 'bg-primary/10 border-primary text-primary' :'bg-muted/30 border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function ExportSection() {
  const { settings, updateExportDefaults } = useSettings();
  const { exportDefaults } = settings;

  const formats: { value: ExportFormat; label: string; description: string }[] = [
    { value: 'pdf', label: 'PDF', description: 'Branded report with visuals' },
    { value: 'json', label: 'JSON', description: 'Raw structured data' },
    { value: 'csv', label: 'CSV', description: 'Spreadsheet-friendly' },
  ];

  return (
    <SectionCard title="Export Format Defaults" description="Set your preferred export format and content options.">
      <div className="space-y-5">
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Default format</p>
          <div className="grid grid-cols-3 gap-3">
            {formats.map((f) => (
              <button
                key={f.value}
                onClick={() => updateExportDefaults({ format: f.value })}
                className={`p-3 rounded-xl border text-left transition-all duration-150 ${
                  exportDefaults.format === f.value
                    ? 'border-primary bg-primary/10' :'border-border bg-muted/30 hover:border-border/80'
                }`}
              >
                <p className={`text-sm font-semibold ${exportDefaults.format === f.value ? 'text-primary' : 'text-foreground'}`}>{f.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.description}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4 divide-y divide-border">
          <SettingRow label="Include VIRA branding" description="Add logo and footer to exported reports">
            <Toggle checked={exportDefaults.includeBranding} onChange={(v) => updateExportDefaults({ includeBranding: v })} label="Include branding" />
          </SettingRow>
          <div className="pt-4">
            <SettingRow label="Include raw extracted text" description="Append the original OCR/PDF text">
              <Toggle checked={exportDefaults.includeRawText} onChange={(v) => updateExportDefaults({ includeRawText: v })} label="Include raw text" />
            </SettingRow>
          </div>
          <div className="pt-4">
            <SettingRow label="Include recommendations" description="AI-generated improvement suggestions">
              <Toggle checked={exportDefaults.includeRecommendations} onChange={(v) => updateExportDefaults({ includeRecommendations: v })} label="Include recommendations" />
            </SettingRow>
          </div>
          <div className="pt-4">
            <SettingRow label="Include score breakdown" description="Hook, clarity, emotion, CTA sub-scores">
              <Toggle checked={exportDefaults.includeScoreBreakdown} onChange={(v) => updateExportDefaults({ includeScoreBreakdown: v })} label="Include score breakdown" />
            </SettingRow>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function ApiKeysSection() {
  const { settings, updateApiKey } = useSettings();
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const providers: { key: keyof typeof settings.apiKeys; label: string; placeholder: string; color: string }[] = [
    { key: 'openai', label: 'OpenAI', placeholder: 'sk-...', color: 'text-emerald-400' },
    { key: 'gemini', label: 'Google Gemini', placeholder: 'AIza...', color: 'text-blue-400' },
    { key: 'anthropic', label: 'Anthropic Claude', placeholder: 'sk-ant-...', color: 'text-orange-400' },
    { key: 'perplexity', label: 'Perplexity', placeholder: 'pplx-...', color: 'text-violet-400' },
  ];

  return (
    <SectionCard title="API Key Management" description="Connect AI providers. Keys are stored locally and never sent to VIRA servers.">
      <div className="space-y-4">
        {providers.map((p) => {
          const value = settings.apiKeys[p.key];
          const isSet = value.length > 0;
          const isRevealed = revealed[p.key];
          return (
            <div key={p.key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className={`text-sm font-medium ${p.color}`}>{p.label}</label>
                {isSet && (
                  <span className="flex items-center gap-1 text-xs text-positive">
                    <Icon name="CheckCircleIcon" size={12} variant="solid" />
                    Connected
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={isRevealed ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => updateApiKey(p.key, e.target.value)}
                    placeholder={p.placeholder}
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setRevealed((r) => ({ ...r, [p.key]: !r[p.key] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={isRevealed ? 'Hide key' : 'Show key'}
                  >
                    <Icon name={isRevealed ? 'EyeSlashIcon' : 'EyeIcon'} size={16} />
                  </button>
                </div>
                {isSet && (
                  <button
                    onClick={() => updateApiKey(p.key, '')}
                    className="px-3 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-negative hover:border-negative/40 transition-colors text-sm"
                    aria-label={`Remove ${p.label} key`}
                  >
                    <Icon name="TrashIcon" size={16} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-warning/5 border border-warning/20">
          <Icon name="InformationCircleIcon" size={16} className="text-warning mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">API keys are stored in your browser&apos;s local storage only. They are never transmitted to VIRA servers.</p>
        </div>
      </div>
    </SectionCard>
  );
}

function AccountSection() {
  const { settings, updateAccount } = useSettings();
  const { account } = settings;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ displayName: account.displayName, email: account.email });

  const planColors: Record<string, string> = {
    free: 'text-muted-foreground bg-muted border-border',
    pro: 'text-primary bg-primary/10 border-primary/30',
    enterprise: 'text-accent bg-accent/10 border-accent/30',
  };

  const handleSave = () => {
    const initials = draft.displayName.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
    updateAccount({ displayName: draft.displayName, email: draft.email, avatarInitials: initials });
    setEditing(false);
  };

  return (
    <SectionCard title="Account Information" description="Manage your profile and subscription plan.">
      <div className="space-y-5">
        {/* Avatar + Plan */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
            {account.avatarInitials}
          </div>
          <div>
            <p className="font-semibold text-foreground">{account.displayName}</p>
            <p className="text-sm text-muted-foreground">{account.email}</p>
            <span className={`inline-flex items-center gap-1 mt-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${planColors[account.plan]}`}>
              {account.plan.charAt(0).toUpperCase() + account.plan.slice(1)} Plan
            </span>
          </div>
          <button
            onClick={() => { setDraft({ displayName: account.displayName, email: account.email }); setEditing(!editing); }}
            className="ml-auto btn-secondary text-sm py-2 px-4"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <AnimatePresence>
          {editing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 overflow-hidden"
            >
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Display name</label>
                <input
                  type="text"
                  value={draft.displayName}
                  onChange={(e) => setDraft((d) => ({ ...d, displayName: e.target.value }))}
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Email address</label>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button onClick={handleSave} className="btn-primary text-sm py-2 px-5">
                Save changes
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plan details */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Current plan</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${planColors[account.plan]}`}>
              {account.plan.charAt(0).toUpperCase() + account.plan.slice(1)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {account.plan === 'free' && 'Up to 10 analyses per month. Upgrade for unlimited access.'}
            {account.plan === 'pro' && 'Unlimited analyses, all AI providers, priority processing.'}
            {account.plan === 'enterprise' && 'Custom limits, dedicated support, team collaboration.'}
          </p>
          {account.plan !== 'enterprise' && (
            <button className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
              Upgrade plan →
            </button>
          )}
        </div>
      </div>
    </SectionCard>
  );
}

function PrivacySection() {
  const { settings, updateDataPrivacy, resetSettings } = useSettings();
  const { dataPrivacy } = settings;
  const [showReset, setShowReset] = useState(false);

  const retentionOptions = [7, 14, 30, 90, 365];

  return (
    <SectionCard title="Data & Privacy" description="Control how VIRA stores and uses your data.">
      <div className="space-y-4 divide-y divide-border">
        <SettingRow label="Save analysis history" description="Keep a record of past analyses in your browser">
          <Toggle checked={dataPrivacy.saveHistory} onChange={(v) => updateDataPrivacy({ saveHistory: v })} label="Save history" />
        </SettingRow>
        <div className="pt-4">
          <SettingRow label="Allow usage analytics" description="Help improve VIRA with anonymous usage data">
            <Toggle checked={dataPrivacy.allowAnalytics} onChange={(v) => updateDataPrivacy({ allowAnalytics: v })} label="Allow analytics" />
          </SettingRow>
        </div>
        <div className="pt-4">
          <SettingRow label="Auto-delete uploaded files" description="Remove uploaded files immediately after processing">
            <Toggle checked={dataPrivacy.autoDeleteUploads} onChange={(v) => updateDataPrivacy({ autoDeleteUploads: v })} label="Auto-delete uploads" />
          </SettingRow>
        </div>
        <div className="pt-4 space-y-3">
          <p className="text-sm font-medium text-foreground">History retention period</p>
          <div className="flex gap-2 flex-wrap">
            {retentionOptions.map((days) => (
              <button
                key={days}
                onClick={() => updateDataPrivacy({ retentionDays: days })}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150 ${
                  dataPrivacy.retentionDays === days
                    ? 'bg-primary/10 border-primary text-primary' :'bg-muted/30 border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {days < 365 ? `${days}d` : '1yr'}
              </button>
            ))}
          </div>
        </div>
        <div className="pt-4 space-y-3">
          <p className="text-sm font-medium text-foreground">Danger zone</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowReset(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-negative/30 text-negative text-sm font-medium hover:bg-negative/5 transition-colors"
            >
              <Icon name="ArrowPathIcon" size={16} />
              Reset all settings
            </button>
          </div>
          <AnimatePresence>
            {showReset && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-4 rounded-xl bg-negative/5 border border-negative/20 space-y-3"
              >
                <p className="text-sm text-foreground font-medium">Reset all settings to defaults?</p>
                <p className="text-xs text-muted-foreground">This will clear all your preferences, API keys, and account info stored locally.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { resetSettings(); setShowReset(false); }}
                    className="px-4 py-2 rounded-lg bg-negative text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Yes, reset
                  </button>
                  <button
                    onClick={() => setShowReset(false)}
                    className="px-4 py-2 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SectionCard>
  );
}

const sectionComponents: Record<SettingsSection, React.ComponentType> = {
  appearance: AppearanceSection,
  notifications: NotificationsSection,
  export: ExportSection,
  'api-keys': ApiKeysSection,
  account: AccountSection,
  privacy: PrivacySection,
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('appearance');
  const ActiveComponent = sectionComponents[activeSection];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your preferences, integrations, and account.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav */}
        <aside className="lg:w-56 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {sections.map((s) => {
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 whitespace-nowrap lg:whitespace-normal w-full text-left ${
                    isActive
                      ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon
                    name={s.icon as Parameters<typeof Icon>[0]['name']}
                    size={18}
                    variant={isActive ? 'solid' : 'outline'}
                  />
                  <div className="hidden lg:block">
                    <p className="leading-tight">{s.label}</p>
                    <p className={`text-xs font-normal mt-0.5 ${isActive ? 'text-primary/70' : 'text-muted-foreground'}`}>{s.description}</p>
                  </div>
                  <span className="lg:hidden">{s.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
