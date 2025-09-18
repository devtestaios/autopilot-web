'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Campaign, CampaignFormData } from '@/types';
import { fetchCampaign, updateCampaign } from '@/lib/api';
import CampaignForm from '@/components/CampaignForm';

export default function EditCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCampaign = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCampaign(campaignId);
      setCampaign(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load campaign';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    if (campaignId) {
      loadCampaign();
    }
  }, [campaignId, loadCampaign]);

  const handleSubmit = async (campaignData: CampaignFormData) => {
    try {
      setSubmitting(true);
      setError(null);
      
      await updateCampaign(campaignId, campaignData);
      
      // Redirect back to campaign details
      router.push(`/campaigns/${campaignId}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update campaign';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/campaigns/${campaignId}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded mb-8 w-1/4"></div>
            <div className="bg-white rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
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
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <strong>Error:</strong> {error || 'Campaign not found'}
            <button 
              onClick={loadCampaign}
              className="ml-4 text-red-600 underline hover:text-red-800"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Convert Campaign to CampaignFormData for the form
  const campaignFormData: CampaignFormData = {
    name: campaign.name,
    platform: campaign.platform,
    client_name: campaign.client_name,
    budget: campaign.budget,
    spend: campaign.spend,
    metrics: campaign.metrics
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link href="/" className="hover:text-blue-600">Dashboard</Link>
            <span>→</span>
            <Link href="/campaigns" className="hover:text-blue-600">Campaigns</Link>
            <span>→</span>
            <Link href={`/campaigns/${campaignId}`} className="hover:text-blue-600">{campaign.name}</Link>
            <span>→</span>
            <span>Edit</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Campaign</h1>
          <p className="text-gray-600 mt-1">Update your campaign settings and budget</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Campaign Form */}
        <CampaignForm
          campaign={campaignFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={submitting}
        />

        {/* Help Text */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-yellow-900 mb-2">Important notes:</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Changes to budget and spend will be reflected immediately</li>
            <li>• Platform changes should be made carefully as they affect integrations</li>
            <li>• Performance data will be preserved regardless of these changes</li>
            <li>• Consider the impact on any automated optimizations currently running</li>
          </ul>
        </div>
      </div>
    </main>
  );
}