'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded' | 'card';
  width?: string | number;
  height?: string | number;
  animated?: boolean;
}

export function Skeleton({ 
  className = '', 
  variant = 'text', 
  width, 
  height, 
  animated = true 
}: SkeletonProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const baseClasses = `
    ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
    ${animated ? 'animate-pulse' : ''}
  `;

  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
    card: 'rounded-xl p-6 space-y-4'
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1rem' : undefined)
  };

  if (variant === 'card') {
    return (
      <div className={`${baseClasses} ${variants[variant]} ${className}`}>
        <div className="flex items-center space-x-4">
          <motion.div 
            className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"
            animate={animated ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="space-y-2 flex-1">
            <motion.div 
              className="h-4 bg-gray-300 dark:bg-gray-600 rounded"
              animate={animated ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
            />
            <motion.div 
              className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"
              animate={animated ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <motion.div 
            className="h-3 bg-gray-300 dark:bg-gray-600 rounded"
            animate={animated ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
          <motion.div 
            className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"
            animate={animated ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`${baseClasses} ${variants[variant]} ${className} relative overflow-hidden`}
      style={style}
      animate={animated ? { opacity: [0.5, 1, 0.5] } : {}}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      {animated && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-300/10 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          style={{ width: '50%' }}
        />
      )}
    </motion.div>
  );
}

// Campaign card skeleton
export function CampaignCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Skeleton height="1.5rem" width="60%" className="mb-2" />
          <Skeleton height="1rem" width="40%" />
        </div>
        <Skeleton variant="rectangular" width="4rem" height="1.5rem" className="ml-4" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Skeleton height="0.875rem" width="50%" className="mb-1" />
          <Skeleton height="1.25rem" width="70%" />
        </div>
        <div>
          <Skeleton height="0.875rem" width="60%" className="mb-1" />
          <Skeleton height="1.25rem" width="80%" />
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <Skeleton height="0.875rem" width="30%" />
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width="4rem" height="2rem" />
          <Skeleton variant="rectangular" width="4rem" height="2rem" />
        </div>
      </div>
    </div>
  );
}

// Dashboard widget skeleton
export function DashboardWidgetSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <Skeleton height="1.5rem" width="40%" />
        <Skeleton variant="circular" width="2rem" height="2rem" />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton height="3rem" width="30%" />
          <Skeleton height="1rem" width="20%" />
        </div>
        
        {/* Chart area */}
        <div className="h-32">
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </div>
        
        <div className="flex justify-between">
          <Skeleton height="0.875rem" width="25%" />
          <Skeleton height="0.875rem" width="25%" />
        </div>
      </div>
    </div>
  );
}

// Page skeleton for loading states
export function PageSkeleton({ children, showHeader = true }: { children?: React.ReactNode; showHeader?: boolean }) {
  return (
    <div className="space-y-6 p-6">
      {showHeader && (
        <>
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton height="2rem" width="200px" />
              <Skeleton height="1rem" width="300px" />
            </div>
            <Skeleton variant="rectangular" width="120px" height="40px" />
          </div>
        </>
      )}
      
      {children ? (
        children
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((index) => (
              <DashboardWidgetSkeleton key={index} />
            ))}
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton variant="rectangular" height="400px" />
            </div>
            <div className="space-y-4">
              {[0, 1, 2].map((index) => (
                <Skeleton key={index} variant="rectangular" height="120px" />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Chart skeleton
export function ChartSkeleton({ height = "300px" }: { height?: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <Skeleton height="1.5rem" width="200px" />
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width="80px" height="32px" />
          <Skeleton variant="rectangular" width="80px" height="32px" />
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Chart area */}
        <div style={{ height }} className="relative">
          <Skeleton variant="rectangular" width="100%" height="100%" />
          {/* Chart overlay elements */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/20 dark:via-blue-900/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ width: '30%' }}
          />
        </div>
        
        {/* Legend */}
        <div className="flex justify-center gap-6">
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex items-center gap-2">
              <Skeleton variant="rectangular" width="12px" height="12px" />
              <Skeleton height="0.875rem" width="60px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Table skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} height="1rem" width="80%" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="border-b border-gray-100 dark:border-gray-700 p-4 last:border-b-0">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton 
                key={colIndex} 
                height="1rem" 
                width={colIndex === 0 ? "90%" : `${60 + Math.random() * 30}%`} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Skeleton;