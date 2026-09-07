/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Dark theme: charcoal background, neon orange accent.
        cream: "#111827",        // page background (was warm cream, now charcoal)
        "cream-dark": "#1A2333", // card/surface background, one step lighter than the page
        terracotta: "#FF9030",        // primary accent (was muted terracotta, now neon orange)
        "terracotta-dark": "#E67A1F", // hover/pressed state for the accent
        clay: "#2D3748",   // borders and dividers
        ink: "#F3F4F6",    // primary text (was dark brown, now off-white)
        sage: "#34D399",   // success / served / paid accent
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
