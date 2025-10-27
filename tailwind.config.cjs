/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts}"
  ],
  theme: {
    extend: {}
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        gettingaround: {
          "primary": "#3b82f6",        // Bright blue for primary actions
          "primary-content": "#ffffff",
          "secondary": "#8b5cf6",      // Purple for secondary actions
          "secondary-content": "#ffffff",
          "accent": "#06b6d4",         // Cyan for highlights
          "accent-content": "#ffffff",
          "neutral": "#1f2937",        // Dark gray for neutral elements
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",       // Pure white background
          "base-200": "#f3f4f6",       // Light gray for cards
          "base-300": "#e5e7eb",       // Medium gray for borders
          "base-content": "#111827",   // Near-black for text
          "info": "#3b82f6",           // Blue for info
          "info-content": "#ffffff",
          "success": "#10b981",        // Green for success
          "success-content": "#ffffff",
          "warning": "#f59e0b",        // Amber for warnings
          "warning-content": "#ffffff",
          "error": "#ef4444",          // Red for errors
          "error-content": "#ffffff",
        }
      }
    ]
  }
};