import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        'orbitron': ['var(--font-orbitron)', 'monospace'],
        'exo-2': ['var(--font-exo-2)', 'sans-serif'],
      },
      colors: {
        // PulseBridge Official Brand Colors
        'pulse-blue': '#00d4ff',
        'pulse-cyan': '#00d4ff', // Alias for pulse-blue
        'bridge-purple': '#7c3aed',
        'pulse-purple': '#7c3aed', // Alias for bridge-purple
        'energy-magenta': '#ec4899',
        'deep-space': '#1a1a2e',
        'interface-gray': '#e0e6ed',
        
        // Enhanced CSS Variable Support
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "pulse-wave": "pulse-wave 1.5s ease-in-out infinite",
        "scanning": "scanning 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "fade-in": "fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in": "slide-in 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "pulse-wave": {
          "0%, 100%": { transform: "scaleY(1)", opacity: "0.8" },
          "50%": { transform: "scaleY(0.6)", opacity: "1" },
        },
        "scanning": {
          "0%, 100%": { opacity: "0", transform: "translateX(-100%)" },
          "50%": { opacity: "1", transform: "translateX(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 5px var(--pulse-blue)" },
          "50%": { boxShadow: "0 0 20px var(--pulse-blue), 0 0 30px var(--pulse-blue)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "fade-in": {
          "from": { opacity: "0", transform: "translateY(20px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "from": { opacity: "0", transform: "translateX(-20px)" },
          "to": { opacity: "1", transform: "translateX(0)" },
        },
      },
      letterSpacing: {
        'widest': '0.2em',
        'ultra-wide': '0.3em',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;