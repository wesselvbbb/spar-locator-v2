/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        green: "#32733C",
        red: "#D43E41",
        black: "#111827",
        light: {
          background: "#ffffff",
          text: "#000000",
        },
        dark: {
          background: "#000000",
          text: "#ffffff",
        },
      },
    },
  },
  plugins: [],
};
