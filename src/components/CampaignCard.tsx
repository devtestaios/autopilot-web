'use client';

import type { Campaign } from '@/types';
import { InteractiveCard, PulseIndicator, AnimatedCounter } from '@/components/ui/InteractiveElements';
import EnhancedButton from '@/components/ui/EnhancedButton';
import { Edit, Trash2, Play, Pause, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

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
    if (!budget) return { bg: 'bg-gray-500', pulse: 'gray' as const };
    if (!spend) return { bg: 'bg-green-500', pulse: 'green' as const };
    const percentage = (spend / budget) * 100;
    if (percentage >= 90) return { bg: 'bg-red-500', pulse: 'red' as const };
    if (percentage >= 75) return { bg: 'bg-yellow-500', pulse: 'yellow' as const };
    return { bg: 'bg-green-500', pulse: 'green' as const };
  };

  const getSpendPercentage = (spend?: number, budget?: number) => {
    if (!budget || !spend) return 0;
    return Math.min((spend / budget) * 100, 100);
  };

  const isActive = campaign.status === 'active';
  const statusColors = getStatusColor(campaign.spend, campaign.budget);

  return (
    <InteractiveCard
      hoverable={true}
      glowing={isActive}
      className="p-6"
    >
      {/* Header with status indicator */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <PulseIndicator 
            active={isActive} 
            color={statusColors.pulse}
            size="sm"
          />
          <div>
            <motion.h3 
              className="text-lg font-semibold text-gray-900 dark:text-white"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {campaign.name}
            </motion.h3>
            <motion.p 
              className="text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {campaign.client_name}
            </motion.p>
          </div>
        </div>
        
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {onEdit && (
            <EnhancedButton
              onClick={() => onEdit(campaign)}
              variant="ghost"
              size="sm"
              icon={<Edit className="w-4 h-4" />}
            >
              Edit
            </EnhancedButton>
          )}
          {onDelete && (
            <EnhancedButton
              onClick={() => onDelete(campaign.id)}
              variant="danger"
              size="sm"
              icon={<Trash2 className="w-4 h-4" />}
            />
          )}
        </motion.div>
      </div>

      {/* Platform Badge with animation */}
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
      >
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-pulse-cyan/20 to-pulse-purple/20 text-pulse-cyan border border-pulse-cyan/20">
          {isActive ? <Play className="w-3 h-3 mr-1" /> : <Pause className="w-3 h-3 mr-1" />}
          {campaign.platform}
        </span>
      </motion.div>

      {/* Budget vs Spend with animated progress */}
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-1">
          <span>Budget</span>
          <AnimatedCounter 
            value={campaign.budget || 0}
            prefix="$"
            className="font-medium"
          />
        </div>
        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-2">
          <span>Spent</span>
          <AnimatedCounter 
            value={campaign.spend || 0}
            prefix="$"
            className="font-medium"
          />
        </div>
        
        {/* Enhanced Progress Bar */}
        {campaign.budget && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className={`h-2 rounded-full ${statusColors.bg} relative`}
              initial={{ width: 0 }}
              animate={{ width: `${getSpendPercentage(campaign.spend, campaign.budget)}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/30 rounded-full"
                animate={{
                  x: ['-100%', '100%'],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Metrics Preview with staggered animation */}
      {campaign.metrics && Object.keys(campaign.metrics).length > 0 && (
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-pulse-cyan" />
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Key Metrics</h4>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(campaign.metrics).slice(0, 4).map(([key, value], index) => (
              <motion.div 
                key={key} 
                className="flex justify-between p-2 rounded bg-gray-50 dark:bg-gray-800/50"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + (index * 0.1) }}
              >
                <span className="text-gray-600 dark:text-gray-400 capitalize">
                  {key.replace('_', ' ')}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {String(value)}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Footer with creation date */}
      <motion.div 
        className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Created: {formatDate(campaign.created_at)}
      </motion.div>
    </InteractiveCard>
  );
}