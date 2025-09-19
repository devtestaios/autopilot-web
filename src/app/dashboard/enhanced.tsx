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

// Enhanced mock data with more realistic metrics
const enhancedCampaigns = [
  {
    id: '1',
    name: 'Q4 Holiday Shopping Blitz',
    platform: 'Google Ads',
    status: 'active',
    budget: 15000,
    spend: 8240,
    impressions: 425000,
    clicks: 12250,
    conversions: 542,
    ctr: 2.88,
    cpc: 0.67,
    roas: 5.4,
    growth: '+23%'
  },
  {
    id: '2',
    name: 'AI-Powered Retargeting',
    platform: 'Meta',
    status: 'active',
    budget: 8000,
    spend: 5100,
    impressions: 189000,
    clicks: 4890,
    conversions: 267,
    ctr: 2.59,
    cpc: 1.04,
    roas: 4.2,
    growth: '+15%'
  },
  {
    id: '3',
    name: 'LinkedIn Professional Outreach',
    platform: 'LinkedIn',
    status: 'optimizing',
    budget: 5500,
    spend: 2850,
    impressions: 94000,
    clicks: 1720,
    conversions: 89,
    ctr: 1.83,
    cpc: 1.66,
    roas: 3.7,
    growth: '+8%'
  }
];

const quickStats = [
  {
    title: 'Total Revenue',
    value: '$47,329',
    change: '+12.5%',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/20'
  },
  {
    title: 'Active Campaigns',
    value: '24',
    change: '+3',
    icon: Rocket,
    color: 'text-pulse-cyan',
    bgColor: 'bg-pulse-cyan/10'
  },
  {
    title: 'Conversion Rate',
    value: '4.82%',
    change: '+0.8%',
    icon: Target,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20'
  },
  {
    title: 'ROAS Average',
    value: '4.7x',
    change: '+0.3x',
    icon: TrendingUp,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20'
  }
];

const aiInsights = [
  {
    type: 'optimization',
    title: 'Budget Reallocation Opportunity',
    description: 'Move $2,400 from LinkedIn to Google Ads for 18% ROAS improvement',
    impact: '+$1,320 revenue',
    confidence: 92,
    icon: Zap,
    color: 'text-blue-600'
  },
  {
    type: 'alert',
    title: 'High-Performing Keywords Detected',
    description: '5 keywords showing 40%+ CTR increase - consider bid increases',
    impact: '+$850 potential',
    confidence: 87,
    icon: TrendingUp,
    color: 'text-green-600'
  },
  {
    type: 'warning',
    title: 'Campaign Fatigue Warning',
    description: 'Meta campaign showing declining engagement - refresh creative',
    impact: 'Prevent -15% CTR',
    confidence: 78,
    icon: Shield,
    color: 'text-orange-600'
  }
];

export default function EnhancedDashboardPage() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  
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
            {enhancedCampaigns.map((campaign, index) => (
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
                            : campaign.status === 'optimizing'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {campaign.status}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">
                        {campaign.growth}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Budget Used</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${campaign.spend.toLocaleString()} / ${campaign.budget.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-pulse-cyan to-pulse-purple h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(campaign.spend / campaign.budget) * 100}%` }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {campaign.roas}x
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">ROAS</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {campaign.ctr}%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">CTR</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {campaign.conversions}
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
            ))}
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