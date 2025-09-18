'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bot, Zap, Brain, TrendingUp, Settings, ArrowRight, AlertTriangle, Bell, CheckCircle } from 'lucide-react';
import type { Campaign } from '@/types';
import { fetchCampaigns, deleteCampaign } from '@/lib/api';
import DashboardStats from '@/components/DashboardStats';
import CampaignCard from '@/components/CampaignCard';
import GoogleAdsIntegration from '@/components/GoogleAdsIntegration';
import GoogleAdsPerformanceDashboard from '@/components/GoogleAdsPerformanceDashboard';
import CampaignOptimizationEngine from '@/components/CampaignOptimizationEngine';
import PerformanceChart from '@/components/PerformanceChart';
import { smartAlertEngine, Alert } from '@/lib/smartAlertEngine';

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);

  async function loadCampaigns() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCampaigns();
      setCampaigns(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load campaigns';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function loadAlerts() {
    try {
      setAlertsLoading(true);
      await smartAlertEngine.analyzeAllCampaigns();
      const currentAlerts = smartAlertEngine.getAlerts({ dismissed: false });
      setAlerts(currentAlerts.slice(0, 3)); // Show top 3 alerts
    } catch (err) {
      console.error('Failed to load alerts:', err);
    } finally {
      setAlertsLoading(false);
    }
  }

  useEffect(() => {
    loadCampaigns();
    loadAlerts();
  }, []);

  async function handleDeleteCampaign(id: string) {
    try {
      await deleteCampaign(id);
      await loadCampaigns(); // Reload the list
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete campaign';
      setError(errorMessage);
    }
  }

  async function dismissAlert(alertId: string) {
    smartAlertEngine.dismissAlert(alertId);
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and optimize your campaigns across all platforms</p>
        </div>
        <div className="flex gap-3">
          <Link href="/campaigns/new">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              New Campaign
            </button>
          </Link>
          <button 
            onClick={loadCampaigns}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Smart Alerts */}
      {alerts.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-orange-800">Smart Alerts</h2>
            {alertsLoading && <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>}
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start justify-between bg-white rounded-lg p-4 border border-orange-200">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {alert.severity === 'critical' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    {alert.severity === 'high' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                    {alert.severity === 'medium' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    {alert.severity === 'low' && <CheckCircle className="h-4 w-4 text-blue-500" />}
                    <span className="font-medium text-gray-900">{alert.title}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{alert.message}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Campaign: {alert.campaignName}</span>
                    <span>•</span>
                    <span>{new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-gray-400 hover:text-gray-600 ml-4"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Stats */}
      <DashboardStats campaigns={campaigns} />

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/autopilot" className="group">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 group-hover:scale-105">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-blue-900">Autopilot Mode</h3>
            </div>
            <p className="text-blue-700 text-sm mb-3">AI-powered autonomous campaign management</p>
            <div className="flex items-center text-blue-600 text-sm font-medium">
              View Dashboard <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <Link href="/ai" className="group">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 group-hover:scale-105">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-purple-900">AI Optimization</h3>
            </div>
            <p className="text-purple-700 text-sm mb-3">Advanced ML models and optimization engines</p>
            <div className="flex items-center text-purple-600 text-sm font-medium">
              View Dashboard <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <Link href="/analytics" className="group">
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 group-hover:scale-105">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-green-900">Analytics</h3>
            </div>
            <p className="text-green-700 text-sm mb-3">Advanced analytics and performance insights</p>
            <div className="flex items-center text-green-600 text-sm font-medium">
              View Dashboard <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <Link href="/unified" className="group">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 group-hover:scale-105">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-600 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-orange-900">Unified Platform</h3>
            </div>
            <p className="text-orange-700 text-sm mb-3">Manage all platforms from one interface</p>
            <div className="flex items-center text-orange-600 text-sm font-medium">
              View Dashboard <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      {/* Performance Chart */}
      <PerformanceChart 
        data={[
          { date: '2024-03-20', spend: 1200, clicks: 450, impressions: 15600, conversions: 24 },
          { date: '2024-03-21', spend: 1350, clicks: 523, impressions: 17200, conversions: 31 },
          { date: '2024-03-22', spend: 1150, clicks: 412, impressions: 14800, conversions: 19 },
          { date: '2024-03-23', spend: 1420, clicks: 567, impressions: 18900, conversions: 38 },
          { date: '2024-03-24', spend: 1300, clicks: 489, impressions: 16300, conversions: 29 },
          { date: '2024-03-25', spend: 1500, clicks: 634, impressions: 20100, conversions: 42 },
          { date: '2024-03-26', spend: 1250, clicks: 478, impressions: 15900, conversions: 26 }
        ]}
        metric="spend" 
        title="Campaign Performance Overview"
      />

      {/* Google Ads Integration */}
      <GoogleAdsIntegration />

      {/* Google Ads Performance */}
      <GoogleAdsPerformanceDashboard />

      {/* Campaign Optimization Engine */}
      <CampaignOptimizationEngine campaigns={campaigns} />

      {/* Campaign Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Active Campaigns</h2>
          <Link href="/campaigns">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64"></div>
              </div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Settings className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first campaign</p>
            <Link href="/campaigns/new">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Create Campaign
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.slice(0, 6).map((campaign) => (
              <CampaignCard 
                key={campaign.id} 
                campaign={campaign} 
                onDelete={handleDeleteCampaign}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}