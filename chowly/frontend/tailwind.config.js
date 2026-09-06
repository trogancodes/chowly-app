/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2f8',
          100: '#fce7f3',
          500: '#e11d48',
          DEFAULT: '#c2185b', // Raspberry
          dark: '#9d1245',
          light: '#d81b60',
        },
        appBg: '#e0f2fe', // Soft Sky/Blue background from requirements
        surface: '#ffffff',
      },
      boxShadow: {
        'framer': '0 20px 50px -12px rgba(194, 24, 91, 0.08), 0 8px 24px -8px rgba(0, 0, 0, 0.04)',
        'framer-modal': '0 25px 60px -15px rgba(0, 0, 0, 0.15)',
        'glow': '0 0 20px rgba(194, 24, 91, 0.25)',
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      }
    },
  },
  plugins: [],
}