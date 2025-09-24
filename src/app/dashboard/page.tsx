'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  ArrowUpRight,
  Activity,
  Zap,
  Target
} from 'lucide-react';

import UnifiedSidebar from '@/components/UnifiedSidebar';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumButton } from '@/components/ui/PremiumButton';

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock data for demonstration
  const quickStats = [
    {
      title: 'Total Revenue',
      value: '$847,291',
      change: '+15.3%',
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-100 dark:bg-teal-900/30',
      icon: DollarSign
    },
    {
      title: 'Active Campaigns',
      value: '24',
      change: '+8.2%',
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
      icon: Target
    },
    {
      title: 'Conversion Rate',
      value: '12.4%',
      change: '+2.1%',
      color: 'text-teal-700 dark:text-teal-300',
      bgColor: 'bg-teal-50 dark:bg-teal-800/30',
      icon: TrendingUp
    },
    {
      title: 'Total Leads',
      value: '2,847',
      change: '+23.5%',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      icon: Users
    }
  ];

  const navigateToAnalytics = () => {
    router.push('/analytics');
  };

  const navigateToCampaigns = () => {
    router.push('/campaigns');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
        
        <main className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-[220px]'
        }`}>
          <div className="p-6 space-y-8">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  AI-powered campaign optimization and performance insights
                </p>
              </div>
              
              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                <PremiumButton
                  variant="ghost"
                  size="sm"
                  icon={<Activity className="w-4 h-4" />}
                >
                  Refresh
                </PremiumButton>
              </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PremiumCard 
                    variant="glassmorphism" 
                    hover 
                    className="p-6 cursor-pointer"
                    data-testid="metric-card"
                    onClick={() => {
                      if (stat.title.includes('Revenue')) {
                        navigateToAnalytics();
                      } else if (stat.title.includes('Campaigns')) {
                        navigateToCampaigns();
                      } else {
                        navigateToAnalytics();
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                        <p className={`text-sm font-medium ${stat.color} flex items-center gap-1 mt-1`}>
                          <ArrowUpRight className="w-3 h-3" />
                          {stat.change}
                        </p>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </PremiumCard>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              {/* Placeholder chart for testing */}
              <div data-testid="dashboard-chart" role="img" aria-label="Dashboard Chart" className="w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-6 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">Dashboard Chart</span>
              </div>
              
              <PremiumCard variant="glassmorphism" className="p-8">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Ready to Optimize Your Campaigns?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Let our AI optimization engine take your campaigns to the next level.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <PremiumButton 
                      variant="primary" 
                      size="lg" 
                      glow
                      onClick={navigateToCampaigns}
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      View Campaigns
                    </PremiumButton>
                    <PremiumButton 
                      variant="outline" 
                      size="lg"
                      onClick={navigateToAnalytics}
                    >
                      <BarChart3 className="w-5 h-5 mr-2" />
                      View Analytics
                    </PremiumButton>
                  </div>
                </div>
              </PremiumCard>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}