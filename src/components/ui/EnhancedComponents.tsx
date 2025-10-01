// Enhanced Component Library - Following UI/UX Golden Compass Framework
// Domain 1: Design Systems Architecture + Domain 4: Interaction Design & Micro-interactions
// Premium enterprise components with consistent design language

'use client';

import React, { forwardRef, ButtonHTMLAttributes, InputHTMLAttributes, HTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/visualEffects';
import { designTokens } from '@/lib/designTokens';
import { animationVariants } from '@/lib/animations';
import visualEffects from '@/lib/visualEffects';

// Enhanced Button Component with Premium States
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  gradient?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    leftIcon,
    rightIcon,
    gradient = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    
    const baseClasses = cn(
      // Base styling
      'inline-flex items-center justify-center font-semibold transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'transform-gpu', // GPU acceleration
      
      // Size variants
      {
        'text-sm px-3 py-1.5 rounded-md': size === 'sm',
        'text-sm px-4 py-2 rounded-lg': size === 'md', 
        'text-base px-6 py-3 rounded-lg': size === 'lg',
        'text-lg px-8 py-4 rounded-xl': size === 'xl'
      },
      
      // Variant styling
      {
        // Primary variant
        'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md hover:shadow-lg focus:ring-blue-500': 
          variant === 'primary' && !gradient,
        
        // Primary with gradient
        [`${visualEffects.gradients.primary} hover:shadow-lg ${visualEffects.shadows.colored.blue} text-white focus:ring-blue-500`]:
          variant === 'primary' && gradient,
        
        // Secondary variant
        'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-900 shadow-sm hover:shadow-md focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white':
          variant === 'secondary',
        
        // Ghost variant
        'hover:bg-gray-100 active:bg-gray-200 text-gray-700 focus:ring-gray-500 dark:hover:bg-gray-800 dark:active:bg-gray-700 dark:text-gray-300':
          variant === 'ghost',
        
        // Outline variant
        'border-2 border-gray-300 hover:border-gray-400 active:border-gray-500 bg-transparent text-gray-700 focus:ring-gray-500 dark:border-gray-600 dark:hover:border-gray-500 dark:text-gray-300':
          variant === 'outline',
        
        // Danger variant
        'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-md hover:shadow-lg focus:ring-red-500':
          variant === 'danger'
      }
    );

    return (
      <motion.button
        ref={ref}
        className={cn(baseClasses, className)}
        variants={animationVariants.buttonPrimary}
        whileHover="hover"
        whileTap="tap"
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <motion.div
            className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

// Enhanced Card Component with Glassmorphism
interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'glassmorphism' | 'elevated' | 'outline';
  interactive?: boolean;
  gradient?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', interactive = false, gradient = false, children, ...props }, ref) => {
    
    const baseClasses = cn(
      'rounded-xl transition-all duration-300',
      
      // Variant styling
      {
        // Default card
        'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm':
          variant === 'default',
        
        // Glassmorphism card
        [visualEffects.glassmorphism.card]: variant === 'glassmorphism',
        
        // Elevated card
        'bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-800':
          variant === 'elevated',
        
        // Outline card
        'bg-transparent border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600':
          variant === 'outline'
      },
      
      // Interactive states
      {
        'cursor-pointer hover:shadow-xl hover:-translate-y-1 transform-gpu': interactive,
        [visualEffects.gradients.subtle.neutral]: gradient
      }
    );

    const MotionCard = interactive ? motion.div : 'div';
    const motionProps = interactive ? {
      variants: animationVariants.cardHover,
      whileHover: 'hover',
      whileTap: 'tap'
    } : {};

    return (
      <MotionCard
        ref={ref}
        className={cn(baseClasses, className)}
        {...(interactive ? motionProps : {})}
        {...props}
      >
        {children}
      </MotionCard>
    );
  }
);

Card.displayName = 'Card';

// Enhanced Input Component
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outline';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    leftIcon, 
    rightIcon,
    variant = 'default',
    id,
    ...props 
  }, ref) => {
    
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    const inputClasses = cn(
      // Base styling
      'w-full transition-all duration-200 placeholder:text-gray-400',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      
      // Variant styling
      {
        // Default variant
        'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500':
          variant === 'default',
        
        // Filled variant
        'bg-gray-100 dark:bg-gray-800 border-transparent rounded-lg px-3 py-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-900':
          variant === 'filled',
        
        // Outline variant
        'border-2 border-gray-300 dark:border-gray-600 bg-transparent rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500':
          variant === 'outline'
      },
      
      // Error state
      {
        'border-red-500 focus:ring-red-500 focus:border-red-500': error,
        'pl-10': leftIcon,
        'pr-10': rightIcon
      }
    );

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium mb-2',
              error ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={cn(inputClasses, className)}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <div className="mt-2 text-sm">
            {error ? (
              <span className="text-red-600 dark:text-red-400">{error}</span>
            ) : (
              <span className="text-gray-500">{helperText}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Enhanced Badge Component
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  outline?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot = false, outline = false, children, ...props }, ref) => {
    
    const baseClasses = cn(
      'inline-flex items-center font-medium rounded-full transition-colors',
      
      // Size variants
      {
        'text-xs px-2 py-1': size === 'sm',
        'text-sm px-2.5 py-1': size === 'md',
        'text-base px-3 py-1.5': size === 'lg'
      },
      
      // Variant styling with outline support
      {
        // Default
        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200': 
          variant === 'default' && !outline,
        'border border-gray-300 text-gray-700 bg-transparent dark:border-gray-600 dark:text-gray-300':
          variant === 'default' && outline,
        
        // Success
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
          variant === 'success' && !outline,
        'border border-green-300 text-green-700 bg-transparent dark:border-green-600 dark:text-green-300':
          variant === 'success' && outline,
        
        // Warning
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
          variant === 'warning' && !outline,
        'border border-yellow-300 text-yellow-700 bg-transparent dark:border-yellow-600 dark:text-yellow-300':
          variant === 'warning' && outline,
        
        // Error
        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200':
          variant === 'error' && !outline,
        'border border-red-300 text-red-700 bg-transparent dark:border-red-600 dark:text-red-300':
          variant === 'error' && outline,
        
        // Info
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200':
          variant === 'info' && !outline,
        'border border-blue-300 text-blue-700 bg-transparent dark:border-blue-600 dark:text-blue-300':
          variant === 'info' && outline
      }
    );

    return (
      <span ref={ref} className={cn(baseClasses, className)} {...props}>
        {dot && (
          <span className={cn(
            'w-1.5 h-1.5 rounded-full mr-1.5',
            {
              'bg-gray-400': variant === 'default',
              'bg-green-500': variant === 'success',
              'bg-yellow-500': variant === 'warning',
              'bg-red-500': variant === 'error',
              'bg-blue-500': variant === 'info'
            }
          )} />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Enhanced Loading Spinner Component
interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'current';
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', color = 'primary', ...props }, ref) => {
    
    const sizeClasses = {
      sm: 'w-4 h-4 border-2',
      md: 'w-6 h-6 border-2',
      lg: 'w-8 h-8 border-3',
      xl: 'w-12 h-12 border-4'
    };
    
    const colorClasses = {
      primary: 'border-blue-600 border-t-transparent',
      secondary: 'border-gray-600 border-t-transparent',
      white: 'border-white border-t-transparent',
      current: 'border-current border-t-transparent'
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-full animate-spin',
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        {...props}
      />
    );
  }
);

Spinner.displayName = 'Spinner';

// Enhanced Avatar Component
interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fallback?: string;
  status?: 'online' | 'offline' | 'busy' | 'away';
  ring?: boolean;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, size = 'md', fallback, status, ring = false, ...props }, ref) => {
    
    const sizeClasses = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl',
      '2xl': 'w-20 h-20 text-2xl'
    };
    
    const statusColors = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      busy: 'bg-red-500',
      away: 'bg-yellow-500'
    };

    return (
      <div 
        ref={ref}
        className={cn('relative inline-block', className)}
        {...props}
      >
        <div className={cn(
          'rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-medium text-gray-600 dark:text-gray-300',
          sizeClasses[size],
          ring && 'ring-2 ring-white dark:ring-gray-800'
        )}>
          {src ? (
            <img 
              src={src} 
              alt={alt || 'Avatar'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{fallback || '?'}</span>
          )}
        </div>
        
        {status && (
          <span className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-800',
            statusColors[status],
            {
              'w-2 h-2': size === 'xs' || size === 'sm',
              'w-3 h-3': size === 'md' || size === 'lg',
              'w-4 h-4': size === 'xl' || size === '2xl'
            }
          )} />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

// Enhanced Progress Component
interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  animated?: boolean;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    value, 
    max = 100, 
    size = 'md', 
    variant = 'default',
    showLabel = false,
    animated = false,
    ...props 
  }, ref) => {
    
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const heightClasses = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4'
    };
    
    const colorClasses = {
      default: 'bg-blue-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      error: 'bg-red-600'
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {showLabel && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
        
        <div className={cn(
          'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
          heightClasses[size]
        )}>
          <motion.div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              colorClasses[variant],
              animated && 'bg-gradient-to-r from-current to-current animate-pulse'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

// Export all components
export {
  Button,
  Card,
  Input,
  Badge,
  Spinner,
  Avatar,
  Progress
};

// Export component collection
export default {
  Button,
  Card,
  Input,
  Badge,
  Spinner,
  Avatar,
  Progress
};