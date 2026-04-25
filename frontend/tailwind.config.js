/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0b0f1e",
          "bg-secondary": "#111827",
          "bg-tertiary": "#1a2236",
          border: "rgb(255 255 255 / 0.1)",
          text: "#ffffff",
          "text-secondary": "#d1d5db",
        },
        light: {
          bg: "#f8fafc",
          "bg-secondary": "#f0f4ff",
          "bg-tertiary": "#ffffff",
          border: "rgb(229 231 235)",
          text: "#1f2937",
          "text-secondary": "#6b7280",
        },
      },
    },
  },
  plugins: [],
};
