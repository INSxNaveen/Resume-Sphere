/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Enable dark mode with class strategy (add 'dark' class to html element)
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}