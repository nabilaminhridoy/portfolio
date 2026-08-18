'use client';

import * as React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  /**
   * Pass as a rendered JSX element (e.g. `<Inbox className="h-5 w-5" />`)
   * to avoid RSC serialization issues with forwardRef icon component types.
   */
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  compact?: boolean;
}

/**
 * EmptyState — premium empty-data placeholder (lists, tables, dashboards).
 * Branded icon tint + optional primary action button.
 */
export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'py-8' : 'py-16',
        className
      )}
      role="status"
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-muted text-muted-foreground',
          compact ? 'h-10 w-10' : 'h-16 w-16'
        )}
      >
        {icon ?? <Inbox className={compact ? 'h-5 w-5' : 'h-7 w-7'} aria-hidden="true" />}
      </div>

      <h3
        className={cn(
          'font-semibold text-foreground',
          compact ? 'mt-3 text-sm' : 'mt-5 text-base'
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(
            'mx-auto max-w-sm text-muted-foreground',
            compact ? 'mt-1 text-xs' : 'mt-2 text-sm'
          )}
        >
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button onClick={onAction} size={compact ? 'sm' : 'default'} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
