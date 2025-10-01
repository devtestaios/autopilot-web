// Design Tokens System - Following UI/UX Golden Compass Framework
// Based on comprehensive 9105-line UI/UX dissertation principles

export const designTokens = {
  // Color System - Semantic Design Tokens (Domain 9)
  colors: {
    // Primary Brand Palette
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe', 
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Primary brand color
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49'
    },
    
    // Secondary Palette - Purple/Indigo for enterprise feel
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff', 
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7', // Secondary brand color
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764'
    },

    // Semantic Colors for Enterprise Applications
    semantic: {
      success: {
        light: '#dcfce7',
        default: '#16a34a',
        dark: '#14532d'
      },
      warning: {
        light: '#fef3c7',
        default: '#d97706',
        dark: '#92400e'
      },
      error: {
        light: '#fee2e2',
        default: '#dc2626',
        dark: '#991b1b'
      },
      info: {
        light: '#dbeafe',
        default: '#2563eb',
        dark: '#1e40af'
      }
    },

    // Neutral Palette with Enhanced Contrast Ratios (Domain 2 - Accessibility)
    neutral: {
      0: '#ffffff',
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712'
    }
  },

  // Typography System - Modern Scale (Domain 3)
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      display: ['Cal Sans', 'Inter', 'system-ui']
    },
    
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }]
    },

    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    }
  },

  // Spacing System - 8pt Grid with Golden Ratio (Domain 3)
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem', // 2px
    1: '0.25rem',    // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem',     // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem',    // 12px
    3.5: '0.875rem', // 14px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    7: '1.75rem',    // 28px
    8: '2rem',       // 32px
    9: '2.25rem',    // 36px
    10: '2.5rem',    // 40px
    11: '2.75rem',   // 44px
    12: '3rem',      // 48px
    14: '3.5rem',    // 56px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    28: '7rem',      // 112px
    32: '8rem',      // 128px
    36: '9rem',      // 144px
    40: '10rem',     // 160px
    44: '11rem',     // 176px
    48: '12rem',     // 192px
    52: '13rem',     // 208px
    56: '14rem',     // 224px
    60: '15rem',     // 240px
    64: '16rem',     // 256px
    72: '18rem',     // 288px
    80: '20rem',     // 320px
    96: '24rem'      // 384px
  },

  // Border Radius System (Domain 3)
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    DEFAULT: '0.25rem', // 4px  
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
  },

  // Shadow System - Layered Elevation (Domain 3)
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    
    // Enterprise-specific shadows
    glass: '0 8px 32px 0 rgb(31 38 135 / 0.37)',
    glow: '0 0 20px rgb(59 130 246 / 0.5)',
    'glow-purple': '0 0 20px rgb(168 85 247 / 0.5)',
    'glow-emerald': '0 0 20px rgb(16 185 129 / 0.5)'
  },

  // Animation & Transition System (Domain 4 - Micro-interactions)
  animation: {
    // Easing curves for natural motion
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      
      // Advanced easing for premium feel
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      back: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)'
    },

    // Duration scale for consistency
    duration: {
      instant: '0ms',
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms',
      slowest: '1000ms'
    },

    // Framer Motion variants for micro-interactions
    variants: {
      fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      },
      
      slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
      },
      
      scaleIn: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 }
      },
      
      slideFromRight: {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 50 }
      },

      // Premium hover effects
      liftUp: {
        rest: { y: 0, scale: 1 },
        hover: { y: -8, scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } }
      },

      // Stagger animations for lists
      staggerContainer: {
        animate: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
          }
        }
      },

      staggerItem: {
        initial: { opacity: 0, y: 20 },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, ease: 'easeOut' }
        }
      }
    }
  },

  // Breakpoints for Responsive Design (Domain 6)
  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    
    // Enterprise-specific breakpoints
    tablet: '768px',
    laptop: '1024px',
    desktop: '1280px',
    ultrawide: '1920px'
  },

  // Z-Index Scale for Layering (Domain 3)
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    
    // Semantic z-index values
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    modalBackdrop: '1040',
    modal: '1050',
    popover: '1060',
    tooltip: '1070',
    notification: '1080'
  },

  // Component-Specific Tokens
  components: {
    // Button System
    button: {
      height: {
        sm: '2rem',    // 32px
        md: '2.5rem',  // 40px
        lg: '3rem',    // 48px
        xl: '3.5rem'   // 56px
      },
      padding: {
        sm: '0.5rem 1rem',
        md: '0.75rem 1.5rem',
        lg: '1rem 2rem',
        xl: '1.25rem 2.5rem'
      }
    },

    // Input System
    input: {
      height: {
        sm: '2rem',
        md: '2.5rem',
        lg: '3rem'
      },
      padding: {
        sm: '0.5rem 0.75rem',
        md: '0.75rem 1rem',
        lg: '1rem 1.25rem'
      }
    },

    // Card System
    card: {
      padding: {
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '2.5rem'
      },
      borderRadius: '0.75rem', // 12px
      background: {
        light: 'rgba(255, 255, 255, 0.8)',
        dark: 'rgba(17, 24, 39, 0.8)'
      }
    }
  },

  // Accessibility Tokens (Domain 2)
  accessibility: {
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '#3b82f6',
      offset: '2px'
    },
    
    // WCAG 2.2 AAA compliant contrast ratios
    contrast: {
      min: '4.5:1',   // WCAG AA
      enhanced: '7:1' // WCAG AAA
    },

    // Minimum touch targets (44px per WCAG)
    touchTarget: {
      minSize: '44px'
    }
  }
};

// Export for TypeScript integration
export type DesignTokens = typeof designTokens;
export default designTokens;