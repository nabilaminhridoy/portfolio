'use client';

import * as React from 'react';
import { trackViewProject, trackClickLiveDemo, trackClickGitHub } from '@/lib/tracking/events';

/**
 * ProjectDetailTracker — invisible client component that fires:
 * 1. ViewProject event on mount (when the project detail page loads)
 * 2. ClickLiveDemo event when the user clicks the Live Demo button
 * 3. ClickGitHub event when the user clicks the GitHub link
 *
 * Usage: place at the top of the project detail page.
 */
export function ProjectDetailTracker({
  slug,
  title,
  demoUrl,
  githubUrl,
}: {
  slug: string;
  title: string;
  demoUrl?: string | null;
  githubUrl?: string | null;
}) {
  // Fire ViewProject on mount
  React.useEffect(() => {
    trackViewProject(slug, title);
  }, [slug, title]);

  // Attach click handlers to demo/github links
  React.useEffect(() => {
    if (demoUrl) {
      const handler = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a[href="' + demoUrl + '"]');
        if (link) {
          trackClickLiveDemo(slug, demoUrl);
        }
      };
      document.addEventListener('click', handler);
      return () => document.removeEventListener('click', handler);
    }
  }, [demoUrl, slug]);

  React.useEffect(() => {
    if (githubUrl) {
      const handler = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a[href="' + githubUrl + '"]');
        if (link) {
          trackClickGitHub(slug, githubUrl);
        }
      };
      document.addEventListener('click', handler);
      return () => document.removeEventListener('click', handler);
    }
  }, [githubUrl, slug]);

  return null;
}
