'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface PremiumCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: 'default' | 'glassmorphism' | 'elevated' | 'flat' | 'bordered';
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
  children: React.ReactNode;
}

const cardVariants = {
  default: {
    base: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    shadow: 'shadow-lg',
  },
  glassmorphism: {
    base: 'bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10',
    shadow: 'shadow-2xl shadow-black/10',
  },
  elevated: {
    base: 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700',
    shadow: 'shadow-2xl shadow-gray-900/10 dark:shadow-black/20',
  },
  flat: {
    base: 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800',
    shadow: '',
  },
  bordered: {
    base: 'bg-transparent border-2 border-pulse-cyan/30 dark:border-pulse-cyan/50',
    shadow: '',
  }
};

export const PremiumCard = forwardRef<HTMLDivElement, PremiumCardProps>(
  ({
    variant = 'default',
    hover = true,
    glow = false,
    gradient = false,
    className,
    children,
    ...props
  }, ref) => {
    const variantClasses = cardVariants[variant];

    const baseClasses = cn(
      // Base styles
      'rounded-2xl transition-all duration-300 ease-out relative overflow-hidden',
      
      // Variant styles
      variantClasses.base,
      variantClasses.shadow,
      
      // Hover effects
      hover && 'hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]',
      
      // Glow effect
      glow && 'shadow-2xl shadow-pulse-cyan/20',
      
      // Gradient border
      gradient && 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900',
      
      className
    );

    const motionProps = {
      whileHover: hover ? {
        y: -4,
        scale: 1.02,
        transition: { duration: 0.2 }
      } : {},
      ...props
    };

    return (
      <motion.div
        ref={ref}
        className={baseClasses}
        {...motionProps}
      >
        {/* Gradient border effect */}
        {gradient && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pulse-cyan/20 via-pulse-purple/20 to-energy-magenta/20 p-px">
            <div className="h-full w-full rounded-2xl bg-white dark:bg-gray-800" />
          </div>
        )}
        
        {/* Shimmer effect for glassmorphism */}
        {variant === 'glassmorphism' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '100%', opacity: [0, 1, 0] }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              repeatDelay: 5,
              ease: 'easeInOut' 
            }}
          />
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);

PremiumCard.displayName = 'PremiumCard';