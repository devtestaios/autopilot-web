'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Campaign } from '@/types';
import { fetchCampaigns, deleteCampaign } from '@/lib/api';
import CampaignTable from '@/components/CampaignTable';
import NavigationTabs from '@/components/NavigationTabs';
import { CampaignFiltersComponent } from '@/components/CampaignFilters';
import { useCampaignFilters } from '@/hooks/useCampaignFilters';
import { useSearchContext } from '@/contexts/SearchContext';
import { Plus } from 'lucide-react';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add filtering functionality
  const { filters, setFilters, filteredCampaigns, totalResults } = useCampaignFilters(campaigns);

  // Provide campaigns data to search context
  const { setCampaigns: setSearchCampaigns } = useSearchContext();

  async function loadCampaigns() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCampaigns();
      setCampaigns(data);
      setSearchCampaigns(data); // Update search context
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load campaigns';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleEditCampaign = (campaign: Campaign) => {
    // Navigate to edit page
    window.location.href = `/campaigns/${campaign.id}/edit`;
  };

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

  const handleDuplicateCampaign = async (campaign: Campaign) => {
    // Create a new campaign based on the existing one
    try {
      const duplicatedCampaign = {
        ...campaign,
        name: `${campaign.name} (Copy)`,
        id: undefined, // Remove ID so a new one gets generated
        created_at: undefined,
        updated_at: undefined,
      };
      
      // You would typically call an API to create the duplicate
      console.log('Duplicating campaign:', duplicatedCampaign);
      alert(`Campaign "${campaign.name}" duplicated successfully!`);
      await loadCampaigns();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate campaign';
      alert(`Failed to duplicate campaign: ${errorMessage}`);
    }
  };

  const handleBulkAction = async (action: 'pause' | 'resume' | 'delete', campaignIds: string[]) => {
    try {
      console.log(`Performing bulk ${action} on campaigns:`, campaignIds);
      
      // Simulate API calls for bulk operations
      switch (action) {
        case 'pause':
          alert(`${campaignIds.length} campaign(s) paused successfully!`);
          break;
        case 'resume':
          alert(`${campaignIds.length} campaign(s) resumed successfully!`);
          break;
        case 'delete':
          // For delete, we'll actually try to delete each campaign
          for (const id of campaignIds) {
            await deleteCampaign(id);
          }
          alert(`${campaignIds.length} campaign(s) deleted successfully!`);
          break;
      }
      
      await loadCampaigns();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : `Failed to ${action} campaigns`;
      alert(`Failed to ${action} campaigns: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      <main className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Campaigns</h1>
            <p className="text-black mt-1">Manage and monitor your marketing campaigns</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              ← Dashboard
            </Link>
            <Link
              href="/campaigns/new"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Campaign
            </Link>
          </div>
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

        {/* Campaign Filters */}
        <CampaignFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          totalResults={totalResults}
        />

        {/* Campaign Table */}
        <CampaignTable
          campaigns={filteredCampaigns}
          onEdit={handleEditCampaign}
          onDelete={handleDeleteCampaign}
          onDuplicate={handleDuplicateCampaign}
          onBulkAction={handleBulkAction}
          onRefresh={loadCampaigns}
          loading={loading}
        />
        </div>
      </main>
    </div>
  );
}