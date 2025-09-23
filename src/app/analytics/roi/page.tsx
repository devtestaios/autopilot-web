'use client';

import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, BarChart3, PieChart } from 'lucide-react';

export default function ROIAnalysisPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">ROI Analysis</h1>
          <p className="text-gray-600 dark:text-gray-400">Return on investment insights across all campaigns</p>
        </motion.div>

        {/* ROI Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">ROI Trend Over Time</h2>
          <div 
            role="img" 
            aria-label="ROI Trend Chart" 
            className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center"
          >
            <span className="text-gray-500 dark:text-gray-400">ROI Trend Chart</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
