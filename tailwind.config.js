/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',   // 🔥 THIS ENABLES DARK MODE
  content: [
    "./index.html",
    "./about.html",
    "./products.html",
    "./subscribe.html",
    "./community.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
