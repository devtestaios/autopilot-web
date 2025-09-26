'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumButton } from '@/components/ui/PremiumButton';

interface RealTimeMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  status: 'healthy' | 'warning' | 'critical';
  lastUpdated: Date;
  target?: number;
  unit: string;
}

interface RealTimeWidgetProps {
  title: string;
  metrics: RealTimeMetric[];
  refreshInterval?: number;
  onRefresh?: () => Promise<void>;
  className?: string;
}

const statusColors = {
  healthy: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  critical: 'text-red-600 dark:text-red-400'
};

const statusIcons = {
  healthy: CheckCircle,
  warning: AlertTriangle,
  critical: AlertTriangle
};

const statusBgColors = {
  healthy: 'bg-green-100 dark:bg-green-900/30',
  warning: 'bg-yellow-100 dark:bg-yellow-900/30',
  critical: 'bg-red-100 dark:bg-red-900/30'
};

export function RealTimeWidget({
  title,
  metrics,
  refreshInterval = 30000,
  onRefresh,
  className = ''
}: RealTimeWidgetProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [timeUntilNext, setTimeUntilNext] = useState(refreshInterval / 1000);

  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(async () => {
      if (onRefresh && !isRefreshing) {
        await handleRefresh();
      }
    }, refreshInterval);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setTimeUntilNext(prev => {
        if (prev <= 1) {
          return refreshInterval / 1000;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, [refreshInterval, onRefresh, isRefreshing]);

  const handleRefresh = async () => {
    if (isRefreshing || !onRefresh) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
      setLastRefresh(new Date());
      setTimeUntilNext(refreshInterval / 1000);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '%') {
      return `${value.toFixed(1)}%`;
    }
    if (unit === '$') {
      return `$${value.toLocaleString()}`;
    }
    if (unit === 'number') {
      return value.toLocaleString();
    }
    return `${value}${unit}`;
  };

  return (
    <PremiumCard variant="glassmorphism" className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Countdown Timer */}
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(timeUntilNext / 60)}:{(timeUntilNext % 60).toString().padStart(2, '0')}</span>
          </div>
          
          {/* Refresh Button */}
          <PremiumButton
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </PremiumButton>
        </div>
      </div>

      {/* Real-time Status Indicator */}
      <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-3 h-3 bg-green-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Live Data
          </span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Updated {lastRefresh.toLocaleTimeString()}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="space-y-4">
        <AnimatePresence>
          {metrics.map((metric, index) => {
            const StatusIcon = statusIcons[metric.status];
            const trendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
            const TrendIcon = trendIcon;
            
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group"
              >
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${statusBgColors[metric.status]}`}>
                      <StatusIcon className={`w-4 h-4 ${statusColors[metric.status]}`} />
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {metric.name}
                      </p>
                      {metric.target && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Target: {formatValue(metric.target, metric.unit)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Trend Indicator */}
                    <div className="flex items-center space-x-1">
                      <TrendIcon className={`w-4 h-4 ${
                        metric.trend === 'up' 
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`} />
                      <span className={`text-sm font-medium ${
                        metric.trend === 'up' 
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {Math.abs(metric.change).toFixed(1)}%
                      </span>
                    </div>

                    {/* Value */}
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatValue(metric.value, metric.unit)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar for Target Metrics */}
                {metric.target && (
                  <motion.div
                    className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  >
                    <motion.div
                      className={`h-full rounded-full ${
                        metric.value >= metric.target
                          ? 'bg-green-500'
                          : metric.value >= metric.target * 0.8
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                    />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Auto-refresh in {Math.floor(timeUntilNext / 60)}:{(timeUntilNext % 60).toString().padStart(2, '0')}
          </span>
          
          <div className="flex items-center space-x-2">
            <PremiumButton size="sm" variant="ghost">
              <BarChart3 className="w-4 h-4 mr-1" />
              Details
            </PremiumButton>
            
            <PremiumButton size="sm" variant="ghost">
              <Zap className="w-4 h-4 mr-1" />
              Optimize
            </PremiumButton>
          </div>
        </div>
      </div>
    </PremiumCard>
  );
}

export default RealTimeWidget;