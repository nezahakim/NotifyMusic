module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#1E90FF", // Dodger Blue
          dark: "#1A78D1", // Darker shade for hover states
        },
      },
    },
  },
  plugins: [],
};
