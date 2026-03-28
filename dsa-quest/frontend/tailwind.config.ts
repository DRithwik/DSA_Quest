import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
    theme: {
    extend: {
      colors: {
        background: "#0a0a0c", // Deep Space Black
        foreground: "#f2f2f7",
        card: "#16161d",
        border: "rgba(255, 255, 255, 0.1)",
        primary: {
          DEFAULT: "#8b5cf6", // Violet
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#0ea5e9", // Cyan
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#f43f5e", // Rose
          foreground: "#ffffff",
        },
        muted: "#71717a",
        quest: {
          easy: "#10b981",
          medium: "#f59e0b",
          hard: "#ef4444"
        }
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      backgroundImage: {
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)",
        "neon-glow": "radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)"
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
      },
      keyframes: {
        wiggle: {
            "0%, 100%": { transform: "rotate(-3deg)" },
            "50%": { transform: "rotate(3deg)" },
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
