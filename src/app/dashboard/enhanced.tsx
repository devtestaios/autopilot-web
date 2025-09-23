'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/components/ui/Toast';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  Eye,
  Plus,
  Target
} from 'lucide-react';
import UnifiedSidebar from '@/components/UnifiedSidebar';
import AdvancedNavigation from '@/components/AdvancedNavigation';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import AIControlChat from '@/components/AIControlChat';
import { AsyncContent } from '@/components/ui/AsyncContent';
import AIInsights from '@/components/AIInsights';

export default function EnhancedDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const { showToast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigateToNewCampaign = () => router.push('/campaigns/new');
  const navigateToAnalytics = () => router.push('/analytics');

  const quickStats = [
    {
      title: 'Total Revenue',
      value: '$847,291',
      change: '+15.3%',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      icon: DollarSign
    },
    {
      title: 'Active Campaigns',
      value: '24',
      change: '+3',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      icon: Target
    },
    {
      title: 'Conversion Rate',
      value: '12.4%',
      change: '+2.1%',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      icon: TrendingUp
    },
    {
      title: 'Total Clicks',
      value: '156,432',
      change: '+8.7%',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      icon: Activity
    }
  ];

  const refreshData = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    if (showToast) {
      showToast('Dashboard data refreshed successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-[220px]'}`}>
        <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
        
        <main className="p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user?.name || 'User'}! 👋
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Here's what's happening with your campaigns today.
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                <PremiumButton
                  onClick={refreshData}
                  disabled={isRefreshing}
                  variant="outline"
                  size="sm"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </PremiumButton>
                
                <PremiumButton onClick={navigateToNewCampaign} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </PremiumButton>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PremiumCard data-testid="metric-card" className="p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                      <p className={`text-sm font-medium mt-1 ${stat.color}`}>
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </PremiumCard>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PremiumCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Campaign Overview</h3>
                  <PremiumButton variant="outline" size="sm" onClick={navigateToAnalytics}>
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </PremiumButton>
                </div>
                
                <div className="text-center py-12" data-testid="dashboard-chart">
                  <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Campaign data will appear here</p>
                </div>
              </PremiumCard>
            </div>

            <div className="space-y-6">
              <AsyncContent loading={false}>
                <AIInsights page="dashboard" />
              </AsyncContent>
              
              <PremiumCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <PremiumButton
                    onClick={navigateToNewCampaign}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </PremiumButton>
                  
                  <PremiumButton
                    onClick={navigateToAnalytics}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </PremiumButton>
                </div>
              </PremiumCard>
            </div>
          </div>
        </main>
      </div>

      <AIControlChat defaultMinimized={true} />
    </div>
  );
}
