'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Loader2, Zap, TrendingUp, BarChart3 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  className?: string;
}

// Basic spinner with enhanced animations
export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  text,
  className = '' 
}: LoadingProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-8 h-8';
      default: return 'w-6 h-6';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'secondary':
        return isDark ? 'text-gray-400' : 'text-gray-600';
      case 'white':
        return 'text-white';
      default:
        return 'text-pulse-cyan';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${getSizeClasses()} ${getColorClasses()}`}
      >
        <Loader2 className="w-full h-full" />
      </motion.div>
      {text && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          {text}
        </motion.span>
      )}
    </div>
  );
}

// Pulse loading animation
export function PulseLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-3 h-3 bg-gradient-to-r from-pulse-cyan to-pulse-purple rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
}

// Wave loading animation
export function WaveLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-end space-x-1 ${className}`}>
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className="w-2 bg-gradient-to-t from-pulse-cyan to-pulse-purple rounded-full"
          animate={{
            height: ['8px', '24px', '8px']
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: index * 0.1,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
}

// Skeleton loading for cards and content
interface SkeletonProps {
  variant?: 'card' | 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  className?: string;
}

export function Skeleton({ 
  variant = 'rectangular', 
  width = 'w-full', 
  height = 'h-4',
  className = '' 
}: SkeletonProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const baseClasses = `
    ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
    animate-pulse
    ${className}
  `;

  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return 'rounded-xl p-6 space-y-4';
      case 'text':
        return 'rounded';
      case 'circular':
        return 'rounded-full';
      default:
        return 'rounded-lg';
    }
  };

  if (variant === 'card') {
    return (
      <div className={`${baseClasses} ${getVariantClasses()}`}>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3 animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${getVariantClasses()} ${width} ${height}`}>
      <motion.div
        className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        style={{ width: '50%' }}
      />
    </div>
  );
}

// Advanced loading overlay
interface LoadingOverlayProps {
  isLoading: boolean;
  children: ReactNode;
  loadingComponent?: ReactNode;
  blur?: boolean;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  children,
  loadingComponent,
  blur = true,
  className = ''
}: LoadingOverlayProps) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{
          filter: isLoading && blur ? 'blur(4px)' : 'blur(0px)',
          opacity: isLoading ? 0.5 : 1
        }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
      
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg z-10"
          >
            {loadingComponent || (
              <div className="flex flex-col items-center gap-4">
                <PulseLoader />
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  Loading...
                </motion.p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Progress loading bar
interface ProgressLoaderProps {
  progress: number;
  text?: string;
  className?: string;
  showPercentage?: boolean;
}

export function ProgressLoader({
  progress,
  text = 'Loading',
  className = '',
  showPercentage = true
}: ProgressLoaderProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {(text || showPercentage) && (
        <div className="flex justify-between items-center">
          {text && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {text}
            </motion.span>
          )}
          {showPercentage && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-gray-500 dark:text-gray-400"
            >
              {Math.round(progress)}%
            </motion.span>
          )}
        </div>
      )}
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-pulse-cyan to-pulse-purple rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute inset-0 bg-white/30 rounded-full"
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

// Specialized dashboard loading
export function DashboardLoader() {
  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <TrendingUp className="w-6 h-6 text-pulse-cyan animate-pulse" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Loading Dashboard
        </h2>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <Skeleton variant="text" width="w-20" height="h-4" />
              <div className="w-8 h-8 bg-gradient-to-br from-pulse-cyan/20 to-pulse-purple/20 rounded-lg animate-pulse" />
            </div>
            <Skeleton variant="text" width="w-16" height="h-8" />
            <Skeleton variant="text" width="w-24" height="h-3" />
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-5 h-5 text-pulse-cyan animate-pulse" />
          <Skeleton variant="text" width="w-32" height="h-5" />
        </div>
        <div className="space-y-3">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} variant="text" width="w-full" height="h-12" />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default LoadingSpinner;