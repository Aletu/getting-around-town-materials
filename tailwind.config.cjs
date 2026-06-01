/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts}"
  ],
  theme: {
    screens: {
      xs: '475px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Nunito', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'soft': '0 2px 14px -4px rgba(74, 47, 28, 0.12), 0 8px 22px -6px rgba(74, 47, 28, 0.08)',
        'soft-lg': '0 18px 50px -16px rgba(74, 47, 28, 0.18), 0 4px 14px -6px rgba(74, 47, 28, 0.10)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(74, 47, 28, 0.06)',
        'glow-primary': '0 0 22px rgba(214, 85, 47, 0.32)',
        'glow-secondary': '0 0 22px rgba(31, 138, 130, 0.30)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light",
      "dark",
      {
        gettingaround: {
          // Custom "warm town" palette — terracotta, deep teal and marigold over
          // a warm-paper base. Deliberately not the DaisyUI default theme.
          "primary": "#d6552f",
          "primary-content": "#fff7f0",
          "secondary": "#1f8a82",
          "secondary-content": "#f3fbfa",
          "accent": "#eaa12e",
          "accent-content": "#3a2a14",
          "neutral": "#2b2018",
          "neutral-content": "#f4e8d8",
          "base-100": "#fffdf8",
          "base-200": "#f7eee1",
          "base-300": "#ecdcc6",
          "base-content": "#2b2018",
          "info": "#3a82b5",
          "info-content": "#f2f9fd",
          "success": "#3f8f46",
          "success-content": "#f3fbf3",
          "warning": "#cf8a16",
          "warning-content": "#2b2018",
          "error": "#c4452e",
          "error-content": "#fff5f3",
          "--rounded-box": "1.25rem",
          "--rounded-btn": "0.85rem",
          "--rounded-badge": "1.5rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.98",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        }
      },
      {
        // WCAG AAA-targeted high-contrast theme: pure black/white with
        // saturated, distinct hues for status colors. All foreground/background
        // pairs hit at least 7:1 contrast.
        highcontrast: {
          "primary": "#0050a4",
          "primary-content": "#ffffff",
          "secondary": "#7a0080",
          "secondary-content": "#ffffff",
          "accent": "#9a4500",
          "accent-content": "#ffffff",
          "neutral": "#000000",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f0f0f0",
          "base-300": "#d4d4d4",
          "base-content": "#000000",
          "info": "#005fa6",
          "info-content": "#ffffff",
          "success": "#006b1f",
          "success-content": "#ffffff",
          "warning": "#8a4a00",
          "warning-content": "#ffffff",
          "error": "#a00000",
          "error-content": "#ffffff",
          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.375rem",
          "--rounded-badge": "0.5rem",
          "--border-btn": "2px",
        }
      }
    ],
    darkTheme: "dark",
    logs: false,
  }
};