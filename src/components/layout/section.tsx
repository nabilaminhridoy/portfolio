import * as React from 'react';
import { cn } from '@/lib/utils';
import { Container, type ContainerProps } from './container';

type SectionSpacing = 'compact' | 'default' | 'relaxed' | 'wide';
type SectionTone = 'default' | 'muted' | 'inverted' | 'brand';

const sectionSpacing: Record<SectionSpacing, string> = {
  compact: 'py-12 sm:py-16',
  default: 'py-16 sm:py-24',
  relaxed: 'py-20 sm:py-28',
  wide: 'py-24 sm:py-32',
};

const sectionTone: Record<SectionTone, string> = {
  default: 'bg-background text-foreground',
  muted: 'bg-muted/40 text-foreground',
  inverted: 'bg-secondary text-secondary-foreground',
  brand: 'bg-brand-dark text-white',
};

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: SectionSpacing;
  tone?: SectionTone;
  container?: boolean;
  containerSize?: ContainerProps['size'];
  as?: React.ElementType;
}

/**
 * Section — semantic section wrapper with consistent vertical rhythm.
 * Use spacing="default" for most content; "compact" for tight UI; "relaxed"/"wide" for hero / CTA.
 */
export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      spacing = 'default',
      tone = 'default',
      container = true,
      containerSize = 'default',
      as: Comp = 'section',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Comp
        ref={ref}
        className={cn(sectionSpacing[spacing], sectionTone[tone], className)}
        {...props}
      >
        {container ? <Container size={containerSize}>{children}</Container> : children}
      </Comp>
    );
  }
);
Section.displayName = 'Section';
