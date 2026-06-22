import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", "sans-serif"],
        serif: ["var(--font-outfit)", "sans-serif"],
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out forwards",
        "fade-in-up": "fade-in-up 0.45s ease-out forwards",
        "slide-in-right": "slide-in-right 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        pop: "pop 0.35s ease-out",
        "scale-in": "scale-in 0.25s ease-out forwards",
      },
      colors: {
        brand: {
          50: "#FDFDFD",
          100: "#F8F8F8",
          200: "#EEEEEE",
          300: "#DCDCDC",
          400: "#A8A8A8",
          500: "#7A7A7A",
          600: "#5C5C5C",
          700: "#4A4A4A",
          800: "#383838",
          900: "#282828",
          950: "#1C1C1C",
        },
        customPink: {
          DEFAULT: "#F77FBE",
          hover: "#f564b0",
        },
        customPurple: {
          DEFAULT: "#6F2DA8",
          hover: "#5A2490",
        },
        accentPink: {
          50: "#F9F2F4",
          100: "#F0E0E4",
          200: "#E1C1C9",
          300: "#D1A2AE",
          400: "#C58B95",
          500: "#B07680",
          600: "#9C626D",
          700: "#834E5A",
          800: "#6A3B47",
          900: "#512834",
          950: "#381521",
        },
        // Gold accent for minimalist feel (optional, but often used for premium)
        accentGold: {
          50: "#FFFBF0",
          100: "#FFF3DA",
          200: "#FFE7B5",
          300: "#FFD480",
          400: "#FFBD4D",
          500: "#D4AF37", // Primary gold tone
          600: "#B8952C",
          700: "#9C7C22",
          800: "#80621A",
          900: "#664B13",
          950: "#4D360C",
        },
      },
    },
  },
  plugins: [],
};
export default config;
