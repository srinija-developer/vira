'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import MetricBar from '@/components/ui/MetricBar';

const defaultContent = `Excited to share that our team just hit a major milestone — 10,000 customers in 18 months! 🎉

This journey has taught me more about resilience, teamwork, and the power of listening to your customers than any business school ever could.

When we started, everyone said B2B SaaS in this niche was too crowded. We believed in the problem we were solving.

Three things that made the difference:
→ Obsessive customer focus
→ Shipping fast and iterating faster
→ Building a culture of radical transparency

To every customer who believed in us early — thank you. You're the reason we wake up every morning. What's your biggest lesson from building something from scratch? Drop it below 👇

#StartupLife #SaaS #Entrepreneurship #B2B #Growth`;

interface SentenceScore {
  text: string;
  score: number;
  reasons: string[];
  rank: number;
}

const scoreSentence = (sentence: string, allSentences: string[]): number => {
  let score = 50;
  const s = sentence.trim();
  const words = s.split(/\s+/).length;

  if (/\d/.test(s)) score += 15;
  if (s.includes('?')) score += 10;
  if (/\b(never|always|every|zero|only|first|last|most|best|worst)\b/i.test(s)) score += 12;
  if (/\b(but|however|yet|despite|although|instead)\b/i.test(s)) score += 10;
  if (words >= 8 && words <= 20) score += 10;
  if (words < 5) score -= 15;
  if (words > 30) score -= 10;
  if (/^(excited|happy|proud|thrilled)/i.test(s)) score -= 20;
  if (/\b(believed|taught|learned|discovered|realized)\b/i.test(s)) score += 8;
  if (/\b(resilience|transparency|obsessive|radical)\b/i.test(s)) score += 8;
  if (allSentences.indexOf(sentence) === 0) score += 5;
  if (allSentences.indexOf(sentence) === allSentences.length - 1) score += 3;

  return Math.min(100, Math.max(10, score));
};

const getReasonsForScore = (sentence: string, score: number): string[] => {
  const reasons: string[] = [];
  const s = sentence.trim();
  if (/\d/.test(s)) reasons.push('Contains specific number — high credibility signal');
  if (/\b(but|however|yet|despite)\b/i.test(s)) reasons.push('Contrast creates tension and curiosity');
  if (/\b(never|always|zero|only|first|best)\b/i.test(s)) reasons.push('Absolute/superlative language — memorable');
  if (/\b(believed|taught|learned|discovered)\b/i.test(s)) reasons.push('Insight/learning framing — high shareability');
  if (/^(excited|happy|proud)/i.test(s)) reasons.push('Weak opener — emotional filler reduces impact');
  if (s.split(/\s+/).length > 25) reasons.push('Too long — loses reader attention');
  if (score >= 80) reasons.push('Strong standalone sentence — could be a hook');
  return reasons.slice(0, 3);
};

export default function GoldenSentence() {
  const [content, setContent] = useState(defaultContent);
  const [analyzed, setAnalyzed] = useState(false);
  const [sentences, setSentences] = useState<SentenceScore[]>([]);
  const [golden, setGolden] = useState<SentenceScore | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = () => {
    const raw = content.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 10);
    const scored = raw.map(s => ({
      text: s.trim(),
      score: scoreSentence(s, raw),
      reasons: getReasonsForScore(s, scoreSentence(s, raw)),
      rank: 0,
    }));
    scored.sort((a, b) => b.score - a.score);
    scored.forEach((s, i) => { s.rank = i + 1; });
    setSentences(scored);
    setGolden(scored[0] || null);
    setAnalyzed(true);
  };

  const handleCopy = () => {
    if (golden) {
      navigator.clipboard.writeText(golden.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center">
            <Icon name="StarIcon" size={20} className="text-warning" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Golden Sentence</h1>
        </div>
        <p className="text-muted-foreground text-sm max-w-xl">
          AI identifies and highlights the single most powerful sentence in your content — the one worth amplifying.
        </p>
      </div>

      {/* Input */}
      <div className="rounded-2xl border border-border bg-card card-glow p-6 space-y-4">
        <label className="text-sm font-semibold text-foreground">Your Content</label>
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); setAnalyzed(false); }}
          rows={6}
          className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          placeholder="Paste your content here..."
        />
        <div className="flex justify-end">
          <button onClick={handleAnalyze} disabled={!content.trim()} className="btn-primary text-sm py-2 px-5 flex items-center gap-2 disabled:opacity-50">
            <Icon name="StarIcon" size={16} />
            Find Golden Sentence
          </button>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {analyzed && golden && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Golden Sentence Hero */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="rounded-2xl border border-warning/40 p-8 text-center space-y-5 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #F59E0B08 0%, #F59E0B15 100%)' }}
            >
              <div className="absolute inset-0 bg-grid-pattern opacity-20" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
                    <Icon name="StarIcon" size={18} className="text-warning" />
                  </div>
                  <span className="text-xs font-bold text-warning uppercase tracking-widest">Golden Sentence</span>
                  <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
                    <Icon name="StarIcon" size={18} className="text-warning" />
                  </div>
                </div>
                <blockquote className="text-xl font-bold text-foreground leading-relaxed max-w-2xl mx-auto">
                  "{golden.text}"
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-warning font-tabular">{golden.score}</span>
                    <span className="text-sm text-muted-foreground">/100 power score</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {golden.reasons.map((r, i) => (
                    <span key={i} className="text-xs bg-warning/15 text-warning border border-warning/30 px-3 py-1 rounded-full">{r}</span>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 btn-secondary text-sm py-2 px-4"
                  >
                    <Icon name={copied ? 'CheckIcon' : 'ClipboardDocumentIcon'} size={16} />
                    {copied ? 'Copied!' : 'Copy Sentence'}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* How to Use It */}
            <div className="rounded-2xl border border-border bg-card card-glow p-6 space-y-4">
              <h3 className="font-semibold text-foreground">How to Amplify This Sentence</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: 'ArrowUpIcon', title: 'Move It to the Top', desc: 'Use it as your opening hook instead of your current first line.' },
                  { icon: 'MegaphoneIcon', title: 'Quote Card', desc: 'Turn it into a standalone visual quote card for maximum reach.' },
                  { icon: 'ChatBubbleLeftIcon', title: 'Thread Starter', desc: 'Use it as the first tweet in a thread or the subject line of an email.' },
                ].map((tip) => (
                  <div key={tip.title} className="rounded-xl bg-muted/40 border border-border p-4 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-warning/15 flex items-center justify-center">
                      <Icon name={tip.icon as Parameters<typeof Icon>[0]['name']} size={16} className="text-warning" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{tip.title}</p>
                    <p className="text-xs text-muted-foreground">{tip.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* All Sentences Ranked */}
            <div className="rounded-2xl border border-border bg-card card-glow overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground">All Sentences Ranked by Power</h3>
                <p className="text-xs text-muted-foreground mt-0.5">AI quality estimate — not a prediction of actual engagement</p>
              </div>
              <div className="divide-y divide-border">
                {sentences.slice(0, 8).map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`px-6 py-4 flex items-start gap-4 ${i === 0 ? 'bg-warning/5' : ''}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      i === 0 ? 'bg-warning/20 text-warning' : 'bg-muted text-foreground/60'
                    }`}>
                      {i === 0 ? '★' : s.rank}
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <p className={`text-sm ${i === 0 ? 'text-foreground font-medium' : 'text-foreground/75'} line-clamp-2`}>
                        "{s.text}"
                      </p>
                      <MetricBar label="" value={s.score} color={i === 0 ? '#F59E0B' : '#6B6B8A'} showValue={false} />
                    </div>
                    <span className={`text-sm font-bold font-tabular flex-shrink-0 ${i === 0 ? 'text-warning' : 'text-foreground/60'}`}>
                      {s.score}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
