'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import { motion } from 'framer-motion';

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-card/90 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <AppLogo size={32} />
            <span className="font-bold text-lg tracking-tight">VIRA</span>
            <span className="text-xs font-medium text-muted-foreground border border-border rounded-full px-2 py-0.5 hidden sm:block">
              AI
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {['Features', 'How It Works', 'Pricing']?.map((item) => (
              <a
                key={`landing-nav-${item}`}
                href={`#${item?.toLowerCase()?.replace(/\s+/g, '-')}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="btn-ghost text-sm hidden sm:flex items-center gap-2">
              Sign In
            </Link>
            <Link href="/content-upload-studio" className="btn-primary text-sm flex items-center gap-2">
              <Icon name="SparklesIcon" size={14} />
              Try Free
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}