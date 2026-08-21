'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import AppLogo from '@/components/ui/AppLogo';

export default function LandingCTA() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-screen-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative bg-card border border-primary/20 rounded-3xl p-12 md:p-16 text-center overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[100px] bg-primary/15 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center glow-violet">
                <AppLogo size={32} />
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Turn ordinary content into{' '}
              <span className="text-gradient-primary">scroll-stopping content.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Upload your first piece of content and get your intelligence report in seconds. No account required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/content-upload-studio"
                className="btn-primary text-base px-10 py-4 flex items-center gap-2 glow-violet"
              >
                <Icon name="ArrowUpTrayIcon" size={18} />
                Analyze My Content — Free
              </Link>
              <Link href="/dashboard" className="btn-secondary text-base px-8 py-4 flex items-center gap-2">
                <Icon name="RectangleGroupIcon" size={18} />
                View Demo Dashboard
              </Link>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              PDF · PNG · JPG · JPEG · No sign-up · Results in seconds
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <AppLogo size={28} />
            <span className="font-bold text-foreground">VIRA</span>
            <span className="text-xs text-muted-foreground">AI Social Content Intelligence</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 VIRA. AI-powered content quality estimates. Not affiliated with any social platform.
          </p>
        </div>
      </div>
    </section>
  );
}