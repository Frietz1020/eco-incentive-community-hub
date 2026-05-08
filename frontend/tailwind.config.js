/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        canopy: "#059669",
        moss: "#64748b",
        river: "#2563eb",
        field: "#f8fafc",
        line: "#e2e8f0",
        danger: "#e84142",
        sun: "#f59e0b",
      },
    },
  },
  plugins: [],
};
