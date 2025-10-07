'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { PremiumCard } from '@/components/ui/PremiumCard';

// Dynamic import for charts to reduce bundle size
const LazyChart = dynamic(() => import('@/components/ui/LazyChart'), { 
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-500 text-sm">Loading chart...</p>
      </div>
    </div>
  )
});

export default function PerformanceCharts() {
  const [performanceData, setPerformanceData] = useState([
    { name: 'Jan', impressions: 45000, clicks: 2400, conversions: 240 },
    { name: 'Feb', impressions: 52000, clicks: 2800, conversions: 290 },
    { name: 'Mar', impressions: 48000, clicks: 2600, conversions: 270 },
    { name: 'Apr', impressions: 61000, clicks: 3200, conversions: 320 },
    { name: 'May', impressions: 58000, clicks: 3100, conversions: 310 },
    { name: 'Jun', impressions: 67000, clicks: 3600, conversions: 380 },
    { name: 'Jul', impressions: 71000, clicks: 3800, conversions: 400 }
  ]);

  const [spendData, setSpendData] = useState([
    { name: 'Google Ads', spend: 18500, budget: 20000 },
    { name: 'Meta', spend: 14200, budget: 15000 },
    { name: 'LinkedIn', spend: 8900, budget: 10000 },
    { name: 'TikTok', spend: 5400, budget: 8000 }
  ]);

  // Simulate data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceData(prev => prev.map(item => ({
        ...item,
        impressions: item.impressions + Math.floor(Math.random() * 1000) - 500,
        clicks: item.clicks + Math.floor(Math.random() * 100) - 50,
        conversions: item.conversions + Math.floor(Math.random() * 20) - 10
      })));
    }, 45000); // Update every 45 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PremiumCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Performance Trends
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 dark:text-green-400">Live</span>
            </div>
          </div>
          <LazyChart 
            type="line"
            data={performanceData}
            dataKey="clicks"
            xAxisKey="name"
            color="#10b981"
            height={300}
            title=""
          />
        </PremiumCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <PremiumCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Spend vs Budget
          </h3>
          <LazyChart 
            type="bar"
            data={spendData}
            dataKey="spend"
            xAxisKey="name"
            color="#0ea5e9"
            height={300}
            title=""
          />
        </PremiumCard>
      </motion.div>
    </div>
  );
}