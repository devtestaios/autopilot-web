'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Activity } from 'lucide-react';
import { PremiumCard } from '@/components/ui/PremiumCard';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

function MetricCard({ title, value, change, icon, color }: MetricCardProps) {
  return (
    <PremiumCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {change !== 0 && (
          <div className={`flex items-center gap-1 ${
            change > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{title}</p>
      </div>
    </PremiumCard>
  );
}

export default function DashboardMetrics() {
  const [metrics, setMetrics] = useState([
    {
      title: 'Total Campaigns',
      value: '24',
      change: 12.5,
      icon: <Target className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-br from-teal-500 to-cyan-600'
    },
    {
      title: 'Active Users',
      value: '8.2K',
      change: 8.1,
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600'
    },
    {
      title: 'Total Spend',
      value: '$47.2K',
      change: -2.4,
      icon: <DollarSign className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600'
    },
    {
      title: 'Performance Score',
      value: '92%',
      change: 5.3,
      icon: <Activity className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-br from-coral-500 to-orange-600'
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        change: Math.random() > 0.5 ? 
          +(Math.random() * 10).toFixed(1) : 
          -(Math.random() * 5).toFixed(1)
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <MetricCard {...metric} />
        </motion.div>
      ))}
    </div>
  );
}