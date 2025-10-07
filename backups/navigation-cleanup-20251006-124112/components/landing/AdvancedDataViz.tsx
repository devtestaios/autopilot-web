'use client';

import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { TrendingUp, BarChart3, PieChart, Activity, Zap, Target } from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

interface AdvancedDataVizProps {
  className?: string;
}

export function AdvancedDataViz({ className = '' }: AdvancedDataVizProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeChart, setActiveChart] = useState<'performance' | 'growth' | 'efficiency'>('performance');
  const [isAnimating, setIsAnimating] = useState(false);

  const performanceData: DataPoint[] = [
    { label: 'Google Ads', value: 85, color: 'from-blue-500 to-blue-600', trend: 'up' },
    { label: 'Meta Ads', value: 78, color: 'from-purple-500 to-purple-600', trend: 'up' },
    { label: 'LinkedIn', value: 92, color: 'from-green-500 to-green-600', trend: 'up' },
    { label: 'TikTok', value: 67, color: 'from-pink-500 to-pink-600', trend: 'stable' },
  ];

  const growthData: DataPoint[] = [
    { label: 'Q1 2024', value: 65, color: 'from-cyan-500 to-cyan-600', trend: 'up' },
    { label: 'Q2 2024', value: 78, color: 'from-blue-500 to-blue-600', trend: 'up' },
    { label: 'Q3 2024', value: 89, color: 'from-purple-500 to-purple-600', trend: 'up' },
    { label: 'Q4 2024', value: 95, color: 'from-pink-500 to-pink-600', trend: 'up' },
  ];

  const efficiencyData: DataPoint[] = [
    { label: 'Campaign Setup', value: 95, color: 'from-emerald-500 to-emerald-600', trend: 'up' },
    { label: 'Optimization', value: 88, color: 'from-teal-500 to-teal-600', trend: 'up' },
    { label: 'Reporting', value: 92, color: 'from-indigo-500 to-indigo-600', trend: 'up' },
    { label: 'Budget Management', value: 97, color: 'from-violet-500 to-violet-600', trend: 'up' },
  ];

  const getCurrentData = () => {
    switch (activeChart) {
      case 'performance': return performanceData;
      case 'growth': return growthData;
      case 'efficiency': return efficiencyData;
      default: return performanceData;
    }
  };

  const handleChartChange = (chart: typeof activeChart) => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveChart(chart);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <motion.section
      ref={ref}
      className={`py-20 px-4 relative overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20" />
        
        {/* Animated Grid */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear'
          }}
          style={{
            backgroundImage: `linear-gradient(90deg, #3B82F6 1px, transparent 1px),
                            linear-gradient(180deg, #3B82F6 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-gray-900 dark:text-white">Real-Time</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Intelligence
            </span>
          </motion.h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Advanced analytics that turn data into actionable insights across all your marketing channels
          </p>
        </motion.div>

        {/* Chart Navigation */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-2 border border-gray-200/50 dark:border-gray-700/50">
            {[
              { key: 'performance', label: 'Platform Performance', icon: BarChart3 },
              { key: 'growth', label: 'Growth Metrics', icon: TrendingUp },
              { key: 'efficiency', label: 'AI Efficiency', icon: Zap },
            ].map((tab) => (
              <motion.button
                key={tab.key}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeChart === tab.key
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => handleChartChange(tab.key as typeof activeChart)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Chart Area */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Interactive Bar Chart */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeChart === 'performance' ? 'Platform Performance' :
                 activeChart === 'growth' ? 'Quarterly Growth' :
                 'AI Efficiency Metrics'}
              </h3>
              <motion.div
                className="flex items-center text-green-500"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Activity className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Live Data</span>
              </motion.div>
            </div>

            <div className="space-y-6">
              {getCurrentData().map((item, index) => (
                <motion.div
                  key={`${activeChart}-${item.label}`}
                  className="group"
                  initial={{ x: -50, opacity: 0 }}
                  animate={isAnimating ? { x: -50, opacity: 0 } : { x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {item.label}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {item.value}%
                      </span>
                      <motion.div
                        className={`w-4 h-4 rounded-full ${
                          item.trend === 'up' ? 'bg-green-500' :
                          item.trend === 'down' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      />
                    </div>
                  </div>
                  
                  <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`absolute left-0 top-0 h-full bg-gradient-to-r ${item.color} rounded-full`}
                      initial={{ width: '0%' }}
                      animate={isAnimating ? { width: '0%' } : { width: `${item.value}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 1, ease: "easeOut" }}
                    />
                    
                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        repeatDelay: 3,
                        delay: index * 0.2 
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Real-time Metrics */}
          <div className="space-y-6">
            {/* Live Performance Card */}
            <motion.div
              className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden"
              whileHover={{ scale: 1.02, rotateY: 2 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Target className="w-8 h-8" />
                  <motion.div
                    className="text-sm bg-white/20 px-3 py-1 rounded-full"
                    animate={{
                      boxShadow: ['0 0 0 0 rgba(255,255,255,0.4)', '0 0 20px 10px rgba(255,255,255,0)']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Live Now
                  </motion.div>
                </div>
                
                <motion.h3
                  className="text-4xl font-bold mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  $2.4M
                </motion.h3>
                <p className="text-blue-100 mb-4">Revenue Generated Today</p>
                
                <div className="flex items-center">
                  <motion.div
                    className="w-3 h-3 bg-green-400 rounded-full mr-3"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-sm">+340% vs last month</span>
                </div>
              </div>
            </motion.div>

            {/* AI Insights Card */}
            <motion.div
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-6">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <BarChart3 className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    AI Recommendations
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Updated 2 minutes ago
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { text: 'Increase Google Ads budget by 25%', impact: '+$12K revenue' },
                  { text: 'Pause underperforming Meta campaigns', impact: 'Save $3.2K' },
                  { text: 'Expand LinkedIn targeting', impact: '+180% reach' },
                ].map((insight, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                    initial={{ x: 50, opacity: 0 }}
                    animate={isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
                    transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
                    whileHover={{ x: 5, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  >
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      {insight.text}
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                      {insight.impact}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Stats Row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {[
            { label: 'Active Campaigns', value: '2,847', trend: '+12%' },
            { label: 'AI Optimizations', value: '45.2K', trend: '+340%' },
            { label: 'Cost Savings', value: '$890K', trend: '+89%' },
            { label: 'Performance Boost', value: '285%', trend: '+45%' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 text-center"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {stat.label}
              </div>
              <div className="text-green-500 text-sm font-semibold">
                {stat.trend}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}