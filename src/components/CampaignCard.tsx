'use client';

import type { Campaign } from '@/types';

interface CampaignCardProps {
  campaign: Campaign;
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (campaignId: string) => void;
}

export default function CampaignCard({ campaign, onEdit, onDelete }: CampaignCardProps) {
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

  const getStatusColor = (spend?: number, budget?: number) => {
    if (!budget) return 'bg-gray-500';
    if (!spend) return 'bg-green-500';
    const percentage = (spend / budget) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getSpendPercentage = (spend?: number, budget?: number) => {
    if (!budget || !spend) return 0;
    return Math.min((spend / budget) * 100, 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
          <p className="text-sm text-black">{campaign.client_name}</p>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(campaign)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(campaign.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Platform Badge */}
      <div className="mb-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {campaign.platform}
        </span>
      </div>

      {/* Budget vs Spend */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-black mb-1">
          <span>Budget</span>
          <span>{formatCurrency(campaign.budget)}</span>
        </div>
        <div className="flex justify-between text-sm text-black mb-2">
          <span>Spent</span>
          <span>{formatCurrency(campaign.spend)}</span>
        </div>
        
        {/* Progress Bar */}
        {campaign.budget && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getStatusColor(campaign.spend, campaign.budget)}`}
              style={{ width: `${getSpendPercentage(campaign.spend, campaign.budget)}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Metrics Preview */}
      {campaign.metrics && Object.keys(campaign.metrics).length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Key Metrics</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(campaign.metrics).slice(0, 4).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-black capitalize">{key.replace('_', ' ')}</span>
                <span className="font-medium">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-xs text-black pt-2 border-t border-gray-100">
        Created: {formatDate(campaign.created_at)}
      </div>
    </div>
  );
}