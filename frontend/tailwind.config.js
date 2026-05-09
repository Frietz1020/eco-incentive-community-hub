/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Primary palette - Nature Distilled Emeralds & Limes
        primary: {
          DEFAULT: "#059669", // Emerald 600
          light: "#34D399",   // Emerald 400
          dark: "#047857",    // Emerald 700
          dim: "rgba(5,150,105,0.08)",
        },
        accent: {
          DEFAULT: "#84CC16", // Lime 500
          light: "#A3E635",   // Lime 400
          dark: "#65A30D",    // Lime 600
          dim: "rgba(132,204,22,0.1)",
        },
        // Surface colors (light mode)
        surface: {
          DEFAULT: "#FFFFFF",
          raised: "#F8FAFC",
          field: "#F1F5F9",
          overlay: "rgba(255,255,255,0.85)",
        },
        // Text
        ink: "#064E3B",         // Emerald 900 (deep green text)
        "ink-strong": "#022C22", // Emerald 950
        muted: "#475569",       // Slate 600
        faint: "#94A3B8",       // Slate 400
        // Borders
        line: "#E2E8F0",
        "line-strong": "#CBD5E1",
        // Semantic
        danger: "#EF4444",
        amber: "#F59E0B",
        violet: "#8B5CF6",
        // Background
        canvas: "#F0FDF4",      // Green tinted white background
      },
      fontFamily: {
        display: ["Orbitron", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Exo 2", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        bio: "16px",
        "bio-lg": "24px",
      },
      boxShadow: {
        glow: "0 0 24px rgba(5,150,105,0.15)",
        "glow-green": "0 0 24px rgba(132,204,22,0.15)",
        card: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        "card-hover": "0 2px 8px rgba(5,150,105,0.08), 0 8px 32px rgba(5,150,105,0.06)",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "chain-move": "chainMove 30s linear infinite",
        "node-pulse": "nodePulse 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        chainMove: {
          "0%": { transform: "translateY(0) translateX(0)" },
          "100%": { transform: "translateY(-50%) translateX(-10%)" },
        },
        nodePulse: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.1)" },
        },
      },
    },
  },
  plugins: [],
};
