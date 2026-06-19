import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
