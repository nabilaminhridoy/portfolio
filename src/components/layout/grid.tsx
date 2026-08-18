import * as React from 'react';
import { cn } from '@/lib/utils';

type GridCols = 1 | 2 | 3 | 4 | 6 | 12;
type GridGap = 'sm' | 'default' | 'md' | 'lg';

const gapClasses: Record<GridGap, string> = {
  sm: 'gap-3',
  default: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
};

const colsClasses: Record<GridCols, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  12: 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12',
};

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: GridCols;
  gap?: GridGap;
  responsive?: boolean;
}

/**
 * Grid — responsive auto-flowing grid. Mobile-first: stacks by default,
 * expands at sm/md/lg breakpoints based on cols count.
 */
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 3, gap = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('grid', colsClasses[cols], gapClasses[gap], className)}
        {...props}
      />
    );
  }
);
Grid.displayName = 'Grid';
