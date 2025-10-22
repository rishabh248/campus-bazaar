/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/hero-bg.jpg')",
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        campusBazaarLight: {
          "primary": "#D97706", // A nice, rich orange
          "secondary": "#F97316",
          "accent": "#37CDBE",
          "neutral": "#3D4451",
          "base-100": "#FFFFFF",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
        campusBazaarDark: {
          "primary": "#F97316", // A brighter orange for dark mode
          "secondary": "#EA580C",
          "accent": "#37CDBE",
          "neutral": "#191D24",
          "base-100": "#2A323C",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
      // You can keep the default light and dark if you want to switch back
      "light",
      "dark",
    ],
    darkTheme: "campusBazaarDark",
    base: true,
    styled: true,
    utils: true,
    logs: false,
  },
}
