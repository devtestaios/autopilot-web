'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  Users, 
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
  Zap
} from 'lucide-react';

interface DashboardStats {
  totalCampaigns: number;
  totalSpend: number;
  totalRevenue: number;
  activeLeads: number;
  conversionRate: number;
  averageRoi: number;
}

interface RecentActivity {
  id: string;
  type: 'campaign_created' | 'campaign_optimized' | 'lead_generated' | 'alert_triggered';
  title: string;
  subtitle: string;
  timestamp: string;
  value?: string;
}

const mockStats: DashboardStats = {
  totalCampaigns: 12,
  totalSpend: 15420.50,
  totalRevenue: 52680.75,
  activeLeads: 47,
  conversionRate: 8.4,
  averageRoi: 240
};

const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'campaign_optimized',
    title: 'Holiday Sale Campaign',
    subtitle: 'Budget automatically optimized',
    timestamp: '2 minutes ago',
    value: '+12% ROI'
  },
  {
    id: '2',
    type: 'lead_generated',
    title: 'New qualified lead',
    subtitle: 'From Google Ads campaign',
    timestamp: '15 minutes ago'
  },
  {
    id: '3',
    type: 'campaign_created',
    title: 'Black Friday Promo',
    subtitle: 'Campaign launched successfully',
    timestamp: '1 hour ago'
  },
  {
    id: '4',
    type: 'alert_triggered',
    title: 'Budget threshold reached',
    subtitle: 'Summer Collection campaign',
    timestamp: '3 hours ago'
  }
];

export default function SimplifiedDashboard() {
  const { theme } = useTheme();
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>(mockRecentActivity);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg mt-6"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-start">
        <div>
          <h1 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Dashboard
          </h1>
          <p className={`text-lg mt-1 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Welcome back! Here's your marketing overview.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/campaigns/new"
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <Zap size={16} />
            New Campaign
          </Link>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={itemVariants}>
        <h2 className={`text-xl font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Key Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <motion.div
            variants={itemVariants}
            className={`p-6 rounded-lg border backdrop-blur-sm ${
              theme === 'dark'
                ? 'bg-gray-800/50 border-gray-700'
                : 'bg-white/50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-green-600/20' : 'bg-green-100'
              }`}>
                <DollarSign size={20} className="text-green-600" />
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight size={16} />
                +23%
              </div>
            </div>
            <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Total Revenue
            </div>
          </motion.div>

          {/* Active Campaigns */}
          <motion.div
            variants={itemVariants}
            className={`p-6 rounded-lg border backdrop-blur-sm ${
              theme === 'dark'
                ? 'bg-gray-800/50 border-gray-700'
                : 'bg-white/50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-100'
              }`}>
                <Target size={20} className="text-blue-600" />
              </div>
              <div className="flex items-center text-blue-600 text-sm font-medium">
                <ArrowUpRight size={16} />
                +2
              </div>
            </div>
            <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {stats.totalCampaigns}
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Active Campaigns
            </div>
          </motion.div>

          {/* Conversion Rate */}
          <motion.div
            variants={itemVariants}
            className={`p-6 rounded-lg border backdrop-blur-sm ${
              theme === 'dark'
                ? 'bg-gray-800/50 border-gray-700'
                : 'bg-white/50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-purple-600/20' : 'bg-purple-100'
              }`}>
                <TrendingUp size={20} className="text-purple-600" />
              </div>
              <div className="flex items-center text-purple-600 text-sm font-medium">
                <ArrowUpRight size={16} />
                +1.2%
              </div>
            </div>
            <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {stats.conversionRate}%
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Conversion Rate
            </div>
          </motion.div>

          {/* Active Leads */}
          <motion.div
            variants={itemVariants}
            className={`p-6 rounded-lg border backdrop-blur-sm ${
              theme === 'dark'
                ? 'bg-gray-800/50 border-gray-700'
                : 'bg-white/50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-orange-600/20' : 'bg-orange-100'
              }`}>
                <Users size={20} className="text-orange-600" />
              </div>
              <div className="flex items-center text-orange-600 text-sm font-medium">
                <ArrowUpRight size={16} />
                +7
              </div>
            </div>
            <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {stats.activeLeads}
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Active Leads
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <h2 className={`text-xl font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              href="/campaigns"
              className={`block p-4 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                  : 'bg-white/50 border-gray-200 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 size={20} className="text-blue-600" />
                <div>
                  <div className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    View Campaigns
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Manage active campaigns
                  </div>
                </div>
              </div>
            </Link>
            
            <Link
              href="/analytics"
              className={`block p-4 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                  : 'bg-white/50 border-gray-200 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Activity size={20} className="text-green-600" />
                <div>
                  <div className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Analytics
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    View performance data
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/leads"
              className={`block p-4 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                  : 'bg-white/50 border-gray-200 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users size={20} className="text-purple-600" />
                <div>
                  <div className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Leads
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Manage your leads
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <h2 className={`text-xl font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Recent Activity
          </h2>
          <div className={`p-6 rounded-lg border backdrop-blur-sm ${
            theme === 'dark'
              ? 'bg-gray-800/50 border-gray-700'
              : 'bg-white/50 border-gray-200'
          }`}>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'campaign_optimized' ? 'bg-green-500' :
                    activity.type === 'lead_generated' ? 'bg-blue-500' :
                    activity.type === 'campaign_created' ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {activity.title}
                      </div>
                      {activity.value && (
                        <span className="text-green-600 text-sm font-medium">
                          {activity.value}
                        </span>
                      )}
                    </div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {activity.subtitle}
                    </div>
                    <div className={`text-xs mt-1 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {activity.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/activity"
                className={`text-sm font-medium transition-colors ${
                  theme === 'dark'
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                View all activity →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}