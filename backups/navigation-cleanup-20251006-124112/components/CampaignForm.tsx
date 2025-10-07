'use client';

import { useState } from 'react';
import type { CampaignFormData } from '@/types';

interface CampaignFormProps {
  campaign?: CampaignFormData;
  onSubmit: (campaign: CampaignFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function CampaignForm({ campaign, onSubmit, onCancel, loading }: CampaignFormProps) {
  const [formData, setFormData] = useState<CampaignFormData>({
    name: campaign?.name || '',
    platform: campaign?.platform || 'google_ads',
    client_name: campaign?.client_name || '',
    budget: campaign?.budget || undefined,
    spend: campaign?.spend || 0,
    metrics: campaign?.metrics || {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof CampaignFormData, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const platformOptions = [
    { value: 'google_ads', label: 'Google Ads' },
    { value: 'meta', label: 'Meta (Facebook/Instagram)' },
    { value: 'linkedin', label: 'LinkedIn Ads' },
    { value: 'twitter', label: 'Twitter/X Ads' },
    { value: 'tiktok', label: 'TikTok Ads' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">
        {campaign ? 'Edit Campaign' : 'Create New Campaign'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campaign Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Campaign Name *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter campaign name..."
          />
        </div>

        {/* Client Name */}
        <div>
          <label htmlFor="client_name" className="block text-sm font-medium text-gray-700 mb-1">
            Client Name *
          </label>
          <input
            type="text"
            id="client_name"
            required
            value={formData.client_name}
            onChange={(e) => handleInputChange('client_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter client name..."
          />
        </div>

        {/* Platform */}
        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
            Platform *
          </label>
          <select
            id="platform"
            required
            value={formData.platform}
            onChange={(e) => handleInputChange('platform', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {platformOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
            Budget ($)
          </label>
          <input
            type="number"
            id="budget"
            min="0"
            step="0.01"
            value={formData.budget || ''}
            onChange={(e) => handleInputChange('budget', e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter budget amount..."
          />
        </div>

        {/* Current Spend */}
        <div>
          <label htmlFor="spend" className="block text-sm font-medium text-gray-700 mb-1">
            Current Spend ($)
          </label>
          <input
            type="number"
            id="spend"
            min="0"
            step="0.01"
            value={formData.spend || 0}
            onChange={(e) => handleInputChange('spend', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter current spend..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : campaign ? 'Update Campaign' : 'Create Campaign'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}