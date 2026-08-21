'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';

const defaultContent = `Excited to share that our team just hit a major milestone — 10,000 customers in 18 months! 🎉

This journey has taught me more about resilience, teamwork, and the power of listening to your customers than any business school ever could.

When we started, everyone said B2B SaaS in this niche was too crowded. We believed in the problem we were solving.

Three things that made the difference:
→ Obsessive customer focus
→ Shipping fast and iterating faster
→ Building a culture of radical transparency

To every customer who believed in us early — thank you. You're the reason we wake up every morning. What's your biggest lesson from building something from scratch? Drop it below 👇

#StartupLife #SaaS #Entrepreneurship #B2B #Growth`;

type Severity = 'critical' | 'warning' | 'info';

interface RedFlag {
  id: string;
  category: string;
  title: string;
  description: string;
  excerpt: string;
  severity: Severity;
  fix: string;
  icon: string;
}

const scanContent = (text: string): RedFlag[] => {
  const flags: RedFlag[] = [];

  if (/^(excited|happy|proud|thrilled|pleased)/i.test(text.trim())) {
    flags.push({
      id: 'weak-opener',
      category: 'Hook',
      title: 'Weak Emotional Opener',
      description: 'Starting with "Excited/Happy/Proud" is one of the most common LinkedIn clichés. It signals low effort and gets skipped.',
      excerpt: text.trim().split('\n')[0].slice(0, 80),
      severity: 'critical',
      fix: 'Lead with the result or the number. "10,000 customers. 18 months." is 10x stronger.',
      icon: 'ExclamationCircleIcon',
    });
  }

  const fillerMatches = text.match(/\b(just|very|really|quite|basically|literally|actually|honestly)\b/gi);
  if (fillerMatches && fillerMatches.length >= 2) {
    flags.push({
      id: 'filler-words',
      category: 'Language',
      title: `Filler Words Detected (${fillerMatches.length}x)`,
      description: 'Filler words dilute your message and reduce perceived authority. Each one weakens your credibility.',
      excerpt: fillerMatches.slice(0, 4).join(', '),
      severity: 'warning',
      fix: 'Remove all filler words. "We just hit" → "We hit". Every word should earn its place.',
      icon: 'MinusCircleIcon',
    });
  }

  const genericHashtags = ['#startuplife', '#growth', '#success', '#motivation', '#entrepreneur'];
  const foundGeneric = genericHashtags.filter(tag => text.toLowerCase().includes(tag));
  if (foundGeneric.length >= 2) {
    flags.push({
      id: 'generic-hashtags',
      category: 'Hashtags',
      title: 'Generic High-Volume Hashtags',
      description: 'Tags like #StartupLife and #Growth have millions of posts. Your content drowns in the noise.',
      excerpt: foundGeneric.join(', '),
      severity: 'warning',
      fix: 'Replace with niche-specific tags: #B2BSaaS, #FounderStory, #StartupMilestone.',
      icon: 'HashtagIcon',
    });
  }

  if (text.toLowerCase().includes('drop it below') || text.toLowerCase().includes('let me know') || text.toLowerCase().includes('thoughts?')) {
    flags.push({
      id: 'weak-cta',
      category: 'CTA',
      title: 'Vague Call-to-Action',
      description: '"Drop it below" and "Let me know" are passive CTAs. They don\'t give the audience a specific reason to engage.',
      excerpt: 'Drop it below 👇',
      severity: 'warning',
      fix: 'Be specific: "Share your #1 lesson in one sentence — I read every reply."',
      icon: 'CursorArrowRaysIcon',
    });
  }

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
  const longSentences = sentences.filter(s => s.split(' ').length > 30);
  if (longSentences.length > 0) {
    flags.push({
      id: 'long-sentences',
      category: 'Readability',
      title: `${longSentences.length} Overly Long Sentence(s)`,
      description: 'Sentences over 30 words are hard to scan on mobile. LinkedIn readers skim — long sentences lose them.',
      excerpt: longSentences[0].trim().slice(0, 80) + '...',
      severity: 'info',
      fix: 'Break long sentences into 2–3 shorter ones. Aim for 15–20 words max per sentence.',
      icon: 'DocumentTextIcon',
    });
  }

  if (text.toLowerCase().includes('to every') || text.toLowerCase().includes('everyone who')) {
    flags.push({
      id: 'generic-gratitude',
      category: 'Emotional Impact',
      title: 'Generic Gratitude Statement',
      description: '"To every customer who believed in us" is abstract. Readers can\'t connect with a crowd — they connect with a story.',
      excerpt: 'To every customer who believed in us early',
      severity: 'info',
      fix: 'Name one specific customer or moment: "One customer told us we saved their team 12 hours a week."',
      icon: 'HeartIcon',
    });
  }

  const words = text.split(/\s+/).filter(Boolean);
  if (words.length > 300) {
    flags.push({
      id: 'too-long',
      category: 'Length',
      title: `Content Too Long (${words.length} words)`,
      description: 'LinkedIn posts over 300 words see significant drop-off. Most readers won\'t reach your CTA.',
      excerpt: `${words.length} words detected`,
      severity: 'warning',
      fix: 'Trim to 150–250 words. Cut the weakest paragraph first.',
      icon: 'ScissorsIcon',
    });
  }

  return flags;
};

const severityConfig: Record<Severity, { label: string; color: string; bg: string; border: string }> = {
  critical: { label: 'Critical', color: '#EF4444', bg: '#EF444410', border: '#EF444430' },
  warning: { label: 'Warning', color: '#F59E0B', bg: '#F59E0B10', border: '#F59E0B30' },
  info: { label: 'Suggestion', color: '#06B6D4', bg: '#06B6D410', border: '#06B6D430' },
};

export default function RedFlagScanner() {
  const [content, setContent] = useState(defaultContent);
  const [analyzed, setAnalyzed] = useState(false);
  const [flags, setFlags] = useState<RedFlag[]>([]);
  const [expandedFlag, setExpandedFlag] = useState<string | null>(null);

  const handleScan = () => {
    setFlags(scanContent(content));
    setAnalyzed(true);
    setExpandedFlag(null);
  };

  const criticalCount = flags.filter(f => f.severity === 'critical').length;
  const warningCount = flags.filter(f => f.severity === 'warning').length;
  const infoCount = flags.filter(f => f.severity === 'info').length;

  const healthScore = Math.max(0, 100 - criticalCount * 25 - warningCount * 12 - infoCount * 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-negative/15 flex items-center justify-center">
            <Icon name="ShieldExclamationIcon" size={20} className="text-negative" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Red Flag Scanner</h1>
        </div>
        <p className="text-muted-foreground text-sm max-w-xl">
          Detects problematic content patterns that silently kill engagement before readers even start.
        </p>
      </div>

      {/* Input */}
      <div className="rounded-2xl border border-border bg-card card-glow p-6 space-y-4">
        <label className="text-sm font-semibold text-foreground">Content to Scan</label>
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); setAnalyzed(false); }}
          rows={6}
          className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          placeholder="Paste your content here..."
        />
        <div className="flex justify-end">
          <button onClick={handleScan} disabled={!content.trim()} className="btn-primary text-sm py-2 px-5 flex items-center gap-2 disabled:opacity-50">
            <Icon name="ShieldExclamationIcon" size={16} />
            Scan for Red Flags
          </button>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {analyzed && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <p className={`text-3xl font-bold font-tabular ${healthScore >= 80 ? 'text-positive' : healthScore >= 60 ? 'text-warning' : 'text-negative'}`}>{healthScore}</p>
                <p className="text-xs text-muted-foreground mt-1">Health Score</p>
              </div>
              <div className="rounded-xl border border-negative/30 bg-negative/5 p-4 text-center">
                <p className="text-3xl font-bold font-tabular text-negative">{criticalCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Critical</p>
              </div>
              <div className="rounded-xl border border-warning/30 bg-warning/5 p-4 text-center">
                <p className="text-3xl font-bold font-tabular text-warning">{warningCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Warnings</p>
              </div>
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-center">
                <p className="text-3xl font-bold font-tabular text-accent">{infoCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Suggestions</p>
              </div>
            </div>

            {flags.length === 0 ? (
              <div className="rounded-2xl border border-positive/30 bg-positive/5 p-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-positive/20 flex items-center justify-center mx-auto">
                  <Icon name="ShieldCheckIcon" size={32} className="text-positive" />
                </div>
                <p className="text-lg font-bold text-foreground">No Red Flags Detected</p>
                <p className="text-sm text-muted-foreground">Your content is clean. No major problematic patterns found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">{flags.length} Issue{flags.length !== 1 ? 's' : ''} Found</h3>
                {flags.map((flag, i) => {
                  const config = severityConfig[flag.severity];
                  return (
                    <motion.div
                      key={flag.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="rounded-2xl border overflow-hidden"
                      style={{ borderColor: config.border, backgroundColor: 'transparent' }}
                    >
                      <button
                        onClick={() => setExpandedFlag(expandedFlag === flag.id ? null : flag.id)}
                        className="w-full flex items-center gap-4 p-5 text-left"
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: config.color + '20' }}>
                          <Icon name={flag.icon as Parameters<typeof Icon>[0]['name']} size={20} style={{ color: config.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-foreground">{flag.title}</span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: config.color, backgroundColor: config.color + '20' }}>
                              {config.label}
                            </span>
                            <span className="text-xs text-foreground/70">{flag.category}</span>
                          </div>
                          <p className="text-xs text-foreground/70 mt-0.5 truncate">"{flag.excerpt}"</p>
                        </div>
                        <Icon name={expandedFlag === flag.id ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={16} className="text-muted-foreground flex-shrink-0" />
                      </button>
                      <AnimatePresence>
                        {expandedFlag === flag.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 space-y-3 border-t border-border/30">
                              <div className="pt-4">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Why It's a Problem</p>
                                <p className="text-sm text-foreground">{flag.description}</p>
                              </div>
                              <div className="rounded-xl p-4 border" style={{ backgroundColor: config.color + '12', borderColor: config.color + '35' }}>
                                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: config.color }}>The Fix</p>
                                <p className="text-sm text-foreground">{flag.fix}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
