'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';

export interface RecordFormShellProps {
  title: string;
  description?: string;
  /** Back to list URL */
  backHref: string;
  /** Form element to wrap; this component injects a form ref + submit */
  children: React.ReactNode;
  /** Submit button label */
  submitLabel?: string;
  /** "View on site" link (e.g. /en/projects/[slug]) */
  viewOnSiteHref?: string;
  /** Form submit handler */
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting?: boolean;
  /** Footer slot — render DeleteConfirmDialog here on edit pages */
  footer?: React.ReactNode;
}

/**
 * RecordFormShell — shared layout for create/edit forms.
 * Renders: back button + title/description + form (with submit) + optional view-on-site link.
 */
export function RecordFormShell({
  title,
  description,
  backHref,
  children,
  submitLabel = 'Save',
  viewOnSiteHref,
  onSubmit,
  isSubmitting = false,
  footer,
}: RecordFormShellProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Button asChild variant="ghost" size="icon" className="shrink-0" aria-label="Back to list">
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {viewOnSiteHref && (
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href={viewOnSiteHref} target="_blank" rel="noreferrer">
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              View
            </Link>
          </Button>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {children}
        <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          {footer ? (
            <div className="flex items-center gap-2">{footer}</div>
          ) : (
            <span />
          )}
          <Button type="submit" disabled={isSubmitting} className="gap-2 sm:ml-auto">
            {isSubmitting ? (
              <>
                <EyeOff className="h-4 w-4" aria-hidden="true" />
                Saving...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
