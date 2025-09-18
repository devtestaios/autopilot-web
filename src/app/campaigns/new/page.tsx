'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { CampaignFormData } from '@/types';
import { createCampaign } from '@/lib/api';
import CampaignForm from '@/components/CampaignForm';

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (campaignData: CampaignFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      await createCampaign(campaignData);
      
      // Redirect to the campaign details page or campaigns list
      router.push('/campaigns');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create campaign';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/campaigns');
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
            <span>New Campaign</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
          <p className="text-gray-600 mt-1">Set up a new marketing campaign to track and optimize</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Campaign Form */}
        <CampaignForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />

        {/* Help Text */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Tips for creating campaigns:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use clear, descriptive names that identify the campaign purpose</li>
            <li>• Set realistic budgets based on your client&apos;s goals</li>
            <li>• Choose the platform where your target audience is most active</li>
            <li>• You can always edit these details later as the campaign evolves</li>
          </ul>
        </div>
      </div>
    </main>
  );
}