import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        blue: {
          1: "#032B41",
          2: "#0365F2",
        },
        gray: {
          1: "#394547",
          2: "#718096",
        },
        green: {
          1: "#2bd97c",
          2: "#16a34a",
        },
      },
    },
  },
  plugins: [],
};

export default config;
