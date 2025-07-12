/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#172554',
          800: '#1e3a8a',
          700: '#1d4ed8',
          600: '#2563eb',
          500: '#3b82f6',
        },
        aqua: {
          900: '#0e7490',
          800: '#0891b2',
          700: '#06b6d4',
          600: '#0dcaf0',
          500: '#22d3ee',
        },
        slate: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
          50: '#f8fafc',
        },
        orange: {
          600: '#ea580c',
          500: '#fb923c',
          400: '#fdba74',
        },
        mint: {
          600: '#16a34a',
          500: '#4ade80',
          400: '#86efac',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
      },
      boxShadow: {
        subtle: '0 2px 4px rgba(0, 0, 0, 0.05)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        elevated: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        glow: '0 0 15px rgba(59, 130, 246, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.slate.700'),
            a: {
              color: theme('colors.navy.600'),
              '&:hover': {
                color: theme('colors.navy.800'),
              },
            },
            h1: {
              color: theme('colors.slate.900'),
              fontWeight: '700',
            },
            h2: {
              color: theme('colors.slate.900'),
              fontWeight: '600',
            },
            h3: {
              color: theme('colors.slate.900'),
              fontWeight: '600',
            },
            h4: {
              color: theme('colors.slate.900'),
              fontWeight: '600',
            },
            code: {
              color: theme('colors.navy.700'),
              backgroundColor: theme('colors.slate.100'),
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.slate.300'),
            a: {
              color: theme('colors.aqua.500'),
              '&:hover': {
                color: theme('colors.aqua.400'),
              },
            },
            h1: {
              color: theme('colors.white'),
            },
            h2: {
              color: theme('colors.white'),
            },
            h3: {
              color: theme('colors.white'),
            },
            h4: {
              color: theme('colors.white'),
            },
            code: {
              color: theme('colors.aqua.400'),
              backgroundColor: theme('colors.slate.800'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};