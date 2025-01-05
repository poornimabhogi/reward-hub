import type { Config } from "tailwindcss";
import { indexScreenConfig } from "./src/styles/screens/indexScreen";
import { shopScreenConfig } from "./src/styles/screens/shopScreen";
import { gamesScreenConfig } from "./src/styles/screens/gamesScreen";
import { healthScreenConfig } from "./src/styles/screens/healthScreen";
import { socialScreenConfig } from "./src/styles/screens/socialScreen";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        ...indexScreenConfig.colors,
        ...shopScreenConfig.colors,
        ...gamesScreenConfig.colors,
        ...healthScreenConfig.colors,
        ...socialScreenConfig.colors,
      },
      fontSize: {
        ...indexScreenConfig.fontSize,
        ...shopScreenConfig.fontSize,
        ...gamesScreenConfig.fontSize,
        ...healthScreenConfig.fontSize,
        ...socialScreenConfig.fontSize,
      },
      spacing: {
        ...indexScreenConfig.spacing,
        ...shopScreenConfig.spacing,
        ...gamesScreenConfig.spacing,
        ...healthScreenConfig.spacing,
        ...socialScreenConfig.spacing,
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;