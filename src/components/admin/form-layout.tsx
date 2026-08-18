'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  description?: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * FormField — labeled wrapper for a single form input.
 * Premium spacing, consistent label/error pattern.
 */
export function FormField({
  label,
  htmlFor,
  description,
  required = false,
  error,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1 text-sm font-medium text-foreground"
      >
        <span>{label}</span>
        {required && <span className="text-destructive">*</span>}
      </label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export interface FormActionsProps {
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

/**
 * FormActions — primary submit + outline cancel pair.
 */
export function FormActions({
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  onCancel,
  isSubmitting = false,
  className,
  align = 'end',
}: FormActionsProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 sm:flex-row',
        align === 'start' && 'sm:justify-start',
        align === 'center' && 'sm:justify-center',
        align === 'end' && 'sm:justify-end',
        className
      )}
    >
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {cancelLabel}
        </Button>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : submitLabel}
      </Button>
    </div>
  );
}

export interface FormLayoutProps {
  title: string;
  description?: string;
  onSubmit?: (e: React.FormEvent) => void;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * FormLayout — premium admin form container.
 * Wraps a Card with header (title + description), body (children), and footer (actions).
 */
export function FormLayout({
  title,
  description,
  onSubmit,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  onCancel,
  isSubmitting = false,
  className,
  children,
  footer,
}: FormLayoutProps) {
  return (
    <Card className={cn('border-border bg-card shadow-card', className)}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-5">{children}</CardContent>
        <CardFooter className="flex justify-end gap-2 border-t border-border bg-muted/20 py-4">
          {footer ?? (
            <FormActions
              submitLabel={submitLabel}
              cancelLabel={cancelLabel}
              onCancel={onCancel}
              isSubmitting={isSubmitting}
            />
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
