/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fuji-blue': {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#38aaf7',
          500: '#0e8fe9',
          600: '#0271c7',
          700: '#0359a1',
          800: '#074c85',
          900: '#0c406e',
        },
        'travel-orange': '#FE9A5F',
        'travel-pink': '#FDEAE6',
      },
      fontFamily: {
        'handwriting': ['"Kiwi Maru"', 'serif'], // 預留手寫風格字體
      }
    },
  },
  plugins: [],
}
