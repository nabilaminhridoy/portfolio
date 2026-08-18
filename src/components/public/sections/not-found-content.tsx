'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, FolderGit2, Terminal } from 'lucide-react';

import { LinkButton } from '@/components/ui/link-button';

// Bilingual labels (not dependent on next-intl context for reliability)
const LABELS = {
  en: {
    terminal: 'error — route not found',
    title: 'Page Not Found',
    description: "The page you're looking for doesn't exist or may have been moved.",
    backHome: 'Back to Home',
    viewProjects: 'View Projects',
  },
  bn: {
    terminal: 'ত্রুটি — রুট খুঁজে পাওয়া যায়নি',
    title: 'পেজটি পাওয়া যায়নি',
    description: 'আপনি যে পেজটি খুঁজছেন সেটি পাওয়া যাচ্ছে না অথবা সরিয়ে নেওয়া হয়েছে।',
    backHome: 'হোমে ফিরে যান',
    viewProjects: 'প্রজেক্ট দেখুন',
  },
} as const;

/**
 * NotFoundContent — premium developer-focused 404 experience.
 *
 * Uses URL pathname to detect locale (/en vs /bn) for maximum reliability
 * in not-found contexts where next-intl's provider context may be unavailable.
 *
 * Features:
 * - Large "404" with gradient text + subtle glow pulse
 * - Terminal-style code fragments (decorative, animated)
 * - HTTP request/status indicators
 * - Staggered entrance animation
 * - Subtle floating motion on decorative elements
 * - Respects prefers-reduced-motion
 * - Bilingual (EN/BN)
 */
export function NotFoundContent() {
  const prefersReduced = useReducedMotion();

  // Detect locale from URL pathname (/en/... or /bn/...)
  const locale = React.useMemo<'en' | 'bn'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/bn')) return 'bn';
    }
    return 'en';
  }, []);

  const L = LABELS[locale];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
  };

  const item = {
    hidden: prefersReduced ? { opacity: 0 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  return (
    <div className="relative flex min-h-[calc(100vh-200px)] items-center justify-center overflow-hidden px-4 py-20">
      {/* === Decorative code fragments === */}
      {!prefersReduced && (
        <>
          <motion.div
            className="absolute left-[8%] top-[15%] hidden font-mono text-xs text-brand-blue/20 sm:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <p>GET /requested-route</p>
              <p className="text-brand-cyan/20">&rarr; 404 NOT_FOUND</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute right-[8%] top-[20%] hidden font-mono text-xs text-muted-foreground/20 lg:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              <p>const route = requestedPath;</p>
              <p>if (!route) return 404;</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-[18%] left-[10%] hidden font-mono text-xs text-brand-cyan/15 sm:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <p>status: 404</p>
              <p>error: ROUTE_NOT_FOUND</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-[15%] right-[10%] hidden font-mono text-xs text-brand-blue/15 lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <p>&lt;404 /&gt;</p>
              <p className="text-brand-cyan/15">route: /unknown</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute left-[15%] top-[60%] hidden font-mono text-2xl font-bold text-brand-blue/[0.08] lg:block"
            animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          >
            {'{ }'}
          </motion.div>
          <motion.div
            className="absolute right-[15%] top-[55%] hidden font-mono text-2xl font-bold text-brand-cyan/[0.08] lg:block"
            animate={{ y: [0, 10, 0], rotate: [0, -2, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            {'</>'}
          </motion.div>
        </>
      )}

      {/* === Main content === */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* Terminal header */}
        <motion.div variants={item} className="mb-8 flex items-center gap-2 rounded-lg border border-border/40 bg-card/40 px-3 py-1.5 backdrop-blur">
          <Terminal className="h-3.5 w-3.5 text-brand-cyan" aria-hidden="true" />
          <span className="font-mono text-[10px] text-muted-foreground">
            {L.terminal}
          </span>
        </motion.div>

        {/* Large 404 with glow */}
        <motion.div variants={item}>
          <motion.h1
            className="bg-gradient-to-br from-brand-blue via-brand-cyan to-brand-blue bg-clip-text text-8xl font-bold tracking-tighter text-transparent sm:text-9xl"
            animate={prefersReduced ? undefined : {
              filter: [
                'drop-shadow(0 0 20px rgba(23, 91, 234, 0.15))',
                'drop-shadow(0 0 30px rgba(0, 197, 251, 0.2))',
                'drop-shadow(0 0 20px rgba(23, 91, 234, 0.15))',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            404
          </motion.h1>
        </motion.div>

        {/* Title */}
        <motion.h2 variants={item} className="mt-2 text-h3 font-bold tracking-tight text-foreground">
          {L.title}
        </motion.h2>

        {/* Description */}
        <motion.p variants={item} className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          {L.description}
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <LinkButton href={locale === 'bn' ? '/bn' : '/en'} variant="brand" size="lg" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {L.backHome}
          </LinkButton>
          <LinkButton href={locale === 'bn' ? '/bn/projects' : '/en/projects'} variant="outline" size="lg" className="gap-2">
            <FolderGit2 className="h-4 w-4" />
            {L.viewProjects}
          </LinkButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
