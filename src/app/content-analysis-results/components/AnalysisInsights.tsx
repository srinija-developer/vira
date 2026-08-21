'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import { mockAnalysisResult } from '@/lib/mockData';

export default function AnalysisInsights() {
  const { insights, keywords, hashtags } = mockAnalysisResult;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-3 gap-6">
      {/* Content Insights */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card border border-border rounded-2xl p-6 card-glow"
      >
        <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
          <Icon name="LightBulbIcon" size={18} className="text-warning" />
          Content Insights
        </h2>

        <div className="space-y-4">
          <div className="bg-positive/5 border border-positive/20 rounded-xl p-4">
            <p className="text-2xs font-bold uppercase tracking-wider text-positive mb-1.5">Strongest Sentence</p>
            <p className="text-sm text-foreground font-medium leading-relaxed italic">
              {insights?.strongestSentence}
            </p>
          </div>

          <div className="bg-warning/5 border border-warning/20 rounded-xl p-4">
            <p className="text-2xs font-bold uppercase tracking-wider text-warning mb-1.5">Weakest Section</p>
            <p className="text-sm text-foreground leading-relaxed">{insights?.weakestSection}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Word Count', value: insights?.wordCount?.toString(), icon: 'DocumentTextIcon' },
              { label: 'Reading Time', value: insights?.readingTime, icon: 'ClockIcon' },
              { label: 'Sentences', value: insights?.sentenceCount?.toString(), icon: 'ListBulletIcon' },
              { label: 'Avg Length', value: `${insights?.avgSentenceLength} words`, icon: 'ArrowsRightLeftIcon' },
            ]?.map((stat) => (
              <div key={`insight-stat-${stat?.label}`} className="bg-muted rounded-xl p-3">
                <p className="text-2xs text-muted-foreground font-medium mb-0.5">{stat?.label}</p>
                <p className="text-sm font-bold font-tabular text-foreground">{stat?.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {[
              { label: 'CTA Detected', value: insights?.ctaDetected, positive: true },
              { label: 'Questions', value: `${insights?.questions} found`, positive: true },
              { label: 'Passive Voice', value: `${insights?.passiveVoiceCount} instance`, positive: false },
              { label: 'Filler Words', value: insights?.fillerWords?.join(', '), positive: false },
            ]?.map((item) => (
              <div key={`detect-${item?.label}`} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{item?.label}</span>
                <span className={`text-xs font-semibold ${item?.positive ? 'text-positive' : 'text-warning'}`}>
                  {typeof item?.value === 'boolean' ? (item?.value ? '✓ Yes' : '✗ No') : item?.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      {/* Keyword Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6 card-glow"
      >
        <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
          <Icon name="TagIcon" size={18} className="text-primary" />
          Keyword Analysis
        </h2>

        <div className="space-y-5">
          {[
            { label: 'Important Keywords', words: keywords?.important, color: 'bg-primary/10 text-primary border-primary/20' },
            { label: 'Repeated Words', words: keywords?.repeated, color: 'bg-warning/10 text-warning border-warning/20' },
            { label: 'Weak Words', words: keywords?.weak, color: 'bg-negative/10 text-negative border-negative/20' },
            { label: 'Potential Keywords', words: keywords?.potential, color: 'bg-positive/10 text-positive border-positive/20' },
          ]?.map((group) => (
            <div key={`kw-group-${group?.label}`}>
              <p className="text-2xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{group?.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {group?.words?.map((word) => (
                  <span
                    key={`kw-${group?.label}-${word}`}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${group?.color}`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      {/* Hashtag Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-6 card-glow"
      >
        <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
          <Icon name="HashtagIcon" size={18} className="text-accent" />
          Hashtag Analysis
        </h2>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded-xl p-3 text-center">
              <p className="text-2xl font-black font-tabular text-foreground">{hashtags?.count}</p>
              <p className="text-2xs text-muted-foreground font-medium mt-0.5">Total Tags</p>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <p className="text-2xl font-black font-tabular text-warning">{hashtags?.relevanceScore}</p>
              <p className="text-2xs text-muted-foreground font-medium mt-0.5">Relevance Score</p>
            </div>
          </div>

          <div>
            <p className="text-2xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Current Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {hashtags?.tags?.map((tag) => {
                const isGeneric = hashtags?.generic?.includes(tag);
                return (
                  <span
                    key={`hashtag-${tag}`}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      isGeneric
                        ? 'bg-warning/10 text-warning border-warning/20' :'bg-accent/10 text-accent border-accent/20'
                    }`}
                  >
                    {tag}
                    {isGeneric && ' ⚠'}
                  </span>
                );
              })}
            </div>
            <p className="text-2xs text-muted-foreground mt-2">⚠ = generic / high-competition tag</p>
          </div>

          <div>
            <p className="text-2xs font-bold uppercase tracking-wider text-positive mb-2">Suggested Replacements</p>
            <div className="flex flex-wrap gap-1.5">
              {hashtags?.suggestions?.map((tag) => (
                <span
                  key={`suggestion-${tag}`}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-positive/10 text-positive border-positive/20 cursor-pointer hover:bg-positive/20 transition-colors"
                >
                  + {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}