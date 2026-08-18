'use client';

import * as React from 'react';
import { Languages } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export interface BilingualFieldProps {
  label: string;
  enId: string;
  bnId: string;
  enValue: string;
  bnValue: string;
  onEnChange: (value: string) => void;
  onBnChange: (value: string) => void;
  required?: boolean;
  description?: string;
  placeholderEn?: string;
  placeholderBn?: string;
  className?: string;
}

/**
 * BilingualField — renders EN + BN inputs side-by-side (lg+) or stacked (mobile).
 * Visual indicator shows "EN" and "বাংলা" badges per input.
 */
export function BilingualInput({
  label,
  enId,
  bnId,
  enValue,
  bnValue,
  onEnChange,
  onBnChange,
  required = false,
  description,
  placeholderEn,
  placeholderBn,
  className,
}: BilingualFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center gap-1 text-sm font-medium text-foreground">
        <span>{label}</span>
        {required && <span className="text-destructive">*</span>}
        <span className="ml-1 flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <Languages className="h-2.5 w-2.5" />
          EN + BN
        </span>
      </div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="relative">
          <Input
            id={enId}
            type="text"
            value={enValue}
            onChange={(e) => onEnChange(e.target.value)}
            placeholder={placeholderEn}
            required={required}
            className="pr-9"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            EN
          </span>
        </div>
        <div className="relative">
          <Input
            id={bnId}
            type="text"
            value={bnValue}
            onChange={(e) => onBnChange(e.target.value)}
            placeholder={placeholderBn}
            required={required}
            dir="auto"
            className="pr-9"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            বাং
          </span>
        </div>
      </div>
    </div>
  );
}

export interface BilingualTextareaProps extends BilingualFieldProps {
  rows?: number;
}

export function BilingualTextarea({
  label,
  enId,
  bnId,
  enValue,
  bnValue,
  onEnChange,
  onBnChange,
  required = false,
  description,
  placeholderEn,
  placeholderBn,
  rows = 4,
  className,
}: BilingualTextareaProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center gap-1 text-sm font-medium text-foreground">
        <span>{label}</span>
        {required && <span className="text-destructive">*</span>}
        <span className="ml-1 flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <Languages className="h-2.5 w-2.5" />
          EN + BN
        </span>
      </div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="relative">
          <Textarea
            id={enId}
            value={enValue}
            onChange={(e) => onEnChange(e.target.value)}
            placeholder={placeholderEn}
            required={required}
            rows={rows}
            className="pr-9 resize-none"
          />
          <span className="pointer-events-none absolute right-3 top-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            EN
          </span>
        </div>
        <div className="relative">
          <Textarea
            id={bnId}
            value={bnValue}
            onChange={(e) => onBnChange(e.target.value)}
            placeholder={placeholderBn}
            required={required}
            rows={rows}
            dir="auto"
            className="pr-9 resize-none"
          />
          <span className="pointer-events-none absolute right-3 top-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            বাং
          </span>
        </div>
      </div>
    </div>
  );
}
