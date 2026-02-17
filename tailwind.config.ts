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
        primary: {
          50: "#FFFBE6",
          100: "#FFF5BF",
          200: "#FFED8A",
          300: "#FFE455",
          400: "#FFDB2E",
          500: "#E8B706",
          600: "#D4A600",
          700: "#B08A00",
          800: "#8C6E00",
          900: "#6B5400",
        },
        accent: {
          50: "#FFF9E6",
          100: "#FFF0BF",
          200: "#FFE699",
          300: "#FFDB66",
          400: "#FFD033",
          500: "#FFC107",
          600: "#E0AA00",
          700: "#B88B00",
          800: "#8F6C00",
          900: "#664D00",
        },
        dark: {
          50: "#f8f9fa",
          100: "#f1f3f5",
          200: "#e9ecef",
          300: "#dee2e6",
          400: "#ced4da",
          500: "#adb5bd",
          600: "#868e96",
          700: "#495057",
          800: "#2d2d2d",
          900: "#1a1a1a",
          950: "#0d0d0d",
        },
      },
    },
  },
  plugins: [],
};

export default config;
