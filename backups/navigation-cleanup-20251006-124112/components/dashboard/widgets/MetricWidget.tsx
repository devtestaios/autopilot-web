'use client';

import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, Target } from 'lucide-react';
import { PremiumCard } from '@/components/ui/PremiumCard';
import type { DashboardWidget } from '@/components/DashboardCustomizer';

interface MetricWidgetProps {
  widget: DashboardWidget;
  data: any;
  isEditMode: boolean;
  onSelect: () => void;
}

export default function MetricWidget({ widget, data, isEditMode, onSelect }: MetricWidgetProps) {
  const getMetricValue = () => {
    if (!data) return '0';
    
    switch (widget.component) {
      case 'RevenueMetric':
        return `$${data.overview?.total_spend?.toLocaleString() || '0'}`;
      case 'CampaignMetric':
        return data.overview?.total_campaigns?.toString() || '0';
      default:
        return '0';
    }
  };

  const getMetricIcon = () => {
    switch (widget.component) {
      case 'RevenueMetric':
        return DollarSign;
      case 'CampaignMetric':
        return Target;
      default:
        return TrendingUp;
    }
  };

  const getMetricChange = () => {
    // Simulate positive growth
    return '+12.5%';
  };

  const Icon = getMetricIcon();

  return (
    <motion.div
      whileHover={{ scale: isEditMode ? 1 : 1.02 }}
      onClick={isEditMode ? onSelect : undefined}
      className={`h-full ${isEditMode ? 'cursor-pointer' : ''}`}
    >
      <PremiumCard className="p-6 h-full">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {widget.title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {getMetricValue()}
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">
                {getMetricChange()}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                vs last month
              </span>
            </div>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </PremiumCard>
    </motion.div>
  );
}