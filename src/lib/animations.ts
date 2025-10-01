// Enhanced Animation System - Following UI/UX Golden Compass Framework
// Domain 4: Interaction Design & Micro-interactions
// Physics-based animations with 60fps performance optimization

import { Variants, Transition } from 'framer-motion';

// Animation Constants for Consistency
export const ANIMATION_CONFIG = {
  // Physics-based spring configurations
  spring: {
    type: 'spring',
    damping: 25,
    stiffness: 300,
    mass: 1
  },
  
  springBouncy: {
    type: 'spring',
    damping: 15,
    stiffness: 400,
    mass: 0.8
  },
  
  springGentle: {
    type: 'spring',
    damping: 30,
    stiffness: 200,
    mass: 1.2
  },

  // Easing curves for premium feel
  easing: {
    smooth: [0.25, 0.46, 0.45, 0.94],
    snappy: [0.68, -0.6, 0.32, 1.6],
    gentle: [0.25, 0.1, 0.25, 1],
    bounce: [0.68, -0.55, 0.265, 1.55]
  },

  // Duration standards (60fps optimized)
  duration: {
    instant: 0,
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    slower: 0.8,
    slowest: 1.2
  }
} as const;

// Enterprise-Grade Animation Variants
export const animationVariants: Record<string, Variants> = {
  // Page transitions with depth
  pageTransition: {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.98
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: ANIMATION_CONFIG.duration.normal,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 0.98,
      transition: {
        duration: ANIMATION_CONFIG.duration.fast,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    }
  },

  // Modal/Dialog animations with backdrop
  modal: {
    initial: { 
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    animate: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        ...ANIMATION_CONFIG.springGentle,
        duration: ANIMATION_CONFIG.duration.normal
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: ANIMATION_CONFIG.duration.fast,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    }
  },

  // Card hover effects with lift
  cardHover: {
    rest: { 
      y: 0, 
      scale: 1,
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      transition: {
        duration: ANIMATION_CONFIG.duration.fast,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    },
    hover: { 
      y: -8, 
      scale: 1.02,
      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.15)',
      transition: {
        duration: ANIMATION_CONFIG.duration.fast,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: ANIMATION_CONFIG.duration.instant
      }
    }
  },

  // Button interactions with micro-feedback
  button: {
    rest: { 
      scale: 1,
      transition: {
        duration: ANIMATION_CONFIG.duration.fast,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    },
    hover: { 
      scale: 1.05,
      transition: {
        duration: ANIMATION_CONFIG.duration.fast,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    },
    tap: { 
      scale: 0.95,
      transition: {
        duration: ANIMATION_CONFIG.duration.instant
      }
    }
  },

  // Premium button with glow effect
  buttonPrimary: {
    rest: { 
      scale: 1,
      boxShadow: '0 4px 14px 0 rgb(59 130 246 / 0.2)',
      transition: {
        duration: ANIMATION_CONFIG.duration.fast,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: '0 8px 25px 0 rgb(59 130 246 / 0.4)',
      transition: {
        duration: ANIMATION_CONFIG.duration.fast,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    },
    tap: { 
      scale: 0.95,
      transition: {
        duration: ANIMATION_CONFIG.duration.instant
      }
    }
  },

  // Sidebar slide animations
  sidebar: {
    closed: { 
      x: '-100%',
      opacity: 0,
      transition: {
        duration: ANIMATION_CONFIG.duration.normal,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    },
    open: { 
      x: 0,
      opacity: 1,
      transition: {
        duration: ANIMATION_CONFIG.duration.normal,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    }
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
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: ANIMATION_CONFIG.duration.normal,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    }
  },

  // KPI Counter animations
  counterUp: {
    initial: { 
      opacity: 0,
      y: 30,
      scale: 0.8
    },
    animate: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        ...ANIMATION_CONFIG.springBouncy,
        delay: 0.2
      }
    }
  },

  // Loading states
  loading: {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        ease: 'easeInOut',
        repeat: Infinity
      }
    }
  },

  // Notification slide-in
  notification: {
    initial: { 
      opacity: 0,
      x: 300,
      scale: 0.95
    },
    animate: { 
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        ...ANIMATION_CONFIG.springGentle,
        duration: ANIMATION_CONFIG.duration.normal
      }
    },
    exit: { 
      opacity: 0,
      x: 300,
      scale: 0.95,
      transition: {
        duration: ANIMATION_CONFIG.duration.fast,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    }
  },

  // Dropdown menu animations
  dropdown: {
    initial: { 
      opacity: 0,
      scale: 0.95,
      y: -10
    },
    animate: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: ANIMATION_CONFIG.duration.fast,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: ANIMATION_CONFIG.duration.fast,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    }
  },

  // Tab switching animations
  tabContent: {
    initial: { 
      opacity: 0,
      x: 20
    },
    animate: { 
      opacity: 1,
      x: 0,
      transition: {
        duration: ANIMATION_CONFIG.duration.normal,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    },
    exit: { 
      opacity: 0,
      x: -20,
      transition: {
        duration: ANIMATION_CONFIG.duration.fast,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    }
  },

  // Progress bar animations
  progressBar: {
    initial: { width: 0 },
    animate: { 
      width: '100%',
      transition: {
        duration: ANIMATION_CONFIG.duration.slower,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    }
  },

  // Floating action button
  fab: {
    rest: { 
      scale: 1,
      boxShadow: '0 8px 25px 0 rgb(0 0 0 / 0.15)',
      transition: {
        duration: ANIMATION_CONFIG.duration.fast,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    },
    hover: { 
      scale: 1.1,
      boxShadow: '0 12px 35px 0 rgb(0 0 0 / 0.25)',
      transition: {
        duration: ANIMATION_CONFIG.duration.fast,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    },
    tap: { 
      scale: 0.95,
      transition: {
        duration: ANIMATION_CONFIG.duration.instant
      }
    }
  },

  // Chart/Graph reveal animations
  chartReveal: {
    initial: { 
      pathLength: 0,
      opacity: 0
    },
    animate: { 
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          duration: 2,
          ease: ANIMATION_CONFIG.easing.smooth
        },
        opacity: {
          duration: 0.5
        }
      }
    }
  },

  // Error state shake animation
  errorShake: {
    animate: {
      x: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.6,
        ease: 'easeInOut'
      }
    }
  },

  // Success pulse animation
  successPulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.6,
        ease: 'easeInOut',
        repeat: 2
      }
    }
  }
};

// Performance-optimized scroll animations
export const scrollAnimations = {
  // Parallax scrolling
  parallax: {
    y: [0, -50],
    transition: {
      duration: 0,
      ease: 'linear'
    }
  },

  // Fade in on scroll
  fadeInOnScroll: {
    initial: { opacity: 0, y: 50 },
    whileInView: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: ANIMATION_CONFIG.duration.normal,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    },
    viewport: { once: true, margin: '-100px' }
  }
};

// Utility functions for animation control
export const animationUtils = {
  // Create dynamic stagger based on index
  createStagger: (index: number, baseDelay = 0.1) => ({
    transition: {
      delay: index * baseDelay,
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.easing.smooth
    }
  }),

  // Create entrance animation with optional delay
  createEntrance: (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay,
        duration: ANIMATION_CONFIG.duration.normal,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    }
  }),

  // Create hover lift effect
  createHoverLift: (lift = 8, scale = 1.02) => ({
    rest: { y: 0, scale: 1 },
    hover: { 
      y: -lift, 
      scale,
      transition: {
        duration: ANIMATION_CONFIG.duration.fast,
        ease: ANIMATION_CONFIG.easing.smooth
      }
    }
  })
};

export default animationVariants;