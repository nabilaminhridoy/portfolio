'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { LanguageSwitcher } from '@/components/theme/language-switcher';
import { LogoMark } from '@/components/public/logo-mark';
import { Link } from '@/i18n/routing';

// Nav order per spec: About, Skills, Projects, Services, Experience, Education, Certifications, Contact
const SECTION_IDS = [
  'about',
  'skills',
  'projects',
  'services',
  'experience',
  'education',
  'certifications',
  'contact',
] as const;

export function Navbar() {
  const tNav = useTranslations('Nav');
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = SECTION_IDS.map((id) => ({
    href: `/#${id}`,
    label: tNav(id),
  }));

  return (
    <div className="sticky top-0 z-50 w-full px-2 pt-2 sm:px-3 sm:pt-3">
      <header
        className={cn(
          'mx-auto flex h-12 w-full max-w-container items-center justify-between rounded-2xl border border-border/50 bg-background/70 px-3 backdrop-blur-md transition-all sm:h-14 sm:px-6 lg:px-8',
          scrolled
            ? 'shadow-card-hover supports-[backdrop-filter]:bg-background/80'
            : 'shadow-card supports-[backdrop-filter]:bg-background/60'
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-1.5">
          <LogoMark size={26} />
          <span className="hidden text-sm font-semibold tracking-tight text-gradient-brand xl:inline-block">
            Nabil Amin Hridoy
          </span>
        </Link>

        {/* Navigation — hidden on mobile (<768px), visible on tablet+ (768px+).
            No hamburger menu, no drawer, no dropdown. */}
        <nav className="hidden items-center gap-2 text-sm md:flex lg:text-base">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:px-3.5"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side actions — Theme + Language (always visible) */}
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>
    </div>
  );
}
