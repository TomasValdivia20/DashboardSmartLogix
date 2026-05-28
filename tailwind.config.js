/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '.theme-dark'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        smart: {
          naranja: '#ff7a00',
          azul: '#0f4c5c',
          blanco: '#ffffff',
        }
      }
    },
  },
  plugins: [],
}