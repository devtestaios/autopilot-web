'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, Search, Filter, MoreVertical, Play, Pause, Square, 
  TrendingUp, TrendingDown, Target, DollarSign, Users, Eye,
  BarChart3, Settings, TestTube, Brain, Workflow, Image,
  Calendar, Clock, AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  objective: string;
  platforms: string[];
  budget: {
    total: number;
    spent: number;
    remaining: number;
    dailyLimit: number;
  };
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpa: number;
    roas: number;
  };
  schedule: {
    startDate: string;
    endDate?: string;
    daysRemaining?: number;
  };
  abTesting: {
    enabled: boolean;
    activeTests: number;
    winningVariant?: string;
  };
  aiOptimization: {
    enabled: boolean;
    lastOptimized?: string;
    improvements: number;
  };
  createdAt: string;
  lastModified: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data - in production, fetch from API
  useEffect(() => {
    const mockCampaigns: Campaign[] = [
      {
        id: 'camp_1',
        name: 'Fall Sale 2025 - Multi Platform',
        status: 'active',
        objective: 'conversions',
        platforms: ['facebook', 'google', 'linkedin'],
        budget: {
          total: 10000,
          spent: 6500,
          remaining: 3500,
          dailyLimit: 500
        },
        metrics: {
          impressions: 245000,
          clicks: 5890,
          conversions: 189,
          ctr: 2.4,
          cpa: 34.39,
          roas: 4.2
        },
        schedule: {
          startDate: '2025-10-01',
          endDate: '2025-10-31',
          daysRemaining: 20
        },
        abTesting: {
          enabled: true,
          activeTests: 2,
          winningVariant: 'Creative B (+18% CTR)'
        },
        aiOptimization: {
          enabled: true,
          lastOptimized: '2025-10-11T06:00:00Z',
          improvements: 23.5
        },
        createdAt: '2025-10-01T00:00:00Z',
        lastModified: '2025-10-11T06:00:00Z'
      },
      {
        id: 'camp_2',
        name: 'Brand Awareness Q4',
        status: 'active',
        objective: 'awareness',
        platforms: ['facebook', 'twitter'],
        budget: {
          total: 5000,
          spent: 1200,
          remaining: 3800,
          dailyLimit: 200
        },
        metrics: {
          impressions: 890000,
          clicks: 12400,
          conversions: 85,
          ctr: 1.4,
          cpa: 58.82,
          roas: 2.1
        },
        schedule: {
          startDate: '2025-10-05',
          endDate: '2025-12-31',
          daysRemaining: 81
        },
        abTesting: {
          enabled: false,
          activeTests: 0
        },
        aiOptimization: {
          enabled: true,
          lastOptimized: '2025-10-10T08:30:00Z',
          improvements: 12.8
        },
        createdAt: '2025-10-05T00:00:00Z',
        lastModified: '2025-10-10T08:30:00Z'
      },
      {
        id: 'camp_3',
        name: 'Product Launch - Beta Test',
        status: 'paused',
        objective: 'consideration',
        platforms: ['google', 'linkedin'],
        budget: {
          total: 3000,
          spent: 850,
          remaining: 2150,
          dailyLimit: 150
        },
        metrics: {
          impressions: 45000,
          clicks: 1580,
          conversions: 24,
          ctr: 3.5,
          cpa: 35.42,
          roas: 3.8
        },
        schedule: {
          startDate: '2025-09-15',
          endDate: '2025-11-15'
        },
        abTesting: {
          enabled: true,
          activeTests: 1
        },
        aiOptimization: {
          enabled: false,
          improvements: 0
        },
        createdAt: '2025-09-15T00:00:00Z',
        lastModified: '2025-10-08T14:20:00Z'
      }
    ];

    setCampaigns(mockCampaigns);
    setFilteredCampaigns(mockCampaigns);
    setLoading(false);
  }, []);

  // Filter campaigns based on search and filters
  useEffect(() => {
    let filtered = campaigns;

    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.objective.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === statusFilter);
    }

    if (platformFilter !== 'all') {
      filtered = filtered.filter(campaign => 
        campaign.platforms.includes(platformFilter)
      );
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, searchTerm, statusFilter, platformFilter]);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    
    const icons = {
      active: CheckCircle,
      paused: Pause,
      completed: CheckCircle,
      draft: Clock
    };

    const Icon = icons[status as keyof typeof icons];

    return (
      <Badge className={`${variants[status as keyof typeof variants]} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPlatformBadges = (platforms: string[]) => {
    const colors = {
      facebook: 'bg-blue-100 text-blue-800',
      google: 'bg-red-100 text-red-800',
      linkedin: 'bg-blue-100 text-blue-800',
      twitter: 'bg-sky-100 text-sky-800'
    };

    return platforms.map(platform => (
      <Badge key={platform} className={`${colors[platform as keyof typeof colors]} text-xs`}>
        {platform}
      </Badge>
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const campaignStats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    paused: campaigns.filter(c => c.status === 'paused').length,
    totalSpend: campaigns.reduce((sum, c) => sum + c.budget.spent, 0),
    totalConversions: campaigns.reduce((sum, c) => sum + c.metrics.conversions, 0),
    avgROAS: campaigns.reduce((sum, c) => sum + c.metrics.roas, 0) / campaigns.length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Manage your marketing campaigns across all platforms</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" asChild>
            <Link href="/campaigns/templates">
              <Target className="w-4 h-4 mr-2" />
              Templates
            </Link>
          </Button>
          <Button asChild>
            <Link href="/campaigns/create">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{campaignStats.total}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-green-600">{campaignStats.active}</p>
              </div>
              <Play className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spend</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(campaignStats.totalSpend)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg ROAS</p>
                <p className="text-2xl font-bold text-green-600">{campaignStats.avgROAS.toFixed(1)}x</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold truncate">{campaign.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {campaign.objective.charAt(0).toUpperCase() + campaign.objective.slice(1)} Campaign
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(campaign.status)}
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {getPlatformBadges(campaign.platforms)}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Budget Progress */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Budget Progress</span>
                  <span>{formatCurrency(campaign.budget.spent)} / {formatCurrency(campaign.budget.total)}</span>
                </div>
                <Progress 
                  value={(campaign.budget.spent / campaign.budget.total) * 100} 
                  className="h-2"
                />
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Impressions</p>
                  <p className="font-semibold">{formatNumber(campaign.metrics.impressions)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Clicks</p>
                  <p className="font-semibold">{formatNumber(campaign.metrics.clicks)}</p>
                </div>
                <div>
                  <p className="text-gray-600">CTR</p>
                  <p className="font-semibold">{campaign.metrics.ctr}%</p>
                </div>
                <div>
                  <p className="text-gray-600">ROAS</p>
                  <p className="font-semibold text-green-600">{campaign.metrics.roas}x</p>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {campaign.abTesting.enabled && (
                  <Badge variant="outline" className="text-xs">
                    <TestTube className="w-3 h-3 mr-1" />
                    A/B Testing
                  </Badge>
                )}
                {campaign.aiOptimization.enabled && (
                  <Badge variant="outline" className="text-xs">
                    <Brain className="w-3 h-3 mr-1" />
                    AI Optimized
                  </Badge>
                )}
              </div>

              {/* Schedule */}
              {campaign.schedule.daysRemaining && (
                <div className="text-xs text-gray-600">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {campaign.schedule.daysRemaining} days remaining
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/campaigns/${campaign.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/campaigns/${campaign.id}/edit`}>
                    <Settings className="w-4 h-4" />
                  </Link>
                </Button>
                {campaign.status === 'active' ? (
                  <Button variant="outline" size="sm">
                    <Pause className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button variant="outline" size="sm">
                    <Play className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' || platformFilter !== 'all'
                ? 'Try adjusting your filters to see more campaigns.'
                : 'Get started by creating your first campaign.'}
            </p>
            <Button asChild>
              <Link href="/campaigns/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}