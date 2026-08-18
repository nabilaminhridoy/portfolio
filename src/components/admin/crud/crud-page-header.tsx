'use client';

import * as React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

export interface CrudPageHeaderProps {
  title: string;
  description?: string;
  /** "New" button href. Omit to hide. */
  newHref?: string;
  newLabel?: string;
  /** Optional actions (e.g., import button) */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * CrudPageHeader — section header with title + description + optional "New" button.
 * Used at the top of every admin list page.
 */
export function CrudPageHeader({
  title,
  description,
  newHref,
  newLabel = 'New',
  actions,
  className,
}: CrudPageHeaderProps) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className ?? ''}`}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {(newHref || actions) && (
        <div className="flex items-center gap-2">
          {actions}
          {newHref && (
            <Button asChild className="gap-2">
              <Link href={newHref}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                {newLabel}
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
