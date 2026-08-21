'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';

const features = [
  {
    id: 'feat-ocr',
    icon: 'EyeIcon',
    title: 'OCR Image Reading',
    description: 'Upload a screenshot of your post and VIRA reads it using Tesseract OCR with image preprocessing for maximum accuracy.',
    tag: 'Tesseract.js',
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/20',
  },
  {
    id: 'feat-pdf',
    icon: 'DocumentTextIcon',
    title: 'PDF Text Extraction',
    description: 'Programmatic PDF parsing that preserves paragraphs, headings, and formatting — not just raw text dumps.',
    tag: 'PDF.js',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
  },
  {
    id: 'feat-scores',
    icon: 'ChartBarSquareIcon',
    title: '8-Dimension Scoring',
    description: 'Hook Strength, Clarity, Emotion, Readability, CTA, Originality, Platform Fit, Hashtag Quality — every angle covered.',
    tag: 'AI Analysis',
    color: 'text-positive',
    bg: 'bg-positive/10',
    border: 'border-positive/20',
  },
  {
    id: 'feat-rewrite',
    icon: 'PencilSquareIcon',
    title: 'AI Rewrite Studio',
    description: 'One-click rewrites: Make it Professional, Viral-Style, Conversational, Shorter, More Emotional, and 7 more modes.',
    tag: '11 Rewrite Modes',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
  },
  {
    id: 'feat-dna',
    icon: 'FingerPrintIcon',
    title: 'Content DNA Profile',
    description: 'Visual content fingerprint showing your tone dimensions: Professional, Emotional, Educational, Confident, Urgent, Creative.',
    tag: 'Unique Feature',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
  },
  {
    id: 'feat-optimizer',
    icon: 'BoltIcon',
    title: 'Live Score Optimizer',
    description: 'Edit your content in real-time and watch all 6 scores update live. See exactly which words move the needle.',
    tag: 'Real-time',
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/20',
  },
];

export default function LandingFeatures() {
  return (
    <section id="features" className="py-24 px-4 bg-muted/20">
      <div className="max-w-screen-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-3 block">
            Capabilities
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Everything your content needs
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            From raw upload to optimized post — VIRA handles the entire intelligence pipeline.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-card border border-border rounded-2xl p-6 card-glow hover:card-glow-active transition-all duration-200"
            >
              <div className={`w-12 h-12 rounded-xl ${feat.bg} border ${feat.border} flex items-center justify-center mb-4`}>
                <Icon name={feat.icon as Parameters<typeof Icon>[0]['name']} size={22} className={feat.color} />
              </div>
              <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {feat.description}
              </p>
              <span className={`text-xs font-bold ${feat.color} ${feat.bg} border ${feat.border} px-3 py-1 rounded-full`}>
                {feat.tag}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}