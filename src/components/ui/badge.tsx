import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  onClick?: () => void;
  'data-testid'?: string;
}

export function Badge({ children, variant = 'default', className = '', onClick, 'data-testid': testId }: BadgeProps) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    destructive: 'bg-red-100 text-red-800',
    outline: 'border border-gray-200 text-gray-700 bg-white'
  };

  const Component = onClick ? 'button' : 'span';

  return (
    <Component 
      onClick={onClick}
      data-testid={testId}
      className={cn(
        baseClasses,
        variantClasses[variant],
        onClick ? 'cursor-pointer' : '',
        className
      )}
    >
      {children}
    </Component>
  );
}