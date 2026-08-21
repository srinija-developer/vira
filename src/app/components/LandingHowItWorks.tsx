'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';

const steps = [
  {
    id: 'step-upload',
    number: '01',
    icon: 'ArrowUpTrayIcon',
    title: 'Upload Your Content',
    description: 'Drop in a PDF document or image file containing your social media post, caption, or ad copy. We support PDF, PNG, JPG, and JPEG.',
    detail: 'Drag & drop or click to browse',
  },
  {
    id: 'step-extract',
    number: '02',
    icon: 'DocumentMagnifyingGlassIcon',
    title: 'AI Extracts & Reads',
    description: 'Our engine extracts text from PDFs programmatically and uses OCR on images. Scanned documents are automatically detected and processed.',
    detail: 'PDF.js + Tesseract OCR',
  },
  {
    id: 'step-analyze',
    number: '03',
    icon: 'SparklesIcon',
    title: 'Get Your Intelligence Report',
    description: 'Receive a full content quality analysis — scores, tone, sentiment, keyword insights, and prioritized improvement recommendations.',
    detail: 'Results in under 10 seconds',
  },
];

export default function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4">
      <div className="max-w-screen-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-3 block">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Three steps to better content
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            No setup, no configuration. Upload, analyze, improve.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector lines */}
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step number */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center glow-violet">
                  <Icon name={step.icon as Parameters<typeof Icon>[0]['name']} size={28} className="text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 text-2xs font-black text-primary bg-background border border-primary/30 rounded-full w-6 h-6 flex items-center justify-center">
                  {step.number}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                {step.description}
              </p>
              <span className="text-xs font-semibold text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full">
                {step.detail}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}