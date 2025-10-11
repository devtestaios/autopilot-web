'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, Users, Activity, Zap } from 'lucide-react';
import { PremiumCard } from '@/components/ui/PremiumCard';

interface RealTimeMetric {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

export default function RealTimeData() {
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([
    {
      label: 'Active Sessions',
      value: '342',
      change: 5,
      icon: <Users className="w-5 h-5" />
    },
    {
      label: 'Live Campaigns',
      value: '18',
      change: 2,
      icon: <Activity className="w-5 h-5" />
    },
    {
      label: 'Current Spend/hr',
      value: '$127',
      change: -3,
      icon: <Zap className="w-5 h-5" />
    },
    {
      label: 'Conversion Rate',
      value: '3.24%',
      change: 8,
      icon: <Activity className="w-5 h-5" />
    }
  ]);

  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.label.includes('Sessions') ? 
          String(Math.floor(Math.random() * 100) + 300) :
          metric.label.includes('Campaigns') ?
          String(Math.floor(Math.random() * 5) + 15) :
          metric.label.includes('Spend') ?
          `$${Math.floor(Math.random() * 50) + 100}` :
          `${(Math.random() * 2 + 2).toFixed(2)}%`,
        change: +(Math.random() * 20 - 10).toFixed(1)
      })));
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  // Simulate connection status
  useEffect(() => {
    const statusInterval = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.95) {
        setConnectionStatus('connected');
      } else if (rand < 0.98) {
        setConnectionStatus('connecting');
      } else {
        setConnectionStatus('disconnected');
      }
    }, 30000);

    return () => clearInterval(statusInterval);
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'disconnected': return 'text-red-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Live Data';
      case 'connecting': return 'Connecting...';
      case 'disconnected': return 'Disconnected';
    }
  };

  return (
    <PremiumCard className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Real-Time Overview
        </h3>
        <div className="flex items-center gap-2">
          <Wifi className={`w-4 h-4 ${getStatusColor()}`} />
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg"
          >
            <div className="flex items-center justify-center mb-2 text-teal-600 dark:text-teal-400">
              {metric.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {metric.value}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {metric.label}
            </div>
            {metric.change !== 0 && (
              <div className={`text-xs font-medium ${
                metric.change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse mr-2"></div>
          Updates every 15 seconds • Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </PremiumCard>
  );
}