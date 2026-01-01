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
        // Core branding - Calming and trustworthy blues
        primary: {
          50: "#f0f9ff", // lightest sky blue
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9", // sky blue
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e", // deep navy
          950: "#082f49", // darkest navy
        },
        // Navy for headers, trust elements
        navy: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68", // main navy
          800: "#243b53",
          900: "#102a43",
        },
        // Vibrant CTA accents
        accent: {
          orange: {
            50: "#fff7ed",
            100: "#ffedd5",
            200: "#fed7aa",
            300: "#fdba74",
            400: "#fb923c",
            500: "#f97316", // main orange CTA
            600: "#ea580c",
            700: "#c2410c",
            800: "#9a3412",
            900: "#7c2d12",
          },
          yellow: {
            50: "#fefce8",
            100: "#fef9c3",
            200: "#fef08a",
            300: "#fde047",
            400: "#facc15", // main yellow CTA
            500: "#eab308",
            600: "#ca8a04",
            700: "#a16207",
            800: "#854d0e",
            900: "#713f12",
          },
          red: {
            50: "#fef2f2",
            100: "#fee2e2",
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#ef4444", // main red CTA (urgent actions)
            600: "#dc2626",
            700: "#b91c1c",
            800: "#991b1b",
            900: "#7f1d1d",
          },
        },
        // Light backgrounds for clarity
        background: {
          DEFAULT: "#ffffff",
          light: "#f8fafc", // subtle gray for sections
          lighter: "#f1f5f9",
          card: "#ffffff",
        },
        // High contrast text
        text: {
          primary: "#0f172a", // very dark for main text
          secondary: "#475569", // medium gray for secondary text
          tertiary: "#64748b", // lighter gray for tertiary text
          inverse: "#ffffff", // white text on dark backgrounds
        },
      },
    },
  },
  plugins: [],
};

export default config;
