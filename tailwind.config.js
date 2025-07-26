/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Cute pixelated egg theme
        egg: {
          yolk: '#FFD93D', // Bright pixel yellow
          yolkLight: '#FFE566', // Lighter yellow
          yolkDark: '#FFB800', // Darker yellow
          white: '#FFFFFF', // Pure white
          shell: '#F8F8F8', // Off-white shell
          shellDark: '#E8E8E8', // Slightly darker shell
          pixel: {
            yellow: '#FFD93D',
            yellowLight: '#FFE566',
            yellowDark: '#FFB800',
            white: '#FFFFFF',
            gray: '#E0E0E0',
            grayDark: '#C0C0C0',
            black: '#2D2D2D',
          }
        },
        // Keep some of the original colors for variety
        sky: '#BEE3DB',
        grass: '#C7EFCF',
        blush: '#F7C5CC',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        fun: ['"Comic Neue"', 'cursive', 'sans-serif'],
      },
      keyframes: {
        crack: {
          '0%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(0.8) rotate(-2deg)' },
          '100%': { transform: 'scaleY(1) rotate(2deg)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        wobble: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '25%': { transform: 'rotate(3deg)' },
          '50%': { transform: 'rotate(-2deg)' },
          '75%': { transform: 'rotate(2deg)' },
        },
      },
      animation: {
        crack: 'crack 0.6s ease-in-out',
        bounce: 'bounce 2s infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        wobble: 'wobble 2s ease-in-out infinite',
      },
      boxShadow: {
        'pixel': '4px 4px 0px rgba(0, 0, 0, 0.1)',
        'pixel-lg': '6px 6px 0px rgba(0, 0, 0, 0.1)',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}; 