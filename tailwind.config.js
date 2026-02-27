/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        frieren: {
          50:  "#fcfbfd",
          100: "#f4f1f8",
          200: "#e6e1f0",
          300: "#d1c7e4",
          400: "#b5a6d3",
          500: "#947cbd",
          600: "#7a5caa",
          700: "#63478e",
          800: "#533b75",
          900: "#43315e",
          950: "#2b1e3f",
        },
        fern: {
          50:  "#f4f3f7",
          100: "#e5e3ec",
          200: "#ccc7d8",
          300: "#a89fc0",
          400: "#8273a3",
          500: "#645387",
          600: "#50416d",
          700: "#413558",
          800: "#362d49",
          900: "#2d263b",
          950: "#1d1827",
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
