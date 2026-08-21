'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import { useChat } from '@/lib/hooks/useChat';
import toast from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────────────────────

type Platform = 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'email';
type AssetType = 'social_post' | 'email_hook' | 'headline' | 'cta' | 'description';

interface RemixAsset {
  id: string;
  type: AssetType;
  platform: Platform;
  content: string;
  characterCount: number;
  tip: string;
}

interface PlatformConfig {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  charLimit: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PLATFORMS: Record<Platform, PlatformConfig> = {
  instagram: {
    label: 'Instagram',
    icon: 'CameraIcon',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    charLimit: 2200,
  },
  linkedin: {
    label: 'LinkedIn',
    icon: 'BriefcaseIcon',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    charLimit: 3000,
  },
  twitter: {
    label: 'X / Twitter',
    icon: 'ChatBubbleLeftRightIcon',
    color: 'text-sky-400',
    bgColor: 'bg-sky-400/10',
    borderColor: 'border-sky-400/30',
    charLimit: 280,
  },
  facebook: {
    label: 'Facebook',
    icon: 'UserGroupIcon',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    charLimit: 63206,
  },
  email: {
    label: 'Email',
    icon: 'EnvelopeIcon',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    charLimit: 9999,
  },
};

const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  social_post: 'Social Post',
  email_hook: 'Email Hook',
  headline: 'Headline',
  cta: 'CTA',
  description: 'Description',
};

const ASSET_TYPE_ICONS: Record<AssetType, string> = {
  social_post: 'DocumentTextIcon',
  email_hook: 'EnvelopeOpenIcon',
  headline: 'BoldIcon',
  cta: 'CursorArrowRaysIcon',
  description: 'Bars3BottomLeftIcon',
};

const PLATFORM_ORDER: Platform[] = ['instagram', 'linkedin', 'twitter', 'facebook', 'email'];

const DEFAULT_CONTENT = `Excited to share that our team just hit a major milestone — 10,000 customers in 18 months! 🎉

This journey has taught me more about resilience, teamwork, and the power of listening to your customers than any business school ever could.

Three things that made the difference:
→ Obsessive customer focus
→ Shipping fast and iterating faster
→ Building a culture of radical transparency

What's your biggest lesson from building something from scratch? Drop it below 👇

#StartupLife #SaaS #Entrepreneurship #B2B #Growth`;

// ─── Mock fallback assets ──────────────────────────────────────────────────────

const buildMockAssets = (): RemixAsset[] => [
  {
    id: 'ig-post',
    type: 'social_post',
    platform: 'instagram',
    content: `10,000 customers. 18 months. Zero outside funding. 🚀\n\nHere's what nobody tells you about building in silence:\n\n→ Obsessive customer focus beats clever marketing\n→ Shipping fast beats planning perfectly\n→ Radical transparency beats corporate polish\n\nWe believed in the problem. The market proved us right.\n\nWhat's your #1 lesson from building something from scratch? Drop it below 👇\n\n#StartupLife #SaaS #Entrepreneurship #B2B #Growth`,
    characterCount: 0,
    tip: 'Use the first line as your hook — Instagram shows only 2 lines before "more".',
  },
  {
    id: 'li-post',
    type: 'social_post',
    platform: 'linkedin',
    content: `18 months ago, everyone told us the niche was too crowded.\n\nWe shipped anyway.\n\nToday: 10,000 customers. No VC. No growth hacks. Just a team that listened harder than anyone else.\n\nThe three things that actually moved the needle weren't in any playbook:\n→ Obsessive customer focus\n→ Shipping fast and iterating faster\n→ Radical transparency — even when it was uncomfortable\n\nTo the early believers: you made this real.\n\nWhat's the one thing you wish someone had told you before you started building?`,
    characterCount: 0,
    tip: 'LinkedIn rewards storytelling. Lead with tension, resolve with insight.',
  },
  {
    id: 'tw-post',
    type: 'social_post',
    platform: 'twitter',
    content: `10,000 customers. 18 months. Zero outside funding.\n\nHere's what nobody tells you about building in silence 🧵`,
    characterCount: 0,
    tip: 'Under 280 chars. Use a thread hook — promise a reveal to drive clicks.',
  },
  {
    id: 'fb-post',
    type: 'social_post',
    platform: 'facebook',
    content: `Big news from our team — we just hit 10,000 customers in 18 months, and I want to share the real story behind it.\n\nThis wasn't a viral moment. It was 547 days of obsessive customer focus, fast shipping, and radical transparency.\n\nThree lessons that changed how I think about building:\n\n1. Your customers know what they need. Listen harder than you think is necessary.\n2. A shipped product beats a perfect plan every single time.\n3. Transparency isn't a risk — it's a competitive advantage.\n\nThank you to every customer, teammate, and early believer who made this possible. 🙏\n\nWhat's the most important lesson you've learned from building something you care about?`,
    characterCount: 0,
    tip: 'Facebook favors longer, personal stories. Ask a question to boost comments.',
  },
  {
    id: 'em-hook',
    type: 'email_hook',
    platform: 'email',
    content: `Subject: We just hit 10,000 customers — here's what actually worked\n\nPreview: (It wasn't what we expected)\n\n---\n\nHey [First Name],\n\n18 months ago we had zero customers and a product most people said was "too niche."\n\nToday we crossed 10,000.\n\nNo VC money. No viral moment. Just three principles we refused to compromise on — and I want to share them with you today.`,
    characterCount: 0,
    tip: 'Subject line + preview text work together. The preview should tease, not repeat.',
  },
  {
    id: 'ig-headline',
    type: 'headline',
    platform: 'instagram',
    content: `10,000 Customers. 18 Months. Zero Outside Funding.`,
    characterCount: 0,
    tip: 'Numbers + contrast = instant credibility. Use this as your caption opener.',
  },
  {
    id: 'li-headline',
    type: 'headline',
    platform: 'linkedin',
    content: `We Built a 10,000-Customer SaaS Without a Single Dollar of VC Money`,
    characterCount: 0,
    tip: 'LinkedIn headlines perform best when they state a specific, surprising outcome.',
  },
  {
    id: 'tw-headline',
    type: 'headline',
    platform: 'twitter',
    content: `Nobody told us building in silence would work. It did.`,
    characterCount: 0,
    tip: 'Intrigue > information on X. Make them want to click.',
  },
  {
    id: 'ig-cta',
    type: 'cta',
    platform: 'instagram',
    content: `Drop your biggest startup lesson in the comments — I read every single one. 👇`,
    characterCount: 0,
    tip: 'Specific CTAs ("drop in comments") outperform vague ones ("engage below").',
  },
  {
    id: 'li-desc',
    type: 'description',
    platform: 'linkedin',
    content: `A candid look at how a bootstrapped SaaS team reached 10,000 customers in 18 months — the three principles that drove growth, the mistakes we almost made, and what we'd do differently if we started over today.`,
    characterCount: 0,
    tip: 'LinkedIn article descriptions should promise a specific takeaway to drive clicks.',
  },
];

// ─── Parse AI response ─────────────────────────────────────────────────────────

function parseAIResponse(raw: string): RemixAsset[] {
  try {
    const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/) || raw.match(/(\[[\s\S]*\])/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1]);
      if (Array.isArray(parsed)) {
        return parsed.map((item: RemixAsset, i: number) => ({
          ...item,
          id: item.id || `asset-${i}`,
          characterCount: (item.content || '').length,
        }));
      }
    }
  } catch {
    // fall through to mock
  }
  return buildMockAssets().map((a) => ({ ...a, characterCount: a.content.length }));
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContentRemix() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [assets, setAssets] = useState<RemixAsset[]>([]);
  const [generated, setGenerated] = useState(false);
  const [activePlatform, setActivePlatform] = useState<Platform | 'all'>('all');
  const [activeType, setActiveType] = useState<AssetType | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { response, isLoading, error, sendMessage } = useChat('OPEN_AI', 'gpt-4o', false);

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  useEffect(() => {
    if (response && !isLoading) {
      const parsed = parseAIResponse(response);
      setAssets(parsed);
      setGenerated(true);
    }
  }, [response, isLoading]);

  const handleGenerate = () => {
    if (!content.trim()) {
      toast.error('Please paste some content first.');
      return;
    }

    const prompt = `You are a world-class content strategist and copywriter. Given the source content below, generate exactly 10 complementary marketing assets as a JSON array.

SOURCE CONTENT:
"""
${content}
"""

Return ONLY a JSON array (no markdown prose outside the code block) with exactly 10 objects. Each object must have:
- "id": unique string -"type": one of "social_post" | "email_hook" | "headline" | "cta" | "description" -"platform": one of "instagram" | "linkedin" | "twitter" | "facebook" | "email" -"content": the asset text (platform-appropriate length and tone)
- "characterCount": number of characters in content -"tip": one short platform-specific copywriting tip (max 15 words)

Required distribution (exactly):
1. Instagram social post
2. LinkedIn social post
3. X/Twitter social post (≤280 chars)
4. Facebook social post
5. Email hook (subject + preview + opening paragraph)
6. Instagram headline
7. LinkedIn headline
8. X/Twitter headline (≤100 chars)
9. Instagram or Facebook CTA (1 sentence)
10. LinkedIn description (2–3 sentences)

Adapt tone and length for each platform. Be specific, punchy, and avoid generic filler.

Return the array inside a \`\`\`json code block.`;

    sendMessage([
      { role: 'system', content: 'You are a world-class content strategist. Always respond with valid JSON inside a ```json code block.' },
      { role: 'user', content: prompt },
    ], { max_completion_tokens: 3000 });
  };

  const filteredAssets = assets.filter((a) => {
    const matchPlatform = activePlatform === 'all' || a.platform === activePlatform;
    const matchType = activeType === 'all' || a.type === activeType;
    return matchPlatform && matchType;
  });

  const platformCounts = PLATFORM_ORDER.reduce<Record<string, number>>((acc, p) => {
    acc[p] = assets.filter((a) => a.platform === p).length;
    return acc;
  }, {});

  const handleCopy = (asset: RemixAsset) => {
    navigator.clipboard.writeText(asset.content).then(() => {
      setCopiedId(asset.id);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleCopyAll = () => {
    const text = filteredAssets
      .map((a) => `[${PLATFORMS[a.platform].label} — ${ASSET_TYPE_LABELS[a.type]}]\n${a.content}`)
      .join('\n\n---\n\n');
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`Copied ${filteredAssets.length} assets!`);
    });
  };

  const platformOrder = ['instagram', 'linkedin', 'twitter', 'facebook', 'email'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Remix</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Turn one piece of content into 10 platform-ready assets — posts, hooks, headlines, CTAs, and descriptions.
          </p>
        </div>
        {generated && (
          <button
            onClick={handleCopyAll}
            className="btn-secondary flex items-center gap-2 text-sm self-start sm:self-auto"
          >
            <Icon name="ClipboardDocumentListIcon" size={16} />
            Copy All ({filteredAssets.length})
          </button>
        )}
      </div>

      {/* Input Panel */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Icon name="DocumentTextIcon" size={18} className="text-primary" />
          <h2 className="font-semibold text-foreground text-sm">Source Content</h2>
          <span className="ml-auto text-xs text-muted-foreground">{content.length} chars</span>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          placeholder="Paste your blog post, LinkedIn article, tweet thread, email, or any piece of content here…"
          className="w-full resize-none rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm p-4 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Works best with 100–2000 words. Supports posts, articles, emails, scripts.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !content.trim()}
            className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Icon name="ArrowPathIcon" size={16} />
                </motion.div>
                Remixing…
              </>
            ) : (
              <>
                <Icon name="SparklesIcon" size={16} />
                {generated ? 'Remix Again' : 'Generate 10 Assets'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading skeleton */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-muted-foreground text-sm">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              >
                <Icon name="ArrowPathIcon" size={18} className="text-primary" />
              </motion.div>
              <span>Generating platform-specific variants…</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-5 space-y-3 animate-pulse">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted" />
                    <div className="h-3 w-24 bg-muted rounded" />
                    <div className="ml-auto h-3 w-16 bg-muted rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                    <div className="h-3 bg-muted rounded w-4/6" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {generated && !isLoading && assets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Platform tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActivePlatform('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activePlatform === 'all' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                All ({assets.length})
              </button>
              {PLATFORM_ORDER.map((p) => {
                const cfg = PLATFORMS[p];
                const count = platformCounts[p] || 0;
                if (!count) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setActivePlatform(activePlatform === p ? 'all' : p)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      activePlatform === p
                        ? `${cfg.bgColor} ${cfg.color} ${cfg.borderColor}`
                        : 'bg-muted border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name={cfg.icon as Parameters<typeof Icon>[0]['name']} size={12} />
                    {cfg.label}
                    <span className="opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Asset type filter */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'social_post', 'email_hook', 'headline', 'cta', 'description'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeType === t
                      ? 'bg-secondary text-secondary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t === 'all' ? 'All Types' : ASSET_TYPE_LABELS[t]}
                </button>
              ))}
            </div>

            {/* Asset grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredAssets.map((asset, idx) => {
                  const cfg = PLATFORMS[asset.platform];
                  const isCopied = copiedId === asset.id;
                  const charCount = asset.content.length;
                  const overLimit = cfg.charLimit < 9999 && charCount > cfg.charLimit;

                  return (
                    <motion.div
                      key={asset.id}
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.04, duration: 0.25 }}
                      className={`bg-card border rounded-2xl p-5 flex flex-col gap-4 ${cfg.borderColor}`}
                    >
                      {/* Card header */}
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${cfg.bgColor}`}>
                          <Icon
                            name={cfg.icon as Parameters<typeof Icon>[0]['name']}
                            size={14}
                            className={cfg.color}
                          />
                        </div>
                        <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Icon
                            name={ASSET_TYPE_ICONS[asset.type] as Parameters<typeof Icon>[0]['name']}
                            size={12}
                          />
                          {ASSET_TYPE_LABELS[asset.type]}
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          <span className={`text-xs font-medium ${overLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {charCount}
                            {cfg.charLimit < 9999 && `/${cfg.charLimit}`}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap flex-1">
                        {asset.content}
                      </p>

                      {/* Tip */}
                      {asset.tip && (
                        <div className="flex items-start gap-2 bg-muted/50 rounded-lg px-3 py-2">
                          <Icon name="LightBulbIcon" size={13} className="text-amber-500 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-muted-foreground leading-snug">{asset.tip}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-1 border-t border-border">
                        <button
                          onClick={() => handleCopy(asset)}
                          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                            isCopied
                              ? 'bg-emerald-500/10 text-emerald-500' :'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                          }`}
                        >
                          <Icon name={isCopied ? 'CheckIcon' : 'ClipboardDocumentIcon'} size={13} />
                          {isCopied ? 'Copied!' : 'Copy'}
                        </button>
                        {overLimit && (
                          <span className="text-xs text-destructive flex items-center gap-1">
                            <Icon name="ExclamationTriangleIcon" size={12} />
                            Over limit
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {filteredAssets.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="FunnelIcon" size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">No assets match the current filters.</p>
                <button
                  onClick={() => { setActivePlatform('all'); setActiveType('all'); }}
                  className="mt-3 text-xs text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!generated && !isLoading && (
        <div className="text-center py-16 text-muted-foreground">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Icon name="SparklesIcon" size={28} className="text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">Ready to remix</h3>
          <p className="text-sm max-w-sm mx-auto">
            Paste any content above and click <strong>Generate 10 Assets</strong> to get platform-specific variants instantly.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {PLATFORM_ORDER.map((p) => {
              const cfg = PLATFORMS[p];
              return (
                <span key={p} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border ${cfg.bgColor} ${cfg.color} ${cfg.borderColor}`}>
                  <Icon name={cfg.icon as Parameters<typeof Icon>[0]['name']} size={12} />
                  {cfg.label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
