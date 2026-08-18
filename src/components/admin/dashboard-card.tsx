'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type TrendDirection = 'up' | 'down' | 'neutral';

export interface DashboardCardProps {
  title: string;
  value: React.ReactNode;
  description?: string;
  /**
   * Icon — pass as a rendered JSX element (e.g. `<FolderGit2 className="h-4 w-4" />`)
   * to avoid RSC serialization issues with forwardRef component types.
   */
  icon?: React.ReactNode;
  trend?: {
    direction: TrendDirection;
    value: string;
  };
  accent?: 'blue' | 'cyan' | 'dark' | 'muted';
  className?: string;
}

const accentClasses = {
  blue: 'bg-primary/10 text-primary',
  cyan: 'bg-accent/15 text-foreground dark:text-accent',
  dark: 'bg-secondary/10 text-secondary dark:bg-accent/15 dark:text-accent',
  muted: 'bg-muted text-muted-foreground',
};

const trendClasses: Record<TrendDirection, string> = {
  up: 'text-emerald-600 dark:text-emerald-400',
  down: 'text-destructive',
  neutral: 'text-muted-foreground',
};

/**
 * DashboardCard — premium KPI/stat card for admin dashboard.
 * Subtle entrance animation (respects reduced motion), icon + trend display.
 *
 * NOTE: Pass `icon` as a rendered JSX element, not a component type.
 * This avoids RSC serialization issues with forwardRef component references.
 */
export function DashboardCard({
  title,
  value,
  description,
  icon,
  trend,
  accent = 'blue',
  className,
}: DashboardCardProps) {
  const prefersReduced = useReducedMotion();
  const TrendIcon = trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : null;

  return (
    <motion.div
      initial={prefersReduced ? undefined : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card className={cn(
        'relative overflow-hidden border-border bg-card shadow-card transition-all hover:shadow-card-hover',
        className
      )}>
        <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </CardTitle>
          {icon && (
            <div
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-md',
                accentClasses[accent]
              )}
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && TrendIcon && (
            <div className={cn(
              'mt-2 inline-flex items-center gap-1 text-xs font-medium',
              trendClasses[trend.direction]
            )}>
              <TrendIcon className="h-3 w-3" aria-hidden="true" />
              <span>{trend.value}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
