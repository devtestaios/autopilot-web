// Customer Journey Mapper Component
// Advanced customer journey visualization with conversion tracking and analytics

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Eye,
  MousePointer,
  Mail,
  Phone,
  Calendar,
  Globe,
  MessageSquare,
  FileText,
  Award,
  Zap
} from 'lucide-react';
import CRMApiService from '../services/crm-api.service';
import { CustomerJourney, JourneyStage, TouchpointChannel, Lead } from '../types/crm.types';

interface CustomerJourneyMapperProps {
  className?: string;
}

interface JourneyMetrics {
  totalJourneys: number;
  avgJourneyDuration: number;
  conversionRate: number;
  mostCommonPath: string[];
  bottleneckStage: string;
  topChannels: Array<{
    channel: TouchpointChannel;
    touchpoints: number;
    conversion: number;
  }>;
}

interface StageAnalytics {
  stage: string;
  leads: number;
  conversion: number;
  avgDuration: number;
  dropOffRate: number;
  topSources: string[];
  nextStages: Array<{
    stage: string;
    probability: number;
    count: number;
  }>;
}

const CustomerJourneyMapper: React.FC<CustomerJourneyMapperProps> = ({ className = '' }) => {
  const [journeyStages, setJourneyStages] = useState<JourneyStage[]>([]);
  const [journeyMetrics, setJourneyMetrics] = useState<JourneyMetrics | null>(null);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [stageAnalytics, setStageAnalytics] = useState<StageAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'funnel' | 'flow' | 'timeline'>('funnel');

  // Mock data for demonstration
  const mockJourneyStages: JourneyStage[] = [
    {
      stage: 'visitor',
      name: 'Website Visitor',
      description: 'Anonymous website visitors exploring our content',
      leads: 2500,
      conversion: 12.5,
      avgDuration: 2.3,
      dropOffReasons: ['No clear value proposition', 'Complex navigation']
    },
    {
      stage: 'lead',
      name: 'Marketing Qualified Lead',
      description: 'Visitors who have shown interest by providing contact information',
      leads: 312,
      conversion: 45.2,
      avgDuration: 5.8,
      dropOffReasons: ['Poor follow-up timing', 'Generic messaging']
    },
    {
      stage: 'qualified',
      name: 'Sales Qualified Lead',
      description: 'Leads that have been qualified by our sales team',
      leads: 141,
      conversion: 68.8,
      avgDuration: 8.5,
      dropOffReasons: ['Budget constraints', 'Wrong timing']
    },
    {
      stage: 'nurturing',
      name: 'Nurturing',
      description: 'Qualified leads being actively nurtured with targeted content',
      leads: 97,
      conversion: 72.2,
      avgDuration: 12.1,
      dropOffReasons: ['Competition', 'Internal priorities shifted']
    },
    {
      stage: 'discovery',
      name: 'Discovery Call',
      description: 'Leads who have engaged in discovery conversations',
      leads: 70,
      conversion: 81.4,
      avgDuration: 6.2,
      dropOffReasons: ['Not decision maker', 'Technical fit issues']
    },
    {
      stage: 'proposal',
      name: 'Proposal Sent',
      description: 'Prospects who have received formal proposals',
      leads: 57,
      conversion: 78.9,
      avgDuration: 14.7,
      dropOffReasons: ['Price concerns', 'Approval process delays']
    },
    {
      stage: 'negotiation',
      name: 'Negotiation',
      description: 'Active negotiations and contract discussions',
      leads: 45,
      conversion: 88.9,
      avgDuration: 18.3,
      dropOffReasons: ['Contract terms', 'Procurement requirements']
    },
    {
      stage: 'closing',
      name: 'Closing',
      description: 'Final steps before deal closure',
      leads: 40,
      conversion: 95.0,
      avgDuration: 3.2,
      dropOffReasons: ['Legal reviews', 'Final approvals']
    },
    {
      stage: 'won',
      name: 'Customer',
      description: 'Successfully closed deals and new customers',
      leads: 38,
      conversion: 100,
      avgDuration: 0,
      dropOffReasons: []
    }
  ];

  const mockJourneyMetrics: JourneyMetrics = {
    totalJourneys: 2500,
    avgJourneyDuration: 45.8,
    conversionRate: 1.52,
    mostCommonPath: ['visitor', 'lead', 'qualified', 'discovery', 'proposal', 'won'],
    bottleneckStage: 'qualified',
    topChannels: [
      { channel: 'website', touchpoints: 1250, conversion: 15.2 },
      { channel: 'email', touchpoints: 892, conversion: 22.4 },
      { channel: 'phone', touchpoints: 445, conversion: 31.8 },
      { channel: 'social_media', touchpoints: 334, conversion: 8.7 },
      { channel: 'advertising', touchpoints: 298, conversion: 12.1 }
    ]
  };

  const mockStageAnalytics: Record<string, StageAnalytics> = {
    visitor: {
      stage: 'visitor',
      leads: 2500,
      conversion: 12.5,
      avgDuration: 2.3,
      dropOffRate: 87.5,
      topSources: ['Google Search', 'Direct Traffic', 'Social Media'],
      nextStages: [
        { stage: 'lead', probability: 12.5, count: 312 },
        { stage: 'exit', probability: 87.5, count: 2188 }
      ]
    },
    lead: {
      stage: 'lead',
      leads: 312,
      conversion: 45.2,
      avgDuration: 5.8,
      dropOffRate: 54.8,
      topSources: ['Content Download', 'Newsletter Signup', 'Contact Form'],
      nextStages: [
        { stage: 'qualified', probability: 45.2, count: 141 },
        { stage: 'nurturing', probability: 31.1, count: 97 },
        { stage: 'exit', probability: 23.7, count: 74 }
      ]
    },
    qualified: {
      stage: 'qualified',
      leads: 141,
      conversion: 68.8,
      avgDuration: 8.5,
      dropOffRate: 31.2,
      topSources: ['Sales Outreach', 'Demo Request', 'Referral'],
      nextStages: [
        { stage: 'discovery', probability: 49.6, count: 70 },
        { stage: 'nurturing', probability: 19.2, count: 27 },
        { stage: 'exit', probability: 31.2, count: 44 }
      ]
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // In a real implementation, these would be actual API calls
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      setJourneyStages(mockJourneyStages);
      setJourneyMetrics(mockJourneyMetrics);
    } catch (error) {
      console.error('Failed to load journey data:', error);
      // Use mock data on error
      setJourneyStages(mockJourneyStages);
      setJourneyMetrics(mockJourneyMetrics);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleStageClick = (stage: string) => {
    setSelectedStage(stage);
    setStageAnalytics(mockStageAnalytics[stage] || null);
  };

  const getStageColor = (index: number, total: number) => {
    const intensity = 1 - (index / total);
    return `rgba(59, 130, 246, ${0.3 + intensity * 0.7})`;
  };

  const getChannelIcon = (channel: TouchpointChannel) => {
    const iconProps = { className: "w-4 h-4" };
    switch (channel) {
      case 'website': return <Globe {...iconProps} />;
      case 'email': return <Mail {...iconProps} />;
      case 'phone': return <Phone {...iconProps} />;
      case 'social_media': return <MessageSquare {...iconProps} />;
      case 'advertising': return <Target {...iconProps} />;
      case 'webinar': return <Calendar {...iconProps} />;
      case 'referral': return <Users {...iconProps} />;
      default: return <MousePointer {...iconProps} />;
    }
  };

  const totalConversionRate = useMemo(() => {
    if (journeyStages.length === 0) return 0;
    const firstStage = journeyStages[0];
    const lastStage = journeyStages[journeyStages.length - 1];
    return ((lastStage.leads / firstStage.leads) * 100).toFixed(2);
  }, [journeyStages]);

  if (loading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Map className="w-7 h-7 text-purple-600" />
            Customer Journey Mapper
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visualize and optimize customer conversion paths
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('funnel')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'funnel' 
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Funnel
            </button>
            <button
              onClick={() => setViewMode('flow')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'flow' 
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Flow
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'timeline' 
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Timeline
            </button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Journey Metrics */}
      {journeyMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Journeys</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {journeyMetrics.totalJourneys.toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 text-sm font-medium">+8.3% this month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Avg Journey Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {journeyMetrics.avgJourneyDuration} days
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-red-600 text-sm font-medium">-2.1 days faster</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalConversionRate}%
                </p>
              </div>
              <Target className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 text-sm font-medium">+0.3% this month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Bottleneck Stage</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                  {journeyMetrics.bottleneckStage}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
            <div className="flex items-center gap-1 mt-3">
              <Eye className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 text-sm font-medium">Needs attention</span>
            </div>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Journey Funnel */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Customer Journey Funnel
                </h3>
                <button className="flex items-center gap-2 px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {journeyStages.map((stage, index) => {
                  const isSelected = selectedStage === stage.stage;
                  const stageWidth = (stage.leads / journeyStages[0].leads) * 100;
                  
                  return (
                    <motion.div
                      key={stage.stage}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-purple-500 ring-offset-2' : ''
                      }`}
                      onClick={() => handleStageClick(stage.stage)}
                    >
                      <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        {/* Stage Number */}
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                            {index + 1}
                          </span>
                        </div>

                        {/* Funnel Bar */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {stage.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {stage.leads.toLocaleString()} leads
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {stage.conversion.toFixed(1)}%
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {stage.avgDuration} days avg
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${stageWidth}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className="h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                              style={{ backgroundColor: getStageColor(index, journeyStages.length) }}
                            >
                              {stageWidth > 15 && `${stageWidth.toFixed(1)}%`}
                            </motion.div>
                          </div>
                        </div>

                        {/* Arrow */}
                        {index < journeyStages.length - 1 && (
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stage Details & Channel Performance */}
        <div className="space-y-6">
          {/* Stage Analytics */}
          {stageAnalytics && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 capitalize">
                {stageAnalytics.stage} Stage Details
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Leads</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {stageAnalytics.leads.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Drop-off Rate</p>
                    <p className="text-xl font-bold text-red-600">
                      {stageAnalytics.dropOffRate.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Top Sources</p>
                  <div className="space-y-1">
                    {stageAnalytics.topSources.map((source) => (
                      <div key={source} className="text-sm font-medium text-gray-900 dark:text-white">
                        • {source}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Next Stages</p>
                  <div className="space-y-2">
                    {stageAnalytics.nextStages.map((nextStage) => (
                      <div key={nextStage.stage} className="flex items-center justify-between">
                        <span className="text-sm capitalize text-gray-900 dark:text-white">
                          {nextStage.stage}
                        </span>
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            {nextStage.probability.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {nextStage.count} leads
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Channel Performance */}
          {journeyMetrics && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Channel Performance
              </h3>

              <div className="space-y-4">
                {journeyMetrics.topChannels.map((channel) => (
                  <div key={channel.channel} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getChannelIcon(channel.channel)}
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white capitalize">
                          {channel.channel.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {channel.touchpoints.toLocaleString()} touchpoints
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 dark:text-white">
                        {channel.conversion.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        conversion
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerJourneyMapper;