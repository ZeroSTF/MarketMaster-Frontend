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
        sm: "640px", // Small devices (phones)
        md: "768px", // Medium devices (tablets)
        lg: "1024px", // Large devices (desktops)
        xl: "1120px", // Extra large devices (larger desktops)
        "2xl": "1230px", // 2X large devices (larger screens)
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
  darkMode: "class",
};
