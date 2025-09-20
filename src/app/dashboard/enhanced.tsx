'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Settings,
  Bell,
  LogOut,
  Home,
  Target,
  Zap,
  Clock,
  ChevronDown,
  Search,
  Filter,
  Plus,
  Eye,
  Edit3,
  MoreHorizontal,
  Sparkles,
  ArrowUpRight,
  Activity,
  Globe,
  Shield,
  Rocket,
  Bot,
  Sliders
} from 'lucide-react';
import { PulseWaveLogo } from '@/components/PulseWaveLogo';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PremiumCard } from '@/components/ui/PremiumCard';
import AdvancedNavigation from '@/components/ui/AdvancedNavigation';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import { useToast } from '@/components/ui/Toast';
import AdvancedSettingsSidebar from '@/components/AdvancedSettingsSidebar';
import AIAssistantChat from '@/components/AIAssistantChat';
import { fetchCampaigns } from '@/lib/api';
import type { Campaign } from '@/types';

export default function EnhancedDashboardPage() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  
  // Real campaign data state
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [campaignsError, setCampaignsError] = useState<string | null>(null);
  
  // Sidebar states
  const [isSettingsSidebarOpen, setIsSettingsSidebarOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isAIChatMinimized, setIsAIChatMinimized] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [user, router]);

  // Load real campaigns from API
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setCampaignsLoading(true);
        setCampaignsError(null);
        const realCampaigns = await fetchCampaigns();
        setCampaigns(realCampaigns);
        showToast({
          type: 'success',
          title: 'Campaign data loaded successfully',
          duration: 3000
        });
      } catch (err) {
        console.error('Failed to load campaigns:', err);
        setCampaignsError('Failed to load campaign data');
        showToast({
          type: 'error',
          title: 'Failed to load campaign data',
          duration: 3000
        });
        // Set empty array as fallback
        setCampaigns([]);
      } finally {
        setCampaignsLoading(false);
      }
    };

    if (user) {
      loadCampaigns();
    }
  }, [user, showToast]);

  // Calculate dynamic stats from real campaigns
  const calculateQuickStats = () => {
    const totalRevenue = campaigns.reduce((sum: number, campaign: Campaign) => {
      const metrics = campaign.metrics || {};
      const conversions = (metrics.conversions as number) || 0;
      return sum + (conversions * 50); // Assuming $50 average order value
    }, 0);
    
    const activeCampaigns = campaigns.filter((c: Campaign) => c.status === 'active').length;
    
    const totalClicks = campaigns.reduce((sum: number, campaign: Campaign) => {
      const metrics = campaign.metrics || {};
      return sum + ((metrics.clicks as number) || 0);
    }, 0);
    
    const totalConversions = campaigns.reduce((sum: number, campaign: Campaign) => {
      const metrics = campaign.metrics || {};
      return sum + ((metrics.conversions as number) || 0);
    }, 0);
    
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    
    const totalSpend = campaigns.reduce((sum: number, campaign: Campaign) => sum + (campaign.spend || 0), 0);
    const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    
    return [
      {
        title: 'Total Revenue',
        value: `$${totalRevenue.toLocaleString()}`,
        change: '+12.5%', // Mock change for now
        icon: DollarSign,
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900/20'
      },
      {
        title: 'Active Campaigns',
        value: activeCampaigns.toString(),
        change: `+${Math.max(0, activeCampaigns - 20)}`, // Mock change
        icon: Rocket,
        color: 'text-pulse-cyan',
        bgColor: 'bg-pulse-cyan/10'
      },
      {
        title: 'Conversion Rate',
        value: `${conversionRate.toFixed(2)}%`,
        change: '+0.8%', // Mock change for now
        icon: Target,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100 dark:bg-purple-900/20'
      },
      {
        title: 'ROAS Average',
        value: `${roas.toFixed(1)}x`,
        change: '+0.3x', // Mock change for now
        icon: TrendingUp,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100 dark:bg-orange-900/20'
      }
    ];
  };

  const quickStats = calculateQuickStats();

  // Generate AI insights based on real campaign data
  const generateAIInsights = () => {
    const insights = [];
    
    // Budget utilization insight
    const highSpendCampaigns = campaigns.filter(c => {
      const budget = c.budget || 1000;
      const utilization = (c.spend / budget) * 100;
      return utilization > 80;
    });
    
    if (highSpendCampaigns.length > 0) {
      insights.push({
        type: 'warning',
        title: 'High Budget Utilization Detected',
        description: `${highSpendCampaigns.length} campaigns using >80% of budget`,
        impact: 'Monitor spending',
        confidence: 95,
        icon: Shield,
        color: 'text-orange-600'
      });
    }
    
    // Performance optimization insight
    const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    if (totalSpend > 5000) {
      insights.push({
        type: 'optimization',
        title: 'Budget Reallocation Opportunity',
        description: `Analyze top-performing campaigns for budget optimization`,
        impact: `+${Math.round(totalSpend * 0.15)} potential revenue`,
        confidence: 87,
        icon: Zap,
        color: 'text-blue-600'
      });
    }
    
    // Campaign performance insight
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    if (activeCampaigns > 0) {
      insights.push({
        type: 'alert',
        title: 'Active Campaign Performance',
        description: `${activeCampaigns} campaigns currently running - performance tracking active`,
        impact: 'Continuous optimization',
        confidence: 92,
        icon: TrendingUp,
        color: 'text-green-600'
      });
    }
    
    return insights.length > 0 ? insights : [
      {
        type: 'info',
        title: 'System Ready',
        description: 'AI monitoring active - ready to analyze campaign performance',
        impact: 'Proactive optimization',
        confidence: 100,
        icon: Zap,
        color: 'text-blue-600'
      }
    ];
  };

  const aiInsights = generateAIInsights();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <PulseWaveLogo size="large" animated className="mb-4" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-pulse-cyan border-t-transparent rounded-full mx-auto"
          />
          <p className="text-gray-600 dark:text-gray-400 mt-4">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Advanced Navigation */}
      <AdvancedNavigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pulse-cyan to-pulse-purple bg-clip-text text-transparent mb-2">
                Welcome back, {user?.name || 'User'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Your campaigns are performing exceptionally well today
              </p>
            </div>
            
            <div className="flex items-center gap-4 mt-6 lg:mt-0">
              <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200/50 dark:border-gray-700/50">
                <Clock className="w-4 h-4 text-gray-500" />
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="bg-transparent text-sm font-medium focus:outline-none"
                >
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
              
              <PremiumButton
                variant="primary"
                icon={<Sparkles className="w-4 h-4" />}
                glow
                onClick={() => showToast({
                  type: 'success',
                  title: 'Campaign Created!',
                  description: 'Your new campaign is being set up...',
                  duration: 3000
                })}
              >
                New Campaign
              </PremiumButton>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {quickStats.map((stat, index) => (
            <PremiumCard 
              key={stat.title} 
              variant="glassmorphism" 
              hover 
              className="p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className={`text-sm font-medium ${stat.color} flex items-center gap-1 mt-1`}>
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </PremiumCard>
          ))}
        </motion.div>

        {/* AI Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <PremiumCard variant="glassmorphism" className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-pulse-cyan to-pulse-purple rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                AI-Powered Insights
              </h2>
              <div className="px-3 py-1 bg-pulse-cyan/10 text-pulse-cyan text-xs font-medium rounded-full">
                3 Active
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiInsights.map((insight, index) => (
                <motion.div
                  key={insight.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:scale-110 transition-transform duration-200`}>
                      <insight.icon className={`w-4 h-4 ${insight.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                        {insight.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {insight.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">
                          {insight.impact}
                        </span>
                        <span className="text-xs text-gray-500">
                          {insight.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center">
              <PremiumButton variant="outline" size="sm">
                View All Insights
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </PremiumButton>
            </div>
          </PremiumCard>
        </motion.div>

        {/* Enhanced Campaigns Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Active Campaigns
            </h2>
            <div className="flex items-center gap-3">
              <PremiumButton variant="ghost" size="sm" icon={<Filter className="w-4 h-4" />}>
                Filter
              </PremiumButton>
              <PremiumButton variant="ghost" size="sm" icon={<MoreHorizontal className="w-4 h-4" />}>
                Options
              </PremiumButton>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {campaignsLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              ))
            ) : campaignsError ? (
              // Error state
              <div className="col-span-full text-center py-8">
                <p className="text-red-500 dark:text-red-400">{campaignsError}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            ) : campaigns.length === 0 ? (
              // Empty state
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No campaigns found</p>
              </div>
            ) : (
              // Real campaigns data
              campaigns.map((campaign: Campaign, index: number) => {
                // Extract metrics from the campaign.metrics object or provide defaults
                const campaignMetrics = campaign.metrics || {};
                const clicks = campaignMetrics.clicks as number || 0;
                const impressions = campaignMetrics.impressions as number || 0;
                const conversions = campaignMetrics.conversions as number || 0;
                const ctr = impressions > 0 ? (clicks / impressions * 100) : 0;
                const roas = campaign.spend > 0 ? (conversions * 50 / campaign.spend) : 0; // Assuming $50 avg order value
                const budget = campaign.budget || 1000; // Default budget if not set
                const growth = "+12.5"; // Mock growth for now
                
                return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                <PremiumCard variant="elevated" hover className="p-6 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {campaign.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {campaign.platform}
                        </span>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          campaign.status === 'active' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : campaign.status === 'paused'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {campaign.status}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">
                        {growth}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Budget Used</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${campaign.spend.toLocaleString()} / ${budget.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-pulse-cyan to-pulse-purple h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((campaign.spend / budget) * 100, 100)}%` }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {roas.toFixed(1)}x
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">ROAS</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {ctr.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">CTR</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {conversions}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Conv.</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <PremiumButton variant="ghost" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </PremiumButton>
                    <PremiumButton variant="outline" size="sm" className="flex-1">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </PremiumButton>
                  </div>
                </PremiumCard>
              </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Quick Actions Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <PremiumCard variant="glassmorphism" className="p-8">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Ready to Scale Further?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Let our AI optimization engine take your campaigns to the next level with automated bidding and budget management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <PremiumButton 
                  variant="primary" 
                  size="lg" 
                  glow
                  onClick={() => showToast({
                    type: 'warning',
                    title: 'AI Autopilot',
                    description: 'This feature is currently in beta. Contact support to enable.',
                    duration: 5000,
                    action: {
                      label: 'Contact Support',
                      onClick: () => showToast({
                        type: 'info',
                        title: 'Support',
                        description: 'Opening support chat...',
                        duration: 2000
                      })
                    }
                  })}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Enable AI Autopilot
                </PremiumButton>
                <PremiumButton 
                  variant="outline" 
                  size="lg"
                  onClick={() => showToast({
                    type: 'info',
                    title: 'Analytics Dashboard',
                    description: 'Opening comprehensive analytics view...',
                    duration: 3000
                  })}
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Analytics
                </PremiumButton>
              </div>
            </div>
          </PremiumCard>
        </motion.div>
      </main>

      {/* Advanced Settings Sidebar */}
      <AdvancedSettingsSidebar 
        isOpen={isSettingsSidebarOpen}
        onClose={() => setIsSettingsSidebarOpen(false)}
      />

      {/* AI Assistant Chat */}
      <AIAssistantChat
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        isMinimized={isAIChatMinimized}
        onToggleMinimize={() => setIsAIChatMinimized(!isAIChatMinimized)}
      />

      {/* Floating Action Buttons for Sidebars */}
      <div className="fixed bottom-4 left-4 flex flex-col gap-3 z-40">
        <motion.button
          onClick={() => setIsSettingsSidebarOpen(true)}
          className="p-3 bg-gradient-to-br from-bridge-purple to-energy-magenta text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Advanced Settings"
        >
          <Sliders className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </motion.button>
        
        <motion.button
          onClick={() => setIsAIChatOpen(true)}
          className="p-3 bg-gradient-to-br from-pulse-blue to-bridge-purple text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="AI Assistant"
        >
          <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
        </motion.button>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}