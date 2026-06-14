/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: [
    "./index.html",
    "./src/**/*.{js,jsx}",
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