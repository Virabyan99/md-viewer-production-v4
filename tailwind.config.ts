import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-roboto)", "Noto Sans", "sans-serif"],
      },
      colors: {
        brand: {
          100: "#dbeafe",
          200: "#bfdbfe",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        surface: {
          50: "#f9fafb",
          900: "#0f172a",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;