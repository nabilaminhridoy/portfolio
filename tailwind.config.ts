import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)'
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)'
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)'
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)'
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)'
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)'
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)'
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        chart: {
          '1': 'var(--chart-1)',
          '2': 'var(--chart-2)',
          '3': 'var(--chart-3)',
          '4': 'var(--chart-4)',
          '5': 'var(--chart-5)'
        },
        // Brand palette — Nabil Amin Hridoy Portfolio
        brand: {
          dark: '#030f2b',
          blue: '#175bea',
          cyan: '#00c5fb',
          white: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'var(--font-bengali)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        bengali: ['var(--font-bengali)', 'var(--font-sans)', 'sans-serif'],
      },
      fontSize: {
        // Premium typography scale
        'caption': ['0.75rem', { lineHeight: '1.125rem', letterSpacing: '0.025em' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'subtitle': ['1.25rem', { lineHeight: '1.6' }],
        'h4': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        'h3': ['1.875rem', { lineHeight: '1.35', letterSpacing: '-0.015em' }],
        'h2': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        'h1': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        'display': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      spacing: {
        // NOTE: Tailwind v4 shares the spacing scale with max-w-*, so we cannot
        // use names like `container`/`section` here without breaking max-w-container.
        // Use explicit Tailwind spacing utilities (p-4, p-6, p-8, gap-4, etc.) directly.
      },
      maxWidth: {
        'container-sm': '768px',   // narrow reading width
        'container': '1280px',     // DEFAULT — premium portfolio width
        'container-lg': '1440px',  // wide pages
        'container-xl': '1536px',  // extra wide (galleries, dashboards)
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        'modal': 'var(--shadow-modal)',
        'glow': 'var(--shadow-glow)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #175bea 0%, #00c5fb 100%)',
        'gradient-dark': 'linear-gradient(135deg, #030f2b 0%, #175bea 100%)',
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.8' },
        },
      },
      screens: {
        'xs': '375px',
        // sm: 640px (default)
        // md: 768px (default)
        // lg: 1024px (default)
        // xl: 1280px (default)
        '2xl': '1536px',
      },
    }
  },
  plugins: [tailwindcssAnimate],
};
export default config;
