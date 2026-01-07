export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui"],
        display: ["Clash Display", "Plus Jakarta Sans", "system-ui"],
      },
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        stroke: "rgb(var(--stroke) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        brand: "rgb(var(--brand) / <alpha-value>)",
        brand2: "rgb(var(--brand2) / <alpha-value>)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgb(var(--stroke)/0.9), 0 22px 70px rgba(0,0,0,.65)",
      },
    },
  },
  plugins: [
    // Utility agar class `bg-white/8` valid
    function({ addUtilities }) {
      addUtilities({
        ".bg-white\\/8": {
          backgroundColor: "rgba(255,255,255,0.08)"
        },
        ".bg-white\\/12": {
          backgroundColor: "rgba(255,255,255,0.12)"
        },
        ".bg-white\\/6": {
          backgroundColor: "rgba(255,255,255,0.06)"
        }
      });
    }
  ]
};