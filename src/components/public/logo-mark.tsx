import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Brand logo mark — clean geometric SVG, not a letter initial.
 * Uses brand gradient (#175bea → #00c5fb) and follows brand visual identity.
 */
export function LogoMark({
  className,
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="brand-mark-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#175bea" />
          <stop offset="100%" stopColor="#00c5fb" />
        </linearGradient>
      </defs>
      {/* Outer rounded square */}
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="8"
        fill="url(#brand-mark-gradient)"
      />
      {/* Inner geometric mark — two stacked chevrons forming an abstract code/dev symbol */}
      <path
        d="M11 11 L6 16 L11 21"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M21 11 L26 16 L21 21"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Center dot — accent cyan */}
      <circle cx="16" cy="16" r="1.5" fill="#00c5fb" />
    </svg>
  );
}
