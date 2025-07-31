/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'opera': {
          primary: '#00D4AA',
          secondary: '#4A90E2',
          dark: '#1A1A1A',
          'dark-light': '#2A2A2A',
        }
      },
      backgroundImage: {
        'gradient-opera': 'linear-gradient(135deg, #00D4AA 0%, #4A90E2 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%)',
      },
    },
  },
  plugins: [],
} 