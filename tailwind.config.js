/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        krishi: {
          50: '#f2f9f1',
          100: '#e1f2e0',
          200: '#c5e5c3',
          300: '#99d296',
          400: '#67b763',
          500: '#2E7D32', // Primary Karavali Green
          600: '#246628',
          700: '#1e5221',
          800: '#1b411d',
          900: '#173619',
          950: '#0a1d0c',
        },
        turmeric: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#F9A825', // Turmeric accent
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        soil: {
          50: '#f7f5f4',
          100: '#ece7e5',
          200: '#ded4d0',
          300: '#c8b8b1',
          400: '#a89086',
          500: '#5D4037', // Soil Brown
          600: '#75584e',
          700: '#5e453d',
          800: '#4f3b35',
          900: '#43342f',
        },
        field: '#FAFAF5',
      },
      fontFamily: {
        sans: ['Noto Sans', 'Noto Sans Kannada', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(46, 125, 50, 0.08), 0 4px 16px -4px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 24px -4px rgba(46, 125, 50, 0.16), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
