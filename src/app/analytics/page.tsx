'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, RefreshCw, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PremiumCard } from '@/components/ui/PremiumCard';
import RealTimePerformanceAnalytics from '@/components/RealTimePerformanceAnalytics';
import NavigationTabs from '@/components/NavigationTabs';
import { fetchCampaigns } from '@/lib/api';
import type { Campaign } from '@/types';

export default function AnalyticsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true);
        const data = await fetchCampaigns();
        setCampaigns(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load campaigns:', err);
        setError('Failed to load campaign data');
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const data = await fetchCampaigns();
      setCampaigns(data);
      setError(null);
    } catch (err) {
      console.error('Failed to refresh data:', err);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    // Mock export functionality
    const dataToExport = {
      campaigns: campaigns.length,
      totalSpend: campaigns.reduce((sum, c) => sum + c.spend, 0),
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <NavigationTabs />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <PremiumButton
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </PremiumButton>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Performance Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Comprehensive insights into your campaign performance
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <PremiumButton
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
              >
                Refresh
              </PremiumButton>
              <PremiumButton
                variant="outline"
                size="sm"
                onClick={exportData}
                icon={<Download className="w-4 h-4" />}
              >
                Export
              </PremiumButton>
              <PremiumButton
                variant="primary"
                size="sm"
                onClick={() => router.push('/dashboard/enhanced')}
                icon={<BarChart3 className="w-4 h-4" />}
              >
                Dashboard
              </PremiumButton>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <PremiumCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Campaigns</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {loading ? '...' : campaigns.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </PremiumCard>
          
          <PremiumCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Spend</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {loading ? '...' : `$${campaigns.reduce((sum, c) => sum + c.spend, 0).toLocaleString()}`}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </PremiumCard>
          
          <PremiumCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Platforms</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {loading ? '...' : new Set(campaigns.map(c => c.platform)).size}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </PremiumCard>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <PremiumCard className="p-6 border-red-200 dark:border-red-800">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <PremiumButton variant="outline" onClick={handleRefresh}>
                  Try Again
                </PremiumButton>
              </div>
            </PremiumCard>
          </motion.div>
        )}

        {/* Real-Time Performance Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <RealTimePerformanceAnalytics 
            campaigns={campaigns}
            loading={loading}
          />
        </motion.div>
      </main>
    </div>
  );
}