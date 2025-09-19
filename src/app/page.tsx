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

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    
    try {
      await deleteCampaign(campaignId);
      await loadCampaigns();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete campaign';
      alert(`Failed to delete campaign: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-teal-500 text-white dark:from-blue-800 dark:via-purple-800 dark:to-teal-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black bg-opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                <Bot className="h-16 w-16 text-white drop-shadow-lg" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              AI-Powered Marketing Autopilot
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              The world's most advanced autonomous campaign optimization platform that surpasses Google & Adobe
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/autopilot"
                className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <Zap className="h-6 w-6 group-hover:text-yellow-500 transition-colors" />
                <span>Launch AI Autopilot</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/ai"
                className="group bg-blue-500 bg-opacity-20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center space-x-3 border border-white border-opacity-20 hover:border-opacity-40"
              >
                <Brain className="h-6 w-6 group-hover:text-purple-300 transition-colors" />
                <span>AI Insights</span>
              </Link>
            </div>
          </div>

          {/* Enhanced Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">47%</div>
              <div className="text-blue-100">Avg ROI Improvement</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <Bot className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-blue-100">Autonomous Optimization</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <Brain className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">95%</div>
              <div className="text-blue-100">AI Prediction Accuracy</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <Zap className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">&lt;60s</div>
              <div className="text-blue-100">Real-time Response</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <Link 
              href="/"
              className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600 dark:text-blue-400"
            >
              Single Platform Dashboard
            </Link>
            <Link 
              href="/unified"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            >
              🌐 Unified Platform Command Center
            </Link>
            <Link 
              href="/platforms"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            >
              ⚙️ Platform Setup
            </Link>
            <Link 
              href="/campaigns"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            >
              📊 Campaign Management
            </Link>
            <Link 
              href="/leads"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              🎯 Lead Management
            </Link>
            <Link 
              href="/analytics"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              📊 Advanced Analytics
            </Link>
            <Link 
              href="/alerts"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              🚨 Smart Alerts
            </Link>
            <Link 
              href="/status"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              📈 System Status
            </Link>
          </nav>
        </div>
      </div>

      <div className="p-4 md:p-8">
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-blue-600 text-xl">🚀</span>
            <div>
              <h3 className="text-blue-800 font-medium">Multi-Platform Integration Available!</h3>
              <p className="text-blue-700 text-sm mt-1">
                Connect Google Ads, Meta Ads, and LinkedIn Ads for unified campaign management. 
                <Link href="/unified-dashboard" className="font-medium underline ml-1">
                  Try the Unified Dashboard
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Autopilot Dashboard</h1>
              <p className="text-gray-600 mt-1">AI-powered marketing campaign management</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/campaigns"
                className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                View All Campaigns
              </Link>
              <Link
                href="/sync"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Sync Management
              </Link>
              <Link
                href="/campaigns/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Campaign
              </Link>
            </div>
          </div>

          <DashboardStats campaigns={campaigns} loading={loading} />

          {/* Smart Alerts Preview */}
          <div className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Bell className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Smart Alert System</h3>
                  <p className="text-sm text-gray-600">Proactive monitoring and intelligent notifications</p>
                </div>
              </div>
              <Link
                href="/alerts"
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                View All Alerts
              </Link>
            </div>

            {alertsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              </div>
            ) : alerts.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">All Systems Normal</h4>
                  <p className="text-gray-600">No active alerts detected. Your campaigns are performing well!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {alert.severity === 'critical' ? (
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          ) : alert.severity === 'high' ? (
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                          ) : (
                            <Bell className="h-5 w-5 text-yellow-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{alert.title}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              alert.severity === 'critical' 
                                ? 'bg-red-100 text-red-800' 
                                : alert.severity === 'high'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {alert.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{alert.message}</p>
                          {alert.campaignName && (
                            <p className="text-xs text-gray-500 mt-1">Campaign: {alert.campaignName}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {alerts.length > 0 && (
                  <div className="text-center pt-2">
                    <Link
                      href="/alerts"
                      className="text-orange-600 hover:text-orange-800 font-medium text-sm"
                    >
                      View {smartAlertEngine.getAlerts({ dismissed: false }).length - alerts.length > 0 
                        ? `${smartAlertEngine.getAlerts({ dismissed: false }).length - alerts.length} more alerts` 
                        : 'all alerts'} →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <GoogleAdsIntegration onSync={loadCampaigns} loading={loading} />
            <PerformanceChart 
              data={[
                { date: '2024-01-01', spend: 250, clicks: 150, impressions: 2500, conversions: 12 },
                { date: '2024-01-02', spend: 320, clicks: 180, impressions: 2800, conversions: 15 },
                { date: '2024-01-03', spend: 290, clicks: 165, impressions: 2650, conversions: 14 },
                { date: '2024-01-04', spend: 410, clicks: 220, impressions: 3200, conversions: 18 },
                { date: '2024-01-05', spend: 380, clicks: 195, impressions: 2950, conversions: 16 },
              ]}
              metric="spend"
              title="Campaign Performance Overview"
            />
          </div>

          <div className="mt-8">
            <GoogleAdsPerformanceDashboard campaigns={campaigns} />
          </div>

          <div className="mt-8">
            <CampaignOptimizationEngine campaigns={campaigns} />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              <strong>Error:</strong> {error}
              <button 
                onClick={loadCampaigns}
                className="ml-4 text-red-600 underline hover:text-red-800"
              >
                Retry
              </button>
            </div>
          )}

          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Campaigns</h2>
              {campaigns.length > 6 && (
                <Link
                  href="/campaigns"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All →
                </Link>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
                <p className="text-gray-600 mb-4">Get started by creating your first marketing campaign.</p>
                <Link
                  href="/campaigns/new"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Your First Campaign
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.slice(0, 6).map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onDelete={handleDeleteCampaign}
                    onEdit={(campaign) => {
                      window.location.href = `/campaigns/${campaign.id}/edit`;
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
