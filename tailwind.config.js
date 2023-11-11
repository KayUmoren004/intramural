/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/**/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/**/**/*.{js,jsx,ts,tsx}",
    "./app/**/**/**/*.{js,jsx,ts,tsx}",
    "./app/**/**/**/**/*.{js,jsx,ts,tsx}",
    "./app/**/**/**/**/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#336699",
          DEFAULT: "#336699",
          dark: "#80BFFF",
        },
        secondary: {
          light: "#4CAF50",
          DEFAULT: "#4CAF50",
          dark: "#8EEB87",
        },
        background: {
          light: "#F4F4F4",
          DEFAULT: "#F4F4F4",
          dark: "#000000", // This is the dark mode background color.
        },
        text: {
          light: "#333333",
          DEFAULT: "#333333",
          dark: "#FFFFFF", // This is the dark mode text color.
        },
        disabled: {
          light: "#CCCCCC",
          DEFAULT: "#CCCCCC",
          dark: "#4D4D4D",
        },
        error: {
          light: "#FF5733",
          DEFAULT: "#FF5733",
          dark: "#FF8566",
        },
        success: {
          light: "#28A745",
          DEFAULT: "#28A745",
          dark: "#71C671",
        },
        information: {
          light: "#17A2B8",
          DEFAULT: "#17A2B8",
          dark: "#5ECED7",
        },
        warning: {
          light: "#FFC107",
          DEFAULT: "#FFC107",
          dark: "#FFD67F",
        },
      },
    },
  },
  plugins: [],
};
