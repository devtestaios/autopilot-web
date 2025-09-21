'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Base loading animation variants
const pulseVariants = {
  initial: { opacity: 0.6 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut" as const
    }
  }
};

const shimmerVariants = {
  initial: { x: '-100%' },
  animate: { 
    x: '100%',
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

// Skeleton Components
const SkeletonBox: React.FC<{
  width?: string;
  height?: string;
  className?: string;
  animate?: boolean;
}> = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '', 
  animate = true 
}) => (
  <motion.div
    variants={animate ? pulseVariants : undefined}
    initial={animate ? "initial" : undefined}
    animate={animate ? "animate" : undefined}
    className={`bg-gray-200 dark:bg-gray-700 rounded ${width} ${height} ${className}`}
  />
);

const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBox
        key={i}
        width={i === lines - 1 ? 'w-3/4' : 'w-full'}
        height="h-4"
      />
    ))}
  </div>
);

const SkeletonCard: React.FC<{
  showImage?: boolean;
  className?: string;
}> = ({ showImage = true, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
    {showImage && (
      <SkeletonBox width="w-full" height="h-48" className="mb-4" />
    )}
    <SkeletonBox width="w-3/4" height="h-6" className="mb-3" />
    <SkeletonText lines={3} />
    <div className="flex justify-between items-center mt-4">
      <SkeletonBox width="w-20" height="h-8" />
      <SkeletonBox width="w-24" height="h-8" />
    </div>
  </div>
);

// Dashboard Skeleton
const DashboardSkeleton: React.FC = () => (
  <div className="p-6 space-y-6">
    {/* Header */}
    <div className="flex justify-between items-center">
      <div>
        <SkeletonBox width="w-64" height="h-8" className="mb-2" />
        <SkeletonBox width="w-48" height="h-4" />
      </div>
      <SkeletonBox width="w-32" height="h-10" />
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <SkeletonBox width="w-8" height="h-8" />
            <SkeletonBox width="w-16" height="h-4" />
          </div>
          <SkeletonBox width="w-20" height="h-8" className="mb-2" />
          <SkeletonBox width="w-24" height="h-4" />
        </div>
      ))}
    </div>

    {/* Chart Area */}
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <SkeletonBox width="w-48" height="h-6" className="mb-6" />
      <SkeletonBox width="w-full" height="h-64" />
    </div>

    {/* Table */}
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <SkeletonBox width="w-32" height="h-6" className="mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <SkeletonBox width="w-8" height="h-8" />
            <SkeletonBox width="w-32" height="h-4" />
            <SkeletonBox width="w-24" height="h-4" />
            <SkeletonBox width="w-20" height="h-4" />
            <SkeletonBox width="w-16" height="h-4" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Campaign Table Skeleton
const CampaignTableSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
    {/* Table Header */}
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <SkeletonBox width="w-48" height="h-6" />
        <div className="flex space-x-3">
          <SkeletonBox width="w-32" height="h-10" />
          <SkeletonBox width="w-24" height="h-10" />
        </div>
      </div>
      <div className="grid grid-cols-6 gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBox key={i} width="w-20" height="h-4" />
        ))}
      </div>
    </div>

    {/* Table Rows */}
    <div className="p-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="grid grid-cols-6 gap-4 py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
          <SkeletonBox width="w-full" height="h-4" />
          <SkeletonBox width="w-16" height="h-6" />
          <SkeletonBox width="w-20" height="h-4" />
          <SkeletonBox width="w-24" height="h-4" />
          <SkeletonBox width="w-16" height="h-4" />
          <div className="flex space-x-2">
            <SkeletonBox width="w-8" height="h-8" />
            <SkeletonBox width="w-8" height="h-8" />
            <SkeletonBox width="w-8" height="h-8" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Chart Skeleton
const ChartSkeleton: React.FC<{
  title?: string;
  height?: string;
}> = ({ title, height = 'h-64' }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
    {title && (
      <SkeletonBox width="w-48" height="h-6" className="mb-6" />
    )}
    <div className={`relative overflow-hidden ${height} bg-gray-100 dark:bg-gray-700 rounded-lg`}>
      <motion.div
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
    </div>
  </div>
);

// Loading Spinner Components
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 
      role="status" 
      aria-label="Loading"
      className={`animate-spin ${sizeClasses[size]} ${className}`} 
    />
  );
};

export const LoadingOverlay: React.FC<{
  message?: string;
  transparent?: boolean;
}> = ({ message = 'Loading...', transparent = false }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className={`
      fixed inset-0 z-50 flex items-center justify-center
      ${transparent ? 'bg-black/20 backdrop-blur-sm' : 'bg-white/90 dark:bg-gray-900/90'}
    `}
  >
    <div className="text-center">
      <LoadingSpinner size="lg" className="mx-auto mb-4 text-blue-600 dark:text-blue-400" />
      <p className="text-gray-600 dark:text-gray-400 font-medium">{message}</p>
    </div>
  </motion.div>
);

// Inline Loading States
export const InlineLoading: React.FC<{
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ message = 'Loading...', size = 'md' }) => (
  <div className="flex items-center justify-center space-x-3 py-8">
    <LoadingSpinner size={size} className="text-blue-600 dark:text-blue-400" />
    <span className="text-gray-600 dark:text-gray-400">{message}</span>
  </div>
);

export const ButtonLoading: React.FC<{
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}> = ({ children, loading = false, disabled = false, className = '', onClick }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`
      relative overflow-hidden transition-all duration-200
      ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
      ${className}
    `}
  >
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center bg-inherit">
        <LoadingSpinner size="sm" />
      </div>
    )}
    <span className={loading ? 'opacity-0' : 'opacity-100'}>
      {children}
    </span>
  </button>
);

// Page Loading Templates
export const PageLoading: React.FC<{
  type?: 'dashboard' | 'table' | 'form' | 'chart';
}> = ({ type = 'dashboard' }) => {
  switch (type) {
    case 'dashboard':
      return <DashboardSkeleton />;
    case 'table':
      return (
        <div className="p-6">
          <CampaignTableSkeleton />
        </div>
      );
    case 'chart':
      return (
        <div className="p-6">
          <ChartSkeleton title="Performance Chart" />
        </div>
      );
    case 'form':
      return (
        <div className="max-w-2xl mx-auto p-6">
          <SkeletonBox width="w-64" height="h-8" className="mb-6" />
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <SkeletonBox width="w-32" height="h-4" className="mb-2" />
                <SkeletonBox width="w-full" height="h-10" />
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-3 mt-8">
            <SkeletonBox width="w-24" height="h-10" />
            <SkeletonBox width="w-32" height="h-10" />
          </div>
        </div>
      );
    default:
      return <DashboardSkeleton />;
  }
};

// Export all components
export {
  DashboardSkeleton,
  CampaignTableSkeleton,
  ChartSkeleton,
  SkeletonCard,
  SkeletonText,
  SkeletonBox
};