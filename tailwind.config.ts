import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
        },
        burgundy: {
          800: '#58111A',
          900: '#3D0A11',
          950: '#23040A',
          deep: '#24040A',
          rich: '#450B17',
          wine: '#5B1425',
          velvet: '#1B0307',
        },
        rose: {
          romantic: '#E25C80',
          glow: '#FF758F',
          petals: '#FF94A8',
        },
        champagne: {
          light: '#F8F1E5',
          DEFAULT: '#E6C687',
          gold: '#D4AF37',
          dark: '#B89230',
        },
        cream: {
          50: '#FFFDF9',
          100: '#FFF8F0',
          200: '#FDF2E3',
        }
      },
      fontFamily: {
        romantic: ['var(--font-romantic)', 'cursive', 'serif'],
        serif: ['var(--font-cormorant)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'sparkle': 'sparkle 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(3deg)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
