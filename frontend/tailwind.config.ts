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
      primary: "#0A1F44",
      accent: "#D4AF37",
      background: "#F9F8F6",
    },
    boxShadow: {
      lex: "0 4px 12px rgba(10, 31, 68, 0.1)",
      "lex-hover": "0 8px 24px rgba(10, 31, 68, 0.15)",
    },
    fontFamily: {
      playfair: ["Playfair Display", "serif"],
      inter: ["Inter", "sans-serif"],
    },
  },
},
  plugins: [],
};

export default config;
