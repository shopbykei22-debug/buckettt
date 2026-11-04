/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F8',
          100: '#FCE4EC',
          200: '#FADADB',
          300: '#F8BBD0',
          400: '#F6A5C0',
          DEFAULT: '#F48FB1',
          500: '#F48FB1',
          600: '#E0729A',
          700: '#B9557B',
          800: '#8E3F5E',
          900: '#632C42',
        },
        secondary: {
          50: '#FAF4F6',
          100: '#EFE0E6',
          200: '#E6C5D1',
          300: '#D5A7B8',
          400: '#C48B9F',
          500: '#A87388',
          600: '#8E5F70',
          700: '#734C5B',
        },
        accent: {
          50: '#F3F8F5',
          100: '#E2EEE7',
          200: '#C6DDD0',
          300: '#A7C4B5',
          400: '#86A997',
          500: '#688C7A',
        },
        success: { 50: '#EEF8F3', 500: '#4F9D7A', 700: '#2F6E52' },
        warning: { 50: '#FDF7EC', 500: '#B9812A', 700: '#7D5518' },
        error: { 50: '#FCF0F2', 500: '#B94A5E', 700: '#82303F' },
        neutral: {
          50: '#FFF9FB',
          100: '#F6EEF1',
          200: '#E9DDE2',
          300: '#D2C3CA',
          400: '#A39299',
          500: '#7D6E75',
          600: '#67585F',
          700: '#51434A',
          800: '#3A2F35',
          900: '#241D21',
        },
        canvas: '#FFF9FB',
        ink: '#51434A',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'card-in': {
          '0%': { opacity: '0', transform: 'translateY(16px) scale(0.94)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'translateY(24px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'sway': {
          '0%, 100%': { transform: 'rotate(-1.5deg)' },
          '50%': { transform: 'rotate(1.5deg)' },
        },
      },
      animation: {
        'card-in': 'card-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.25s ease-out both',
        'pop-in': 'pop-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        'sway': 'sway 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
