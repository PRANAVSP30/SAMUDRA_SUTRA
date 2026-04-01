/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          900: '#001a33',
          800: '#002952',
          700: '#004080',
          600: '#0055b3',
          500: '#0066cc',
        },
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
