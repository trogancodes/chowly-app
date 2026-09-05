/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7EFE1",
        "cream-dark": "#F0E4CE",
        terracotta: "#C1502E",
        "terracotta-dark": "#A8421F",
        clay: "#E4D3B8",
        ink: "#3A2A1C",
        sage: "#748C69",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        chowly: "1.75rem",
      },
    },
  },
  plugins: [],
};
