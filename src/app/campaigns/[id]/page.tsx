'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { Campaign, PerformanceSnapshot } from '@/types';
import { fetchCampaign, fetchCampaignPerformance, deleteCampaign } from '@/lib/api';

export default function CampaignDetailsPage() {
  const params = useParams();
  const campaignId = params.id as string;
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [performance, setPerformance] = useState<PerformanceSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCampaignData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [campaignData, performanceData] = await Promise.all([
        fetchCampaign(campaignId),
        fetchCampaignPerformance(campaignId)
      ]);
      
      setCampaign(campaignData);
      setPerformance(performanceData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load campaign data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    if (campaignId) {
      loadCampaignData();
    }
  }, [campaignId, loadCampaignData]);

  const handleDeleteCampaign = async () => {
    if (!confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) return;
    
    try {
      await deleteCampaign(campaignId);
      window.location.href = '/campaigns';
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete campaign';
      alert(`Failed to delete campaign: ${errorMessage}`);
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded mb-8 w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !campaign) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <strong>Error:</strong> {error || 'Campaign not found'}
            <button 
              onClick={loadCampaignData}
              className="ml-4 text-red-600 underline hover:text-red-800"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  const spendPercentage = campaign.budget && campaign.spend 
    ? Math.min((campaign.spend / campaign.budget) * 100, 100) 
    : 0;

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Link href="/" className="hover:text-blue-600">Dashboard</Link>
          <span>→</span>
          <Link href="/campaigns" className="hover:text-blue-600">Campaigns</Link>
          <span>→</span>
          <span>{campaign.name}</span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
            <p className="text-gray-600 mt-1">Client: {campaign.client_name}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {campaign.platform}
              </span>
              <span className="text-sm text-gray-500">
                Created {formatDate(campaign.created_at)}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/campaigns/${campaign.id}/edit`}
              className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDeleteCampaign}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Campaign Overview</h2>
              
              {/* Budget Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Budget Progress</span>
                  <span>{spendPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full ${
                      spendPercentage >= 90 ? 'bg-red-500' :
                      spendPercentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${spendPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Spent: {formatCurrency(campaign.spend)}</span>
                  <span>Budget: {formatCurrency(campaign.budget)}</span>
                </div>
              </div>

              {/* Campaign Metrics */}
              {campaign.metrics && Object.keys(campaign.metrics).length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Current Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(campaign.metrics).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600 capitalize mb-1">
                          {key.replace('_', ' ')}
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Performance History */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Performance History</h2>
              
              {performance.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No performance data yet</h3>
                  <p className="text-gray-600">Performance snapshots will appear here once data is synced.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {performance.map((snapshot) => (
                    <div key={snapshot.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Snapshot from {formatDate(snapshot.snapshot_date)}</h4>
                        <span className="text-sm text-gray-500">
                          {formatDate(snapshot.created_at)}
                        </span>
                      </div>
                      {snapshot.metrics && Object.keys(snapshot.metrics).length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {Object.entries(snapshot.metrics).map(([key, value]) => (
                            <div key={key} className="text-sm">
                              <span className="text-gray-600 capitalize">{key.replace('_', ' ')}: </span>
                              <span className="font-medium">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Budget</span>
                  <span className="font-medium">{formatCurrency(campaign.budget)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spend</span>
                  <span className="font-medium">{formatCurrency(campaign.spend)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining</span>
                  <span className="font-medium">
                    {formatCurrency((campaign.budget || 0) - (campaign.spend || 0))}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">Platform</span>
                  <span className="font-medium capitalize">{campaign.platform.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Performance Snapshots</span>
                  <span className="font-medium">{performance.length}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/campaigns/${campaign.id}/edit`}
                  className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Edit Campaign
                </Link>
                <button
                  onClick={() => alert('Performance sync coming soon with Google Ads integration!')}
                  className="block w-full text-center bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  Sync Performance
                </button>
                <Link
                  href="/campaigns"
                  className="block w-full text-center bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Back to Campaigns
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}