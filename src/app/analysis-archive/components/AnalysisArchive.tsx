'use client';
import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import type { Platform } from '@/types/analysis';

// ─── Extended mock archive data ───────────────────────────────────────────────
interface ArchiveEntry {
  id: string;
  filename: string;
  platform: Platform | 'General';
  contentType: string;
  uploadedAt: string;
  overallScore: number;
  fileType: 'pdf' | 'image' | 'text';
  status: 'complete' | 'error';
  wordCount: number;
  tone: string;
}

const ARCHIVE_DATA: ArchiveEntry[] = [
  { id: 'analysis-001', filename: 'linkedin-post-q3-campaign.pdf', platform: 'LinkedIn', contentType: 'Post', uploadedAt: '2026-08-21T04:30:00Z', overallScore: 82, fileType: 'pdf', status: 'complete', wordCount: 156, tone: 'Inspirational' },
  { id: 'analysis-002', filename: 'instagram-product-launch.jpg', platform: 'Instagram', contentType: 'Caption', uploadedAt: '2026-08-20T14:22:00Z', overallScore: 67, fileType: 'image', status: 'complete', wordCount: 89, tone: 'Promotional' },
  { id: 'analysis-003', filename: 'twitter-thread-draft.pdf', platform: 'X/Twitter', contentType: 'Post', uploadedAt: '2026-08-19T09:15:00Z', overallScore: 74, fileType: 'pdf', status: 'complete', wordCount: 210, tone: 'Educational' },
  { id: 'analysis-004', filename: 'facebook-ad-copy-v2.png', platform: 'Facebook', contentType: 'Advertisement', uploadedAt: '2026-08-18T16:45:00Z', overallScore: 58, fileType: 'image', status: 'complete', wordCount: 64, tone: 'Urgent' },
  { id: 'analysis-005', filename: 'linkedin-announcement.pdf', platform: 'LinkedIn', contentType: 'Announcement', uploadedAt: '2026-08-17T11:30:00Z', overallScore: 89, fileType: 'pdf', status: 'complete', wordCount: 312, tone: 'Professional' },
  { id: 'analysis-006', filename: 'ig-reel-caption-draft.jpg', platform: 'Instagram', contentType: 'Marketing Content', uploadedAt: '2026-08-16T08:00:00Z', overallScore: 71, fileType: 'image', status: 'complete', wordCount: 78, tone: 'Friendly' },
  { id: 'analysis-007', filename: 'twitter-product-tease.pdf', platform: 'X/Twitter', contentType: 'Post', uploadedAt: '2026-08-15T13:10:00Z', overallScore: 63, fileType: 'pdf', status: 'complete', wordCount: 42, tone: 'Urgent' },
  { id: 'analysis-008', filename: 'facebook-event-promo.png', platform: 'Facebook', contentType: 'Advertisement', uploadedAt: '2026-08-14T10:05:00Z', overallScore: 77, fileType: 'image', status: 'complete', wordCount: 130, tone: 'Promotional' },
  { id: 'analysis-009', filename: 'linkedin-thought-leadership.pdf', platform: 'LinkedIn', contentType: 'Post', uploadedAt: '2026-08-13T07:45:00Z', overallScore: 91, fileType: 'pdf', status: 'complete', wordCount: 480, tone: 'Educational' },
  { id: 'analysis-010', filename: 'ig-story-copy.jpg', platform: 'Instagram', contentType: 'Caption', uploadedAt: '2026-08-12T15:30:00Z', overallScore: 55, fileType: 'image', status: 'complete', wordCount: 35, tone: 'Friendly' },
  { id: 'analysis-011', filename: 'general-blog-intro.pdf', platform: 'General', contentType: 'Other', uploadedAt: '2026-08-11T09:00:00Z', overallScore: 68, fileType: 'pdf', status: 'complete', wordCount: 620, tone: 'Professional' },
  { id: 'analysis-012', filename: 'twitter-launch-thread.pdf', platform: 'X/Twitter', contentType: 'Post', uploadedAt: '2026-08-10T12:00:00Z', overallScore: 84, fileType: 'pdf', status: 'complete', wordCount: 290, tone: 'Inspirational' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const PLATFORM_COLORS: Record<string, string> = {
  LinkedIn: 'bg-blue-500/15 text-blue-700 border-blue-500/30 .dark:text-blue-400',
  Instagram: 'bg-pink-500/15 text-pink-700 border-pink-500/30',
  'X/Twitter': 'bg-sky-500/15 text-sky-700 border-sky-500/30',
  Facebook: 'bg-indigo-500/15 text-indigo-700 border-indigo-500/30',
  General: 'bg-muted text-muted-foreground border-border',
};

const FILE_ICONS: Record<string, string> = {
  pdf: 'DocumentTextIcon',
  image: 'PhotoIcon',
  text: 'DocumentIcon',
};

function scoreColor(score: number) {
  if (score >= 80) return 'text-emerald-700';
  if (score >= 65) return 'text-amber-700';
  return 'text-rose-700';
}

function scoreBg(score: number) {
  if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/30';
  if (score >= 65) return 'bg-amber-500/10 border-amber-500/30';
  return 'bg-rose-500/10 border-rose-500/30';
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Sub-components ───────────────────────────────────────────────────────────
interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}
function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 whitespace-nowrap ${
        active
          ? 'bg-primary/20 text-primary border-primary/40' :'bg-muted/50 text-muted-foreground border-border hover:border-primary/30 hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}

interface ArchiveCardProps {
  entry: ArchiveEntry;
  selected: boolean;
  onSelect: (id: string) => void;
  onRestore: (entry: ArchiveEntry) => void;
}
function ArchiveCard({ entry, selected, onSelect, onRestore }: ArchiveCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-xl border bg-card p-5 flex flex-col gap-3 transition-all duration-150 group ${
        selected ? 'border-primary/60 ring-1 ring-primary/30' : 'border-border hover:border-primary/30'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onSelect(entry.id)}
        className={`absolute top-4 right-4 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150 ${
          selected ? 'bg-primary border-primary' : 'border-border bg-background group-hover:border-primary/50'
        }`}
        aria-label={selected ? 'Deselect' : 'Select'}
      >
        {selected && <Icon name="CheckIcon" size={12} className="text-white" />}
      </button>

      {/* Header row */}
      <div className="flex items-start gap-3 pr-7">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          <Icon name={FILE_ICONS[entry.fileType] as Parameters<typeof Icon>[0]['name']} size={20} className="text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate leading-tight">{entry.filename}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{entry.contentType} · {entry.wordCount} words</p>
        </div>
      </div>

      {/* Score + Platform */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold ${scoreBg(entry.overallScore)}`}>
          <span className={scoreColor(entry.overallScore)}>{entry.overallScore}</span>
          <span className="text-muted-foreground font-normal">/100</span>
        </span>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${PLATFORM_COLORS[entry.platform] || PLATFORM_COLORS.General}`}>
          {entry.platform}
        </span>
        <span className="px-2.5 py-1 rounded-full border border-border bg-muted/40 text-xs text-muted-foreground">
          {entry.fileType.toUpperCase()}
        </span>
      </div>

      {/* Tone + Date */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Icon name="TagIcon" size={12} />
          {entry.tone}
        </span>
        <span className="flex items-center gap-1">
          <Icon name="CalendarIcon" size={12} />
          {formatDate(entry.uploadedAt)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-border">
        <Link
          href="/content-analysis-results"
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
        >
          <Icon name="EyeIcon" size={13} />
          View
        </Link>
        <button
          onClick={() => onRestore(entry)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-muted text-foreground/70 text-xs font-semibold hover:bg-muted/80 hover:text-foreground transition-colors"
        >
          <Icon name="ArrowPathIcon" size={13} />
          Restore
        </button>
        <button
          className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          title="Export"
        >
          <Icon name="ArrowDownTrayIcon" size={14} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

const PLATFORMS = ['All', 'LinkedIn', 'Instagram', 'X/Twitter', 'Facebook', 'General'] as const;
const FILE_TYPES = ['All', 'pdf', 'image', 'text'] as const;
const SCORE_RANGES = ['All', '80–100', '65–79', '0–64'] as const;

export default function AnalysisArchive() {
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('All');
  const [scoreFilter, setScoreFilter] = useState<string>('All');
  const [sort, setSort] = useState<SortOption>('newest');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [restoredEntry, setRestoredEntry] = useState<ArchiveEntry | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Filter + sort
  const filtered = useMemo(() => {
    let data = [...ARCHIVE_DATA];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (e) =>
          e.filename.toLowerCase().includes(q) ||
          e.platform.toLowerCase().includes(q) ||
          e.contentType.toLowerCase().includes(q) ||
          e.tone.toLowerCase().includes(q)
      );
    }

    if (platformFilter !== 'All') data = data.filter((e) => e.platform === platformFilter);
    if (fileTypeFilter !== 'All') data = data.filter((e) => e.fileType === fileTypeFilter);
    if (scoreFilter === '80–100') data = data.filter((e) => e.overallScore >= 80);
    else if (scoreFilter === '65–79') data = data.filter((e) => e.overallScore >= 65 && e.overallScore < 80);
    else if (scoreFilter === '0–64') data = data.filter((e) => e.overallScore < 65);

    data.sort((a, b) => {
      if (sort === 'newest') return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      if (sort === 'oldest') return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
      if (sort === 'highest') return b.overallScore - a.overallScore;
      return a.overallScore - b.overallScore;
    });

    return data;
  }, [search, platformFilter, fileTypeFilter, scoreFilter, sort]);

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((e) => e.id)));
    }
  };

  const handleBulkExport = () => {
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2500);
  };

  const handleRestore = (entry: ArchiveEntry) => {
    setRestoredEntry(entry);
    setTimeout(() => setRestoredEntry(null), 3000);
  };

  const allSelected = filtered.length > 0 && selected.size === filtered.length;

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Score' },
    { value: 'lowest', label: 'Lowest Score' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analysis Archive</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {ARCHIVE_DATA.length} analyses · Browse, filter, and restore past results
          </p>
        </div>
        <Link
          href="/content-upload-studio"
          className="flex items-center gap-2 btn-primary text-sm py-2 px-4"
        >
          <Icon name="PlusIcon" size={16} />
          New Analysis
        </Link>
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by filename, platform, tone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="XMarkIcon" size={14} />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <Icon name="ChevronDownIcon" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Filter chips */}
      <div className="space-y-3">
        {/* Platform */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16 flex-shrink-0">Platform</span>
          <div className="flex gap-2 flex-wrap">
            {PLATFORMS.map((p) => (
              <FilterChip key={p} label={p} active={platformFilter === p} onClick={() => setPlatformFilter(p)} />
            ))}
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16 flex-shrink-0">Score</span>
          <div className="flex gap-2 flex-wrap">
            {SCORE_RANGES.map((r) => (
              <FilterChip key={r} label={r} active={scoreFilter === r} onClick={() => setScoreFilter(r)} />
            ))}
          </div>
        </div>

        {/* File Type */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16 flex-shrink-0">Type</span>
          <div className="flex gap-2 flex-wrap">
            {FILE_TYPES.map((t) => (
              <FilterChip key={t} label={t === 'All' ? 'All' : t.toUpperCase()} active={fileTypeFilter === t} onClick={() => setFileTypeFilter(t)} />
            ))}
          </div>
        </div>
      </div>

      {/* Bulk actions bar */}
      <div className="flex items-center justify-between gap-4 py-3 px-4 rounded-xl border border-border bg-card/60">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSelectAll}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150 flex-shrink-0 ${
              allSelected ? 'bg-primary border-primary' : 'border-border bg-background hover:border-primary/50'
            }`}
            aria-label="Select all"
          >
            {allSelected && <Icon name="CheckIcon" size={12} className="text-white" />}
          </button>
          <span className="text-sm text-muted-foreground">
            {selected.size > 0 ? (
              <span className="text-foreground font-semibold">{selected.size} selected</span>
            ) : (
              `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`
            )}
          </span>
        </div>

        <AnimatePresence>
          {selected.size > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-2"
            >
              <button
                onClick={handleBulkExport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors border border-primary/30"
              >
                <Icon name="ArrowDownTrayIcon" size={13} />
                Export {selected.size}
              </button>
              <button
                onClick={() => setSelected(new Set())}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:text-foreground transition-colors"
              >
                <Icon name="XMarkIcon" size={13} />
                Clear
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
            <Icon name="ArchiveBoxIcon" size={32} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-foreground font-semibold">No analyses found</p>
            <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters or search query</p>
          </div>
          <button
            onClick={() => { setSearch(''); setPlatformFilter('All'); setFileTypeFilter('All'); setScoreFilter('All'); }}
            className="text-primary text-sm font-medium hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((entry) => (
              <ArchiveCard
                key={entry.id}
                entry={entry}
                selected={selected.has(entry.id)}
                onSelect={toggleSelect}
                onRestore={handleRestore}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Toast: Restore notification */}
      <AnimatePresence>
        {restoredEntry && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-card border border-primary/40 shadow-2xl shadow-primary/10"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Icon name="ArrowPathIcon" size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Analysis restored</p>
              <p className="text-xs text-muted-foreground truncate max-w-[200px]">{restoredEntry.filename}</p>
            </div>
            <Link
              href="/content-analysis-results"
              className="ml-2 text-xs font-semibold text-primary hover:underline whitespace-nowrap"
            >
              View →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast: Export success */}
      <AnimatePresence>
        {exportSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-card border border-emerald-500/40 shadow-2xl shadow-emerald-500/10"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
              <Icon name="CheckCircleIcon" size={16} className="text-emerald-400" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              {selected.size} {selected.size === 1 ? 'analysis' : 'analyses'} exported successfully
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
