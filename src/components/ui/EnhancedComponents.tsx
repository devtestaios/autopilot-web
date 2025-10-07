'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// Enhanced Button Component
interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    leftIcon,
    rightIcon,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center font-semibold transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'hover:scale-105 active:scale-95 transform',
      {
        'text-sm px-3 py-1.5 rounded-md': size === 'sm',
        'text-sm px-4 py-2 rounded-lg': size === 'md', 
        'text-base px-6 py-3 rounded-lg': size === 'lg'
      },
      {
        'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500': variant === 'primary',
        'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500': variant === 'secondary',
        'hover:bg-gray-100 text-gray-700 focus:ring-gray-500': variant === 'ghost',
        'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500': variant === 'outline',
        'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500': variant === 'danger'
      }
    );

    return (
      <button
        ref={ref}
        className={cn(baseClasses, className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <div className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';

// Enhanced Card Component
interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const EnhancedCard = forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const baseClasses = cn(
      'rounded-lg transition-all duration-200',
      {
        'bg-white dark:bg-gray-800 shadow-sm': variant === 'default',
        'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl': variant === 'elevated',
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700': variant === 'outlined'
      },
      {
        'p-0': padding === 'none',
        'p-4': padding === 'sm',
        'p-6': padding === 'md',
        'p-8': padding === 'lg'
      }
    );

    return (
      <div ref={ref} className={cn(baseClasses, className)} {...props}>
        {children}
      </div>
    );
  }
);

EnhancedCard.displayName = 'EnhancedCard';

// Enhanced Badge Component
interface EnhancedBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  withDot?: boolean;
}

export const EnhancedBadge = forwardRef<HTMLSpanElement, EnhancedBadgeProps>(
  ({ className, variant = 'default', size = 'md', withDot = false, children, ...props }, ref) => {
    const baseClasses = cn(
      'inline-flex items-center font-semibold rounded-full',
      {
        'text-xs px-2 py-1': size === 'sm',
        'text-sm px-2.5 py-1': size === 'md',
        'text-base px-3 py-1.5': size === 'lg'
      },
      {
        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200': variant === 'default',
        'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200': variant === 'success',
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200': variant === 'warning',
        'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200': variant === 'error',
        'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200': variant === 'info'
      }
    );

    return (
      <span ref={ref} className={cn(baseClasses, className)} {...props}>
        {withDot && (
          <span className={cn(
            'w-1.5 h-1.5 rounded-full mr-1.5',
            {
              'bg-gray-400': variant === 'default',
              'bg-green-400': variant === 'success',
              'bg-yellow-400': variant === 'warning',
              'bg-red-400': variant === 'error',
              'bg-blue-400': variant === 'info'
            }
          )} />
        )}
        {children}
      </span>
    );
  }
);

EnhancedBadge.displayName = 'EnhancedBadge';

// Simple Progress Component
interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, variant = 'default', ...props }, ref) => {
    const percentage = Math.min(Math.max(value, 0), max) / max * 100;
    
    return (
      <div
        ref={ref}
        className={cn('w-full bg-gray-200 rounded-full h-2', className)}
        {...props}
      >
        <div
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            {
              'bg-blue-600': variant === 'default',
              'bg-green-600': variant === 'success',
              'bg-yellow-600': variant === 'warning',
              'bg-red-600': variant === 'error'
            }
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';

// Simple Spinner Component
interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'border-2 border-current border-t-transparent rounded-full animate-spin',
          {
            'h-4 w-4': size === 'sm',
            'h-6 w-6': size === 'md',
            'h-8 w-8': size === 'lg'
          },
          className
        )}
        {...props}
      />
    );
  }
);

Spinner.displayName = 'Spinner';

// Simple Avatar Component
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full',
          {
            'h-8 w-8': size === 'sm',
            'h-10 w-10': size === 'md',
            'h-12 w-12': size === 'lg'
          },
          className
        )}
        {...props}
      >
        {src ? (
          <img
            className="aspect-square h-full w-full"
            alt={alt}
            src={src}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {fallback}
            </span>
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

// Export aliases for compatibility
export const Button = EnhancedButton;
export const Card = EnhancedCard;
export const Badge = EnhancedBadge;

export default {
  EnhancedButton,
  EnhancedCard,
  EnhancedBadge,
  Button,
  Card,
  Badge,
  Progress,
  Spinner,
  Avatar
};
