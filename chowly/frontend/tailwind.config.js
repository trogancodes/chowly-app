/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#c2185b', // Raspberry
          light: '#d81b60',
          dark: '#9d1245',
        },
        appBg: '#e0f2fe',
        surface: '#ffffff',
      },
      boxShadow: {
        'framer': '0 10px 40px -10px rgba(194, 24, 91, 0.12)',
        'framer-hover': '0 20px 50px -12px rgba(194, 24, 91, 0.25)',
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      }
    },
  },
  plugins: [],
}