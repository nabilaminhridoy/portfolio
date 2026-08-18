import * as React from 'react';
import { cn } from '@/lib/utils';

type ContainerSize = 'default' | 'narrow' | 'wide' | 'full';

const containerClasses: Record<ContainerSize, string> = {
  default: 'mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8',
  narrow: 'mx-auto w-full max-w-container-sm px-4 sm:px-6 lg:px-8',
  wide: 'mx-auto w-full max-w-container-xl px-4 sm:px-6 lg:px-8',
  full: 'mx-auto w-full px-4 sm:px-6 lg:px-8',
};

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  as?: React.ElementType;
}

/**
 * Container — page width constraint with mobile-first padding.
 * Premium portfolio uses `default` (1152px) for most pages.
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'default', as: Comp = 'div', ...props }, ref) => {
    return (
      <Comp
        ref={ref}
        className={cn(containerClasses[size], className)}
        {...props}
      />
    );
  }
);
Container.displayName = 'Container';
