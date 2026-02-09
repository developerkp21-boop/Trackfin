/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'rgb(var(--bg-primary) / <alpha-value>)',
          secondary: 'rgb(var(--bg-secondary) / <alpha-value>)',
          card: 'rgb(var(--bg-card) / <alpha-value>)'
        },
        text: {
          primary: 'rgb(var(--text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--text-muted) / <alpha-value>)'
        },
        border: {
          subtle: 'rgb(var(--border-subtle) / <alpha-value>)',
          strong: 'rgb(var(--border-strong) / <alpha-value>)'
        },
        accent: {
          primary: 'rgb(var(--accent-primary) / <alpha-value>)',
          soft: 'rgb(var(--accent-soft) / <alpha-value>)',
          strong: 'rgb(var(--accent-strong) / <alpha-value>)'
        },
        brand: {
          primary: 'rgb(var(--brand-primary) / <alpha-value>)',
          soft: 'rgb(var(--brand-soft) / <alpha-value>)',
          strong: 'rgb(var(--brand-strong) / <alpha-value>)',
          50: 'rgb(var(--brand-soft) / <alpha-value>)',
          100: 'rgb(var(--brand-soft) / <alpha-value>)',
          200: 'rgb(var(--brand-soft) / <alpha-value>)',
          300: 'rgb(var(--brand-primary) / <alpha-value>)',
          400: 'rgb(var(--brand-primary) / <alpha-value>)',
          500: 'rgb(var(--brand-primary) / <alpha-value>)',
          600: 'rgb(var(--brand-strong) / <alpha-value>)',
          700: 'rgb(var(--brand-strong) / <alpha-value>)',
          800: 'rgb(var(--brand-strong) / <alpha-value>)',
          900: 'rgb(var(--brand-strong) / <alpha-value>)'
        },
        button: {
          primary: 'rgb(var(--button-bg) / <alpha-value>)',
          hover: 'rgb(var(--button-hover) / <alpha-value>)',
          text: 'rgb(var(--button-text) / <alpha-value>)'
        },
        state: {
          success: 'rgb(var(--state-success) / <alpha-value>)',
          danger: 'rgb(var(--state-danger) / <alpha-value>)',
          warning: 'rgb(var(--state-warning) / <alpha-value>)',
          info: 'rgb(var(--state-info) / <alpha-value>)'
        },
        on: {
          brand: 'rgb(var(--on-brand) / <alpha-value>)',
          accent: 'rgb(var(--on-accent) / <alpha-value>)'
        },
        blush: {
          50: 'rgb(var(--accent-soft) / <alpha-value>)',
          100: 'rgb(var(--accent-primary) / <alpha-value>)',
          200: 'rgb(var(--accent-primary) / <alpha-value>)',
          300: 'rgb(var(--accent-primary) / <alpha-value>)',
          400: 'rgb(var(--accent-strong) / <alpha-value>)',
          500: 'rgb(var(--accent-strong) / <alpha-value>)',
          600: 'rgb(var(--accent-strong) / <alpha-value>)',
          700: 'rgb(var(--accent-strong) / <alpha-value>)',
          800: 'rgb(var(--accent-strong) / <alpha-value>)',
          900: 'rgb(var(--accent-strong) / <alpha-value>)'
        },
        overlay: 'rgb(var(--overlay) / <alpha-value>)',
        ink: {
          50: 'rgb(var(--bg-secondary) / <alpha-value>)',
          100: 'rgb(var(--bg-secondary) / <alpha-value>)',
          200: 'rgb(var(--border-subtle) / <alpha-value>)',
          300: 'rgb(var(--border-strong) / <alpha-value>)',
          400: 'rgb(var(--text-muted) / <alpha-value>)',
          500: 'rgb(var(--text-muted) / <alpha-value>)',
          600: 'rgb(var(--text-secondary) / <alpha-value>)',
          700: 'rgb(var(--text-secondary) / <alpha-value>)',
          800: 'rgb(var(--text-primary) / <alpha-value>)',
          900: 'rgb(var(--text-primary) / <alpha-value>)'
        },
        emerald: {
          100: 'rgb(var(--state-success) / 0.18)',
          500: 'rgb(var(--state-success) / <alpha-value>)',
          600: 'rgb(var(--state-success) / <alpha-value>)',
          700: 'rgb(var(--state-success) / <alpha-value>)'
        },
        red: {
          100: 'rgb(var(--state-danger) / 0.18)',
          500: 'rgb(var(--state-danger) / <alpha-value>)',
          600: 'rgb(var(--state-danger) / <alpha-value>)',
          700: 'rgb(var(--state-danger) / <alpha-value>)'
        },
        amber: {
          100: 'rgb(var(--state-warning) / 0.18)',
          500: 'rgb(var(--state-warning) / <alpha-value>)',
          600: 'rgb(var(--state-warning) / <alpha-value>)',
          700: 'rgb(var(--state-warning) / <alpha-value>)'
        },
        blue: {
          100: 'rgb(var(--state-info) / 0.18)',
          500: 'rgb(var(--state-info) / <alpha-value>)',
          600: 'rgb(var(--state-info) / <alpha-value>)',
          700: 'rgb(var(--state-info) / <alpha-value>)'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgb(var(--shadow-color) / 0.12)',
        glow: '0 18px 40px rgb(var(--brand-primary) / 0.22)'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif']
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 }
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
