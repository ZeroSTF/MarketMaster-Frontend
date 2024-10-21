/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        "roboto-flex": ['"Roboto Flex"', "sans-serif"],
      },
      boxShadowwatchlist: {
        'custom-inset': 'inset 0px 2px 11.4px 0px rgba(46, 156, 244, 0.25)',
      },
      screens: {
        'sm': '640px',   // Small devices (phones)
        'md': '768px',   // Medium devices (tablets)
        'lg': '1024px',  // Large devices (desktops)
        'xl': '1120px',  // Extra large devices (larger desktops)
        '2xl': '1230px', // 2X large devices (larger screens)
      }, 
      colors: {
        'dark-bg': '#0d0d0d',
        'deep-brown': '#3e2723',
        'deep-red': '#b71c1c',
        'dark-main': 'rgba(13,13,13,0.85)',
        'dark-sidebar': '#1f1f1f',
      },
      boxShadow: {
        'futuristic': '0 0 15px 5px rgba(255, 255, 0, 0.5)',
      },
      
    },
  },
  plugins: [require("@tailwindcss/forms")],
  darkMode: "class",
};
