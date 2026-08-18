import * as React from 'react';
import { cn } from '@/lib/utils';

type StackDirection = 'row' | 'column';
type StackGap = 'xs' | 'sm' | 'default' | 'md' | 'lg';
type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

const gapClasses: Record<StackGap, string> = {
  xs: 'gap-1',
  sm: 'gap-2',
  default: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
};

const alignClasses: Record<StackAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyClasses: Record<StackJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: StackDirection;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
}

/**
 * Stack — flexbox layout primitive (one-liner for `display: flex`).
 * - `direction="row"` + `align="center"` = horizontal stack
 * - `direction="column"` (default) = vertical stack
 */
export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      direction = 'column',
      gap = 'default',
      align = 'stretch',
      justify = 'start',
      wrap = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          direction === 'row' ? 'flex-row' : 'flex-col',
          gapClasses[gap],
          alignClasses[align],
          justifyClasses[justify],
          wrap && 'flex-wrap',
          className
        )}
        {...props}
      />
    );
  }
);
Stack.displayName = 'Stack';
