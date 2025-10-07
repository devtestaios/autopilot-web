'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { TrendingUp, TrendingDown, Eye, MousePointer } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: 'active' | 'paused' | 'ended';
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
  change: number;
}

export default function CampaignTable() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Holiday Sale 2025',
      platform: 'Google Ads',
      status: 'active',
      impressions: 125000,
      clicks: 3200,
      spend: 1250,
      ctr: 2.56,
      change: 12.5
    },
    {
      id: '2',
      name: 'Brand Awareness Q1',
      platform: 'Meta',
      status: 'active',
      impressions: 98000,
      clicks: 2100,
      spend: 980,
      ctr: 2.14,
      change: -3.2
    },
    {
      id: '3',
      name: 'Lead Generation Pro',
      platform: 'LinkedIn',
      status: 'active',
      impressions: 45000,
      clicks: 1800,
      spend: 2200,
      ctr: 4.00,
      change: 8.7
    },
    {
      id: '4',
      name: 'Product Launch',
      platform: 'TikTok',
      status: 'paused',
      impressions: 67000,
      clicks: 1500,
      spend: 670,
      ctr: 2.24,
      change: 0
    },
    {
      id: '5',
      name: 'Retargeting Campaign',
      platform: 'Google Ads',
      status: 'active',
      impressions: 34000,
      clicks: 1200,
      spend: 480,
      ctr: 3.53,
      change: 15.8
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'ended': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Google Ads': return 'text-blue-600 dark:text-blue-400';
      case 'Meta': return 'text-purple-600 dark:text-purple-400';
      case 'LinkedIn': return 'text-indigo-600 dark:text-indigo-400';
      case 'TikTok': return 'text-pink-600 dark:text-pink-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCampaigns(prev => prev.map(campaign => ({
        ...campaign,
        impressions: campaign.impressions + Math.floor(Math.random() * 1000),
        clicks: campaign.clicks + Math.floor(Math.random() * 50),
        spend: campaign.spend + Math.floor(Math.random() * 100),
        ctr: +(campaign.clicks / campaign.impressions * 100).toFixed(2),
        change: campaign.status === 'active' ? +(Math.random() * 20 - 10).toFixed(1) : 0
      })));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <PremiumCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Campaign Performance
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-teal-600 dark:text-teal-400">Real-time</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Campaign</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Platform</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Impressions</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Clicks</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">CTR</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Spend</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Change</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign, index) => (
              <motion.tr
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {campaign.name}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`font-medium ${getPlatformColor(campaign.platform)}`}>
                    {campaign.platform}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </td>
                <td className="py-4 px-4 text-right font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center justify-end gap-1">
                    <Eye className="w-4 h-4 text-gray-400" />
                    {campaign.impressions.toLocaleString()}
                  </div>
                </td>
                <td className="py-4 px-4 text-right font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center justify-end gap-1">
                    <MousePointer className="w-4 h-4 text-gray-400" />
                    {campaign.clicks.toLocaleString()}
                  </div>
                </td>
                <td className="py-4 px-4 text-right font-medium text-gray-900 dark:text-white">
                  {campaign.ctr}%
                </td>
                <td className="py-4 px-4 text-right font-medium text-gray-900 dark:text-white">
                  ${campaign.spend.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right">
                  {campaign.change !== 0 && (
                    <div className={`flex items-center justify-end gap-1 ${
                      campaign.change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {campaign.change > 0 ? 
                        <TrendingUp className="w-4 h-4" /> : 
                        <TrendingDown className="w-4 h-4" />
                      }
                      <span className="font-medium">{Math.abs(campaign.change)}%</span>
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </PremiumCard>
  );
}