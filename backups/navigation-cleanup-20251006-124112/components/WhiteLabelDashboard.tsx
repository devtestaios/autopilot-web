'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { 
  Palette, 
  Store, 
  Code,
  Globe,
  DollarSign,
  Users,
  Star,
  Package,
  Building,
  Settings,
  Upload,
  Download,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  AlertTriangle,
  Zap,
  Crown,
  Shield,
  Sparkles,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Link,
  ExternalLink,
  RefreshCw,
  Filter,
  Search,
  MoreHorizontal,
  Plus,
  Minus,
  Edit,
  Trash2,
  Share,
  HeartHandshake,
  Handshake,
  Target,
  Briefcase,
  FileText,
  CreditCard,
  Percent,
  Calculator,
  ChartLine,
  Database,
  AppWindow,
  Webhook,
  Key,
  Lock,
  Unlock
} from 'lucide-react';

interface WhiteLabelDashboardProps {
  className?: string;
}

// Mock data for white-label and partner ecosystem
const mockWhiteLabelData = {
  branding: {
    id: 'brand_001',
    organizationName: 'Marketing Dynamics Inc',
    logoUrl: '/api/placeholder/200/80',
    faviconUrl: '/api/placeholder/32/32',
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    accentColor: '#3b82f6',
    customDomain: 'platform.marketingdynamics.com',
    domainStatus: 'active',
    sslEnabled: true,
    customization: {
      headerEnabled: true,
      footerEnabled: true,
      poweredByHidden: true,
      customCSS: '.dashboard { border-radius: 12px; }',
      customJS: 'console.log("Custom analytics tracking");'
    },
    emailTemplate: {
      headerImage: '/api/placeholder/600/150',
      footerText: '© 2024 Marketing Dynamics Inc. All rights reserved.',
      brandColors: true
    }
  },
  partners: [
    {
      id: 'partner_001',
      name: 'AdTech Solutions',
      type: 'technology',
      status: 'active',
      tier: 'platinum',
      joinedDate: new Date('2024-01-15'),
      revenue: 125000,
      revenueShare: 25,
      clients: 47,
      apiCallsMonth: 2400000,
      description: 'Advanced advertising technology and automation platform',
      logoUrl: '/api/placeholder/120/60',
      website: 'https://adtechsolutions.com',
      contactEmail: 'partnerships@adtechsolutions.com',
      integrations: ['Google Ads', 'Meta Ads', 'LinkedIn Ads', 'Analytics API'],
      features: ['Real-time bidding', 'Advanced analytics', 'Custom reporting'],
      rating: 4.8,
      reviews: 156
    },
    {
      id: 'partner_002',
      name: 'CreativeFlow Agency',
      type: 'agency',
      status: 'active',
      tier: 'gold',
      joinedDate: new Date('2024-02-20'),
      revenue: 85000,
      revenueShare: 20,
      clients: 32,
      apiCallsMonth: 1800000,
      description: 'Full-service digital marketing agency specializing in performance marketing',
      logoUrl: '/api/placeholder/120/60',
      website: 'https://creativeflow.agency',
      contactEmail: 'hello@creativeflow.agency',
      integrations: ['Campaign Management', 'Analytics', 'Reporting'],
      features: ['White-label reports', 'Client management', 'Performance dashboards'],
      rating: 4.6,
      reviews: 89
    },
    {
      id: 'partner_003',
      name: 'DataSync Pro',
      type: 'technology',
      status: 'pending',
      tier: 'silver',
      joinedDate: new Date('2024-03-10'),
      revenue: 45000,
      revenueShare: 15,
      clients: 18,
      apiCallsMonth: 950000,
      description: 'Data integration and synchronization platform for marketing teams',
      logoUrl: '/api/placeholder/120/60',
      website: 'https://datasyncpro.com',
      contactEmail: 'partners@datasyncpro.com',
      integrations: ['Data API', 'Webhook Integration', 'Custom Connectors'],
      features: ['Real-time sync', 'Data transformation', 'Custom schemas'],
      rating: 4.3,
      reviews: 42
    }
  ],
  marketplace: {
    totalApps: 47,
    activeInstalls: 15420,
    monthlyRevenue: 255000,
    topCategories: [
      { name: 'Analytics & Reporting', count: 12, growth: 15.6 },
      { name: 'Campaign Management', count: 8, growth: 22.3 },
      { name: 'Creative Tools', count: 7, growth: 18.9 },
      { name: 'Data Integration', count: 6, growth: 12.1 },
      { name: 'Automation', count: 5, growth: 28.7 },
      { name: 'Customer Support', count: 4, growth: 8.4 },
      { name: 'Billing & Invoicing', count: 3, growth: 6.2 },
      { name: 'Security & Compliance', count: 2, growth: 34.5 }
    ],
    featuredApps: [
      {
        id: 'app_001',
        name: 'Advanced Analytics Pro',
        developer: 'DataViz Inc',
        category: 'Analytics & Reporting',
        price: 99,
        installs: 2340,
        rating: 4.8,
        description: 'Professional analytics with custom dashboards and advanced reporting',
        featured: true
      },
      {
        id: 'app_002', 
        name: 'Creative Studio',
        developer: 'CreativeFlow Agency',
        category: 'Creative Tools',
        price: 149,
        installs: 1890,
        rating: 4.6,
        description: 'Complete creative suite for ad design and video production',
        featured: true
      },
      {
        id: 'app_003',
        name: 'AutoBid AI',
        developer: 'AdTech Solutions',
        category: 'Automation',
        price: 199,
        installs: 1560,
        rating: 4.9,
        description: 'AI-powered bidding optimization with machine learning algorithms',
        featured: true
      }
    ]
  },
  revenueSharing: {
    totalRevenue: 1250000,
    partnerRevenue: 312500,
    platformRevenue: 937500,
    monthlyGrowth: 18.5,
    partnerDistribution: [
      { tier: 'Platinum', partners: 5, revenue: 156250, percentage: 50 },
      { tier: 'Gold', partners: 12, revenue: 93750, percentage: 30 },
      { tier: 'Silver', partners: 23, revenue: 62500, percentage: 20 }
    ],
    recentPayouts: [
      {
        partnerId: 'partner_001',
        partnerName: 'AdTech Solutions',
        amount: 31250,
        period: 'March 2024',
        status: 'paid',
        date: new Date('2024-04-01')
      },
      {
        partnerId: 'partner_002',
        partnerName: 'CreativeFlow Agency',
        amount: 17000,
        period: 'March 2024',
        status: 'pending',
        date: new Date('2024-04-01')
      },
      {
        partnerId: 'partner_003',
        partnerName: 'DataSync Pro',
        amount: 6750,
        period: 'March 2024',
        status: 'processing',
        date: new Date('2024-04-01')
      }
    ]
  },
  apiManagement: {
    totalApiKeys: 156,
    activeKeys: 142,
    monthlyRequests: 12500000,
    endpoints: [
      { name: 'Campaigns API', calls: 4200000, status: 'healthy' },
      { name: 'Analytics API', calls: 3800000, status: 'healthy' },
      { name: 'Users API', calls: 2100000, status: 'healthy' },
      { name: 'Billing API', calls: 1200000, status: 'healthy' },
      { name: 'Webhooks API', calls: 800000, status: 'healthy' },
      { name: 'Reports API', calls: 400000, status: 'degraded' }
    ],
    rateLimit: {
      tier1: { requests: 1000, window: 'hour' },
      tier2: { requests: 5000, window: 'hour' },
      tier3: { requests: 25000, window: 'hour' },
      enterprise: { requests: 100000, window: 'hour' }
    }
  }
};

export default function WhiteLabelDashboard({ className }: WhiteLabelDashboardProps) {
  const [selectedPartner, setSelectedPartner] = useState(mockWhiteLabelData.partners[0]);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number, decimals = 1) => {
    return `${value.toFixed(decimals)}%`;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'text-purple-600 bg-purple-100';
      case 'gold':
        return 'text-yellow-600 bg-yellow-100';
      case 'silver':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'suspended':
        return 'text-red-600 bg-red-100';
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const refreshData = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Palette className="h-8 w-8 text-purple-600" />
            White-Label & Partner Ecosystem
          </h1>
          <p className="text-muted-foreground mt-1">
            Customize branding, manage partners, and build your marketplace ecosystem
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Partners</p>
                <p className="text-2xl font-bold">{mockWhiteLabelData.partners.filter(p => p.status === 'active').length}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600">97 total clients</span>
                </div>
              </div>
              <Handshake className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(mockWhiteLabelData.marketplace.monthlyRevenue)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+{formatPercentage(mockWhiteLabelData.revenueSharing.monthlyGrowth)}</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Marketplace Apps</p>
                <p className="text-2xl font-bold">{mockWhiteLabelData.marketplace.totalApps}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Package className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-purple-600">{mockWhiteLabelData.marketplace.activeInstalls.toLocaleString()} installs</span>
                </div>
              </div>
              <Store className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">API Requests</p>
                <p className="text-2xl font-bold">{(mockWhiteLabelData.apiManagement.monthlyRequests / 1000000).toFixed(1)}M</p>
                <div className="flex items-center gap-1 mt-1">
                  <AppWindow className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-orange-600">{mockWhiteLabelData.apiManagement.activeKeys} active keys</span>
                </div>
              </div>
              <Code className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="api">API Management</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Brand Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Brand Configuration
                </CardTitle>
                <CardDescription>Customize your platform's visual identity and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Organization Name</label>
                  <Input 
                    value={mockWhiteLabelData.branding.organizationName}
                    className="mt-1"
                    readOnly
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Primary Color</label>
                    <div className="flex items-center gap-2 mt-1">
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: mockWhiteLabelData.branding.primaryColor }}
                      />
                      <Input value={mockWhiteLabelData.branding.primaryColor} className="text-xs" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Secondary Color</label>
                    <div className="flex items-center gap-2 mt-1">
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: mockWhiteLabelData.branding.secondaryColor }}
                      />
                      <Input value={mockWhiteLabelData.branding.secondaryColor} className="text-xs" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Accent Color</label>
                    <div className="flex items-center gap-2 mt-1">
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: mockWhiteLabelData.branding.accentColor }}
                      />
                      <Input value={mockWhiteLabelData.branding.accentColor} className="text-xs" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Custom Domain</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={mockWhiteLabelData.branding.customDomain} />
                    <Badge className={getStatusColor(mockWhiteLabelData.branding.domainStatus)}>
                      {mockWhiteLabelData.branding.domainStatus}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">SSL Enabled</label>
                      <p className="text-xs text-muted-foreground">Secure HTTPS connection</p>
                    </div>
                    <Switch 
                      checked={mockWhiteLabelData.branding.sslEnabled}
                      onCheckedChange={() => {}}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Hide "Powered By"</label>
                      <p className="text-xs text-muted-foreground">Remove platform branding</p>
                    </div>
                    <Switch 
                      checked={mockWhiteLabelData.branding.customization.poweredByHidden}
                      onCheckedChange={() => {}}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Custom Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Custom Code & Assets
                </CardTitle>
                <CardDescription>Add custom CSS, JavaScript, and email templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Custom CSS</label>
                  <textarea 
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                    rows={4}
                    value={mockWhiteLabelData.branding.customization.customCSS}
                    readOnly
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Custom JavaScript</label>
                  <textarea 
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                    rows={3}
                    value={mockWhiteLabelData.branding.customization.customJS}
                    readOnly
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Email Footer Text</label>
                  <Input 
                    value={mockWhiteLabelData.branding.emailTemplate.footerText}
                    className="mt-1"
                    readOnly
                  />
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Assets
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Email Templates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="partners" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Input placeholder="Search partners..." className="w-64" />
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Partner List */}
            <div className="lg:col-span-2 space-y-4">
              {mockWhiteLabelData.partners.map((partner) => (
                <div
                  key={partner.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedPartner(partner)}
                >
                  <Card className={`transition-all ${selectedPartner.id === partner.id ? 'ring-2 ring-blue-500' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Building className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">{partner.name}</h4>
                            <p className="text-sm text-muted-foreground capitalize">{partner.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getTierColor(partner.tier)}>
                            {partner.tier}
                          </Badge>
                          <Badge className={getStatusColor(partner.status)}>
                            {partner.status}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">{partner.description}</p>

                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold">{formatCurrency(partner.revenue)}</p>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{partner.clients}</p>
                          <p className="text-xs text-muted-foreground">Clients</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{formatPercentage(partner.revenueShare)}</p>
                          <p className="text-xs text-muted-foreground">Rev Share</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{partner.rating}</p>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Partner Details */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Partner Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Building className="h-8 w-8 text-gray-600" />
                    </div>
                    <h3 className="font-semibold text-lg">{selectedPartner.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{selectedPartner.type}</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Tier</label>
                      <div className="mt-1">
                        <Badge className={getTierColor(selectedPartner.tier)}>
                          {selectedPartner.tier}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Monthly Revenue</label>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(selectedPartner.revenue)}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Revenue Share</label>
                      <p className="text-lg font-bold">{formatPercentage(selectedPartner.revenueShare)}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium">API Calls/Month</label>
                      <p className="text-sm text-muted-foreground">{selectedPartner.apiCallsMonth.toLocaleString()}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Rating</label>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{selectedPartner.rating}</span>
                        <span className="text-sm text-muted-foreground">({selectedPartner.reviews} reviews)</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Integrations</label>
                      <div className="mt-1 space-y-1">
                        {selectedPartner.integrations.map((integration, index) => (
                          <Badge key={index} variant="outline" className="mr-1 mb-1">
                            {integration}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Marketplace Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Marketplace Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{mockWhiteLabelData.marketplace.totalApps}</p>
                    <p className="text-sm text-muted-foreground">Total Apps</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{mockWhiteLabelData.marketplace.activeInstalls.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Active Installs</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Categories</h4>
                  <div className="space-y-2">
                    {mockWhiteLabelData.marketplace.topCategories.slice(0, 5).map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{category.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{category.count}</span>
                          <span className="text-xs text-green-600">+{formatPercentage(category.growth)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Featured Apps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Featured Apps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockWhiteLabelData.marketplace.featuredApps.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{app.name}</h4>
                        <p className="text-sm text-muted-foreground">{app.developer}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{app.category}</Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs">{app.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(app.price)}</p>
                        <p className="text-xs text-muted-foreground">{app.installs} installs</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">{formatCurrency(mockWhiteLabelData.revenueSharing.totalRevenue)}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Handshake className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">{formatCurrency(mockWhiteLabelData.revenueSharing.partnerRevenue)}</p>
                <p className="text-sm text-muted-foreground">Partner Revenue</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold">+{formatPercentage(mockWhiteLabelData.revenueSharing.monthlyGrowth)}</p>
                <p className="text-sm text-muted-foreground">Monthly Growth</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Revenue Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockWhiteLabelData.revenueSharing.partnerDistribution.map((tier, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{tier.tier} Partners ({tier.partners})</span>
                        <span className="text-sm font-bold">{formatCurrency(tier.revenue)}</span>
                      </div>
                      <Progress value={tier.percentage} className="h-2" />
                      <div className="text-xs text-muted-foreground text-right">
                        {formatPercentage(tier.percentage)} of partner revenue
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Payouts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Recent Payouts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockWhiteLabelData.revenueSharing.recentPayouts.map((payout, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{payout.partnerName}</h4>
                        <p className="text-sm text-muted-foreground">{payout.period}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(payout.amount)}</p>
                        <Badge className={getStatusColor(payout.status)}>
                          {payout.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* API Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AppWindow className="h-5 w-5" />
                  API Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{mockWhiteLabelData.apiManagement.totalApiKeys}</p>
                    <p className="text-sm text-muted-foreground">Total API Keys</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{(mockWhiteLabelData.apiManagement.monthlyRequests / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-muted-foreground">Monthly Requests</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Endpoint Usage</h4>
                  <div className="space-y-2">
                    {mockWhiteLabelData.apiManagement.endpoints.map((endpoint, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{endpoint.name}</span>
                          <Badge className={getStatusColor(endpoint.status)}>
                            {endpoint.status}
                          </Badge>
                        </div>
                        <span className="text-sm font-medium">{(endpoint.calls / 1000000).toFixed(1)}M</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rate Limits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Rate Limits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(mockWhiteLabelData.apiManagement.rateLimit).map(([tier, limit], index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium capitalize">{tier}</h4>
                        <p className="text-sm text-muted-foreground">API Tier</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{limit.requests.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">per {limit.window}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Deployment Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Deployment Options
                </CardTitle>
                <CardDescription>Choose how to deploy your white-labeled platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Subdomain Deployment</h4>
                      <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Deploy on your-brand.autopilot.com with full customization
                    </p>
                    <Button size="sm">
                      <Zap className="h-4 w-4 mr-2" />
                      Quick Setup
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Custom Domain</h4>
                      <Badge variant="outline">Enterprise</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Full custom domain with SSL certificate management
                    </p>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">On-Premise</h4>
                      <Badge variant="outline">Contact Sales</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Deploy within your own infrastructure
                    </p>
                    <Button size="sm" variant="outline">
                      <Building className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Deployment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Current Deployment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge className="bg-green-100 text-green-800">Live</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Domain</span>
                    <span className="text-sm text-muted-foreground">{mockWhiteLabelData.branding.customDomain}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">SSL Certificate</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">CDN</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Deploy</span>
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex gap-2">
                    <Button size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Site
                    </Button>
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Redeploy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}