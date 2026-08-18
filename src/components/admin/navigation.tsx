'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface NavItemData {
  label: string;
  href: string;
  icon?: LucideIcon;
  badge?: string;
  active?: boolean;
}

export interface AdminNavigationProps {
  items: NavItemData[];
  onNavigate?: (href: string) => void;
  variant?: 'tabs' | 'pills' | 'underline';
  className?: string;
}

const variantClasses = {
  tabs: '',
  pills: '',
  underline: '',
};

/**
 * AdminNavigation — horizontal navigation (tab strip / pill group).
 * Use inside AdminHeader or as a section sub-nav.
 */
export function AdminNavigation({
  items,
  onNavigate,
  variant = 'tabs',
  className,
}: AdminNavigationProps) {
  return (
    <nav
      className={cn('flex items-center gap-1', variantClasses[variant], className)}
      aria-label="Section navigation"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const baseClass = cn(
          'inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium transition-colors',
          variant === 'tabs' &&
            'border-b-2 px-3 py-2 -mb-px',
          variant === 'pills' && 'rounded-md px-3 py-1.5',
          variant === 'underline' && 'px-2 py-1',
          item.active
            ? variant === 'tabs'
              ? 'border-primary text-primary'
              : variant === 'pills'
                ? 'bg-primary text-primary-foreground'
                : 'text-primary border-b border-primary'
            : variant === 'tabs'
              ? 'border-transparent text-muted-foreground hover:text-foreground'
              : variant === 'pills'
                ? 'text-muted-foreground hover:bg-muted hover:text-foreground'
                : 'text-muted-foreground hover:text-foreground'
        );

        return (
          <a
            key={`${item.href}-${item.label}`}
            href={item.href}
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate(item.href);
              }
            }}
            className={baseClass}
            aria-current={item.active ? 'page' : undefined}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                {item.badge}
              </span>
            )}
          </a>
        );
      })}
    </nav>
  );
}
