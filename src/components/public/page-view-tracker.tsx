'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/tracking/events';

/**
 * PageViewTracker — invisible client component that fires a PageView event
 * on every route change. Place in the locale layout (or any layout).
 */
export function PageViewTracker() {
  const pathname = usePathname();

  React.useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
