'use client';

import { useState, useEffect, useCallback } from 'react';
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
  MoreHorizontal,
  Sparkles,
  ArrowUpRight,
  Activity,
  Globe,
  Shield,
  Rocket
  }
];

const aiInsights = [
  {
                    <DashboardWidgetSkeleton />
                    <DashboardWidgetSkeleton />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartSkeleton />
                    <ChartSkeleton />
                  </div>
                </PageSkeleton>
              }
            >
              <Breadcrumb />
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-pulse-cyan to-pulse-purple bg-clip-text text-transparent mb-2">
                      Welcome back, {user?.name || 'User'}
                    </h1>
                    <p className="text-gray-800 dark:text-gray-400 text-lg">
                      Your campaigns are performing exceptionally well today
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-6 lg:mt-0">
                    <ActionDropdown
                      onNewCampaign={navigateToNewCampaign}
                      onAnalytics={navigateToAnalytics}
                      onOptimization={navigateToOptimization}
                    />
                  </div>
                </div>
              </motion.div>
              <PremiumCard className="mb-8">
                // ...existing code...
                  <p className="text-gray-800 dark:text-gray-400 mb-6">
                    Let our AI optimization engine take your campaigns to the next level with automated bidding and budget management.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <PremiumButton 
                      variant="primary" 
                      size="lg" 
                      glow
                      onClick={navigateToOptimization}
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Enable AI Autopilot
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
            </AsyncContent>
          </main>
          <AIControlChat defaultMinimized={true} />
        </div>
      </div>
    );
}
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
              
              <PremiumButton
                variant="ghost"
                size="sm"
                icon={<Activity className="w-4 h-4" />}
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </PremiumButton>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
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
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-400 mb-1">
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

        {/* AI Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <AIInsights 
            page="dashboard" 
            data={{ campaigns: enhancedCampaigns, stats: quickStats }}
          />
        </motion.div>

        {/* Enhanced Campaigns Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Active Campaigns
            </h2>
            <div className="flex items-center gap-3">
              <PremiumButton 
                variant="ghost" 
                size="sm" 
                icon={<Filter className="w-4 h-4" />}
                onClick={navigateToCampaigns}
              >
                Filter
              </PremiumButton>
              <PremiumButton 
                variant="ghost" 
                size="sm" 
                icon={<MoreHorizontal className="w-4 h-4" />}
                onClick={navigateToCampaigns}
              >
                View All
              </PremiumButton>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {(campaigns.length > 0 ? campaigns.slice(0, 6) : [
              {
                id: 1,
                name: 'Google Ads - Search Campaign',
                platform: 'Google',
                status: 'active',
                budget: 5000,
                spend: 3200,
                impressions: 125000,
                clicks: 2100,
                conversions: 156,
                ctr: 1.68,
                cpc: 1.52,
                roas: 4.2
              },
              {
                id: 2,
                name: 'Meta Display Campaign',
                platform: 'Meta',
                status: 'active',
                budget: 8000,
                spend: 4800,
                impressions: 287000,
                clicks: 3200,
                conversions: 187,
                ctr: 1.12,
                cpc: 1.50,
                roas: 3.8
              }
            ]).map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
                onClick={() => viewCampaign(campaign.id)}
              >
                <PremiumCard variant="elevated" hover className="p-6 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {campaign.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-800 dark:text-gray-400">
                          {campaign.platform}
                        </span>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          campaign.status === 'active' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : campaign.status === 'optimizing'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {campaign.status}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">
                        {campaign.growth}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-800 dark:text-gray-400">Budget Used</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${campaign.spend.toLocaleString()} / ${campaign.budget.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-pulse-cyan to-pulse-purple h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(campaign.spend / campaign.budget) * 100}%` }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {campaign.roas}x
                        </div>
                        <div className="text-xs text-gray-800 dark:text-gray-400">ROAS</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {campaign.ctr}%
                        </div>
                        <div className="text-xs text-gray-800 dark:text-gray-400">CTR</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {campaign.conversions}
                        </div>
                        <div className="text-xs text-gray-800 dark:text-gray-400">Conv.</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <PremiumButton 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewCampaign(campaign.id);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </PremiumButton>
                    <PremiumButton 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        editCampaign(campaign.id);
                      }}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </PremiumButton>
                  </div>
                </PremiumCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <PremiumCard variant="glassmorphism" className="p-8">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Ready to Scale Further?
              </h3>
              <p className="text-gray-800 dark:text-gray-400 mb-6">
                Let our AI optimization engine take your campaigns to the next level with automated bidding and budget management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <PremiumButton 
                  variant="primary" 
                  size="lg" 
                  glow
                  onClick={navigateToOptimization}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Enable AI Autopilot
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
        </AsyncContent>
      </main>

      {/* AI Control Chat Assistant */}
      <AIControlChat defaultMinimized={true} />
      </div>
    </div>
  );
}