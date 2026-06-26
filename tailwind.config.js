/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        court: {
          900: "#0a0a0f",
          800: "#12121b",
          700: "#1b1b29",
          600: "#272739",
        },
        flame: {
          400: "#ff8a3d",
          500: "#ff6b00",
          600: "#e85d00",
        },
      },
      keyframes: {
        "pop-in": {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "pop-in": "pop-in 0.25s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
