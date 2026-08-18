'use client';

import * as React from 'react';
import { trackDownloadResume } from '@/lib/tracking/events';

/**
 * ResumeDownloadTracker — invisible client component that fires
 * DownloadResume event when the user clicks any download/resume link.
 *
 * Usage: place at the top of the resume page.
 */
export function ResumeDownloadTracker({ resumeUrl }: { resumeUrl: string }) {
  React.useEffect(() => {
    if (!resumeUrl) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href="' + resumeUrl + '"]');
      if (link) {
        trackDownloadResume();
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [resumeUrl]);

  return null;
}
