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
        'brand': ['var(--font-orbitron)', 'var(--font-exo-2)', 'sans-serif'], // PulseBridge brand font
        'sans': ['var(--font-exo-2)', 'system-ui', '-apple-system', 'sans-serif'], // Default body font
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
        
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        "pulse-wave": "pulse-wave 1.5s ease-in-out infinite",
        "scanning": "scanning 3s ease-in-out infinite",
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
      },
      letterSpacing: {
        'widest': '0.2em',
        'ultra-wide': '0.3em',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;