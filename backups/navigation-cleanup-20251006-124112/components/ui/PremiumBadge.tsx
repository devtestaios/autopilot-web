'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PremiumBadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
  status?: 'active' | 'paused' | 'ended' | 'optimizing'; // Add status prop for campaign status
}

const variantClasses = {
  default: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
  success: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
  warning: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
  danger: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300',
  info: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300',
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base',
};

const statusVariantMap = {
  active: 'success',
  paused: 'warning', 
  ended: 'danger',
  optimizing: 'info'
} as const;

const statusLabels = {
  active: 'Active',
  paused: 'Paused',
  ended: 'Ended',
  optimizing: 'Optimizing'
} as const;

export function PremiumBadge({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className,
  animated = false,
  status
}: PremiumBadgeProps) {
  // If status is provided, use it to determine variant and children
  const finalVariant = status ? statusVariantMap[status] : variant;
  const finalChildren = status ? statusLabels[status] : children;
  
  const badgeClasses = cn(
    'inline-flex items-center font-medium rounded-full border',
    variantClasses[finalVariant],
    sizeClasses[size],
    className
  );

  if (animated) {
    return (
      <motion.span
        className={badgeClasses}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {finalChildren}
      </motion.span>
    );
  }

  return <span className={badgeClasses}>{finalChildren}</span>;
}