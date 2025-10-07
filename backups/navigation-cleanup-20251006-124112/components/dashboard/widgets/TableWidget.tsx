'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { PremiumCard } from '@/components/ui/PremiumCard';
import type { DashboardWidget } from '@/components/DashboardCustomizer';
import type { Campaign } from '@/types';

interface TableWidgetProps {
  widget: DashboardWidget;
  data: any;
  isEditMode: boolean;
  onSelect: () => void;
}

// Extended campaign interface for table display
interface CampaignTableData extends Campaign {
  impressions: number;
  clicks: number;
  conversions: number;
  roas: number;
}

export default function TableWidget({ widget, data, isEditMode, onSelect }: TableWidgetProps) {
  // Sample campaign data
  const campaigns: CampaignTableData[] = data?.campaigns || [
    {
      id: 1,
      name: 'Google Search Campaign',
      platform: 'Google',
      status: 'active',
      spend: 2500,
      impressions: 125000,
      clicks: 2100,
      conversions: 156,
      roas: 4.2
    },
    {
      id: 2,
      name: 'Meta Display Campaign',
      platform: 'Meta',
      status: 'active',
      spend: 1800,
      impressions: 98000,
      clicks: 1540,
      conversions: 92,
      roas: 3.8
    },
    {
      id: 3,
      name: 'LinkedIn Professional',
      platform: 'LinkedIn',
      status: 'paused',
      spend: 1200,
      impressions: 45000,
      clicks: 890,
      conversions: 67,
      roas: 5.1
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'paused':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'ended':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-800 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getRoasColor = (roas: number) => {
    if (roas >= 4) return 'text-green-600';
    if (roas >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      whileHover={{ scale: isEditMode ? 1 : 1.02 }}
      onClick={isEditMode ? onSelect : undefined}
      className={`h-full ${isEditMode ? 'cursor-pointer' : ''}`}
    >
      <PremiumCard className="p-6 h-full">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {widget.title}
          </h3>
          <p className="text-sm text-gray-800 dark:text-gray-400">
            Top performing campaigns by ROAS
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider pb-2">
                  Campaign
                </th>
                <th className="text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider pb-2">
                  Status
                </th>
                <th className="text-right text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider pb-2">
                  Spend
                </th>
                <th className="text-right text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider pb-2">
                  ROAS
                </th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {campaigns.slice(0, widget.config?.limit || 5).map((campaign, index) => (
                <tr 
                  key={campaign.id} 
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <td className="py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {campaign.name}
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-400">
                        {campaign.platform}
                      </p>
                    </div>
                  </td>
                  <td className="py-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="py-2 text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${campaign.spend.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-2 text-right">
                    <div className="flex items-center justify-end">
                      <span className={`text-sm font-medium ${getRoasColor(campaign.roas)}`}>
                        {campaign.roas}x
                      </span>
                      {campaign.roas >= 4 ? (
                        <TrendingUp className="w-4 h-4 text-green-600 ml-1" />
                      ) : campaign.roas >= 3 ? (
                        <Activity className="w-4 h-4 text-yellow-600 ml-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 ml-1" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PremiumCard>
    </motion.div>
  );
}