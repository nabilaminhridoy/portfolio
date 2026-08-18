'use client';

import * as React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  /**
   * Pass as a rendered JSX element (e.g. `<AlertTriangle className="h-5 w-5" />`)
   * to avoid RSC serialization issues with forwardRef icon component types.
   */
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  compact?: boolean;
}

/**
 * ErrorState — premium error placeholder (failed loads, exceptions, 404).
 * Subtle red tint on icon; primary CTA to retry / navigate.
 */
export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  icon,
  actionLabel = 'Try Again',
  onAction,
  className,
  compact = false,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'py-8' : 'py-16',
        className
      )}
      role="alert"
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-destructive/10 text-destructive',
          compact ? 'h-10 w-10' : 'h-16 w-16'
        )}
      >
        {icon ?? <AlertTriangle className={compact ? 'h-5 w-5' : 'h-7 w-7'} aria-hidden="true" />}
      </div>

      <h3
        className={cn(
          'font-semibold text-foreground',
          compact ? 'mt-3 text-sm' : 'mt-5 text-base'
        )}
      >
        {title}
      </h3>

      <p
        className={cn(
          'mx-auto max-w-sm text-muted-foreground',
          compact ? 'mt-1 text-xs' : 'mt-2 text-sm'
        )}
      >
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          size={compact ? 'sm' : 'default'}
          variant="outline"
          className="mt-6 gap-2"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
