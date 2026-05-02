/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

const statusColors = ['slate', 'indigo', 'red', 'green', 'emerald', 'amber'];
const statusShades = ['100', '200', '400', '500', '600', '700'];
const darkShades = ['400', '800', '900'];

export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    ...statusColors.flatMap(color =>
      statusShades.flatMap(shade => [
        `bg-${color}-${shade}`,
        `text-${color}-${shade}`,
        `border-${color}-${shade}`,
        `ring-${color}-${shade}`,
      ])
    ),
    ...statusColors.flatMap(color =>
      darkShades.flatMap(shade => [
        `dark:bg-${color}-${shade}`,
        `dark:text-${color}-${shade}`,
        `dark:border-${color}-${shade}`,
        `dark:bg-${color}-${shade}/20`,
        `dark:bg-${color}-${shade}/30`,
        `dark:border-${color}-${shade}/30`,
      ])
    ),
  ],
  theme: {
    extend: {
      colors: {
        "primary":           "#6366F1",
        "primary-dark":      "#4F46E5",
        "primary-light":     "#818CF8",
        "secondary":         "#06B6D4",
        "background-light":  "#FAFAFA",
        "background-dark":   "#07090F",
        "surface-light":     "#FFFFFF",
        "surface-dark":      "#0F1629",
        "surface-card":      "#131D35",
        "text-main":         "#0A0F1E",
        "text-muted":        "#64748B",
        "accent":            "#10B981",
        "accent-warm":       "#F59E0B",
        "border-color":      "#E2E8F0",
        "border-dark":       "#1a2540",
      },
      fontFamily: {
        "display":   ["Space Grotesk", "sans-serif"],
        "body":      ["Inter", "sans-serif"],
        "mono":      ["JetBrains Mono", "monospace"],
        "signature": ["Dancing Script", "cursive"],
      },
      boxShadow: {
        "lift":    "0 20px 60px -12px rgba(99,102,241,0.25)",
        "soft":    "0 4px 24px -4px rgba(0,0,0,0.08)",
        "glow":    "0 0 40px rgba(99,102,241,0.35)",
        "card":    "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
      },
      backgroundImage: {
        "gradient-radial":   "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "mesh-primary":      "radial-gradient(at 40% 20%, hsla(240,100%,74%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.10) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(256,100%,74%,0.10) 0px, transparent 50%)",
      },
      animation: {
        "float":   "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% center" },
          to:   { backgroundPosition: "200% center" },
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [
    forms,
    containerQueries,
  ],
}