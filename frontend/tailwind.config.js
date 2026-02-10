// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        h4h: {
          purple: "#7C3AED", // Primary purple
          light: "#F5F3FF",
          dark: "#1F2937",
        },
      },
      backgroundImage: {
        'gradient-h4h': 'linear-gradient(135deg, #7C3AED 0%, #C026D3 100%)',
        'gradient-button': 'linear-gradient(90deg, #7C3AED 0%, #A855F7 100%)',
      }
    },
  },
  plugins: [],
}

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'sm': '390px',
        'md': '768px',
      },
    },
  },
}