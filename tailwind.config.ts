import type { Config } from "tailwindcss";

export default {
  // Phase 2D.1: Enhanced content paths for aggressive CSS purging (targeting 6-8 kB reduction)
  content: [
    // Core application paths
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    
    // Specific high-usage directories for better purging
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    
    // UI component directories - Phase 2D optimization
    "./src/components/ui/**/*.{js,ts,jsx,tsx}",
    "./src/components/dashboard/**/*.{js,ts,jsx,tsx}",
    "./src/components/project-management/**/*.{js,ts,jsx,tsx}",
    "./src/components/analytics/**/*.{js,ts,jsx,tsx}",
    "./src/components/navigation/**/*.{js,ts,jsx,tsx}",
  ],
  
  // Phase 2D.1: Enhanced purging through specific content paths
  
  darkMode: "class",
  theme: {
    extend: {
      spacing: {
        '0.5': '0.125rem',  // 2px
        '1': '0.25rem',     // 4px
        '2': '0.5rem',      // 8px - Base unit
        '3': '0.75rem',     // 12px
        '4': '1rem',        // 16px
        '5': '1.25rem',     // 20px
        '6': '1.5rem',      // 24px
        '8': '2rem',        // 32px
        '10': '2.5rem',     // 40px
        '12': '3rem',       // 48px
        '16': '4rem',       // 64px
        '20': '5rem',       // 80px
        '24': '6rem',       // 96px
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.25' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.5' }],      // 14px
        'base': ['1rem', { lineHeight: '1.5' }],        // 16px
        'md': ['1.125rem', { lineHeight: '1.625' }],    // 18px
        'lg': ['1.25rem', { lineHeight: '1.5' }],       // 20px
        'xl': ['1.5rem', { lineHeight: '1.375' }],      // 24px
        '2xl': ['1.875rem', { lineHeight: '1.25' }],    // 30px
        '3xl': ['2.25rem', { lineHeight: '1.25' }],     // 36px
        '4xl': ['3rem', { lineHeight: '1.25' }],        // 48px
      },
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
  
  // Phase 2D.1: Advanced optimization settings for CSS reduction
  
  plugins: [require("tailwindcss-animate")],
} satisfies Config;