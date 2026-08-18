'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Code2, Sparkles, ChevronDown, Mail } from 'lucide-react';

import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/ui/link-button';

interface HeroData {
  nameEn: string;
  nameBn: string;
  roleEn: string;
  roleBn: string;
  bioEn: string;
  bioBn: string;
  available: boolean;
  resumeUrl: string | null;
  locale: 'en' | 'bn';
}

export function Hero({ data }: { data: HeroData }) {
  const t = useTranslations('Hero');
  const prefersReduced = useReducedMotion();

  const name = data.locale === 'bn' ? data.nameBn : data.nameEn;
  const role = data.locale === 'bn' ? data.roleBn : data.roleEn;
  // Fall back to translation tagline when CMS bio is empty — translation is generic dev description, not personal info
  const bio = (data.locale === 'bn' ? data.bioBn : data.bioEn) || t('tagline');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const item = {
    hidden: prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <section
      id="hero"
      className="relative flex items-start justify-center overflow-hidden px-4 pt-28 pb-16 sm:px-6 lg:px-8"
    >
      {/* NOTE: Hero no longer has its own separate background layer.
          The GlobalBackground (in the locale layout) provides the site-wide
          animated background. This avoids the "blue rectangular block" issue
          caused by having a separate Hero-only mesh gradient. */}

      {/* Hero content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mx-auto w-full max-w-4xl text-center"
      >
        {/* Availability badge */}
        {data.available && (
          <motion.div variants={item}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>{t('available')}</span>
            </div>
          </motion.div>
        )}

        {/* Greeting */}
        <motion.p
          variants={item}
          className="mb-2 text-sm font-medium uppercase tracking-widest text-primary"
        >
          {t('greeting')}
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={item}
          className="bg-gradient-to-br from-foreground via-foreground to-brand-blue bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {name}
        </motion.h1>

        {/* Role */}
        <motion.p
          variants={item}
          className="mt-4 text-xl font-semibold text-primary sm:text-2xl md:text-3xl"
        >
          {role}
        </motion.p>

        {/* Tagline */}
        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {bio}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
          className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <LinkButton href="/projects" variant="brand" size="lg" className="gap-2">
            <Code2 className="h-4 w-4" />
            {t('viewProjects')}
            <ArrowRight className="h-4 w-4" />
          </LinkButton>

          {data.resumeUrl ? (
            <Button asChild size="lg" variant="outline">
              <a href={data.resumeUrl} target="_blank" rel="noopener noreferrer">
                {t('downloadResume')}
              </a>
            </Button>
          ) : (
            <Button asChild size="lg" variant="outline">
              <Link href="/resume">{t('downloadResume')}</Link>
            </Button>
          )}

          {/* Contact Me — third CTA per Phase 6 refinement spec */}
          <Button asChild size="lg" variant="ghost">
            <a href="/#contact">
              <Mail className="h-4 w-4" />
              {data.locale === 'bn' ? 'যোগাযোগ করুন' : 'Contact Me'}
            </a>
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={prefersReduced ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        </motion.div>
      </motion.div>
    </section>
  );
}
