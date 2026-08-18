'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  message?: string;
  className?: string;
  variant?: 'page' | 'inline' | 'overlay';
  size?: 'sm' | 'default' | 'lg';
}

const sizeMap = {
  sm: 'h-4 w-4',
  default: 'h-6 w-6',
  lg: 'h-8 w-8',
};

/**
 * LoadingState — premium loading indicator with brand-colored spinner.
 * - variant="page": centered in available space, ideal for full-page loads
 * - variant="inline": inline with text, ideal for buttons / cells
 * - variant="overlay": covers nearest relative parent (use parent + relative)
 */
export function LoadingState({
  message = 'Loading...',
  className,
  variant = 'page',
  size = 'default',
}: LoadingStateProps) {
  if (variant === 'inline') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-2 text-sm text-muted-foreground',
          className
        )}
        role="status"
      >
        <Loader2 className={cn('animate-spin text-brand-blue', sizeMap[size])} />
        {message && <span>{message}</span>}
      </span>
    );
  }

  if (variant === 'overlay') {
    return (
      <div
        className={cn(
          'absolute inset-0 z-30 flex items-center justify-center bg-background/80 backdrop-blur-sm',
          className
        )}
        role="status"
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className={cn('animate-spin text-brand-blue', sizeMap[size])} />
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </div>
      </div>
    );
  }

  // page variant
  return (
    <div
      className={cn(
        'flex min-h-[40vh] flex-col items-center justify-center gap-3',
        className
      )}
      role="status"
    >
      <Loader2 className={cn('animate-spin text-brand-blue', sizeMap[size])} />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
