'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Settings,
  Bell,
  LogOut,
  Bot,
  Home,
  Target,
  Zap,
  Clock,
  ChevronDown,
  Search,
  Filter,
  Plus,
  Eye,
  Edit3,
  MoreHorizontal
} from 'lucide-react';

// Mock data for demonstration
const mockCampaigns = [
  {
    id: '1',
    name: 'Summer Sale Campaign',
    platform: 'Google Ads',
    status: 'active',
    budget: 5000,
    spend: 3240,
    impressions: 125000,
    clicks: 3250,
    conversions: 142,
    ctr: 2.6,
    cpc: 0.97,
    roas: 4.2
  },
  {
    id: '2',
    name: 'Brand Awareness Q3',
    platform: 'Meta',
    status: 'active',
    budget: 3000,
    spend: 2100,
    impressions: 89000,
    clicks: 1890,
    conversions: 67,
    ctr: 2.1,
    cpc: 1.11,
    roas: 3.8
  },
  {
    id: '3',
    name: 'Holiday Prep Campaign',
    platform: 'LinkedIn',
    status: 'paused',
    budget: 2500,
    spend: 850,
    impressions: 34000,
    clicks: 720,
    conversions: 28,
    ctr: 2.1,
    cpc: 1.18,
    roas: 3.2
  }
];

const mockNotifications = [
  {
    id: '1',
    type: 'performance',
    title: 'Campaign performing above target',
    message: 'Summer Sale Campaign has exceeded ROAS target by 15%',
    time: '2 hours ago',
    read: false
  },
  {
    id: '2',
    type: 'budget',
    title: 'Budget threshold reached',
    message: 'Brand Awareness Q3 has used 70% of allocated budget',
    time: '4 hours ago',
    read: false
  },
  {
    id: '3',
    type: 'optimization',
    title: 'Optimization suggestion available',
    message: 'Consider increasing bid for top-performing keywords',
    time: '1 day ago',
    read: true
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const { theme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
          <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalSpend = mockCampaigns.reduce((sum, campaign) => sum + campaign.spend, 0);
  const totalImpressions = mockCampaigns.reduce((sum, campaign) => sum + campaign.impressions, 0);
  const totalClicks = mockCampaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
  const totalConversions = mockCampaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
  const avgRoas = mockCampaigns.reduce((sum, campaign) => sum + campaign.roas, 0) / mockCampaigns.length;

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className={`border-b backdrop-blur-sm ${
        theme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white/50 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and title */}
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-100'
              }`}>
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <h1 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Autopilot Dashboard
                </h1>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Welcome back, {user.name}
                </p>
              </div>
            </div>

            {/* Navigation and user menu */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <Bell size={20} />
                  {mockNotifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {/* Notifications dropdown */}
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg border z-50 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {mockNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 dark:border-gray-700 ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                        >
                          <h4 className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h4>
                          <p className={`text-xs mt-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {notification.message}
                          </p>
                          <p className={`text-xs mt-1 ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            {notification.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Settings */}
              <button
                onClick={() => router.push('/settings')}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Settings size={20} />
              </button>

              {/* Home button */}
              <button
                onClick={() => router.push('/')}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Home size={20} />
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className={`text-2xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user.name}!
          </h2>
          <p className={`${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Here's what's happening with your campaigns today.
          </p>
        </motion.div>

        {/* Key metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className={`p-6 rounded-xl border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total Spend
                </p>
                <p className={`text-2xl font-bold mt-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  ${totalSpend.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-600/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+12%</span>
              <span className={`ml-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                vs last month
              </span>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Impressions
                </p>
                <p className={`text-2xl font-bold mt-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {(totalImpressions / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-600/20 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+8%</span>
              <span className={`ml-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                vs last month
              </span>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Conversions
                </p>
                <p className={`text-2xl font-bold mt-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {totalConversions}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-600/20 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+15%</span>
              <span className={`ml-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                vs last month
              </span>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Avg ROAS
                </p>
                <p className={`text-2xl font-bold mt-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {avgRoas.toFixed(1)}x
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-600/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+5%</span>
              <span className={`ml-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                vs last month
              </span>
            </div>
          </div>
        </motion.div>

        {/* Campaign management section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-xl border p-6 ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Active Campaigns
            </h3>
            <div className="flex items-center space-x-3">
              <button className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}>
                <Filter size={16} className="mr-2 inline" />
                Filter
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                <Plus size={16} className="mr-2 inline" />
                New Campaign
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {mockCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className={`p-4 border rounded-lg transition-colors hover:shadow-md ${
                  theme === 'dark'
                    ? 'border-gray-700 hover:bg-gray-700/50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className={`font-medium mr-3 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {campaign.name}
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        campaign.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400'
                      }`}>
                        {campaign.status}
                      </span>
                      <span className={`ml-2 text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {campaign.platform}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                      <div>
                        <p className={`${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Spend / Budget
                        </p>
                        <p className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          ${campaign.spend.toLocaleString()} / ${campaign.budget.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className={`${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          CTR
                        </p>
                        <p className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {campaign.ctr}%
                        </p>
                      </div>
                      <div>
                        <p className={`${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          CPC
                        </p>
                        <p className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          ${campaign.cpc}
                        </p>
                      </div>
                      <div>
                        <p className={`${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Conversions
                        </p>
                        <p className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {campaign.conversions}
                        </p>
                      </div>
                      <div>
                        <p className={`${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          ROAS
                        </p>
                        <p className={`font-medium ${
                          campaign.roas >= 4 ? 'text-green-600' : 
                          campaign.roas >= 3 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {campaign.roas}x
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <button className={`p-2 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'hover:bg-gray-600 text-gray-400'
                            : 'hover:bg-gray-100 text-gray-500'
                        }`}>
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        >
          <div className={`p-6 rounded-xl border text-center ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="p-3 bg-blue-100 dark:bg-blue-600/20 rounded-lg w-fit mx-auto mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className={`font-medium mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              AI Optimization
            </h4>
            <p className={`text-sm mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Let AI optimize your campaigns automatically
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Enable Autopilot
            </button>
          </div>

          <div className={`p-6 rounded-xl border text-center ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="p-3 bg-green-100 dark:bg-green-600/20 rounded-lg w-fit mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h4 className={`font-medium mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Performance Report
            </h4>
            <p className={`text-sm mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Generate detailed performance insights
            </p>
            <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Generate Report
            </button>
          </div>

          <div className={`p-6 rounded-xl border text-center ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="p-3 bg-purple-100 dark:bg-purple-600/20 rounded-lg w-fit mx-auto mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className={`font-medium mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Audience Insights
            </h4>
            <p className={`text-sm mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Discover new audience opportunities
            </p>
            <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              View Insights
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}