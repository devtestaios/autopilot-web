'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PremiumButtonProps 
  extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  glassmorphism?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

const buttonVariants = {
  primary: {
    base: 'bg-gradient-to-r from-pulse-cyan to-pulse-purple text-white border-transparent',
    hover: 'hover:from-pulse-cyan/90 hover:to-pulse-purple/90 hover:shadow-lg hover:shadow-pulse-cyan/25',
    focus: 'focus:ring-2 focus:ring-pulse-cyan/50',
    disabled: 'disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none'
  },
  secondary: {
    base: 'bg-white/10 backdrop-blur-sm text-pulse-cyan border border-pulse-cyan/30',
    hover: 'hover:bg-pulse-cyan/10 hover:border-pulse-cyan/50 hover:shadow-lg hover:shadow-pulse-cyan/20',
    focus: 'focus:ring-2 focus:ring-pulse-cyan/50',
    disabled: 'disabled:bg-muted disabled:text-muted-foreground disabled:border-border'
  },
  ghost: {
    base: 'bg-transparent text-pulse-cyan border-transparent',
    hover: 'hover:bg-pulse-cyan/10 hover:text-pulse-purple',
    focus: 'focus:ring-2 focus:ring-pulse-cyan/50',
    disabled: 'disabled:text-muted-foreground'
  },
  outline: {
    base: 'bg-transparent text-pulse-cyan border border-pulse-cyan/50',
    hover: 'hover:bg-pulse-cyan hover:text-white hover:border-pulse-cyan',
    focus: 'focus:ring-2 focus:ring-pulse-cyan/50',
    disabled: 'disabled:text-muted-foreground disabled:border-border'
  },
  danger: {
    base: 'bg-gradient-to-r from-red-500 to-red-600 text-white border-transparent',
    hover: 'hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/25',
    focus: 'focus:ring-2 focus:ring-red-500/50',
    disabled: 'disabled:from-gray-400 disabled:to-gray-500'
  },
  success: {
    base: 'bg-gradient-to-r from-green-500 to-green-600 text-white border-transparent',
    hover: 'hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:shadow-green-500/25',
    focus: 'focus:ring-2 focus:ring-green-500/50',
    disabled: 'disabled:from-gray-400 disabled:to-gray-500'
  }
};

const sizeVariants = {
  sm: 'px-3 py-1.5 text-sm font-medium',
  md: 'px-4 py-2 text-sm font-medium',
  lg: 'px-6 py-3 text-base font-medium',
  xl: 'px-8 py-4 text-lg font-semibold'
};

export const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    glassmorphism = false,
    glow = false,
    className,
    children,
    disabled,
    ...props
  }, ref) => {
    const variantClasses = buttonVariants[variant];
    const sizeClasses = sizeVariants[size];
    const isDisabled = disabled || loading;

    const baseClasses = cn(
      // Base styles
      'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 ease-out',
      'transform active:scale-95 relative overflow-hidden',
      'focus:outline-none focus:ring-offset-2 focus:ring-offset-background',
      
      // Variant styles
      variantClasses.base,
      variantClasses.hover,
      variantClasses.focus,
      variantClasses.disabled,
      
      // Size styles
      sizeClasses,
      
      // Glassmorphism effect
      glassmorphism && 'backdrop-blur-xl bg-background/5 border border-border',
      
      // Glow effect
      glow && !isDisabled && 'shadow-2xl shadow-pulse-cyan/50',
      
      // Disabled state
      isDisabled && 'cursor-not-allowed opacity-60',
      
      className
    );

    const motionProps = {
      whileHover: !isDisabled ? { 
        scale: 1.02,
        transition: { duration: 0.2 } 
      } : {},
      whileTap: !isDisabled ? { 
        scale: 0.98,
        transition: { duration: 0.1 } 
      } : {},
      ...props
    };

    return (
      <motion.button
        ref={ref}
        className={baseClasses}
        disabled={isDisabled}
        {...motionProps}
      >
        {/* Shimmer effect for primary variant */}
        {variant === 'primary' && !isDisabled && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 3,
              ease: 'easeInOut' 
            }}
          />
        )}
        
        {/* Content */}
        <div className="relative flex items-center gap-2">
          {loading && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          
          {!loading && icon && iconPosition === 'left' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          
          <span>{children}</span>
          
          {!loading && icon && iconPosition === 'right' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
        </div>
      </motion.button>
    );
  }
);

PremiumButton.displayName = 'PremiumButton';