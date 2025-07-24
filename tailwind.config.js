/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        yolk: {
          light: '#FFF9E3', // Eggshell
          DEFAULT: '#FFE066', // Yolk yellow
          dark: '#FFD23F', // Deeper yolk
        },
        shell: '#F7E7CE', // Egg shell
        sky: '#BEE3DB', // Pastel blue
        grass: '#C7EFCF', // Pastel green
        blush: '#F7C5CC', // Pastel pink
      },
      fontFamily: {
        fun: ['"Comic Neue"', 'cursive', 'sans-serif'],
      },
      keyframes: {
        crack: {
          '0%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(0.8) rotate(-2deg)' },
          '100%': { transform: 'scaleY(1) rotate(2deg)' },
        },
      },
      animation: {
        crack: 'crack 0.6s ease-in-out',
      },
    },
  },
  plugins: [],
}; 