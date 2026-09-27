/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EAF2FB",
          100: "#DCEBF7",
          200: "#B7D6EF",
          300: "#8FB8DE",
          500: "#2E74B5",
          600: "#255E92",
          700: "#1D4A73",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

