/** @type {import('tailwindcss').Config} */

// Build a Tailwind colour scale from CSS custom properties so utilities support
// <alpha-value> (e.g. bg-navy-900/80, text-aqua-400/60).
const withAlpha = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;
const scale = (base, stops) =>
  Object.fromEntries(stops.map((s) => [s, withAlpha(`${base}-${s}`)]));

const navy = scale('navy', [50, 100, 200, 300, 400, 500, 600, 700, 750, 800, 850, 900, 950]);
const aqua = scale('aqua', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]);
const secondary = scale('secondary', [100, 300, 500, 700, 900]);
const tertiary = scale('tertiary', [300, 400, 500, 700]);
const errorScale = scale('error', [300, 400, 500, 700]);

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Structural canvas
        navy,
        // Brand beacon — also aliased to `primary` so legacy primary-* utilities
        // across the codebase adopt the aqua palette.
        aqua,
        primary: aqua,
        secondary,
        tertiary,
        error: errorScale,
        // Semantic aliases
        surface: {
          DEFAULT: withAlpha('navy-900'),
          container: withAlpha('navy-800'),
          low: withAlpha('navy-850'),
          lowest: withAlpha('navy-950'),
          bright: withAlpha('navy-600'),
        },
        // Success maps to the aqua beacon (active/live states)
        success: {
          50: withAlpha('aqua-50'),
          400: withAlpha('aqua-400'),
          500: withAlpha('aqua-500'),
          600: withAlpha('aqua-600'),
          700: withAlpha('aqua-700'),
        },
        warning: {
          400: withAlpha('tertiary-400'),
          500: withAlpha('tertiary-500'),
          700: withAlpha('tertiary-700'),
        },
        accent: {
          aqua: withAlpha('aqua-400'),
          periwinkle: withAlpha('secondary-300'),
          coral: withAlpha('tertiary-400'),
        },
      },

      fontFamily: {
        display: ['var(--font-geist-sans)', 'Geist', 'system-ui', 'sans-serif'],
        sans: [
          'var(--font-inter)',
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'var(--font-jetbrains-mono)',
          'JetBrains Mono',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },

      fontSize: {
        // Design-system type scale
        'display': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-md': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'label-sm': ['0.75rem', { lineHeight: '1', letterSpacing: '0.02em', fontWeight: '600' }],
      },

      spacing: {
        18: '4.5rem',
        88: '22rem',
        112: '28rem',
        128: '32rem',
      },

      // Soft shape language (0.25rem default)
      borderRadius: {
        DEFAULT: '0.25rem',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      // Indigo/navy-tinted ambient shadows for dark elevation
      boxShadow: {
        sm: '0 1px 2px 0 rgb(2 6 23 / 0.4)',
        md: '0 4px 12px -2px rgb(2 6 23 / 0.45)',
        lg: '0 10px 24px -6px rgb(2 6 23 / 0.5)',
        xl: '0 20px 40px -12px rgb(2 6 23 / 0.55)',
        '2xl': '0 25px 55px -12px rgb(2 6 23 / 0.6)',
        elevated: '0 16px 40px -12px rgb(2 6 23 / 0.6)',
        card: '0 4px 12px -2px rgb(2 6 23 / 0.45)',
        'card-hover': '0 10px 24px -6px rgb(2 6 23 / 0.5)',
        button: '0 1px 2px 0 rgb(2 6 23 / 0.4)',
        'button-hover': '0 4px 12px -2px rgb(2 6 23 / 0.45)',
        glow: '0 0 0 1px rgb(79 219 200 / 0.4), 0 0 24px -4px rgb(79 219 200 / 0.35)',
        highlight: '0 0 0 3px rgb(79 219 200 / 0.35)',
      },

      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-once': 'pulse 1.5s ease-in-out',
        float: 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'aqua-gradient': 'linear-gradient(135deg, #4fdbc8 0%, #14b8a6 100%)',
        'navy-gradient': 'linear-gradient(135deg, #0e1513 0%, #1a211f 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
  ],
};
