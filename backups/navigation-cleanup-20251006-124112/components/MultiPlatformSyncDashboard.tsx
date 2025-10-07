'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Globe, 
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Plus,
  Eye,
  Settings,
  TrendingUp,
  Activity,
  Network
} from 'lucide-react';

// Platform icons (you could replace with actual platform logos)
const PlatformIcon = ({ platform }: { platform: string }) => {
  const icons = {
    google_ads: '🔍',
    meta: '📘',
    linkedin: '💼',
    tiktok: '🎵'
  };
  return <span className="text-lg">{icons[platform as keyof typeof icons] || '🌐'}</span>;
};

interface Campaign {
  id: string;
  name: string;
  status: string;
  platform: string;
  budget_amount: number;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  last_sync: string;
  sync_status: string;
}

interface SyncResult {
  platform: string;
  campaign_id: string;
  success: boolean;
  message: string;
  timestamp: string;
}

interface CrossPlatformPerformance {
  total_impressions: number;
  total_clicks: number;
  total_conversions: number;
  total_spend: number;
  total_revenue: number;
  platform_breakdown: Record<string, any>;
  performance_by_platform: Record<string, any>;
}

interface SyncStatus {
  platforms: Record<string, any>;
  total_campaigns: number;
  recent_sync_results: SyncResult[];
  last_full_sync: string;
}

const MultiPlatformSyncDashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [performance, setPerformance] = useState<CrossPlatformPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [autoSync, setAutoSync] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';

  useEffect(() => {
    loadDashboardData();
    
    // Auto-sync interval
    let interval: NodeJS.Timeout;
    if (autoSync) {
      interval = setInterval(loadDashboardData, 60000); // Sync every minute
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoSync]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load campaigns
      const campaignsResponse = await fetch(`${API_BASE}/api/v1/sync/campaigns`);
      const campaignsData = await campaignsResponse.json();
      setCampaigns(campaignsData);
      
      // Load sync status
      const statusResponse = await fetch(`${API_BASE}/api/v1/sync/status`);
      const statusData = await statusResponse.json();
      setSyncStatus(statusData);
      
      // Load performance data
      const performanceResponse = await fetch(`${API_BASE}/api/v1/sync/performance/cross-platform`);
      const performanceData = await performanceResponse.json();
      setPerformance(performanceData);
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncAllCampaigns = async () => {
    try {
      setSyncing(true);
      const response = await fetch(`${API_BASE}/api/v1/sync/sync-all`, {
        method: 'POST'
      });
      const results = await response.json();
      
      console.log('Sync results:', results);
      
      // Refresh data after sync
      await loadDashboardData();
      
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  const authenticatePlatforms = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/sync/authenticate`, {
        method: 'POST'
      });
      const results = await response.json();
      
      console.log('Authentication results:', results);
      await loadDashboardData();
      
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const testPlatformConnection = async (platform: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/sync/platforms/${platform}/test-connection`, {
        method: 'POST'
      });
      const result = await response.json();
      
      console.log(`${platform} connection test:`, result);
      return result;
      
    } catch (error) {
      console.error(`${platform} connection test failed:`, error);
      return { connected: false, message: 'Connection test failed' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'synced': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'conflict': return 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800';
      default: return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'synced': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      default: return <RefreshCw className="w-4 h-4" />;
    }
  };

  const filteredCampaigns = selectedPlatform === 'all' 
    ? campaigns 
    : campaigns.filter(c => c.platform === selectedPlatform);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Network className="w-8 h-8 text-purple-600" />
            Multi-Platform Campaign Sync
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Unified campaign management across Google Ads, Meta, and LinkedIn
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant={autoSync ? "default" : "outline"}
            onClick={() => setAutoSync(!autoSync)}
            className="flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            {autoSync ? 'Auto-Sync ON' : 'Auto-Sync OFF'}
          </Button>
          
          <Button
            onClick={authenticatePlatforms}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Authenticate
          </Button>
          
          <Button
            onClick={syncAllCampaigns}
            disabled={syncing}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync All'}
          </Button>
        </div>
      </div>

      {/* Sync Status Indicator */}
      <div className={`flex items-center gap-2 p-3 rounded-lg border ${
        autoSync 
          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
          : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
      }`}>
        <div className={`w-2 h-2 rounded-full ${autoSync ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}></div>
        <span className={`text-sm font-medium ${
          autoSync ? 'text-green-700 dark:text-green-300' : 'text-blue-700 dark:text-blue-300'
        }`}>
          {autoSync ? 'Auto-Sync Active - Real-time platform synchronization' : 'Manual Sync Mode - Click sync to update'}
        </span>
        {syncStatus && (
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-auto">
            Last sync: {new Date(syncStatus.last_full_sync).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Platform Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {syncStatus && Object.entries(syncStatus.platforms).map(([platform, status]: [string, any]) => (
          <Card key={platform} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <PlatformIcon platform={platform} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                      {platform.replace('_', ' ')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {status.connected ? 'Connected' : 'Disconnected'}
                    </p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${status.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Campaigns</span>
                  <span className="font-medium">{status.total_campaigns}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Synced</span>
                  <span className="font-medium">{status.synced_campaigns}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Sync Rate</span>
                  <span className="font-medium">{Math.round(status.sync_rate * 100)}%</span>
                </div>
                
                <div className="mt-3">
                  <Progress value={status.sync_rate * 100} className="h-2" />
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => testPlatformConnection(platform)}
                  className="w-full mt-3"
                >
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Overview */}
      {performance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Cross-Platform Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {performance.total_impressions.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Impressions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {performance.total_clicks.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {performance.total_conversions.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Conversions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${performance.total_spend.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Spend</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${performance.total_revenue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Platform Breakdown</h4>
              {Object.entries(performance.platform_breakdown).map(([platform, data]: [string, any]) => (
                <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <PlatformIcon platform={platform} />
                    <span className="font-medium capitalize">{platform.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span>{data.campaigns} campaigns</span>
                    <span>${data.spend.toLocaleString()} spent</span>
                    <span className="text-green-600">${data.revenue.toLocaleString()} revenue</span>
                    <span className="font-medium">
                      {data.spend > 0 ? `${(data.revenue / data.spend).toFixed(1)}x ROAS` : 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Synchronized Campaigns
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              >
                <option value="all">All Platforms</option>
                <option value="google_ads">Google Ads</option>
                <option value="meta">Meta</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="p-4 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <PlatformIcon platform={campaign.platform} />
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {campaign.name}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {campaign.platform.replace('_', ' ')}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(campaign.sync_status)}`}>
                        {getStatusIcon(campaign.sync_status)}
                        <span className="ml-1">{campaign.sync_status}</span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                        <p className="font-medium">${campaign.budget_amount}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Impressions:</span>
                        <p className="font-medium">{campaign.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Clicks:</span>
                        <p className="font-medium">{campaign.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Conversions:</span>
                        <p className="font-medium">{campaign.conversions}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Spend:</span>
                        <p className="font-medium">${campaign.spend.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
                        <p className="font-medium text-green-600">${campaign.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {campaign.last_sync && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Last synced: {new Date(campaign.last_sync).toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Sync
                    </Button>
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Network className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No campaigns found</p>
                <p className="text-sm">Sync with platforms to see campaigns here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiPlatformSyncDashboard;