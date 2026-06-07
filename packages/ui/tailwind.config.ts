import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          indigo: "#6366f1",
          violet: "#8b5cf6",
          cyan: "#06b6d4",
        },
      },
    },
  },
  plugins: [],
};

export default config;
