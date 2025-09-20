'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PremiumLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
  variant?: 'spinner' | 'dots' | 'bars';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const SpinnerLoader = ({ size }: { size: 'sm' | 'md' | 'lg' }) => (
  <motion.div
    className={cn('border-2 border-blue-200 border-t-blue-600 rounded-full', sizeClasses[size])}
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  />
);

const DotsLoader = ({ size }: { size: 'sm' | 'md' | 'lg' }) => {
  const dotSize = size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3';
  
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn('bg-blue-600 rounded-full', dotSize)}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

const BarsLoader = ({ size }: { size: 'sm' | 'md' | 'lg' }) => {
  const barHeight = size === 'sm' ? 'h-2' : size === 'md' ? 'h-4' : 'h-6';
  const barWidth = size === 'sm' ? 'w-0.5' : size === 'md' ? 'w-1' : 'w-1.5';
  
  return (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={cn('bg-blue-600', barWidth, barHeight)}
          animate={{
            scaleY: [1, 0.3, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

export function PremiumLoading({ 
  size = 'md', 
  className,
  message,
  variant = 'spinner'
}: PremiumLoadingProps) {
  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader size={size} />;
      case 'bars':
        return <BarsLoader size={size} />;
      default:
        return <SpinnerLoader size={size} />;
    }
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      {renderLoader()}
      {message && (
        <motion.p
          className="text-sm text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}