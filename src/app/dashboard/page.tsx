'use client';

import React from 'react';
import { Target, BarChart3, Users, DollarSign, TrendingUp, Activity, RefreshCw, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for the AI Control system to avoid SSR issues
const AutonomousAIControl = dynamic(() => import('@/components/AutonomousAIControl'), {
  ssr: false,
  loading: () => null
});

export default function DashboardPage() {
  const stats = [
    { title: 'Active Campaigns', value: '12', change: '+8.2%', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Total Revenue', value: '$24,680', change: '+12.5%', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
    { title: 'Conversion Rate', value: '3.24%', change: '+2.1%', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
    { title: 'Active Users', value: '1,429', change: '+5.7%', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' }
  ];

  const platforms = [
    { name: 'Social Media', description: 'Multi-platform management', status: 'Active', color: 'bg-pink-500' },
    { name: 'Email Marketing', description: 'Campaign automation', status: 'Active', color: 'bg-blue-500' },
    { name: 'Project Management', description: 'Team collaboration', status: 'Active', color: 'bg-green-500' },
    { name: 'Analytics', description: 'Performance insights', status: 'Active', color: 'bg-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Master Terminal
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Unified command center for all platform operations
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors">
              <Target className="w-4 h-4 mr-2" />
              Master Control
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={stat.title} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  {index === 0 && <BarChart3 className={`w-6 h-6 ${stat.color}`} />}
                  {index === 1 && <DollarSign className={`w-6 h-6 ${stat.color}`} />}
                  {index === 2 && <TrendingUp className={`w-6 h-6 ${stat.color}`} />}
                  {index === 3 && <Users className={`w-6 h-6 ${stat.color}`} />}
                </div>
              </div>
              <div className="flex items-center text-sm">
                <TrendingUp className={`w-4 h-4 mr-1 ${stat.color}`} />
                <span className={`font-medium ${stat.color}`}>
                  {stat.change}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">
                  vs last month
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Platform Overview
            </h2>
            <div className="space-y-4">
              {platforms.map((platform) => (
                <div key={platform.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{platform.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{platform.description}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 rounded-full">
                    {platform.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 text-left bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30 rounded-lg transition-colors">
                <Target className="w-5 h-5 text-teal-600 dark:text-teal-400 mr-3" />
                <span className="font-medium text-teal-700 dark:text-teal-300">Platform Control</span>
              </button>
              <button className="w-full flex items-center p-3 text-left bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                <span className="font-medium text-blue-700 dark:text-blue-300">View Analytics</span>
              </button>
              <button className="w-full flex items-center p-3 text-left bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors">
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" />
                <span className="font-medium text-purple-700 dark:text-purple-300">AI Center</span>
              </button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gradient-to-r from-teal-50 via-blue-50 to-purple-50 dark:from-teal-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-teal-200 dark:border-teal-800">
          <div className="flex items-center mb-4">
            <Activity className="w-6 h-6 text-teal-600 dark:text-teal-400 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                System Status
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                All systems operational • Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">99.9%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">245ms</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Response</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">105</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Routes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">Active</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* Unified AI Control Assistant */}
      <AutonomousAIControl 
        position="bottom-right"
        defaultMinimized={true}
      />
    </div>
  );
}
