/**
 * Design Tokens — Nabil Amin Hridoy Portfolio CMS
 *
 * Centralized design system tokens. Use these for any non-Tailwind contexts
 * (inline styles, dynamic styles, JS-driven components, theming logic).
 *
 * Tailwind already mirrors these via globals.css + tailwind.config.ts.
 */

export const brandColors = {
  dark: '#030f2b',
  blue: '#175bea',
  cyan: '#00c5fb',
  white: '#ffffff',
} as const;

export type BrandColorName = keyof typeof brandColors;

export const colorTokens = {
  // Brand
  brand: brandColors,

  // Light theme semantic
  light: {
    background: '#ffffff',
    foreground: '#030f2b',
    card: '#ffffff',
    cardForeground: '#030f2b',
    primary: '#175bea',
    primaryForeground: '#ffffff',
    secondary: '#030f2b',
    secondaryForeground: '#ffffff',
    muted: '#f4f6fb',
    mutedForeground: '#5a6485',
    accent: '#00c5fb',
    accentForeground: '#030f2b',
    border: '#e4e8f1',
    input: '#e4e8f1',
    ring: '#175bea',
  },

  // Dark theme semantic
  dark: {
    background: '#030f2b',
    foreground: '#ffffff',
    card: '#0a1a3f',
    cardForeground: '#ffffff',
    primary: '#175bea',
    primaryForeground: '#ffffff',
    secondary: '#0a1a3f',
    secondaryForeground: '#ffffff',
    muted: '#0a1a3f',
    mutedForeground: '#8b9bc7',
    accent: '#00c5fb',
    accentForeground: '#030f2b',
    border: 'rgba(255, 255, 255, 0.1)',
    input: 'rgba(255, 255, 255, 0.15)',
    ring: '#00c5fb',
  },
} as const;

export const typographyTokens = {
  fontFamily: {
    sans: 'var(--font-sans), var(--font-bengali), system-ui, sans-serif',
    bengali: 'var(--font-bengali), var(--font-sans), sans-serif',
    mono: 'var(--font-mono), ui-monospace, monospace',
  },
  fontSize: {
    caption: { size: '0.75rem', lineHeight: '1.125rem', letterSpacing: '0.025em' },
    body: { size: '1rem', lineHeight: '1.6' },
    bodyLg: { size: '1.125rem', lineHeight: '1.7' },
    subtitle: { size: '1.25rem', lineHeight: '1.6' },
    h4: { size: '1.5rem', lineHeight: '1.4', letterSpacing: '-0.01em' },
    h3: { size: '1.875rem', lineHeight: '1.35', letterSpacing: '-0.015em' },
    h2: { size: '2.25rem', lineHeight: '1.25', letterSpacing: '-0.02em' },
    h1: { size: '3rem', lineHeight: '1.2', letterSpacing: '-0.025em' },
    display: { size: '4rem', lineHeight: '1.1', letterSpacing: '-0.03em' },
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const;

export const spacingTokens = {
  // Component spacing
  xs: '0.25rem',     // 4px
  sm: '0.5rem',      // 8px
  component: '1rem', // 16px
  md: '1.5rem',      // 24px
  lg: '2rem',        // 32px
  xl: '3rem',        // 48px
  // Section spacing (between sections)
  section: '6rem',   // 96px
  sectionSm: '4rem', // 64px (mobile)
  sectionLg: '8rem', // 128px
  // Container
  containerPadding: '1rem',    // 16px (mobile)
  containerPaddingLg: '2rem',   // 32px (desktop)
} as const;

export const containerTokens = {
  maxWidth: {
    sm: '768px',     // narrow reading width
    DEFAULT: '1280px', // default premium portfolio width
    lg: '1440px',    // wide pages
    xl: '1536px',    // extra wide
  },
} as const;

export const radiusTokens = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
} as const;

export const borderTokens = {
  light: '#e4e8f1',
  lightDark: 'rgba(255, 255, 255, 0.1)',
  width: {
    thin: '1px',
    DEFAULT: '1px',
    thick: '2px',
  },
} as const;

export const shadowTokens = {
  card: '0 1px 3px 0 rgb(3 15 43 / 0.08), 0 1px 2px -1px rgb(3 15 43 / 0.08)',
  cardHover: '0 10px 30px -10px rgb(23 91 234 / 0.25), 0 4px 6px -4px rgb(3 15 43 / 0.1)',
  modal: '0 20px 50px -12px rgb(3 15 43 / 0.35)',
  glow: '0 0 24px rgb(0 197 251 / 0.35)',
} as const;

export const breakpointTokens = {
  xs: '375px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export type Breakpoint = keyof typeof breakpointTokens;

/** Responsive container labels */
export const containerVariants = {
  // Mobile-first: full width with padding
  // sm: max 640px (compact UI)
  // md: max 768px (tablet)
  // lg: max 1024px (laptop)
  // xl: max 1280px (desktop)
  // 2xl: max 1536px (wide)
  default: 'container mx-auto px-4 sm:px-6 lg:px-8 max-w-container',
  narrow: 'container mx-auto px-4 sm:px-6 lg:px-8 max-w-container-sm',
  wide: 'container mx-auto px-4 sm:px-6 lg:px-8 max-w-container-xl',
} as const;

/** All design tokens combined */
export const designTokens = {
  colors: colorTokens,
  typography: typographyTokens,
  spacing: spacingTokens,
  container: containerTokens,
  radius: radiusTokens,
  border: borderTokens,
  shadow: shadowTokens,
  breakpoint: breakpointTokens,
} as const;
