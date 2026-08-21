'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Editor' | 'Viewer';
  avatar: string;
  status: 'active' | 'pending';
  joinedAt: string;
}

interface SavedReport {
  id: string;
  title: string;
  createdAt: string;
  sections: number;
  views: number;
  shared: boolean;
  score: number;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  connectedAt?: string;
  category: 'ai' | 'storage' | 'analytics' | 'publishing';
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TEAM_MEMBERS: TeamMember[] = [
  { id: 'tm-1', name: 'Chris Morgan', email: 'chris@company.io', role: 'Owner', avatar: 'CM', status: 'active', joinedAt: '2026-01-15' },
  { id: 'tm-2', name: 'Aisha Patel', email: 'aisha@company.io', role: 'Admin', avatar: 'AP', status: 'active', joinedAt: '2026-02-20' },
  { id: 'tm-3', name: 'Jordan Lee', email: 'jordan@company.io', role: 'Editor', avatar: 'JL', status: 'active', joinedAt: '2026-04-08' },
  { id: 'tm-4', name: 'Sam Rivera', email: 'sam@company.io', role: 'Viewer', avatar: 'SR', status: 'pending', joinedAt: '2026-08-19' },
];

const SAVED_REPORTS: SavedReport[] = [
  { id: 'r-1', title: 'Q3 Campaign Performance', createdAt: '2026-08-20', sections: 5, views: 14, shared: true, score: 89 },
  { id: 'r-2', title: 'Client Review — August', createdAt: '2026-08-18', sections: 4, views: 7, shared: true, score: 76 },
  { id: 'r-3', title: 'LinkedIn Content Audit', createdAt: '2026-08-12', sections: 6, views: 3, shared: false, score: 82 },
  { id: 'r-4', title: 'Email Hook Analysis', createdAt: '2026-08-05', sections: 3, views: 0, shared: false, score: 91 },
  { id: 'r-5', title: 'Brand Voice Consistency', createdAt: '2026-07-28', sections: 5, views: 22, shared: true, score: 78 },
];

const INTEGRATIONS: Integration[] = [
  { id: 'int-openai', name: 'OpenAI', description: 'GPT-4o for content analysis and generation', icon: 'SparklesIcon', connected: true, connectedAt: '2026-01-15', category: 'ai' },
  { id: 'int-gemini', name: 'Google Gemini', description: 'Multimodal AI for image and text analysis', icon: 'CpuChipIcon', connected: true, connectedAt: '2026-03-10', category: 'ai' },
  { id: 'int-anthropic', name: 'Anthropic Claude', description: 'Claude for nuanced content evaluation', icon: 'ChatBubbleLeftRightIcon', connected: false, category: 'ai' },
  { id: 'int-gdrive', name: 'Google Drive', description: 'Import and export content directly', icon: 'CloudArrowUpIcon', connected: true, connectedAt: '2026-02-05', category: 'storage' },
  { id: 'int-notion', name: 'Notion', description: 'Sync reports and insights to Notion pages', icon: 'DocumentTextIcon', connected: false, category: 'storage' },
  { id: 'int-ga', name: 'Google Analytics', description: 'Track content performance metrics', icon: 'ChartBarSquare', connected: true, connectedAt: '2026-04-01', category: 'analytics' },
  { id: 'int-linkedin', name: 'LinkedIn', description: 'Publish optimized content directly', icon: 'GlobeAltIcon', connected: false, category: 'publishing' },
  { id: 'int-twitter', name: 'X / Twitter', description: 'Schedule and publish to X', icon: 'HashtagIcon', connected: false, category: 'publishing' },
];

const API_USAGE = {
  used: 8420,
  limit: 10000,
  resetDate: '2026-09-01',
  breakdown: [
    { label: 'Content Analysis', calls: 3840, color: 'var(--primary)' },
    { label: 'Hook Generation', calls: 2100, color: 'var(--accent)' },
    { label: 'Rewrites', calls: 1580, color: 'var(--positive)' },
    { label: 'Other', calls: 900, color: 'var(--warning)' },
  ],
};

const ROLE_COLORS: Record<TeamMember['role'], string> = {
  Owner: 'bg-primary/15 text-primary border-primary/30',
  Admin: 'bg-accent/15 text-accent border-accent/30',
  Editor: 'bg-positive/15 text-positive border-positive/30',
  Viewer: 'bg-muted text-muted-foreground border-border',
};

const CATEGORY_LABELS: Record<Integration['category'], string> = {
  ai: 'AI Provider',
  storage: 'Storage',
  analytics: 'Analytics',
  publishing: 'Publishing',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function UsageBar({ used, limit }: { used: number; limit: number }) {
  const pct = Math.min((used / limit) * 100, 100);
  const color = pct >= 90 ? 'var(--negative)' : pct >= 70 ? 'var(--warning)' : 'var(--primary)';
  return (
    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'team' | 'integrations'>('overview');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('Editor');
  const [integrations, setIntegrations] = useState(INTEGRATIONS);
  const [categoryFilter, setCategoryFilter] = useState<'all' | Integration['category']>('all');

  const usagePct = Math.round((API_USAGE.used / API_USAGE.limit) * 100);

  const filteredIntegrations = categoryFilter === 'all'
    ? integrations
    : integrations.filter((i) => i.category === categoryFilter);

  function toggleIntegration(id: string) {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, connected: !i.connected, connectedAt: !i.connected ? new Date().toISOString().split('T')[0] : undefined }
          : i
      )
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'UserCircleIcon' },
    { id: 'reports', label: 'Saved Reports', icon: 'DocumentChartBarIcon' },
    { id: 'team', label: 'Team', icon: 'UsersIcon' },
    { id: 'integrations', label: 'Integrations', icon: 'PuzzlePieceIcon' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Account</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your plan, usage, team, and integrations</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            CM
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-foreground">Chris Morgan</p>
            <p className="text-xs text-muted-foreground">chris@company.io</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-150 -mb-px ${
              activeTab === tab.id
                ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            <Icon name={tab.icon as Parameters<typeof Icon>[0]['name']} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Subscription Tier */}
          <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-6 space-y-5">
            <SectionHeader title="Subscription" />
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Icon name="StarIcon" size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-base font-bold text-foreground">Pro Plan</p>
                <p className="text-xs text-muted-foreground">Billed monthly · $49/mo</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'API Calls / month', value: '10,000' },
                { label: 'Team members', value: '10 seats' },
                { label: 'Saved reports', value: 'Unlimited' },
                { label: 'Export formats', value: 'PDF, CSV, JSON' },
                { label: 'AI providers', value: 'All 3' },
                { label: 'Priority support', value: '✓ Included' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-border space-y-2">
              <button className="w-full btn-primary text-sm py-2">Upgrade to Enterprise</button>
              <button className="w-full text-sm py-2 px-4 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                Manage Billing
              </button>
            </div>
          </div>

          {/* API Usage */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 space-y-5">
            <SectionHeader
              title="API Usage"
              description={`Resets on ${API_USAGE.resetDate}`}
            />
            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-bold text-foreground">{API_USAGE.used.toLocaleString()}</span>
                  <span className="text-lg text-muted-foreground"> / {API_USAGE.limit.toLocaleString()}</span>
                </div>
                <span
                  className={`text-sm font-semibold px-2.5 py-1 rounded-full border ${
                    usagePct >= 90
                      ? 'bg-negative/10 text-negative border-negative/30'
                      : usagePct >= 70
                      ? 'bg-warning/10 text-warning border-warning/30' :'bg-positive/10 text-positive border-positive/30'
                  }`}
                >
                  {usagePct}% used
                </span>
              </div>
              <UsageBar used={API_USAGE.used} limit={API_USAGE.limit} />
              <p className="text-xs text-muted-foreground">{API_USAGE.limit - API_USAGE.used} calls remaining this cycle</p>
            </div>

            {/* Breakdown */}
            <div className="space-y-3 pt-2 border-t border-border">
              <p className="text-sm font-medium text-foreground">Usage Breakdown</p>
              {API_USAGE.breakdown.map((item) => {
                const pct = Math.round((item.calls / API_USAGE.used) * 100);
                return (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                        <span className="text-muted-foreground">{item.label}</span>
                      </div>
                      <span className="font-medium text-foreground">{item.calls.toLocaleString()} <span className="text-muted-foreground font-normal">({pct}%)</span></span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── SAVED REPORTS TAB ── */}
      {activeTab === 'reports' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          <SectionHeader
            title="Saved Reports"
            description={`${SAVED_REPORTS.length} reports saved`}
            action={
              <a href="/performance-reports" className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                <Icon name="PlusIcon" size={15} />
                New Report
              </a>
            }
          />
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <span>Report</span>
              <span className="text-center">Score</span>
              <span className="text-center">Sections</span>
              <span className="text-center">Views</span>
              <span className="text-right">Actions</span>
            </div>
            {SAVED_REPORTS.map((report, idx) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto_auto] gap-3 sm:gap-4 items-center px-5 py-4 border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="DocumentChartBarIcon" size={16} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{report.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{report.createdAt}</span>
                      {report.shared && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                          Shared
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex sm:justify-center items-center gap-2">
                  <span className="text-xs text-muted-foreground sm:hidden">Score:</span>
                  <span
                    className={`text-sm font-bold px-2 py-0.5 rounded-lg ${
                      report.score >= 85 ? 'text-positive bg-positive/10' : report.score >= 70 ? 'text-warning bg-warning/10' : 'text-negative bg-negative/10'
                    }`}
                  >
                    {report.score}
                  </span>
                </div>
                <div className="flex sm:justify-center items-center gap-2">
                  <span className="text-xs text-muted-foreground sm:hidden">Sections:</span>
                  <span className="text-sm text-foreground">{report.sections}</span>
                </div>
                <div className="flex sm:justify-center items-center gap-2">
                  <span className="text-xs text-muted-foreground sm:hidden">Views:</span>
                  <span className="text-sm text-foreground">{report.views}</span>
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="View">
                    <Icon name="EyeIcon" size={15} />
                  </button>
                  <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Share">
                    <Icon name="ShareIcon" size={15} />
                  </button>
                  <button className="p-1.5 rounded-lg text-muted-foreground hover:text-negative hover:bg-negative/10 transition-colors" title="Delete">
                    <Icon name="TrashIcon" size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── TEAM TAB ── */}
      {activeTab === 'team' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          <SectionHeader
            title="Team Members"
            description={`${TEAM_MEMBERS.filter((m) => m.status === 'active').length} active · ${TEAM_MEMBERS.filter((m) => m.status === 'pending').length} pending`}
          />

          {/* Invite Form */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-sm font-semibold text-foreground mb-3">Invite a team member</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.io"
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as TeamMember['role'])}
                className="px-3 py-2 text-sm rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
              <button className="btn-primary text-sm py-2 px-4 flex items-center gap-2 justify-center">
                <Icon name="PaperAirplaneIcon" size={15} />
                Send Invite
              </button>
            </div>
          </div>

          {/* Members List */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {TEAM_MEMBERS.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, var(--primary), var(--accent))` }}
                >
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground">{member.name}</p>
                    {member.status === 'pending' && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/30">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                </div>
                <span className={`hidden sm:inline-flex text-xs font-medium px-2.5 py-1 rounded-full border ${ROLE_COLORS[member.role]}`}>
                  {member.role}
                </span>
                <p className="hidden md:block text-xs text-muted-foreground whitespace-nowrap">
                  Joined {member.joinedAt}
                </p>
                {member.role !== 'Owner' && (
                  <button className="p-1.5 rounded-lg text-muted-foreground hover:text-negative hover:bg-negative/10 transition-colors flex-shrink-0" title="Remove">
                    <Icon name="XMarkIcon" size={15} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── INTEGRATIONS TAB ── */}
      {activeTab === 'integrations' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          <SectionHeader
            title="Connected Integrations"
            description={`${integrations.filter((i) => i.connected).length} of ${integrations.length} connected`}
          />

          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {(['all', 'ai', 'storage', 'analytics', 'publishing'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  categoryFilter === cat
                    ? 'bg-primary/10 text-primary border border-primary/30' :'text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent'
                }`}
              >
                {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredIntegrations.map((integration, idx) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon name={integration.icon as Parameters<typeof Icon>[0]['name']} size={20} className="text-foreground" />
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                      integration.connected
                        ? 'bg-positive/10 text-positive border-positive/30' :'bg-muted text-muted-foreground border-border'
                    }`}
                  >
                    {integration.connected ? 'Connected' : 'Not connected'}
                  </span>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-foreground">{integration.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{integration.description}</p>
                  <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[integration.category]}</p>
                </div>
                {integration.connected && integration.connectedAt && (
                  <p className="text-xs text-muted-foreground">Since {integration.connectedAt}</p>
                )}
                <button
                  onClick={() => toggleIntegration(integration.id)}
                  className={`w-full text-sm py-2 px-4 rounded-lg font-medium transition-colors ${
                    integration.connected
                      ? 'border border-border text-muted-foreground hover:text-negative hover:border-negative/40 hover:bg-negative/5'
                      : 'btn-primary'
                  }`}
                >
                  {integration.connected ? 'Disconnect' : 'Connect'}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
