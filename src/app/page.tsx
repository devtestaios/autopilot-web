'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Campaign, fetchCampaigns, deleteCampaign } from '@/lib/api';
import DashboardStats from '@/components/DashboardStats';
import CampaignCard from '@/components/CampaignCard';
import GoogleAdsIntegration from '@/components/GoogleAdsIntegration';
import PerformanceChart from '@/components/PerformanceChart';

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadCampaigns() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCampaigns();
      setCampaigns(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    
    try {
      await deleteCampaign(campaignId);
      await loadCampaigns(); // Refresh the list
    } catch (err: any) {
      alert(`Failed to delete campaign: ${err.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
              href="/campaigns/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Campaign
            </Link>
          </div>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats campaigns={campaigns} loading={loading} />

        {/* Google Ads Integration & Performance */}
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

        {/* Error State */}
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

        {/* Recent Campaigns */}
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
                    // Navigate to edit page - we'll implement this next
                    window.location.href = `/campaigns/${campaign.id}/edit`;
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
