'use client';
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import ScoreRing from '@/components/ui/ScoreRing';
import MetricBar from '@/components/ui/MetricBar';
import { mockAnalysisResult, mockRecentAnalyses, mockScoreHistory } from '@/lib/mockData';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReportSection {
  id: string;
  label: string;
  description: string;
  icon: string;
  enabled: boolean;
}

interface ShareLink {
  id: string;
  label: string;
  url: string;
  createdAt: string;
  views: number;
  expires: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const REPORT_ANALYSES = mockRecentAnalyses.map((a) => ({
  ...a,
  selected: false,
}));

const MOCK_SHARE_LINKS: ShareLink[] = [
  {
    id: 'link-001',
    label: 'Q3 Campaign Report',
    url: 'https://vira3991.builtwithrocket.new/r/q3-campaign-abc123',
    createdAt: '2026-08-20T10:00:00Z',
    views: 14,
    expires: '2026-09-20',
  },
  {
    id: 'link-002',
    label: 'Client Review — August',
    url: 'https://vira3991.builtwithrocket.new/r/client-aug-xyz789',
    createdAt: '2026-08-18T08:30:00Z',
    views: 7,
    expires: '2026-09-18',
  },
];

const DEFAULT_SECTIONS: ReportSection[] = [
  {
    id: 'scores',
    label: 'Performance Scores',
    description: 'Overall score, sub-scores (hook, clarity, emotion, CTA, readability, originality)',
    icon: 'ChartBarSquare',
    enabled: true,
  },
  {
    id: 'recommendations',
    label: 'Recommendations',
    description: 'Prioritised AI-generated improvement suggestions',
    icon: 'LightBulbIcon',
    enabled: true,
  },
  {
    id: 'trends',
    label: 'Score Trends',
    description: '7-analysis score history and velocity indicators',
    icon: 'ArrowTrendingUpIcon',
    enabled: true,
  },
  {
    id: 'assets',
    label: 'Asset Library',
    description: 'All analysed files with metadata and individual scores',
    icon: 'FolderOpenIcon',
    enabled: false,
  },
  {
    id: 'insights',
    label: 'Content Insights',
    description: 'Word count, reading time, tone, sentiment, and keyword breakdown',
    icon: 'MagnifyingGlassIcon',
    enabled: false,
  },
  {
    id: 'dna',
    label: 'Content DNA',
    description: 'Professional, emotional, educational, and creative composition',
    icon: 'BeakerIcon',
    enabled: false,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 80) return 'text-positive';
  if (score >= 65) return 'text-warning';
  return 'text-negative';
}

function scoreBg(score: number) {
  if (score >= 80) return 'bg-positive/10 border-positive/30';
  if (score >= 65) return 'bg-warning/10 border-warning/30';
  return 'bg-negative/10 border-negative/30';
}

function priorityColor(p: string) {
  if (p === 'HIGH') return 'bg-negative/10 text-negative border-negative/30';
  if (p === 'MEDIUM') return 'bg-warning/10 text-warning border-warning/30';
  return 'bg-positive/10 text-positive border-positive/30';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function generateShareId() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionToggle({
  section,
  onToggle,
}: {
  section: ReportSection;
  onToggle: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onToggle(section.id)}
      className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all duration-150 text-left ${
        section.enabled
          ? 'bg-primary/5 border-primary/30' :'bg-card border-border hover:border-border/80'
      }`}
    >
      <div
        className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          section.enabled ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
        }`}
      >
        <Icon name={section.icon as Parameters<typeof Icon>[0]['name']} size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${section.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
          {section.label}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{section.description}</p>
      </div>
      <div
        className={`mt-1 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          section.enabled ? 'bg-primary border-primary' : 'border-border'
        }`}
      >
        {section.enabled && (
          <svg viewBox="0 0 8 8" className="w-2.5 h-2.5 text-white fill-current">
            <path d="M1.5 4L3 5.5L6.5 2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </button>
  );
}

function ReportPreviewScores() {
  const { scores } = mockAnalysisResult;
  const subScores = [
    { label: 'Hook', score: scores.hook },
    { label: 'Clarity', score: scores.clarity },
    { label: 'Emotion', score: scores.emotion },
    { label: 'Readability', score: scores.readability },
    { label: 'CTA', score: scores.cta },
    { label: 'Originality', score: scores.originality },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <ScoreRing score={scores.overall} size={80} strokeWidth={7} />
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Overall Score</p>
          <p className="text-3xl font-black text-foreground">{scores.overall}<span className="text-base font-medium text-muted-foreground">/100</span></p>
          <p className="text-xs text-positive font-semibold mt-0.5">Excellent</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {subScores.map((s) => (
          <div key={s.label} className={`flex items-center justify-between px-3 py-2 rounded-lg border ${scoreBg(s.score)}`}>
            <span className="text-xs font-medium text-foreground">{s.label}</span>
            <span className={`text-sm font-bold ${scoreColor(s.score)}`}>{s.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportPreviewRecommendations() {
  const { recommendations } = mockAnalysisResult;
  return (
    <div className="space-y-2">
      {recommendations.slice(0, 3).map((rec) => (
        <div key={rec.id} className="flex items-start gap-3 p-3 bg-muted/40 rounded-xl border border-border">
          <span className={`text-2xs font-bold px-2 py-0.5 rounded-full border flex-shrink-0 mt-0.5 ${priorityColor(rec.priority)}`}>
            {rec.priority}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{rec.what}</p>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{rec.why}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportPreviewTrends() {
  const max = Math.max(...mockScoreHistory.map((h) => h.score));
  return (
    <div className="space-y-3">
      <div className="flex items-end gap-1.5 h-20">
        {mockScoreHistory.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t-md bg-primary/70 transition-all"
              style={{ height: `${(h.score / max) * 72}px` }}
            />
            <span className="text-2xs text-muted-foreground">{h.date.replace('Aug ', '')}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">7-analysis trend</span>
        <span className="text-positive font-semibold">▲ +24 pts velocity</span>
      </div>
    </div>
  );
}

function ReportPreviewAssets() {
  return (
    <div className="space-y-2">
      {mockRecentAnalyses.slice(0, 4).map((a) => (
        <div key={a.id} className="flex items-center gap-3 px-3 py-2 bg-muted/40 rounded-lg border border-border">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon name={a.fileType === 'pdf' ? 'DocumentTextIcon' : 'PhotoIcon'} size={14} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{a.filename}</p>
            <p className="text-2xs text-muted-foreground">{a.platform} · {formatDate(a.uploadedAt)}</p>
          </div>
          <span className={`text-xs font-bold ${scoreColor(a.overallScore)}`}>{a.overallScore}</span>
        </div>
      ))}
    </div>
  );
}

function ReportPreviewInsights() {
  const { insights, tone, sentiment } = mockAnalysisResult;
  const items = [
    { label: 'Word Count', value: String(insights.wordCount) },
    { label: 'Reading Time', value: insights.readingTime },
    { label: 'Tone', value: tone },
    { label: 'Sentiment', value: sentiment },
    { label: 'Sentences', value: String(insights.sentenceCount) },
    { label: 'Passive Voice', value: String(insights.passiveVoiceCount) },
  ];
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => (
        <div key={item.label} className="px-3 py-2 bg-muted/40 rounded-lg border border-border">
          <p className="text-2xs text-muted-foreground">{item.label}</p>
          <p className="text-sm font-semibold text-foreground mt-0.5">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function ReportPreviewDNA() {
  const { contentDNA } = mockAnalysisResult;
  const items = [
    { label: 'Professional', value: contentDNA.professional },
    { label: 'Emotional', value: contentDNA.emotional },
    { label: 'Educational', value: contentDNA.educational },
    { label: 'Confident', value: contentDNA.confident },
    { label: 'Urgent', value: contentDNA.urgent },
    { label: 'Creative', value: contentDNA.creative },
  ];
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <MetricBar key={item.label} label={item.label} value={item.value} max={100} />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PerformanceReports() {
  const [sections, setSections] = useState<ReportSection[]>(DEFAULT_SECTIONS);
  const [reportTitle, setReportTitle] = useState('Q3 Content Performance Report');
  const [reportNote, setReportNote] = useState('Prepared for client review — August 2026');
  const [shareLinks, setShareLinks] = useState<ShareLink[]>(MOCK_SHARE_LINKS);
  const [activeTab, setActiveTab] = useState<'builder' | 'share'>('builder');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const enabledSections = sections.filter((s) => s.enabled);

  const toggleSection = useCallback((id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCopyLink = (link: ShareLink) => {
    navigator.clipboard.writeText(link.url).catch(() => {});
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('Link copied to clipboard');
  };

  const handleGenerateLink = () => {
    if (!newLinkLabel.trim()) return;
    setGeneratingLink(true);
    setTimeout(() => {
      const id = generateShareId();
      const newLink: ShareLink = {
        id: `link-${id}`,
        label: newLinkLabel.trim(),
        url: `https://vira3991.builtwithrocket.new/r/${id}`,
        createdAt: new Date().toISOString(),
        views: 0,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      };
      setShareLinks((prev) => [newLink, ...prev]);
      setNewLinkLabel('');
      setShowLinkForm(false);
      setGeneratingLink(false);
      showToast('Shareable link created');
    }, 900);
  };

  const handleDeleteLink = (id: string) => {
    setShareLinks((prev) => prev.filter((l) => l.id !== id));
    showToast('Link removed');
  };

  const handleExportPDF = async () => {
    setExportingPDF(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');
      if (!reportRef.current) return;
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW;
      const imgH = (canvas.height * imgW) / canvas.width;
      let yPos = 0;
      let remaining = imgH;
      while (remaining > 0) {
        pdf.addImage(imgData, 'PNG', 0, -yPos, imgW, imgH);
        remaining -= pageH;
        yPos += pageH;
        if (remaining > 0) pdf.addPage();
      }
      pdf.save(`${reportTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      showToast('PDF exported successfully');
    } catch {
      showToast('PDF export failed — please try again');
    } finally {
      setExportingPDF(false);
    }
  };

  const sectionPreviewMap: Record<string, React.ReactNode> = {
    scores: <ReportPreviewScores />,
    recommendations: <ReportPreviewRecommendations />,
    trends: <ReportPreviewTrends />,
    assets: <ReportPreviewAssets />,
    insights: <ReportPreviewInsights />,
    dna: <ReportPreviewDNA />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Performance Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build customisable reports and share them with clients or your team
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'builder' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="flex items-center gap-2">
              <Icon name="DocumentTextIcon" size={15} />
              Builder
            </span>
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'share' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="flex items-center gap-2">
              <Icon name="ShareIcon" size={15} />
              Share Links
              {shareLinks.length > 0 && (
                <span className="bg-primary/20 text-primary text-2xs font-bold px-1.5 py-0.5 rounded-full">
                  {shareLinks.length}
                </span>
              )}
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'builder' ? (
          <motion.div
            key="builder"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 xl:grid-cols-5 gap-6"
          >
            {/* Left: Config Panel */}
            <div className="xl:col-span-2 space-y-5">
              {/* Report Meta */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Report Details</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Report Title</label>
                    <input
                      type="text"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground"
                      placeholder="e.g. Q3 Content Performance Report"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Report Note</label>
                    <input
                      type="text"
                      value={reportNote}
                      onChange={(e) => setReportNote(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground"
                      placeholder="e.g. Prepared for client review"
                    />
                  </div>
                </div>
              </div>

              {/* Section Toggles */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Sections</h2>
                  <span className="text-xs text-muted-foreground">{enabledSections.length}/{sections.length} enabled</span>
                </div>
                <div className="space-y-2">
                  {sections.map((section) => (
                    <SectionToggle key={section.id} section={section} onToggle={toggleSection} />
                  ))}
                </div>
              </div>

              {/* Export Actions */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Export</h2>
                <button
                  onClick={handleExportPDF}
                  disabled={exportingPDF || enabledSections.length === 0}
                  className="w-full flex items-center justify-center gap-2 btn-primary py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exportingPDF ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Generating PDF…
                    </>
                  ) : (
                    <>
                      <Icon name="ArrowDownTrayIcon" size={16} />
                      Export as PDF
                    </>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('share')}
                  className="w-full flex items-center justify-center gap-2 btn-secondary py-2.5 text-sm"
                >
                  <Icon name="LinkIcon" size={16} />
                  Create Shareable Link
                </button>
              </div>
            </div>

            {/* Right: Live Preview */}
            <div className="xl:col-span-3">
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Live Preview</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-negative/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-positive/60" />
                  </div>
                </div>

                {/* Printable report area */}
                <div ref={reportRef} className="p-6 bg-white space-y-6">
                  {/* Report Header */}
                  <div className="border-b-2 border-gray-200 pb-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">VIRA AI</p>
                        <h1 className="text-xl font-black text-gray-900 leading-tight">{reportTitle || 'Untitled Report'}</h1>
                        {reportNote && <p className="text-sm text-gray-500 mt-1">{reportNote}</p>}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-400">Generated</p>
                        <p className="text-xs font-semibold text-gray-600">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {enabledSections.map((s) => (
                        <span key={s.id} className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {s.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Enabled Sections */}
                  {enabledSections.length === 0 ? (
                    <div className="py-12 text-center">
                      <Icon name="DocumentTextIcon" size={32} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-400">Enable at least one section to preview your report</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {enabledSections.map((section, idx) => (
                        <motion.div
                          key={section.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="space-y-3"
                        >
                          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center">
                              <Icon name={section.icon as Parameters<typeof Icon>[0]['name']} size={13} className="text-gray-500" />
                            </div>
                            <h2 className="text-sm font-bold text-gray-800">{section.label}</h2>
                          </div>
                          {sectionPreviewMap[section.id]}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <p className="text-2xs text-gray-400">Generated by VIRA AI · vira3991.builtwithrocket.new</p>
                    <p className="text-2xs text-gray-400">Confidential</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="share"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* Create Link */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-foreground">Shareable Links</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Generate links to share reports with clients or team members</p>
                </div>
                <button
                  onClick={() => setShowLinkForm((v) => !v)}
                  className="flex items-center gap-2 btn-primary text-sm py-2 px-4"
                >
                  <Icon name="PlusIcon" size={15} />
                  New Link
                </button>
              </div>

              <AnimatePresence>
                {showLinkForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border border-border rounded-xl p-4 bg-muted/30 mb-4 space-y-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">New Shareable Link</p>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Link Label</label>
                        <input
                          type="text"
                          value={newLinkLabel}
                          onChange={(e) => setNewLinkLabel(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleGenerateLink()}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground"
                          placeholder="e.g. Client Review — September"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleGenerateLink}
                          disabled={!newLinkLabel.trim() || generatingLink}
                          className="flex items-center gap-2 btn-primary text-sm py-2 px-4 disabled:opacity-50"
                        >
                          {generatingLink ? (
                            <>
                              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                              </svg>
                              Generating…
                            </>
                          ) : (
                            <>
                              <Icon name="LinkIcon" size={14} />
                              Generate Link
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => { setShowLinkForm(false); setNewLinkLabel(''); }}
                          className="btn-secondary text-sm py-2 px-4"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Links List */}
              {shareLinks.length === 0 ? (
                <div className="py-10 text-center">
                  <Icon name="LinkIcon" size={28} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No shareable links yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Create a link to share your report with clients or teammates</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {shareLinks.map((link) => (
                    <motion.div
                      key={link.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border"
                    >
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon name="LinkIcon" size={16} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{link.label}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{link.url}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-2xs text-muted-foreground">Created {formatDate(link.createdAt)}</span>
                          <span className="text-2xs text-muted-foreground">·</span>
                          <span className="text-2xs text-muted-foreground">Expires {link.expires}</span>
                          <span className="text-2xs text-muted-foreground">·</span>
                          <span className="text-2xs font-semibold text-foreground">{link.views} views</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleCopyLink(link)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            copiedId === link.id
                              ? 'bg-positive/10 text-positive border border-positive/30' :'bg-muted text-muted-foreground hover:text-foreground border border-border'
                          }`}
                        >
                          <Icon name={copiedId === link.id ? 'CheckIcon' : 'ClipboardDocumentIcon'} size={13} />
                          {copiedId === link.id ? 'Copied' : 'Copy'}
                        </button>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-negative hover:bg-negative/10 transition-colors border border-border"
                          aria-label="Delete link"
                        >
                          <Icon name="TrashIcon" size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Icon name="InformationCircleIcon" size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">How shareable links work</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Each link generates a read-only view of your current report configuration — including all enabled sections and your report title. Links expire after 30 days and can be revoked at any time. Recipients do not need a VIRA account to view the report.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
