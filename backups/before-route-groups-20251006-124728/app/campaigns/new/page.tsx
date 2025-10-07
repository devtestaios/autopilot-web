'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { CampaignFormData } from '@/types';
import { createCampaign } from '@/lib/api';
import EnhancedCampaignForm from '@/components/EnhancedCampaignForm';

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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Dashboard</Link>
            <span>→</span>
            <Link href="/campaigns" className="hover:text-blue-600 dark:hover:text-blue-400">Campaigns</Link>
            <span>→</span>
            <span className="text-gray-900 dark:text-white">New Campaign</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Campaign</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Set up a comprehensive marketing campaign with advanced targeting and optimization</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Enhanced Campaign Form */}
        <EnhancedCampaignForm
          data-testid="campaign-form"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </main>
  );
}