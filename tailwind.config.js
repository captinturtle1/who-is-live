/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'reverse-spin': 'rspin 1s linear infinite',
        'display-delay': 'displayDelay 50ms linear'
      },
      keyframes: {
        rspin: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        displayDelay: {
          '0%': { opacity: '0%' },
          '99%': { opacity: '0%' },
          '100%': { opacity: '100%' }
        }
      }
    },
  },
  plugins: [],
}

