'use client';

import * as React from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * SkillProgressBar — animates from 0% to the CMS-defined level value
 * when the element enters the viewport. Animates only once.
 *
 * Uses IntersectionObserver (vanilla browser API) for reliable viewport
 * detection — more reliable than framer-motion's whileInView in SSR contexts.
 *
 * CSS transition handles the smooth animation (GPU-friendly width transition).
 *
 * Respects prefers-reduced-motion: shows static bar at target width immediately.
 */
export function SkillProgressBar({ level }: { level: number }) {
  const prefersReduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    // If reduced motion, show the bar at target width immediately
    if (prefersReduced) {
      setInView(true);
      return;
    }

    const el = ref.current;
    if (!el) {
      // Fallback: if ref not available, just show the bar
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // only animate once
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <div
      ref={ref}
      className="h-full rounded-full bg-gradient-brand transition-[width] duration-700 ease-out"
      style={{ width: inView ? `${level}%` : '0%' }}
    />
  );
}
