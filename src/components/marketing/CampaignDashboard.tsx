'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  MousePointer, 
  Eye, 
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Clock,
  Play,
  Pause,
  Edit3,
  Copy,
  Trash2,
  MoreVertical,
  Filter,
  Search,
  RefreshCw,
  Plus,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Types
export interface Campaign {
  id: string;
  name: string;
  platform: 'Google Ads' | 'Meta' | 'LinkedIn' | 'TikTok' | 'Pinterest' | 'Twitter';
  status: 'active' | 'paused' | 'draft' | 'completed';
  type: 'Search' | 'Display' | 'Video' | 'Shopping' | 'Social' | 'Email';
  budget: {
    daily: number;
    total: number;
    spent: number;
    remaining: number;
  };
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    ctr: number;
    cpc: number;
    cpm: number;
    roas: number;
    conversionRate: number;
  };
  targeting: {
    audience: string;
    locations: string[];
    ageRange: string;
    interests: string[];
  };
  schedule: {
    startDate: Date;
    endDate?: Date;
    timezone: string;
  };
  createdAt: Date;
  lastModified: Date;
}

export interface CampaignDashboardProps {
  campaigns?: Campaign[];
  onCampaignUpdate?: (campaignId: string, updates: Partial<Campaign>) => void;
  onCampaignCreate?: () => void;
  className?: string;
}

// Platform Icons
const PlatformIcon = ({ platform }: { platform: Campaign['platform'] }) => {
  const icons = {
    'Google Ads': <Target className="w-4 h-4" />,
    'Meta': <Globe className="w-4 h-4" />,
    'LinkedIn': <Users className="w-4 h-4" />,
    'TikTok': <Smartphone className="w-4 h-4" />,
    'Pinterest': <Eye className="w-4 h-4" />,
    'Twitter': <Monitor className="w-4 h-4" />
  };
  return icons[platform] || <Target className="w-4 h-4" />;
};

// Status Badge Component
const StatusBadge = ({ status }: { status: Campaign['status'] }) => {
  const variants = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
  };

  const icons = {
    active: <Play className="w-3 h-3" />,
    paused: <Pause className="w-3 h-3" />,
    draft: <Clock className="w-3 h-3" />,
    completed: <CheckCircle className="w-3 h-3" />
  };

  return (
    <Badge className={`${variants[status]} flex items-center gap-1`}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Performance Metrics Card
const PerformanceCard = ({ 
  title, 
  value, 
  prefix = '', 
  suffix = '', 
  trend, 
  trendValue 
}: {
  title: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}) => {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Activity;

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">{title}</span>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-xs ${trendColors[trend]}`}>
            <TrendIcon className="w-3 h-3" />
            {trendValue}
          </div>
        )}
      </div>
      <div className="text-xl font-semibold">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </div>
    </div>
  );
};

// Campaign Row Component
const CampaignRow = ({ 
  campaign, 
  onStatusToggle, 
  onEdit, 
  onDelete 
}: {
  campaign: Campaign;
  onStatusToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [showActions, setShowActions] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <motion.div
      layout
      className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Campaign Info */}
      <div className="col-span-3 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
          <PlatformIcon platform={campaign.platform} />
        </div>
        <div>
          <h4 className="font-medium text-sm">{campaign.name}</h4>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{campaign.platform}</span>
            <span>•</span>
            <span>{campaign.type}</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="col-span-1 flex items-center">
        <StatusBadge status={campaign.status} />
      </div>

      {/* Budget */}
      <div className="col-span-2 flex items-center">
        <div>
          <div className="text-sm font-medium">{formatCurrency(campaign.budget.spent)}</div>
          <div className="text-xs text-gray-500">of {formatCurrency(campaign.budget.total)}</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="col-span-2 flex items-center">
        <div>
          <div className="text-sm font-medium">{campaign.performance.clicks.toLocaleString()}</div>
          <div className="text-xs text-gray-500">CTR: {formatPercentage(campaign.performance.ctr)}</div>
        </div>
      </div>

      <div className="col-span-2 flex items-center">
        <div>
          <div className="text-sm font-medium">{campaign.performance.conversions}</div>
          <div className="text-xs text-gray-500">Rate: {formatPercentage(campaign.performance.conversionRate)}</div>
        </div>
      </div>

      <div className="col-span-1 flex items-center">
        <div>
          <div className="text-sm font-medium">{campaign.performance.roas.toFixed(1)}x</div>
          <div className="text-xs text-gray-500">ROAS</div>
        </div>
      </div>

      {/* Actions */}
      <div className="col-span-1 flex items-center justify-end">
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-1"
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onStatusToggle(campaign.id)}
                title={campaign.status === 'active' ? 'Pause Campaign' : 'Activate Campaign'}
              >
                {campaign.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(campaign.id)}
                title="Edit Campaign"
              >
                <Edit3 className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(campaign.id)}
                title="Delete Campaign"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Main Campaign Dashboard Component
export default function CampaignDashboard({ 
  campaigns = [], 
  onCampaignUpdate,
  onCampaignCreate,
  className = '' 
}: CampaignDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<Campaign['status'] | 'all'>('all');
  const [filterPlatform, setFilterPlatform] = useState<Campaign['platform'] | 'all'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Mock data if no campaigns provided
  const mockCampaigns: Campaign[] = [
    {
      id: 'camp-1',
      name: 'Q4 Product Launch - Search',
      platform: 'Google Ads',
      status: 'active',
      type: 'Search',
      budget: {
        daily: 500,
        total: 15000,
        spent: 12300,
        remaining: 2700
      },
      performance: {
        impressions: 145000,
        clicks: 4060,
        conversions: 142,
        revenue: 28400,
        ctr: 2.8,
        cpc: 3.03,
        cpm: 8.48,
        roas: 4.6,
        conversionRate: 3.5
      },
      targeting: {
        audience: 'Business Professionals',
        locations: ['United States', 'Canada'],
        ageRange: '25-54',
        interests: ['Business', 'Technology', 'Marketing']
      },
      schedule: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        timezone: 'America/New_York'
      },
      createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'camp-2',
      name: 'Brand Awareness - Social',
      platform: 'Meta',
      status: 'active',
      type: 'Social',
      budget: {
        daily: 200,
        total: 6000,
        spent: 4800,
        remaining: 1200
      },
      performance: {
        impressions: 89000,
        clicks: 2134,
        conversions: 67,
        revenue: 13400,
        ctr: 2.4,
        cpc: 2.25,
        cpm: 5.39,
        roas: 3.8,
        conversionRate: 3.1
      },
      targeting: {
        audience: 'Marketing Professionals',
        locations: ['United States'],
        ageRange: '28-45',
        interests: ['Marketing', 'Digital Marketing', 'Social Media']
      },
      schedule: {
        startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        timezone: 'America/New_York'
      },
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - 6 * 60 * 60 * 1000)
    },
    {
      id: 'camp-3',
      name: 'LinkedIn Lead Generation',
      platform: 'LinkedIn',
      status: 'paused',
      type: 'Social',
      budget: {
        daily: 150,
        total: 4500,
        spent: 2100,
        remaining: 2400
      },
      performance: {
        impressions: 34000,
        clicks: 890,
        conversions: 23,
        revenue: 4600,
        ctr: 2.6,
        cpc: 2.36,
        cpm: 6.18,
        roas: 2.2,
        conversionRate: 2.6
      },
      targeting: {
        audience: 'B2B Decision Makers',
        locations: ['United States', 'Canada', 'United Kingdom'],
        ageRange: '30-55',
        interests: ['B2B', 'Enterprise Software', 'Business Strategy']
      },
      schedule: {
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        timezone: 'America/New_York'
      },
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ];

  const campaignData = campaigns.length > 0 ? campaigns : mockCampaigns;

  // Filter campaigns
  const filteredCampaigns = campaignData.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.platform.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus;
    const matchesPlatform = filterPlatform === 'all' || campaign.platform === filterPlatform;
    
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  // Calculate summary metrics
  const summaryMetrics = filteredCampaigns.reduce((acc, campaign) => {
    return {
      totalSpent: acc.totalSpent + campaign.budget.spent,
      totalClicks: acc.totalClicks + campaign.performance.clicks,
      totalConversions: acc.totalConversions + campaign.performance.conversions,
      totalRevenue: acc.totalRevenue + campaign.performance.revenue,
      avgROAS: (acc.avgROAS + campaign.performance.roas) / 2
    };
  }, {
    totalSpent: 0,
    totalClicks: 0,
    totalConversions: 0,
    totalRevenue: 0,
    avgROAS: 0
  });

  const handleStatusToggle = (campaignId: string) => {
    const campaign = campaignData.find(c => c.id === campaignId);
    if (campaign && onCampaignUpdate) {
      const newStatus = campaign.status === 'active' ? 'paused' : 'active';
      onCampaignUpdate(campaignId, { status: newStatus });
    }
  };

  const handleEdit = (campaignId: string) => {
    console.log('Edit campaign:', campaignId);
    // Handle edit logic
  };

  const handleDelete = (campaignId: string) => {
    console.log('Delete campaign:', campaignId);
    // Handle delete logic
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Campaign Management</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and optimize your advertising campaigns across all platforms
          </p>
        </div>
        <Button onClick={onCampaignCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <PerformanceCard
          title="Total Spent"
          value={summaryMetrics.totalSpent}
          prefix="$"
          trend="up"
          trendValue="+12.5%"
        />
        <PerformanceCard
          title="Total Clicks"
          value={summaryMetrics.totalClicks}
          trend="up"
          trendValue="+8.3%"
        />
        <PerformanceCard
          title="Conversions"
          value={summaryMetrics.totalConversions}
          trend="up"
          trendValue="+15.2%"
        />
        <PerformanceCard
          title="Revenue"
          value={summaryMetrics.totalRevenue}
          prefix="$"
          trend="up"
          trendValue="+18.7%"
        />
        <PerformanceCard
          title="Avg ROAS"
          value={summaryMetrics.avgROAS.toFixed(1)}
          suffix="x"
          trend="up"
          trendValue="+0.3x"
        />
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Campaigns</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
              >
                <LineChart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="all">All Platforms</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Meta">Meta</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="TikTok">TikTok</option>
              <option value="Pinterest">Pinterest</option>
              <option value="Twitter">Twitter</option>
            </select>
          </div>

          {/* Campaign Table */}
          {viewMode === 'table' && (
            <div className="space-y-2">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400">
                <div className="col-span-3">Campaign</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2">Budget</div>
                <div className="col-span-2">Clicks / CTR</div>
                <div className="col-span-2">Conversions</div>
                <div className="col-span-1">ROAS</div>
                <div className="col-span-1">Actions</div>
              </div>

              {/* Campaign Rows */}
              <div className="space-y-1">
                {filteredCampaigns.map((campaign) => (
                  <CampaignRow
                    key={campaign.id}
                    campaign={campaign}
                    onStatusToggle={handleStatusToggle}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No campaigns found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}