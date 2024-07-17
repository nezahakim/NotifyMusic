/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E90FF", // DodgerBlue
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
