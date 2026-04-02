/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        root: 'var(--color-root)',
        panel: 'var(--color-panel)',
        card: 'var(--color-card)',
        deep: 'var(--color-deep)',
        subtle: 'var(--color-border)',
        primary: 'var(--color-text)',
        muted: 'var(--color-text-muted)',
        'muted-dark': 'var(--color-text-muted-dark)',
        accent: {
          blue: '#00f2fe',
          teal: '#4facfe',
        }
      },
      animation: {
        'flow': 'flow 20s linear infinite',
      },
      keyframes: {
        flow: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' }
        }
      }
    },
  },
  plugins: [],
}
