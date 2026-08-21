'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

import MetricBar from '@/components/ui/MetricBar';

const beforeContent = `Excited to share that we hit 10k customers! 🎉

This has been a great journey and we learned a lot. The team worked really hard and we're grateful for everyone's support.

We hope to continue growing and serving our customers well.

Thanks everyone! 🙏

#startup #growth #customers`;

const afterContent = `10,000 customers. 18 months. Zero outside funding. 🎉

Here's what nobody tells you about getting there:

→ Obsessive customer focus beats any growth hack
→ Shipping fast and iterating faster wins
→ Radical transparency builds the culture you actually want

One customer told us we saved their team 12 hours a week. That's when it clicked. To everyone who believed in us early — you're the reason we show up every day.

What's your #1 lesson from building something from scratch? Share it below — I read every reply.

#FounderStory #B2BSaaS #StartupMilestone`;

const beforeScores = [
  { label: 'Hook', score: 42 },
  { label: 'Clarity', score: 55 },
  { label: 'CTA', score: 38 },
  { label: 'Emotion', score: 48 },
];

const afterScores = [
  { label: 'Hook', score: 91 },
  { label: 'Clarity', score: 86 },
  { label: 'CTA', score: 72 },
  { label: 'Emotion', score: 78 },
];

export default function LandingBeforeAfter() {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before');

  return (
    <section className="py-24 px-4">
      <div className="max-w-screen-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-3 block">
            Transformation
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            See the difference VIRA makes
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            The same LinkedIn post — before and after VIRA analysis and optimization.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card border border-border rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-negative/5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-negative" />
                <span className="text-sm font-bold text-negative">Original Content</span>
              </div>
              <span className="text-2xl font-black font-tabular text-negative">64</span>
            </div>
            <div className="p-5">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed font-sans mb-5">
                {beforeContent}
              </pre>
              <div className="space-y-2.5 border-t border-border pt-4">
                {beforeScores?.map((s) => (
                  <MetricBar key={`before-${s?.label}`} label={s?.label} score={s?.score} height={4} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-card border border-positive/30 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-positive/20 bg-positive/5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-positive" />
                <span className="text-sm font-bold text-positive">AI Optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xs text-positive font-semibold bg-positive/10 border border-positive/20 px-2 py-0.5 rounded-full">
                  +25 pts
                </span>
                <span className="text-2xl font-black font-tabular text-positive">89</span>
              </div>
            </div>
            <div className="p-5">
              <pre className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-sans mb-5">
                {afterContent}
              </pre>
              <div className="space-y-2.5 border-t border-border pt-4">
                {afterScores?.map((s) => (
                  <MetricBar key={`after-${s?.label}`} label={s?.label} score={s?.score} height={4} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Improvement callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex items-center justify-center gap-6 flex-wrap"
        >
          {[
            { label: 'Original Score', value: '64', color: 'text-negative' },
            { label: '→', value: '', color: 'text-muted-foreground' },
            { label: 'Optimized Score', value: '89', color: 'text-positive' },
            { label: '→', value: '', color: 'text-muted-foreground' },
            { label: 'Improvement', value: '+25 pts', color: 'text-accent' },
          ]?.map((item, i) => (
            <div key={`ba-stat-${i}`} className="text-center">
              {item?.value && (
                <>
                  <div className={`text-3xl font-black font-tabular ${item?.color}`}>{item?.value}</div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5">{item?.label}</div>
                </>
              )}
              {!item?.value && (
                <span className="text-2xl text-muted-foreground">{item?.label}</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}