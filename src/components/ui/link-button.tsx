import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';

import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

/**
 * LinkButton — navigation link styled as a Button.
 * Uses next-intl Link so locale prefix is preserved automatically.
 */
const linkButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
        destructive: 'bg-destructive text-white hover:bg-destructive/90 shadow-sm',
        outline:
          'border border-input bg-background hover:bg-accent/10 hover:text-foreground hover:border-primary/40',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm',
        ghost: 'hover:bg-accent/10 hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        brand: 'bg-gradient-brand text-white shadow-sm hover:shadow-glow transition-all',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-md px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface LinkButtonProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'href' | 'color'>,
    VariantProps<typeof linkButtonVariants> {
  href: Parameters<typeof Link>[0]['href'];
  asChild?: boolean;
  locale?: 'en' | 'bn';
}

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant, size, asChild = false, href, ...props }, ref) => {
    const Comp = asChild ? Slot : Link;
    return (
      <Comp
        ref={ref}
        href={href}
        className={cn(linkButtonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
LinkButton.displayName = 'LinkButton';

export { linkButtonVariants };
