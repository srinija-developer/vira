'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'SquaresFour' },
  { label: 'Analyze', href: '/content-upload-studio', icon: 'ArrowUpTray' },
  { label: 'Results', href: '/content-analysis-results', icon: 'ChartBarSquare' },
  { label: 'Optimizer', href: '/content-optimizer', icon: 'SparklesIcon' },
  { label: 'Hook Arena', href: '/hook-battle-arena', icon: 'BoltIcon' },
  { label: 'X-Ray', href: '/content-xray', icon: 'MagnifyingGlassIcon' },
  { label: 'Personas', href: '/audience-persona-simulator', icon: 'UsersIcon' },
  { label: 'Red Flags', href: '/red-flag-scanner', icon: 'ShieldExclamationIcon' },
  { label: 'Golden', href: '/golden-sentence', icon: 'StarIcon' },
  { label: 'A/B Lab', href: '/ab-content-lab', icon: 'BeakerIcon' },
  { label: 'Remix', href: '/content-remix', icon: 'ArrowPathRoundedSquareIcon' },
  { label: 'Archive', href: '/analysis-archive', icon: 'ArchiveBoxIcon' },
  { label: 'Reports', href: '/performance-reports', icon: 'DocumentChartBarIcon' },
  { label: 'Account', href: '/account', icon: 'UserCircleIcon' },
  { label: 'Settings', href: '/settings', icon: 'Cog6ToothIcon' },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
              <AppLogo size={32} />
              <span className="font-bold text-lg tracking-tight text-foreground hidden sm:block">
                VIRA
              </span>
              <span className="hidden sm:block text-xs font-medium text-muted-foreground border border-border rounded-full px-2 py-0.5">
                AI
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
                return (
                  <Link
                    key={`nav-${item.href}`}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon
                      name={item.icon as Parameters<typeof Icon>[0]['name']}
                      size={16}
                      variant={isActive ? 'solid' : 'outline'}
                    />
                    {item.label}
                    {item.badge && (
                      <span className="bg-primary text-primary-foreground text-2xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/content-upload-studio"
                className="hidden md:flex items-center gap-2 btn-primary text-sm py-2 px-4"
              >
                <Icon name="PlusIcon" size={16} />
                New Analysis
              </Link>

              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                CM
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Toggle mobile menu"
              >
                <Icon name={mobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border bg-card overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={`mobile-nav-${item.href}`}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={item.icon as Parameters<typeof Icon>[0]['name']} size={18} />
                      {item.label}
                    </Link>
                  );
                })}
                <div className="pt-2 border-t border-border">
                  <Link
                    href="/content-upload-studio"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 btn-primary text-sm w-full justify-center"
                  >
                    <Icon name="PlusIcon" size={16} />
                    New Analysis
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-screen-2xl w-full mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 py-8">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={`bottom-nav-${item.href}`}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon
                  name={item.icon as Parameters<typeof Icon>[0]['name']}
                  size={20}
                  variant={isActive ? 'solid' : 'outline'}
                />
                <span className="text-2xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}