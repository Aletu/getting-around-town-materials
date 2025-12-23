/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts}"
  ],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      }
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "cupcake",
      "light",
      "dark",
      "bumblebee",
      {
        gettingaround: {
          "primary": "#65c3c8",
          "secondary": "#ef9fbc",
          "accent": "#eeaf3a",
          "neutral": "#291334",
          "base-100": "#faf7f5",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        }
      }
    ]
  }
};