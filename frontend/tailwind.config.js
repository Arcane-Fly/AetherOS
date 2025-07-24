/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'liquid-blue': '#0066CC',
        'liquid-purple': '#6B46C1',
        'liquid-green': '#059669',
      },
    },
  },
  plugins: [],
}