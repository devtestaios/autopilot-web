// Premium Visual Effects System - Following UI/UX Golden Compass Framework
// Domain 3: Modern Visual Design Principles + Domain 7: Performance-Optimized UI
// Advanced glassmorphism, gradient systems, and visual hierarchy

import { designTokens } from './designTokens';

// Glassmorphism Effects (Enterprise Premium)
export const glassmorphism = {
  // Light mode glassmorphism
  light: {
    backdrop: 'backdrop-blur-md backdrop-saturate-150',
    background: 'bg-white/80',
    border: 'border border-white/20',
    shadow: 'shadow-xl',
    ring: 'ring-1 ring-black/5'
  },

  // Dark mode glassmorphism
  dark: {
    backdrop: 'backdrop-blur-md backdrop-saturate-150',
    background: 'bg-gray-900/80',
    border: 'border border-white/10',
    shadow: 'shadow-2xl',
    ring: 'ring-1 ring-white/10'
  },

  // Combined utility classes
  card: 'backdrop-blur-md backdrop-saturate-150 bg-white/80 dark:bg-gray-900/80 border border-white/20 dark:border-white/10 shadow-xl ring-1 ring-black/5 dark:ring-white/10',

  sidebar: 'backdrop-blur-xl backdrop-saturate-200 bg-white/95 dark:bg-gray-900/95 border-r border-white/20 dark:border-white/10',

  modal: 'backdrop-blur-lg backdrop-saturate-150 bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-white/10 shadow-2xl',

  // Interactive states
  hover: 'hover:bg-white/90 dark:hover:bg-gray-900/90 hover:shadow-2xl transition-all duration-300',

  active: 'active:bg-white/95 dark:active:bg-gray-900/95 active:scale-[0.98] transition-all duration-150',

  // Visual mode presets
  modes: {
    premium: 'backdrop-blur-md backdrop-saturate-150 bg-white/80 dark:bg-gray-900/80 border border-white/20 dark:border-white/10 shadow-xl',
    standard: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm',
    minimal: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800'
  }
};

// Advanced Gradient System
export const gradients = {
  // Brand gradients
  primary: 'bg-gradient-to-r from-blue-500 to-indigo-600',
  secondary: 'bg-gradient-to-r from-purple-500 to-pink-600',
  success: 'bg-gradient-to-r from-green-500 to-emerald-600',
  warning: 'bg-gradient-to-r from-yellow-500 to-orange-600',
  error: 'bg-gradient-to-r from-red-500 to-rose-600',

  // Premium enterprise gradients
  premium: {
    ocean: 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700',
    sunset: 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600',
    forest: 'bg-gradient-to-br from-green-600 via-teal-600 to-cyan-700',
    royal: 'bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-700',
    gold: 'bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500'
  },

  // Subtle background gradients
  subtle: {
    light: 'bg-gradient-to-br from-gray-50 to-white',
    dark: 'bg-gradient-to-br from-gray-900 to-gray-800',
    neutral: 'bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-800'
  },

  // Text gradients
  text: {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent',
    secondary: 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent',
    rainbow: 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent'
  },

  // Hover state gradients
  hover: {
    primary: 'hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-700',
    secondary: 'hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-700',
    success: 'hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-700'
  },

  // Border gradients
  border: {
    primary: 'border-gradient-to-r from-blue-500 to-indigo-600',
    rainbow: 'border-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500'
  }
};

// Advanced Shadow System
export const shadows = {
  // Elevation shadows (Material Design inspired)
  elevation: {
    1: 'shadow-sm',
    2: 'shadow',
    3: 'shadow-md', 
    4: 'shadow-lg',
    5: 'shadow-xl',
    6: 'shadow-2xl'
  },

  // Colored shadows for premium effects
  colored: {
    blue: 'shadow-lg shadow-blue-500/25 dark:shadow-blue-500/40',
    purple: 'shadow-lg shadow-purple-500/25 dark:shadow-purple-500/40',
    green: 'shadow-lg shadow-green-500/25 dark:shadow-green-500/40',
    red: 'shadow-lg shadow-red-500/25 dark:shadow-red-500/40',
    orange: 'shadow-lg shadow-orange-500/25 dark:shadow-orange-500/40'
  },

  // Glow effects
  glow: {
    sm: 'shadow-lg shadow-current/20',
    md: 'shadow-xl shadow-current/30',
    lg: 'shadow-2xl shadow-current/40',
    xl: 'shadow-2xl shadow-current/50'
  },

  // Interactive shadows
  interactive: {
    rest: 'shadow-md',
    hover: 'hover:shadow-xl hover:shadow-black/10',
    active: 'active:shadow-inner'
  },

  // Custom shadow utilities
  custom: {
    neumorphism: 'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] shadow-[0_1px_0_0_rgba(0,0,0,0.1)]',
    inset: 'shadow-inner',
    none: 'shadow-none'
  }
};

// Typography Enhancement System
export const typography = {
  // Premium font combinations (with gradient effects)
  display: {
    hero: 'font-display text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight',
    title: 'font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
    subtitle: 'font-display text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight'
  },

  // Body text styles
  body: {
    large: 'text-lg leading-relaxed',
    base: 'text-base leading-relaxed',
    small: 'text-sm leading-relaxed',
    xs: 'text-xs leading-normal'
  },

  // Enhanced readability
  enhanced: {
    title: 'text-2xl font-semibold tracking-tight text-gray-900 dark:text-white',
    subtitle: 'text-lg font-medium text-gray-700 dark:text-gray-300',
    body: 'text-base text-gray-600 dark:text-gray-400 leading-relaxed',
    caption: 'text-sm text-gray-500 dark:text-gray-500'
  },

  // Interactive text states
  interactive: {
    link: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline-offset-4 hover:underline',
    button: 'font-semibold tracking-wide',
    nav: 'font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
  },

  // Visual mode presets
  modes: {
    premium: {
      title: 'text-4xl md:text-5xl font-bold tracking-tight',
      subtitle: 'text-lg md:text-xl text-gray-600 dark:text-gray-400'
    },
    standard: {
      title: 'text-3xl font-bold text-gray-900 dark:text-white',
      subtitle: 'text-base text-gray-600 dark:text-gray-400'
    },
    minimal: {
      title: 'text-2xl font-semibold text-gray-900 dark:text-white',
      subtitle: 'text-sm text-gray-600 dark:text-gray-400'
    }
  }
};

// Layout Utilities for Visual Hierarchy
export const layout = {
  // Flexbox patterns
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
    col: 'flex flex-col',
    colCenter: 'flex flex-col items-center justify-center'
  },

  // Grid patterns
  grid: {
    auto: 'grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))]',
    responsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    dashboard: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    sidebar: 'grid grid-cols-[250px_1fr]',
    sidebarCollapsed: 'grid grid-cols-[60px_1fr]'
  },

  // Spacing systems
  spacing: {
    section: 'py-16 md:py-24',
    container: 'px-4 md:px-6 lg:px-8',
    card: 'p-6 md:p-8',
    tight: 'space-y-4',
    comfortable: 'space-y-6',
    relaxed: 'space-y-8'
  }
};

// Interactive States System
export const states = {
  // Button states
  button: {
    primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 text-white transition-colors',
    secondary: 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 disabled:bg-gray-100 text-gray-900 transition-colors',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition-colors'
  },

  // Input states
  input: {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-500 focus:border-green-500 focus:ring-green-500'
  },

  // Card states
  card: {
    default: 'hover:shadow-lg transition-shadow',
    interactive: 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer',
    selected: 'ring-2 ring-blue-500 shadow-lg'
  }
};

// Accessibility Enhancements
export const accessibility = {
  // Focus states (WCAG 2.2 compliant)
  focus: {
    ring: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    visible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
    within: 'focus-within:ring-2 focus-within:ring-blue-500'
  },

  // High contrast support
  contrast: {
    text: 'contrast-more:text-black contrast-more:dark:text-white',
    border: 'contrast-more:border-black contrast-more:dark:border-white',
    bg: 'contrast-more:bg-white contrast-more:dark:bg-black'
  },

  // Screen reader utilities
  sr: {
    only: 'sr-only',
    focusable: 'sr-only focus:not-sr-only'
  }
};

// Performance Optimizations
export const performance = {
  // GPU acceleration for smooth animations
  gpu: 'transform-gpu',
  
  // Optimized scrolling
  scroll: 'scroll-smooth',
  
  // Content visibility for large lists
  contentVisibility: 'content-visibility-auto',
  
  // Reduce motion for accessibility
  reduceMotion: 'motion-reduce:transition-none motion-reduce:transform-none'
};

// Component Composition Utilities
export const compose = {
  // Premium card component
  card: `${glassmorphism.card} rounded-xl p-6 transition-all duration-300 ${states.card.interactive}`,
  
  // Enterprise button
  button: `inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold transition-all duration-200 ${accessibility.focus.ring}`,
  
  // Form input
  input: `w-full rounded-lg border px-3 py-2 transition-colors ${accessibility.focus.ring} ${states.input.default}`,
  
  // Navigation item
  navItem: `flex items-center px-3 py-2 rounded-lg transition-colors ${typography.interactive.nav} ${accessibility.focus.ring}`
};

// Export utility function to combine classes
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Export theme-aware utilities
export const getThemeClasses = (lightClass: string, darkClass: string) => {
  return `${lightClass} dark:${darkClass}`;
};

export default {
  glassmorphism,
  gradients,
  shadows,
  typography,
  layout,
  states,
  accessibility,
  performance,
  compose,
  cn,
  getThemeClasses
};