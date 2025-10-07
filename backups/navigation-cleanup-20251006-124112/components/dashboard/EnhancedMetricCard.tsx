'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { PremiumCard } from '@/components/ui/PremiumCard';

interface EnhancedMetricCardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  loading?: boolean;
  onClick?: () => void;
  trend?: 'up' | 'down' | 'neutral';
  formatValue?: (value: string | number) => string;
  subtitle?: string;
  showSparkline?: boolean;
  sparklineData?: number[];
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export function EnhancedMetricCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor,
  bgColor,
  loading = false,
  onClick,
  trend = change >= 0 ? 'up' : 'down',
  formatValue,
  subtitle,
  showSparkline = false,
  sparklineData = []
}: EnhancedMetricCardProps) {
  const displayValue = formatValue ? formatValue(value) : value;
  const changeColor = trend === 'up' 
    ? 'text-green-600 dark:text-green-400' 
    : trend === 'down' 
    ? 'text-red-600 dark:text-red-400'
    : 'text-gray-600 dark:text-gray-400';

  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  if (loading) {
    return (
      <PremiumCard className="p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
      </PremiumCard>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <PremiumCard 
        variant="glassmorphism" 
        hover 
        className={`p-6 cursor-pointer group relative overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
        data-testid="enhanced-metric-card"
      >
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent dark:from-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {title}
              </p>
              {subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {subtitle}
                </p>
              )}
            </div>
            
            <motion.div 
              className={`p-3 rounded-xl ${bgColor} relative overflow-hidden`}
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className={`w-6 h-6 ${iconColor} relative z-10`} />
              
              {/* Icon background pulse effect */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-white/20"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.2, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </div>

          <div className="space-y-2">
            <motion.p 
              className="text-3xl font-bold text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {displayValue}
            </motion.p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <TrendIcon className={`w-4 h-4 ${changeColor}`} />
                <span className={`text-sm font-medium ${changeColor}`}>
                  {Math.abs(change)}%
                </span>
                {changeLabel && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {changeLabel}
                  </span>
                )}
              </div>

              {/* Mini Sparkline */}
              {showSparkline && sparklineData.length > 0 && (
                <div className="flex items-center space-x-px h-6">
                  {sparklineData.slice(-10).map((point, index) => (
                    <motion.div
                      key={index}
                      className={`w-1 rounded-full ${
                        trend === 'up' 
                          ? 'bg-green-400 dark:bg-green-500' 
                          : 'bg-red-400 dark:bg-red-500'
                      }`}
                      style={{ 
                        height: `${Math.max(4, (point / Math.max(...sparklineData)) * 24)}px` 
                      }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hover indicator */}
          {onClick && (
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 w-0 group-hover:w-full"
              transition={{ duration: 0.3 }}
            />
          )}
        </div>
      </PremiumCard>
    </motion.div>
  );
}

export default EnhancedMetricCard;