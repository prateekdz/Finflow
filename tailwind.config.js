/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'Cascadia Code', 'monospace'],
      },
      colors: {
        // Finflow Design System Colors
        bg: {
          main: 'var(--color-bg-main)',
          card: 'var(--color-bg-card)',
          sunken: 'var(--color-bg-sunken)',
        },
        sidebar: 'var(--color-sidebar)',
        text: {
          primary: 'var(--color-text-primary)',
          muted: 'var(--color-text-muted)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          surface: 'var(--color-accent-surface)',
        },
        gain: 'var(--color-gain)',
        loss: 'var(--color-loss)',
        warning: 'var(--color-warning)',
        border: {
          DEFAULT: 'var(--color-border)',
          subtle: 'var(--color-border-subtle)',
        },
      },
      ringColor: {
        accent: 'var(--color-accent)',
      },
      borderRadius: {
        card: '12px',
        btn: '6px',
        input: '8px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '96': '24rem',
        '128': '32rem',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}