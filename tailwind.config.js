/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens:{
      'xs': '475px',
      ...defaultTheme.screens
    },
    extend: {
      colors: {
          background: '#1E1E1E',
          text: '#CCCCCC',
          container: '#2A2A2A',
          heading: '#3498DB',
          navbarBg: '#2A2A2A',
          navbarText: '#CCCCCC',
          navbarHover: '#4D4D4D',
      },
    },
  },
  plugins: [],
}

