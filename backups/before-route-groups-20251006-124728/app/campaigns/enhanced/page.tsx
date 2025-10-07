'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { 
  Plus, 
  Bot, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Zap, 
  Settings, 
  Play, 
  Pause, 
  Activity,
  Users,
  Globe,
  Brain,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  MousePointer,
  CreditCard,
  Filter,
  Search,
  Calendar,
  Download,
  Upload
} from 'lucide-react';

// Dynamic imports for less critical icons to reduce bundle size
const BarChart3 = dynamic(() => import('lucide-react').then(mod => ({ default: mod.BarChart3 })), { 
  ssr: false,
  loading: () => <div className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
});
const PieChart = dynamic(() => import('lucide-react').then(mod => ({ default: mod.PieChart })), { 
  ssr: false,
  loading: () => <div className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
});

import { useRouter } from 'next/navigation';

// Enhanced Campaign Interface
interface EnhancedCampaign {
  id: string;
  name: string;
  type: 'cross-platform' | 'single-platform';
  platforms: ('google-ads' | 'meta' | 'linkedin' | 'tiktok' | 'twitter')[];
  status: 'draft' | 'active' | 'paused' | 'completed' | 'optimizing';
  budget: {
    total: number;
    daily: number;
    spent: number;
    remaining: number;
    allocation: Record<string, number>;
  };
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    cpa: number;
    roas: number;
    confidence: number;
  };
  splitTests: {
    active: number;
    total: number;
    winnerFound: boolean;
    confidence: number;
  };
  aiInsights: {
    score: number;
    recommendations: string[];
    predictions: {
      nextDaySpend: number;
      expectedROAS: number;
      riskLevel: 'low' | 'medium' | 'high';
    };
  };
  createdAt: string;
  lastOptimized: string;
}

export default function EnhancedCampaignsDashboard() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<EnhancedCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'split-tests' | 'ai-center' | 'budget' | 'performance'>('overview');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [aiOptimizing, setAiOptimizing] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockCampaigns: EnhancedCampaign[] = [
      {
        id: '1',
        name: 'Q4 Holiday Cross-Platform Blitz',
        type: 'cross-platform',
        platforms: ['google-ads', 'meta', 'linkedin'],
        status: 'active',
        budget: {
          total: 50000,
          daily: 1667,
          spent: 32400,
          remaining: 17600,
          allocation: { 'google-ads': 45, 'meta': 35, 'linkedin': 20 }
        },
        performance: {
          impressions: 2840000,
          clicks: 42600,
          conversions: 1278,
          ctr: 1.5,
          cpc: 0.76,
          cpa: 25.35,
          roas: 4.2,
          confidence: 94
        },
        splitTests: {
          active: 8,
          total: 15,
          winnerFound: true,
          confidence: 96
        },
        aiInsights: {
          score: 92,
          recommendations: [
            'Increase Meta budget by 15% based on performance',
            'Test new creative variants for LinkedIn',
            'Expand winning audience on Google Ads'
          ],
          predictions: {
            nextDaySpend: 1845,
            expectedROAS: 4.6,
            riskLevel: 'low'
          }
        },
        createdAt: '2025-09-01',
        lastOptimized: '2025-09-23T10:30:00Z'
      },
      {
        id: '2',
        name: 'Lead Gen B2B Focus',
        type: 'single-platform',
        platforms: ['linkedin'],
        status: 'optimizing',
        budget: {
          total: 25000,
          daily: 833,
          spent: 18200,
          remaining: 6800,
          allocation: { 'linkedin': 100 }
        },
        performance: {
          impressions: 890000,
          clicks: 12450,
          conversions: 456,
          ctr: 1.4,
          cpc: 1.46,
          cpa: 39.91,
          roas: 3.1,
          confidence: 87
        },
        splitTests: {
          active: 12,
          total: 18,
          winnerFound: false,
          confidence: 73
        },
        aiInsights: {
          score: 78,
          recommendations: [
            'Test different job title targeting',
            'A/B test CTA variations',
            'Optimize landing page conversion rate'
          ],
          predictions: {
            nextDaySpend: 920,
            expectedROAS: 3.4,
            riskLevel: 'medium'
          }
        },
        createdAt: '2025-08-15',
        lastOptimized: '2025-09-23T09:15:00Z'
      },
      {
        id: '3',
        name: 'Brand Awareness Multi-Touch',
        type: 'cross-platform',
        platforms: ['google-ads', 'meta', 'tiktok'],
        status: 'active',
        budget: {
          total: 75000,
          daily: 2500,
          spent: 45600,
          remaining: 29400,
          allocation: { 'google-ads': 40, 'meta': 35, 'tiktok': 25 }
        },
        performance: {
          impressions: 4200000,
          clicks: 84000,
          conversions: 2100,
          ctr: 2.0,
          cpc: 0.54,
          cpa: 21.71,
          roas: 5.8,
          confidence: 98
        },
        splitTests: {
          active: 15,
          total: 22,
          winnerFound: true,
          confidence: 91
        },
        aiInsights: {
          score: 95,
          recommendations: [
            'Scale winning TikTok creative to other platforms',
            'Increase budget allocation to top performing segments',
            'Launch sequential remarketing campaign'
          ],
          predictions: {
            nextDaySpend: 2750,
            expectedROAS: 6.1,
            riskLevel: 'low'
          }
        },
        createdAt: '2025-07-20',
        lastOptimized: '2025-09-23T11:45:00Z'
      }
    ];

    setTimeout(() => {
      setCampaigns(mockCampaigns);
      setLoading(false);
    }, 1000);
  }, []);

  const handleBulkOptimize = async () => {
    setAiOptimizing(true);
    // Simulate AI optimization
    setTimeout(() => {
      setAiOptimizing(false);
      // Update campaigns with optimized status
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'paused': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'optimizing': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
      case 'draft': return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
      case 'completed': return 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'google-ads': return '🔍';
      case 'meta': return '📘';
      case 'linkedin': return '💼';
      case 'tiktok': return '🎵';
      case 'twitter': return '🐦';
      default: return '🌐';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Campaign Command Center
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              AI-Powered Cross-Platform Campaign Optimization & Split Testing
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/campaigns/create')}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus size={20} />
              New Campaign
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBulkOptimize}
              disabled={aiOptimizing || selectedCampaigns.length === 0}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {aiOptimizing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Bot size={20} />
                </motion.div>
              ) : (
                <Brain size={20} />
              )}
              AI Optimize Selected
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl flex items-center gap-2 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all"
            >
              <Download size={20} />
              Export Data
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Stats Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              title: 'Total ROAS',
              value: '4.7x',
              change: '+12.3%',
              trend: 'up',
              icon: TrendingUp,
              color: 'from-green-500 to-emerald-500'
            },
            {
              title: 'Active Split Tests',
              value: '35',
              change: '+8',
              trend: 'up',
              icon: Target,
              color: 'from-blue-500 to-cyan-500'
            },
            {
              title: 'Total Ad Spend',
              value: '$96.2K',
              change: '+15.7%',
              trend: 'up',
              icon: DollarSign,
              color: 'from-purple-500 to-pink-500'
            },
            {
              title: 'AI Optimizations',
              value: '247',
              change: '+43',
              trend: 'up',
              icon: Zap,
              color: 'from-orange-500 to-red-500'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-gray-600 dark:text-gray-400">{stat.title}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Campaign Overview', icon: BarChart3 },
              { id: 'split-tests', label: 'Split Test Center', icon: Target },
              { id: 'ai-center', label: 'AI Control Center', icon: Brain },
              { id: 'budget', label: 'Budget Management', icon: CreditCard },
              { id: 'performance', label: 'Performance Analytics', icon: Activity }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Campaign Cards Grid */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Active Campaigns ({campaigns.length})
                </h2>
                
                <div className="flex flex-wrap gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search campaigns..."
                      className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  
                  <select className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>All Platforms</option>
                    <option>Google Ads</option>
                    <option>Meta</option>
                    <option>LinkedIn</option>
                    <option>TikTok</option>
                  </select>
                  
                  <select className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Paused</option>
                    <option>Optimizing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-6">
                {campaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Campaign Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedCampaigns.includes(campaign.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCampaigns([...selectedCampaigns, campaign.id]);
                            } else {
                              setSelectedCampaigns(selectedCampaigns.filter(id => id !== campaign.id));
                            }
                          }}
                          className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                        />
                        
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {campaign.name}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
                              {campaign.status}
                            </span>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Platforms:</span>
                              <div className="flex gap-1">
                                {campaign.platforms.map(platform => (
                                  <span key={platform} className="text-lg" title={platform}>
                                    {getPlatformIcon(platform)}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <Brain size={14} />
                              <span>AI Score: {campaign.aiInsights.score}/100</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 transition-colors"
                        >
                          <Settings size={20} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors"
                        >
                          {campaign.status === 'active' ? <Pause size={20} /> : <Play size={20} />}
                        </motion.button>
                      </div>
                    </div>

                    {/* Performance Metrics Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      {[
                        { label: 'ROAS', value: `${campaign.performance.roas}x`, color: 'text-green-600' },
                        { label: 'CTR', value: `${campaign.performance.ctr}%`, color: 'text-blue-600' },
                        { label: 'CPA', value: `$${campaign.performance.cpa}`, color: 'text-purple-600' },
                        { label: 'Conversions', value: campaign.performance.conversions.toLocaleString(), color: 'text-orange-600' }
                      ].map((metric) => (
                        <div key={metric.label} className="text-center">
                          <div className={`text-lg font-bold ${metric.color} mb-1`}>
                            {metric.value}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Budget Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Budget Progress</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ${campaign.budget.spent.toLocaleString()} / ${campaign.budget.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-teal-600 to-cyan-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(campaign.budget.spent / campaign.budget.total) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Split Test Status */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {campaign.splitTests.active}/{campaign.splitTests.total}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Active Tests</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {campaign.splitTests.confidence}%
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Confidence</div>
                        </div>
                        
                        {campaign.splitTests.winnerFound && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle size={16} />
                            <span className="text-sm font-medium">Winner Found</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Optimized</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(campaign.lastOptimized).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-purple-700 dark:text-purple-300">AI Recommendations</span>
                      </div>
                      <div className="space-y-2">
                        {campaign.aiInsights.recommendations.slice(0, 2).map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          
          {activeTab === 'split-tests' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-teal-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Advanced Split Test Center
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Cross-platform A/B testing with AI-powered optimization
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-3 rounded-xl"
                >
                  Coming Soon - Advanced Split Testing Suite
                </motion.button>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'ai-center' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  AI Control Center
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Autonomous campaign management and real-time optimization
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl"
                >
                  Configure AI Settings
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}