'use client';

import type { Campaign } from '@/types';
import { checkApiHealth } from '@/lib/api';
import { useEffect, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';

interface DashboardStatsProps {
  campaigns: Campaign[];
  loading?: boolean;
}

interface HealthStatus {
  health: string;
  version: string;
  database: string;
}

export default function DashboardStats({ campaigns, loading }: DashboardStatsProps) {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);

  useEffect(() => {
    checkApiHealth()
      .then(setHealthStatus)
      .catch(() => {
        // Ignore errors, healthStatus remains null
        setHealthStatus(null);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <GlassCard key={i} className="p-6 animate-pulse" intensity="light" animated={false}>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </GlassCard>
        ))}
      </div>
    );
  }

  const totalCampaigns = campaigns.length;
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const totalSpend = campaigns.reduce((sum, c) => sum + (c.spend || 0), 0);
  const avgSpendPercentage = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const platformCounts = campaigns.reduce((acc, campaign) => {
    acc[campaign.platform] = (acc[campaign.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activeCampaigns = campaigns.filter(c => (c.spend || 0) < (c.budget || Infinity)).length;

  return (
  <div className="space-y-8">
      {/* System Health Status */}
      {healthStatus && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-xl p-6 border border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-black dark:text-white">System Status</h3>
                <p className="text-sm text-black dark:text-gray-300">All systems operational</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-black dark:text-white">{healthStatus.health}</div>
                <div className="text-black dark:text-gray-400">Health</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-black dark:text-white">{healthStatus.version}</div>
                <div className="text-black dark:text-gray-400">Version</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-black dark:text-white">{healthStatus.database}</div>
                <div className="text-black dark:text-gray-400">Database</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="dashboard-stats">
  {/* Total Campaigns */}
  <GlassCard className="p-6 group" intensity="medium" hover={true} data-testid="metric-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-bold text-black dark:text-gray-300 uppercase tracking-wide">Total Campaigns</p>
              <p className="text-3xl font-bold text-black dark:text-white mt-2">{totalCampaigns}</p>
              <div className="flex items-center mt-3">
                <span className="text-sm text-green-700 dark:text-green-400 font-semibold bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">{activeCampaigns} active</span>
                <span className="text-gray-400 mx-2">•</span>
                <span className="text-sm text-black dark:text-gray-300 font-bold">{totalCampaigns - activeCampaigns} paused</span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 rounded-xl group-hover:scale-110 transition-transform duration-300 float">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </GlassCard>

        {/* Total Budget */}
  <GlassCard className="p-6 group" intensity="medium" hover={true} data-testid="metric-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-bold text-black dark:text-gray-300 uppercase tracking-wide">Total Budget</p>
              <p className="text-3xl font-bold text-black dark:text-white mt-2">${totalBudget.toLocaleString()}</p>
              <div className="flex items-center mt-3">
                <span className="text-sm text-blue-700 dark:text-blue-400 font-semibold bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">${totalSpend.toLocaleString()} spent</span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 rounded-xl group-hover:scale-110 transition-transform duration-300 float">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </GlassCard>

        {/* Total Spend */}
  <GlassCard className="p-6 group" intensity="medium" hover={true} data-testid="metric-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-bold text-black dark:text-gray-300 uppercase tracking-wide">Total Spend</p>
              <p className="text-3xl font-bold text-black dark:text-white mt-2">{formatCurrency(totalSpend)}</p>
              <div className="flex items-center mt-3">
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${avgSpendPercentage > 80 ? 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30' : avgSpendPercentage > 60 ? 'text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30' : 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30'}`}>
                  {avgSpendPercentage.toFixed(1)}% of budget
                </span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 rounded-xl group-hover:scale-110 transition-transform duration-300 float">
              <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </GlassCard>

        {/* Remaining Budget */}
  <GlassCard className="p-6 group" intensity="medium" hover={true} data-testid="metric-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-bold text-black dark:text-gray-300 uppercase tracking-wide">Remaining Budget</p>
              <p className="text-3xl font-bold text-black dark:text-white mt-2">{formatCurrency(totalBudget - totalSpend)}</p>
              <div className="flex items-center mt-3">
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                  {((totalBudget - totalSpend) / totalBudget * 100).toFixed(1)}% available
                </span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-xl group-hover:scale-110 transition-transform duration-300 float">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Platform Breakdown */}
      {Object.keys(platformCounts).length > 0 && (
        <GlassCard className="p-8" intensity="medium" hover={false}>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Platform Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(platformCounts).map(([platform, count]) => (
              <div key={platform} className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 capitalize mb-2">{platform.replace('_', ' ')}</div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(count / totalCampaigns) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}