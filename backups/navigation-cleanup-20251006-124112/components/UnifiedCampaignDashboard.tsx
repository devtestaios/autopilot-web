'use client';

import React, { useState, useEffect } from 'react';
import { multiPlatformManager, UnifiedCampaignWithPlatform, CrossPlatformMetrics } from '@/lib/platforms/manager';

interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSpend: number;
  totalConversions: number;
  connectedPlatforms: number;
}

export function UnifiedCampaignDashboard() {
  const [campaigns, setCampaigns] = useState<UnifiedCampaignWithPlatform[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalSpend: 0,
    totalConversions: 0,
    connectedPlatforms: 0
  });
  const [crossPlatformMetrics, setCrossPlatformMetrics] = useState<CrossPlatformMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load campaigns from all platforms
      const allCampaigns = await multiPlatformManager.getAllCampaigns();
      setCampaigns(allCampaigns);

      // Calculate basic stats
      const activeCampaigns = allCampaigns.filter(c => c.status === 'active').length;
      const connectedPlatforms = multiPlatformManager.getActivePlatforms().length;

      setStats({
        totalCampaigns: allCampaigns.length,
        activeCampaigns,
        totalSpend: 0, // Would need to fetch metrics for accurate spend
        totalConversions: 0,
        connectedPlatforms
      });

      // Load cross-platform metrics for last 30 days
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      try {
        const metrics = await multiPlatformManager.getCrossPlatformMetrics(startDate, endDate);
        setCrossPlatformMetrics(metrics);
        
        setStats(prev => ({
          ...prev,
          totalSpend: metrics.totalSpend,
          totalConversions: metrics.totalConversions
        }));
      } catch (metricsError) {
        console.warn('Could not load cross-platform metrics:', metricsError);
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard data. Please check your platform connections.');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCampaigns = () => {
    if (selectedPlatform === 'all') {
      return campaigns;
    }
    return campaigns.filter(campaign => campaign.platformId === selectedPlatform);
  };

  const getAvailablePlatforms = () => {
    const platforms = Array.from(new Set(campaigns.map(c => c.platformId)));
    return platforms.map(platformId => {
      const campaign = campaigns.find(c => c.platformId === platformId);
      return {
        id: platformId,
        name: campaign?.platformDisplayName || platformId
      };
    });
  };

  const handleCampaignAction = async (campaignId: string, action: 'pause' | 'resume') => {
    try {
      if (action === 'pause') {
        await multiPlatformManager.bulkPauseCampaigns([campaignId]);
      } else {
        await multiPlatformManager.bulkResumeCampaigns([campaignId]);
      }
      
      // Refresh campaigns
      await loadDashboardData();
    } catch (error) {
      console.error(`Failed to ${action} campaign:`, error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading campaign data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-2">
          <span className="text-red-600">⚠️</span>
          <h3 className="text-red-800 font-medium">Error Loading Dashboard</h3>
        </div>
        <p className="text-red-700 mt-2">{error}</p>
        <button
          onClick={loadDashboardData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Unified Campaign Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Manage campaigns across all connected advertising platforms
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCampaigns}</p>
            </div>
            <div className="text-2xl">📊</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeCampaigns}</p>
            </div>
            <div className="text-2xl">▶️</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spend (30d)</p>
              <p className="text-2xl font-bold text-blue-600">
                ${stats.totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="text-2xl">💰</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connected Platforms</p>
              <p className="text-2xl font-bold text-purple-600">{stats.connectedPlatforms}</p>
            </div>
            <div className="text-2xl">🔗</div>
          </div>
        </div>
      </div>

      {/* Cross-Platform Metrics */}
      {crossPlatformMetrics && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Cross-Platform Performance (Last 30 Days)</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Impressions</p>
              <p className="text-xl font-bold">{crossPlatformMetrics.totalImpressions.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Clicks</p>
              <p className="text-xl font-bold">{crossPlatformMetrics.totalClicks.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">CTR</p>
              <p className="text-xl font-bold">{(crossPlatformMetrics.averageCtr * 100).toFixed(2)}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">CPC</p>
              <p className="text-xl font-bold">${crossPlatformMetrics.averageCpc.toFixed(2)}</p>
            </div>
          </div>

          {/* Platform Breakdown */}
          <div className="mt-6">
            <h4 className="font-medium mb-3">Platform Breakdown</h4>
            <div className="space-y-2">
              {Object.entries(crossPlatformMetrics.platformBreakdown).map(([platformId, breakdown]) => (
                <div key={platformId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">{platformId.replace('_', ' ').toUpperCase()}</span>
                  <div className="flex gap-4 text-sm">
                    <span>Spend: ${breakdown.spend.toFixed(0)}</span>
                    <span>Share: {breakdown.share.toFixed(1)}%</span>
                    <span>Conversions: {breakdown.conversions}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Platform Filter */}
      <div className="flex items-center gap-4">
        <label htmlFor="platform-filter" className="text-sm font-medium text-gray-700">
          Filter by Platform:
        </label>
        <select
          id="platform-filter"
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Platforms</option>
          {getAvailablePlatforms().map(platform => (
            <option key={platform.id} value={platform.id}>
              {platform.name}
            </option>
          ))}
        </select>
      </div>

      {/* Campaigns List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">
            Campaigns ({getFilteredCampaigns().length})
          </h3>
        </div>

        {getFilteredCampaigns().length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Campaigns Found</h3>
            <p className="text-gray-600 mb-4">
              {stats.connectedPlatforms === 0 
                ? 'Connect your advertising platforms to get started.'
                : 'Create campaigns in your connected platforms to see them here.'
              }
            </p>
            <a
              href="/platforms"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {stats.connectedPlatforms === 0 ? 'Connect Platforms' : 'Manage Platforms'}
            </a>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {getFilteredCampaigns().map((campaign) => (
              <div key={campaign.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{campaign.name}</h4>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {campaign.platformDisplayName}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        campaign.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {campaign.status.toUpperCase()}
                      </span>
                      {campaign.isMultiPlatform && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                          Multi-Platform
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span>
                        Objective: {campaign.objective.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span>
                        Budget: ${campaign.budget.amount} ({campaign.budget.type})
                      </span>
                      <span>
                        Created: {new Date(campaign.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {campaign.status === 'active' ? (
                      <button
                        onClick={() => handleCampaignAction(campaign.id, 'pause')}
                        className="px-3 py-1 text-sm border border-orange-300 text-orange-600 rounded hover:bg-orange-50"
                      >
                        ⏸️ Pause
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCampaignAction(campaign.id, 'resume')}
                        className="px-3 py-1 text-sm border border-green-300 text-green-600 rounded hover:bg-green-50"
                      >
                        ▶️ Resume
                      </button>
                    )}
                    <button className="px-3 py-1 text-sm border border-gray-300 text-gray-600 rounded hover:bg-gray-50">
                      📊 Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {campaigns.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              📊 Performance Report
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              ⏸️ Bulk Pause
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              🎯 Optimize Budget
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              📈 Create Campaign
            </button>
          </div>
        </div>
      )}
    </div>
  );
}