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

interface ContentLayer {
  id: string;
  label: string;
  icon: string;
  color: string;
  items: { text: string; type: 'positive' | 'neutral' | 'warning' }[];
}

interface StructureBlock {
  label: string;
  content: string;
  score: number;
  color: string;
  feedback: string;
}

const analyzeContent = (text: string) => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
  const words = text.split(/\s+/).filter(Boolean);
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  const hashtags = text.match(/#\w+/g) || [];
  const emojis = text.match(/\p{Emoji}/gu) || [];
  const questions = text.match(/\?/g) || [];
  const bullets = text.match(/^[→•\-\*]/gm) || [];

  const layers: ContentLayer[] = [
    {
      id: 'hook',
      label: 'Hook Layer',
      icon: 'BoltIcon',
      color: '#7C3AED',
      items: [
        { text: sentences[0]?.trim().slice(0, 80) + '...', type: sentences[0]?.toLowerCase().startsWith('excited') ? 'warning' : 'positive' },
        { text: `Opens with ${sentences[0]?.toLowerCase().startsWith('excited') ? 'weak emotional filler' : 'direct statement'}`, type: sentences[0]?.toLowerCase().startsWith('excited') ? 'warning' : 'positive' },
        { text: `First sentence: ${sentences[0]?.split(' ').length || 0} words`, type: (sentences[0]?.split(' ').length || 0) > 20 ? 'warning' : 'positive' },
      ],
    },
    {
      id: 'structure',
      label: 'Structure Layer',
      icon: 'Squares2X2Icon',
      color: '#06B6D4',
      items: [
        { text: `${paragraphs.length} paragraphs detected`, type: paragraphs.length >= 3 ? 'positive' : 'warning' },
        { text: `${bullets.length} bullet/list items`, type: bullets.length > 0 ? 'positive' : 'neutral' },
        { text: `${sentences.length} total sentences`, type: 'neutral' },
        { text: `Avg sentence length: ${Math.round(words.length / Math.max(sentences.length, 1))} words`, type: Math.round(words.length / Math.max(sentences.length, 1)) > 20 ? 'warning' : 'positive' },
      ],
    },
    {
      id: 'engagement',
      label: 'Engagement Layer',
      icon: 'HeartIcon',
      color: '#F59E0B',
      items: [
        { text: `${emojis.length} emojis used`, type: emojis.length > 0 && emojis.length <= 4 ? 'positive' : emojis.length > 4 ? 'warning' : 'neutral' },
        { text: `${questions.length} question(s) — drives comments`, type: questions.length > 0 ? 'positive' : 'warning' },
        { text: hashtags.length > 0 ? `${hashtags.length} hashtags: ${hashtags.slice(0, 3).join(', ')}` : 'No hashtags detected', type: hashtags.length > 0 ? 'positive' : 'neutral' },
      ],
    },
    {
      id: 'cta',
      label: 'CTA Layer',
      icon: 'CursorArrowRaysIcon',
      color: '#10B981',
      items: [
        { text: text.toLowerCase().includes('drop') || text.toLowerCase().includes('comment') || text.toLowerCase().includes('share') ? 'CTA detected in content' : 'No clear CTA found', type: text.toLowerCase().includes('drop') || text.toLowerCase().includes('comment') ? 'positive' : 'warning' },
        { text: text.includes('?') ? 'Engagement question present' : 'Missing engagement question', type: text.includes('?') ? 'positive' : 'warning' },
        { text: 'CTA placement: end of content', type: 'neutral' },
      ],
    },
    {
      id: 'language',
      label: 'Language Layer',
      icon: 'LanguageIcon',
      color: '#A78BFA',
      items: [
        { text: `${words.length} total words`, type: words.length >= 100 && words.length <= 300 ? 'positive' : 'warning' },
        { text: `Reading level: ${words.length > 200 ? 'Intermediate' : 'Easy'}`, type: 'neutral' },
        { text: text.match(/\b(just|very|really|quite|basically)\b/gi)?.length ? `${text.match(/\b(just|very|really|quite|basically)\b/gi)!.length} filler words detected` : 'No major filler words', type: text.match(/\b(just|very|really|quite|basically)\b/gi)?.length ? 'warning' : 'positive' },
      ],
    },
  ];

  const blocks: StructureBlock[] = [
    {
      label: 'Opening / Hook',
      content: paragraphs[0]?.slice(0, 120) + (paragraphs[0]?.length > 120 ? '...' : '') || '',
      score: sentences[0]?.toLowerCase().startsWith('excited') ? 62 : 88,
      color: '#7C3AED',
      feedback: sentences[0]?.toLowerCase().startsWith('excited') ? 'Weak opener — starts with emotional filler' : 'Strong direct opening',
    },
    {
      label: 'Body / Narrative',
      content: paragraphs.slice(1, -1).join(' ').slice(0, 120) + '...',
      score: bullets.length > 0 ? 85 : 70,
      color: '#06B6D4',
      feedback: bullets.length > 0 ? 'Good use of lists for scannability' : 'Dense paragraphs — consider breaking up',
    },
    {
      label: 'Closing / CTA',
      content: paragraphs[paragraphs.length - 1]?.slice(0, 120) + '...' || '',
      score: questions.length > 0 ? 74 : 45,
      color: '#10B981',
      feedback: questions.length > 0 ? 'Engagement question present but could be more specific' : 'Weak close — no clear CTA',
    },
  ];

  return { layers, blocks, wordCount: words.length, sentenceCount: sentences.length, paragraphCount: paragraphs.length };
};

export default function ContentXRay() {
  const [content, setContent] = useState(defaultContent);
  const [analyzed, setAnalyzed] = useState(false);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [result, setResult] = useState<ReturnType<typeof analyzeContent> | null>(null);

  const handleAnalyze = () => {
    setResult(analyzeContent(content));
    setAnalyzed(true);
    setActiveLayer(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
            <Icon name="MagnifyingGlassIcon" size={20} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Content X-Ray</h1>
        </div>
        <p className="text-muted-foreground text-sm max-w-xl">
          Deep structural breakdown of your content — layer by layer, sentence by sentence.
        </p>
      </div>

      {/* Input */}
      <div className="rounded-2xl border border-border bg-card card-glow p-6 space-y-4">
        <label className="text-sm font-semibold text-foreground">Content to X-Ray</label>
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); setAnalyzed(false); }}
          rows={6}
          className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          placeholder="Paste your content here..."
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{content.split(/\s+/).filter(Boolean).length} words</p>
          <button onClick={handleAnalyze} disabled={!content.trim()} className="btn-primary text-sm py-2 px-5 flex items-center gap-2 disabled:opacity-50">
            <Icon name="MagnifyingGlassIcon" size={16} />
            Run X-Ray
          </button>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {analyzed && result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Words', value: result.wordCount, icon: 'DocumentTextIcon' },
                { label: 'Sentences', value: result.sentenceCount, icon: 'ChatBubbleLeftIcon' },
                { label: 'Paragraphs', value: result.paragraphCount, icon: 'Bars3Icon' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-2xl font-bold text-foreground font-tabular">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Structure Blocks */}
            <div className="rounded-2xl border border-border bg-card card-glow overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Content Structure Map</h3>
                <p className="text-xs text-muted-foreground mt-0.5">How your content is architecturally organized</p>
              </div>
              <div className="p-6 space-y-4">
                {result.blocks.map((block, i) => (
                  <div key={i} className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: block.color }} />
                        <span className="text-sm font-semibold text-foreground">{block.label}</span>
                      </div>
                      <span className="text-sm font-bold font-tabular" style={{ color: block.color }}>{block.score}/100</span>
                    </div>
                    <p className="text-xs text-foreground/70 italic line-clamp-2">"{block.content}"</p>
                    <MetricBar label="" value={block.score} color={block.color} showValue={false} />
                    <p className="text-xs text-foreground/80">{block.feedback}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Layer Explorer */}
            <div className="rounded-2xl border border-border bg-card card-glow overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Layer-by-Layer Breakdown</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Click a layer to inspect it</p>
              </div>
              <div className="p-6 space-y-3">
                {result.layers.map((layer) => (
                  <div key={layer.id}>
                    <button
                      onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
                      className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: layer.color + '20' }}>
                          <Icon name={layer.icon as Parameters<typeof Icon>[0]['name']} size={16} style={{ color: layer.color }} />
                        </div>
                        <span className="text-sm font-semibold text-foreground">{layer.label}</span>
                      </div>
                      <Icon name={activeLayer === layer.id ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={16} className="text-muted-foreground" />
                    </button>
                    <AnimatePresence>
                      {activeLayer === layer.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 ml-4 space-y-2 pb-2">
                            {layer.items.map((item, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                                  item.type === 'positive' ? 'bg-positive' : item.type === 'warning' ? 'bg-warning' : 'bg-muted-foreground'
                                }`} />
                                {item.text}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
