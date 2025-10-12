'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowLeft,
  Settings,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Eye,
  Target,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Download
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface PlatformDetails {
  platform: string;
  displayName: string;
  status: 'connected' | 'error' | 'syncing' | 'disconnected';
  health: 'excellent' | 'good' | 'warning' | 'critical';
  connectionDate: string;
  lastSync: string;
  accountInfo: {
    accountId: string;
    accountName: string;
    currency: string;
    timezone: string;
  };
  metrics: {
    spend: number;
    impressions: number;
    clicks: number;
    ctr: number;
    cpc: number;
    conversions: number;
    conversionRate: number;
    campaigns: number;
    adSets: number;
    ads: number;
  };
}

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'ended';
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  objective: string;
  startDate: string;
  endDate?: string;
}

// =============================================================================
// PLATFORM DETAIL PAGE COMPONENT
// =============================================================================

export default function PlatformDetailPage({ params }: { params: { platform: string } }) {
  const [platformDetails, setPlatformDetails] = useState<PlatformDetails | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const router = useRouter();
  const platform = params.platform;

  useEffect(() => {
    loadPlatformDetails();
    loadCampaigns();
  }, [platform]);

  const loadPlatformDetails = async () => {
    try {
      // Mock data for demo - in production this would be a real API call
      const mockDetails: PlatformDetails = {
        platform,
        displayName: platform.charAt(0).toUpperCase() + platform.slice(1).replace('-', ' '),
        status: 'connected',
        health: 'excellent',
        connectionDate: '2024-10-01T10:00:00Z',
        lastSync: new Date(Date.now() - 300000).toISOString(),
        accountInfo: {
          accountId: `acc_${platform}_123456`,
          accountName: `Company ${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`,
          currency: 'USD',
          timezone: 'America/New_York'
        },
        metrics: {
          spend: 15420,
          impressions: 450000,
          clicks: 12300,
          ctr: 0.027,
          cpc: 1.25,
          conversions: 384,
          conversionRate: 0.031,
          campaigns: 8,
          adSets: 24,
          ads: 156
        }
      };
      
      setPlatformDetails(mockDetails);
      setError(null);
    } catch (error) {
      console.error('Error loading platform details:', error);
      setError('Failed to load platform details');
    }
  };

  const loadCampaigns = async () => {
    try {
      // Mock campaigns data
      const mockCampaigns: Campaign[] = [
        {
          id: 'camp_1',
          name: 'Holiday Sale Campaign',
          status: 'active',
          spend: 5420,
          impressions: 150000,
          clicks: 4200,
          ctr: 0.028,
          cpc: 1.29,
          conversions: 132,
          objective: 'Conversions',
          startDate: '2024-10-01',
          endDate: '2024-12-31'
        },
        {
          id: 'camp_2',
          name: 'Brand Awareness Q4',
          status: 'active',
          spend: 3850,
          impressions: 180000,
          clicks: 3600,
          ctr: 0.020,
          cpc: 1.07,
          conversions: 89,
          objective: 'Reach',
          startDate: '2024-10-15'
        },
        {
          id: 'camp_3',
          name: 'Product Launch Retargeting',
          status: 'paused',
          spend: 2150,
          impressions: 85000,
          clicks: 2100,
          ctr: 0.025,
          cpc: 1.02,
          conversions: 67,
          objective: 'Conversions',
          startDate: '2024-09-15',
          endDate: '2024-10-15'
        }
      ];
      
      setCampaigns(mockCampaigns);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    
    try {
      // Simulate sync operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Sync Complete',
        description: `${platformDetails?.displayName} data has been updated.`,
      });
      
      // Reload data
      await loadPlatformDetails();
      await loadCampaigns();
    } catch (error) {
      toast({
        title: 'Sync Failed',
        description: 'Failed to sync platform data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (confirm('Are you sure you want to disconnect this platform?')) {
      try {
        // Simulate disconnect operation
        toast({
          title: 'Platform Disconnected',
          description: `${platformDetails?.displayName} has been disconnected.`,
        });
        
        router.push('/dashboard');
      } catch (error) {
        toast({
          title: 'Disconnect Failed',
          description: 'Failed to disconnect platform. Please try again.',
          variant: 'destructive'
        });
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${(num * 100).toFixed(2)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!platformDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Platform not found or failed to load.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  {platform === 'facebook' && '📘'}
                  {platform === 'google-ads' && '🎯'}
                  {platform === 'linkedin' && '💼'}
                  {platform === 'tiktok' && '🎵'}
                  {platform === 'twitter' && '🐦'}
                  {platform === 'instagram' && '📸'}
                </div>
                {platformDetails.displayName}
                <Badge className="capitalize">
                  {platformDetails.status}
                </Badge>
              </h1>
              <p className="text-gray-600 mt-1">
                Connected since {new Date(platformDetails.connectionDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleSync}
              disabled={isSyncing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              Sync Now
            </Button>
            
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            
            <Button variant="destructive" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>
        </div>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Account ID</p>
                <p className="font-medium">{platformDetails.accountInfo.accountId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Name</p>
                <p className="font-medium">{platformDetails.accountInfo.accountName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Currency</p>
                <p className="font-medium">{platformDetails.accountInfo.currency}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Sync</p>
                <p className="font-medium">{new Date(platformDetails.lastSync).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spend</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(platformDetails.metrics.spend)}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Impressions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(platformDetails.metrics.impressions)}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-full">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clicks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(platformDetails.metrics.clicks)}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(platformDetails.metrics.conversions)}
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-full">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Data */}
        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Active Campaigns
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{campaign.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                            <span className="text-sm text-gray-600">{campaign.objective}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View in {platformDetails.displayName}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Spend</p>
                          <p className="font-medium">{formatCurrency(campaign.spend)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Impressions</p>
                          <p className="font-medium">{formatNumber(campaign.impressions)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Clicks</p>
                          <p className="font-medium">{formatNumber(campaign.clicks)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">CTR</p>
                          <p className="font-medium">{formatPercentage(campaign.ctr)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">CPC</p>
                          <p className="font-medium">${campaign.cpc.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Conversions</p>
                          <p className="font-medium">{campaign.conversions}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Performance charts and detailed analytics will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Sync Settings</h3>
                    <p className="text-gray-600 text-sm">Configure how often data is synchronized from this platform.</p>
                    
                    <div className="mt-4 space-y-2">
                      <label className="flex items-center">
                        <input type="radio" name="sync" value="hourly" className="mr-2" defaultChecked />
                        <span>Every hour</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="sync" value="daily" className="mr-2" />
                        <span>Daily</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="sync" value="manual" className="mr-2" />
                        <span>Manual only</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Data Retention</h3>
                    <p className="text-gray-600 text-sm">How long to keep historical data from this platform.</p>
                    
                    <select className="mt-2 px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="90">90 days</option>
                      <option value="180">6 months</option>
                      <option value="365" defaultValue>1 year</option>
                      <option value="unlimited">Unlimited</option>
                    </select>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button variant="destructive">
                      Disconnect Platform
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}