'use client';'use client';



import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';import { Badge } from '@/components/ui/badge';

import { Progress } from '@/components/ui/progress';import { Progress } from '@/components/ui/progress';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Alert, AlertDescription } from '@/components/ui/alert';import { Alert, AlertDescription } from '@/components/ui/alert';

import { useToast } from '@/components/ui/use-toast';import { useToast } from '@/components/ui/use-toast';

import { import { 

  BarChart3,  BarChart3,

  TrendingUp,  TrendingUp,

  DollarSign,  DollarSign,

  Users,  Users,

  Zap,  Zap,

  RefreshCw,  RefreshCw,

  Settings,  Settings,

  Eye,  Eye,

  AlertTriangle,  AlertTriangle,

  CheckCircle,  CheckCircle,

  Clock,  Clock,

  Wifi,  Wifi,

  WifiOff,  WifiOff,

  Plus,  Plus,

  Filter,  Filter,

  Download,  Download,

  Calendar,  Calendar,

  Target,  Target,

  Activity,  Activity,

  Database,  Database,

  Sync  Sync

} from 'lucide-react';} from 'lucide-react';

import { useRouter } from 'next/navigation';import { useRouter } from 'next/navigation';



// =============================================================================// =============================================================================

// TYPES// TYPES

// =============================================================================// =============================================================================



interface DashboardMetrics {interface DashboardMetrics {

  totalConnections: number;  totalConnections: number;

  activeConnections: number;  activeConnections: number;

  totalSpend: number;  totalSpend: number;

  totalImpressions: number;  totalImpressions: number;

  totalClicks: number;  totalClicks: number;

  avgCTR: number;  avgCTR: number;

  avgCPC: number;  avgCPC: number;

  lastSyncTime: string;  lastSyncTime: string;

}}



interface PlatformMetrics {interface PlatformMetrics {

  platform: string;  platform: string;

  status: 'connected' | 'error' | 'syncing' | 'disconnected';  status: 'connected' | 'error' | 'syncing' | 'disconnected';

  spend: number;  spend: number;

  impressions: number;  impressions: number;

  clicks: number;  clicks: number;

  ctr: number;  ctr: number;

  cpc: number;  cpc: number;

  lastSync: string;  lastSync: string;

  campaigns: number;  campaigns: number;

  health: 'excellent' | 'good' | 'warning' | 'critical';  health: 'excellent' | 'good' | 'warning' | 'critical';

}}



interface SyncActivity {interface SyncActivity {

  id: string;  id: string;

  platform: string;  platform: string;

  type: 'full_sync' | 'incremental' | 'error_recovery';  type: 'full_sync' | 'incremental' | 'error_recovery';

  status: 'success' | 'error' | 'in_progress';  status: 'success' | 'error' | 'in_progress';

  timestamp: string;  timestamp: string;

  recordsProcessed: number;  recordsProcessed: number;

  duration: number;  duration: number;

  message?: string;  message?: string;

}}



// =============================================================================// =============================================================================

// DASHBOARD COMPONENT// DASHBOARD COMPONENT

// =============================================================================// =============================================================================



export default function PlatformDashboard() {export default function PlatformDashboard() {

  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);

  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics[]>([]);  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics[]>([]);

  const [syncActivity, setSyncActivity] = useState<SyncActivity[]>([]);  const [syncActivity, setSyncActivity] = useState<SyncActivity[]>([]);

  const [isLoading, setIsLoading] = useState(true);  const [isLoading, setIsLoading] = useState(true);

  const [isSyncing, setIsSyncing] = useState(false);  const [isSyncing, setIsSyncing] = useState(false);

  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  const [error, setError] = useState<string | null>(null);  const [error, setError] = useState<string | null>(null);

    

  const { toast } = useToast();  const { toast } = useToast();

  const router = useRouter();  const router = useRouter();



  // Load dashboard data  // Load dashboard data

  useEffect(() => {  useEffect(() => {

    loadDashboardData();    loadDashboardData();

        

    // Set up real-time updates    // Set up real-time updates

    const interval = setInterval(loadDashboardData, 60000); // Every minute    const interval = setInterval(loadDashboardData, 60000); // Every minute

    return () => clearInterval(interval);    return () => clearInterval(interval);

  }, [selectedTimeRange]);  }, [selectedTimeRange]);



  const loadDashboardData = async () => {  const loadDashboardData = async () => {

    try {    try {

      setIsLoading(true);      setIsLoading(true);

            

      const [metricsRes, platformsRes, activityRes] = await Promise.all([      const [metricsRes, platformsRes, activityRes] = await Promise.all([

        fetch(`/api/dashboard/metrics?timeRange=${selectedTimeRange}`),        fetch(`/api/dashboard/metrics?timeRange=${selectedTimeRange}`),

        fetch(`/api/dashboard/platforms?timeRange=${selectedTimeRange}`),        fetch(`/api/dashboard/platforms?timeRange=${selectedTimeRange}`),

        fetch('/api/dashboard/sync-activity')        fetch('/api/dashboard/sync-activity')

      ]);      ]);



      if (metricsRes.ok) {      if (metricsRes.ok) {

        const metricsData = await metricsRes.json();        const metricsData = await metricsRes.json();

        setDashboardMetrics(metricsData.metrics);        setDashboardMetrics(metricsData.metrics);

      }      }



      if (platformsRes.ok) {      if (platformsRes.ok) {

        const platformsData = await platformsRes.json();        const platformsData = await platformsRes.json();

        setPlatformMetrics(platformsData.platforms);        setPlatformMetrics(platformsData.platforms);

      }      }



      if (activityRes.ok) {      if (activityRes.ok) {

        const activityData = await activityRes.json();        const activityData = await activityRes.json();

        setSyncActivity(activityData.activities);        setSyncActivity(activityData.activities);

      }      }



      setError(null);      setError(null);

    } catch (error) {    } catch (error) {

      console.error('Error loading dashboard data:', error);      console.error('Error loading dashboard data:', error);

      setError('Failed to load dashboard data');      setError('Failed to load dashboard data');

    } finally {    } finally {

      setIsLoading(false);      setIsLoading(false);

    }    }

  };  };



  const handleSyncAll = async () => {  const handleSyncAll = async () => {

    setIsSyncing(true);    setIsSyncing(true);

        

    try {    try {

      const response = await fetch('/api/platforms/sync-all', {      const response = await fetch('/api/platforms/sync-all', {

        method: 'POST'        method: 'POST'

      });      });



      if (response.ok) {      if (response.ok) {

        toast({        toast({

          title: 'Sync Started',          title: 'Sync Started',

          description: 'All platforms are being synced. This may take a few minutes.',          description: 'All platforms are being synced. This may take a few minutes.',

        });        });

                

        // Refresh data after a short delay        // Refresh data after a short delay

        setTimeout(loadDashboardData, 2000);        setTimeout(loadDashboardData, 2000);

      } else {      } else {

        throw new Error('Failed to start sync');        throw new Error('Failed to start sync');

      }      }

    } catch (error) {    } catch (error) {

      toast({      toast({

        title: 'Sync Failed',        title: 'Sync Failed',

        description: 'Failed to start platform sync. Please try again.',        description: 'Failed to start platform sync. Please try again.',

        variant: 'destructive'        variant: 'destructive'

      });      });

    } finally {    } finally {

      setIsSyncing(false);      setIsSyncing(false);

    }    }

  };  };



  const handlePlatformAction = (platform: string, action: string) => {  const handlePlatformAction = (platform: string, action: string) => {

    switch (action) {    switch (action) {

      case 'view':      case 'view':

        router.push(`/platforms/${platform}`);        router.push(`/platforms/${platform}`);

        break;        break;

      case 'configure':      case 'configure':

        router.push(`/platforms/${platform}/settings`);        router.push(`/platforms/${platform}/settings`);

        break;        break;

      case 'disconnect':      case 'disconnect':

        // Handle disconnect logic        // Handle disconnect logic

        break;        break;

    }    }

  };  };



  const getHealthColor = (health: string) => {  const getHealthColor = (health: string) => {

    switch (health) {    switch (health) {

      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';

      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';

      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';

      case 'critical': return 'text-red-600 bg-red-50 border-red-200';      case 'critical': return 'text-red-600 bg-red-50 border-red-200';

      default: return 'text-gray-600 bg-gray-50 border-gray-200';      default: return 'text-gray-600 bg-gray-50 border-gray-200';

    }    }

  };  };



  const getStatusIcon = (status: string) => {  const getStatusIcon = (status: string) => {

    switch (status) {    switch (status) {

      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />;      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />;

      case 'syncing': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;      case 'syncing': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;

      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;

      case 'disconnected': return <WifiOff className="h-4 w-4 text-gray-400" />;      case 'disconnected': return <WifiOff className="h-4 w-4 text-gray-400" />;

      default: return <Clock className="h-4 w-4 text-gray-400" />;      default: return <Clock className="h-4 w-4 text-gray-400" />;

    }    }

  };  };



  const formatCurrency = (amount: number) => {  const formatCurrency = (amount: number) => {

    return new Intl.NumberFormat('en-US', {    return new Intl.NumberFormat('en-US', {

      style: 'currency',      style: 'currency',

      currency: 'USD',      currency: 'USD',

      minimumFractionDigits: 0,      minimumFractionDigits: 0,

      maximumFractionDigits: 0,      maximumFractionDigits: 0,

    }).format(amount);    }).format(amount);

  };  };



  const formatNumber = (num: number) => {  const formatNumber = (num: number) => {

    return new Intl.NumberFormat('en-US', {    return new Intl.NumberFormat('en-US', {

      minimumFractionDigits: 0,      minimumFractionDigits: 0,

      maximumFractionDigits: 1,      maximumFractionDigits: 1,

    }).format(num);    }).format(num);

  };  };



  const formatPercentage = (num: number) => {  const formatPercentage = (num: number) => {

    return `${(num * 100).toFixed(2)}%`;    return `${(num * 100).toFixed(2)}%`;

  };  };



  if (isLoading && !dashboardMetrics) {  if (isLoading && !dashboardMetrics) {

    return (    return (

      <div className="min-h-screen bg-gray-50 p-6">      <div className="min-h-screen bg-gray-50 p-6">

        <div className="max-w-7xl mx-auto">        <div className="max-w-7xl mx-auto">

          <div className="animate-pulse space-y-6">          <div className="animate-pulse space-y-6">

            <div className="h-8 bg-gray-200 rounded w-1/3"></div>            <div className="h-8 bg-gray-200 rounded w-1/3"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

              {[...Array(4)].map((_, i) => (              {[...Array(4)].map((_, i) => (

                <div key={i} className="h-32 bg-gray-200 rounded"></div>                <div key={i} className="h-32 bg-gray-200 rounded"></div>

              ))}              ))}

            </div>            </div>

            <div className="h-96 bg-gray-200 rounded"></div>            <div className="h-96 bg-gray-200 rounded"></div>

          </div>          </div>

        </div>        </div>

      </div>      </div>

    );    );

  }  }



  return (  return (

    <div className="min-h-screen bg-gray-50">    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto p-6 space-y-6">      <div className="max-w-7xl mx-auto p-6 space-y-6">

        {/* Header */}        {/* Header */}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

          <div>          <div>

            <h1 className="text-3xl font-bold text-gray-900">Platform Dashboard</h1>            <h1 className="text-3xl font-bold text-gray-900">Platform Dashboard</h1>

            <p className="text-gray-600 mt-1">            <p className="text-gray-600 mt-1">

              Monitor and manage your marketing platform connections              Monitor and manage your marketing platform connections

            </p>            </p>

          </div>          </div>

                    

          <div className="flex items-center gap-3">          <div className="flex items-center gap-3">

            <select            <select

              value={selectedTimeRange}              value={selectedTimeRange}

              onChange={(e) => setSelectedTimeRange(e.target.value)}              onChange={(e) => setSelectedTimeRange(e.target.value)}

              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"

            >            >

              <option value="24h">Last 24 Hours</option>              <option value="24h">Last 24 Hours</option>

              <option value="7d">Last 7 Days</option>              <option value="7d">Last 7 Days</option>

              <option value="30d">Last 30 Days</option>              <option value="30d">Last 30 Days</option>

              <option value="90d">Last 90 Days</option>              <option value="90d">Last 90 Days</option>

            </select>            </select>

                        

            <Button            <Button

              onClick={handleSyncAll}              onClick={handleSyncAll}

              disabled={isSyncing}              disabled={isSyncing}

              className="flex items-center gap-2"              className="flex items-center gap-2"

            >            >

              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />

              Sync All              Sync All

            </Button>            </Button>

                        

            <Button            <Button

              onClick={() => router.push('/platforms/setup')}              onClick={() => router.push('/platforms/setup')}

              className="flex items-center gap-2"              className="flex items-center gap-2"

            >            >

              <Plus className="h-4 w-4" />              <Plus className="h-4 w-4" />

              Add Platform              Add Platform

            </Button>            </Button>

          </div>          </div>

        </div>        </div>



        {/* Error Alert */}        {/* Error Alert */}

        {error && (        {error && (

          <Alert className="border-red-200 bg-red-50">          <Alert className="border-red-200 bg-red-50">

            <AlertTriangle className="h-4 w-4" />            <AlertTriangle className="h-4 w-4" />

            <AlertDescription>{error}</AlertDescription>            <AlertDescription>{error}</AlertDescription>

          </Alert>          </Alert>

        )}        )}



        {/* Overview Metrics */}        {/* Overview Metrics */}

        {dashboardMetrics && (        {dashboardMetrics && (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <Card>            <Card>

              <CardContent className="p-6">              <CardContent className="p-6">

                <div className="flex items-center justify-between">                <div className="flex items-center justify-between">

                  <div>                  <div>

                    <p className="text-sm font-medium text-gray-600">Total Spend</p>                    <p className="text-sm font-medium text-gray-600">Total Spend</p>

                    <p className="text-2xl font-bold text-gray-900">                    <p className="text-2xl font-bold text-gray-900">

                      {formatCurrency(dashboardMetrics.totalSpend)}                      {formatCurrency(dashboardMetrics.totalSpend)}

                    </p>                    </p>

                  </div>                  </div>

                  <div className="p-3 bg-blue-50 rounded-full">                  <div className="p-3 bg-blue-50 rounded-full">

                    <DollarSign className="h-6 w-6 text-blue-600" />                    <DollarSign className="h-6 w-6 text-blue-600" />

                  </div>                  </div>

                </div>                </div>

                <div className="mt-2 flex items-center text-sm">                <div className="mt-2 flex items-center text-sm">

                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />

                  <span className="text-green-600">+12.5%</span>                  <span className="text-green-600">+12.5%</span>

                  <span className="text-gray-500 ml-1">from last period</span>                  <span className="text-gray-500 ml-1">from last period</span>

                </div>                </div>

              </CardContent>              </CardContent>

            </Card>            </Card>



            <Card>            <Card>

              <CardContent className="p-6">              <CardContent className="p-6">

                <div className="flex items-center justify-between">                <div className="flex items-center justify-between">

                  <div>                  <div>

                    <p className="text-sm font-medium text-gray-600">Impressions</p>                    <p className="text-sm font-medium text-gray-600">Impressions</p>

                    <p className="text-2xl font-bold text-gray-900">                    <p className="text-2xl font-bold text-gray-900">

                      {formatNumber(dashboardMetrics.totalImpressions)}                      {formatNumber(dashboardMetrics.totalImpressions)}

                    </p>                    </p>

                  </div>                  </div>

                  <div className="p-3 bg-purple-50 rounded-full">                  <div className="p-3 bg-purple-50 rounded-full">

                    <Eye className="h-6 w-6 text-purple-600" />                    <Eye className="h-6 w-6 text-purple-600" />

                  </div>                  </div>

                </div>                </div>

                <div className="mt-2 flex items-center text-sm">                <div className="mt-2 flex items-center text-sm">

                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />

                  <span className="text-green-600">+8.2%</span>                  <span className="text-green-600">+8.2%</span>

                  <span className="text-gray-500 ml-1">from last period</span>                  <span className="text-gray-500 ml-1">from last period</span>

                </div>                </div>

              </CardContent>              </CardContent>

            </Card>            </Card>



            <Card>            <Card>

              <CardContent className="p-6">              <CardContent className="p-6">

                <div className="flex items-center justify-between">                <div className="flex items-center justify-between">

                  <div>                  <div>

                    <p className="text-sm font-medium text-gray-600">Clicks</p>                    <p className="text-sm font-medium text-gray-600">Clicks</p>

                    <p className="text-2xl font-bold text-gray-900">                    <p className="text-2xl font-bold text-gray-900">

                      {formatNumber(dashboardMetrics.totalClicks)}                      {formatNumber(dashboardMetrics.totalClicks)}

                    </p>                    </p>

                  </div>                  </div>

                  <div className="p-3 bg-green-50 rounded-full">                  <div className="p-3 bg-green-50 rounded-full">

                    <Target className="h-6 w-6 text-green-600" />                    <Target className="h-6 w-6 text-green-600" />

                  </div>                  </div>

                </div>                </div>

                <div className="mt-2 flex items-center text-sm">                <div className="mt-2 flex items-center text-sm">

                  <span className="text-gray-600">CTR: {formatPercentage(dashboardMetrics.avgCTR)}</span>                  <span className="text-gray-600">CTR: {formatPercentage(dashboardMetrics.avgCTR)}</span>

                </div>                </div>

              </CardContent>              </CardContent>

            </Card>            </Card>



            <Card>            <Card>

              <CardContent className="p-6">              <CardContent className="p-6">

                <div className="flex items-center justify-between">                <div className="flex items-center justify-between">

                  <div>                  <div>

                    <p className="text-sm font-medium text-gray-600">Connections</p>                    <p className="text-sm font-medium text-gray-600">Connections</p>

                    <p className="text-2xl font-bold text-gray-900">                    <p className="text-2xl font-bold text-gray-900">

                      {dashboardMetrics.activeConnections}/{dashboardMetrics.totalConnections}                      {dashboardMetrics.activeConnections}/{dashboardMetrics.totalConnections}

                    </p>                    </p>

                  </div>                  </div>

                  <div className="p-3 bg-orange-50 rounded-full">                  <div className="p-3 bg-orange-50 rounded-full">

                    <Wifi className="h-6 w-6 text-orange-600" />                    <Wifi className="h-6 w-6 text-orange-600" />

                  </div>                  </div>

                </div>                </div>

                <div className="mt-2">                <div className="mt-2">

                  <Progress                   <Progress 

                    value={(dashboardMetrics.activeConnections / dashboardMetrics.totalConnections) * 100}                     value={(dashboardMetrics.activeConnections / dashboardMetrics.totalConnections) * 100} 

                    className="h-2"                    className="h-2"

                  />                  />

                </div>                </div>

              </CardContent>              </CardContent>

            </Card>            </Card>

          </div>          </div>

        )}        )}



        {/* Main Content Tabs */}        {/* Main Content Tabs */}

        <Tabs defaultValue="platforms" className="space-y-6">        <Tabs defaultValue="platforms" className="space-y-6">

          <TabsList>          <TabsList>

            <TabsTrigger value="platforms">Platforms</TabsTrigger>            <TabsTrigger value="platforms">Platforms</TabsTrigger>

            <TabsTrigger value="activity">Sync Activity</TabsTrigger>            <TabsTrigger value="activity">Sync Activity</TabsTrigger>

            <TabsTrigger value="analytics">Analytics</TabsTrigger>            <TabsTrigger value="analytics">Analytics</TabsTrigger>

          </TabsList>          </TabsList>



          {/* Platforms Tab */}          {/* Platforms Tab */}

          <TabsContent value="platforms" className="space-y-6">          <TabsContent value="platforms" className="space-y-6">

            <div className="grid gap-6">            <div className="grid gap-6">

              {platformMetrics.map((platform) => (              {platformMetrics.map((platform) => (

                <Card key={platform.platform} className="hover:shadow-lg transition-shadow">                <Card key={platform.platform} className="hover:shadow-lg transition-shadow">

                  <CardContent className="p-6">                  <CardContent className="p-6">

                    <div className="flex items-center justify-between mb-4">                    <div className="flex items-center justify-between mb-4">

                      <div className="flex items-center gap-3">                      <div className="flex items-center gap-3">

                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">

                          {platform.platform === 'facebook' && '📘'}                          {platform.platform === 'facebook' && '📘'}

                          {platform.platform === 'google-ads' && '🎯'}                          {platform.platform === 'google-ads' && '🎯'}

                          {platform.platform === 'linkedin' && '💼'}                          {platform.platform === 'linkedin' && '💼'}

                          {platform.platform === 'tiktok' && '🎵'}                          {platform.platform === 'tiktok' && '🎵'}

                          {platform.platform === 'twitter' && '🐦'}                          {platform.platform === 'twitter' && '🐦'}

                        </div>                        </div>

                        <div>                        <div>

                          <h3 className="text-lg font-semibold capitalize">                          <h3 className="text-lg font-semibold capitalize">

                            {platform.platform.replace('-', ' ')}                            {platform.platform.replace('-', ' ')}

                          </h3>                          </h3>

                          <div className="flex items-center gap-2">                          <div className="flex items-center gap-2">

                            {getStatusIcon(platform.status)}                            {getStatusIcon(platform.status)}

                            <span className="text-sm text-gray-600 capitalize">                            <span className="text-sm text-gray-600 capitalize">

                              {platform.status}                              {platform.status}

                            </span>                            </span>

                            <Badge className={getHealthColor(platform.health)}>                            <Badge className={getHealthColor(platform.health)}>

                              {platform.health}                              {platform.health}

                            </Badge>                            </Badge>

                          </div>                          </div>

                        </div>                        </div>

                      </div>                      </div>

                                            

                      <div className="flex items-center gap-2">                      <div className="flex items-center gap-2">

                        <Button                        <Button

                          variant="outline"                          variant="outline"

                          size="sm"                          size="sm"

                          onClick={() => handlePlatformAction(platform.platform, 'view')}                          onClick={() => handlePlatformAction(platform.platform, 'view')}

                        >                        >

                          <Eye className="h-4 w-4 mr-1" />                          <Eye className="h-4 w-4 mr-1" />

                          View                          View

                        </Button>                        </Button>

                        <Button                        <Button

                          variant="outline"                          variant="outline"

                          size="sm"                          size="sm"

                          onClick={() => handlePlatformAction(platform.platform, 'configure')}                          onClick={() => handlePlatformAction(platform.platform, 'configure')}

                        >                        >

                          <Settings className="h-4 w-4 mr-1" />                          <Settings className="h-4 w-4 mr-1" />

                          Configure                          Configure

                        </Button>                        </Button>

                      </div>                      </div>

                    </div>                    </div>



                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

                      <div className="text-center">                      <div className="text-center">

                        <p className="text-sm text-gray-600">Spend</p>                        <p className="text-sm text-gray-600">Spend</p>

                        <p className="text-lg font-semibold">{formatCurrency(platform.spend)}</p>                        <p className="text-lg font-semibold">{formatCurrency(platform.spend)}</p>

                      </div>                      </div>

                      <div className="text-center">                      <div className="text-center">

                        <p className="text-sm text-gray-600">Impressions</p>                        <p className="text-sm text-gray-600">Impressions</p>

                        <p className="text-lg font-semibold">{formatNumber(platform.impressions)}</p>                        <p className="text-lg font-semibold">{formatNumber(platform.impressions)}</p>

                      </div>                      </div>

                      <div className="text-center">                      <div className="text-center">

                        <p className="text-sm text-gray-600">Clicks</p>                        <p className="text-sm text-gray-600">Clicks</p>

                        <p className="text-lg font-semibold">{formatNumber(platform.clicks)}</p>                        <p className="text-lg font-semibold">{formatNumber(platform.clicks)}</p>

                      </div>                      </div>

                      <div className="text-center">                      <div className="text-center">

                        <p className="text-sm text-gray-600">CTR</p>                        <p className="text-sm text-gray-600">CTR</p>

                        <p className="text-lg font-semibold">{formatPercentage(platform.ctr)}</p>                        <p className="text-lg font-semibold">{formatPercentage(platform.ctr)}</p>

                      </div>                      </div>

                      <div className="text-center">                      <div className="text-center">

                        <p className="text-sm text-gray-600">Campaigns</p>                        <p className="text-sm text-gray-600">Campaigns</p>

                        <p className="text-lg font-semibold">{platform.campaigns}</p>                        <p className="text-lg font-semibold">{platform.campaigns}</p>

                      </div>                      </div>

                    </div>                    </div>



                    <div className="mt-4 pt-4 border-t border-gray-200">                    <div className="mt-4 pt-4 border-t border-gray-200">

                      <div className="flex items-center justify-between text-sm text-gray-600">                      <div className="flex items-center justify-between text-sm text-gray-600">

                        <span>Last sync: {new Date(platform.lastSync).toLocaleString()}</span>                        <span>Last sync: {new Date(platform.lastSync).toLocaleString()}</span>

                        <div className="flex items-center gap-1">                        <div className="flex items-center gap-1">

                          <Sync className="h-4 w-4" />                          <Sync className="h-4 w-4" />

                          <span>Auto-sync enabled</span>                          <span>Auto-sync enabled</span>

                        </div>                        </div>

                      </div>                      </div>

                    </div>                    </div>

                  </CardContent>                  </CardContent>

                </Card>                </Card>

              ))}              ))}

            </div>            </div>

          </TabsContent>          </TabsContent>



          {/* Sync Activity Tab */}          {/* Sync Activity Tab */}

          <TabsContent value="activity" className="space-y-6">          <TabsContent value="activity" className="space-y-6">

            <Card>            <Card>

              <CardHeader>              <CardHeader>

                <CardTitle className="flex items-center gap-2">                <CardTitle className="flex items-center gap-2">

                  <Activity className="h-5 w-5" />                  <Activity className="h-5 w-5" />

                  Recent Sync Activity                  Recent Sync Activity

                </CardTitle>                </CardTitle>

              </CardHeader>              </CardHeader>

              <CardContent>              <CardContent>

                <div className="space-y-4">                <div className="space-y-4">

                  {syncActivity.map((activity) => (                  {syncActivity.map((activity) => (

                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">

                      <div className="flex items-center gap-3">                      <div className="flex items-center gap-3">

                        <div className={`w-2 h-2 rounded-full ${                        <div className={`w-2 h-2 rounded-full ${

                          activity.status === 'success' ? 'bg-green-500' :                          activity.status === 'success' ? 'bg-green-500' :

                          activity.status === 'error' ? 'bg-red-500' :                          activity.status === 'error' ? 'bg-red-500' :

                          'bg-blue-500'                          'bg-blue-500'

                        }`}></div>                        }`}></div>

                        <div>                        <div>

                          <p className="font-medium capitalize">                          <p className="font-medium capitalize">

                            {activity.platform} - {activity.type.replace('_', ' ')}                            {activity.platform} - {activity.type.replace('_', ' ')}

                          </p>                          </p>

                          <p className="text-sm text-gray-600">                          <p className="text-sm text-gray-600">

                            {formatNumber(activity.recordsProcessed)} records • {activity.duration}s                            {formatNumber(activity.recordsProcessed)} records • {activity.duration}s

                          </p>                          </p>

                        </div>                        </div>

                      </div>                      </div>

                      <div className="text-right">                      <div className="text-right">

                        <p className="text-sm text-gray-600">                        <p className="text-sm text-gray-600">

                          {new Date(activity.timestamp).toLocaleString()}                          {new Date(activity.timestamp).toLocaleString()}

                        </p>                        </p>

                        <Badge variant={activity.status === 'success' ? 'default' : 'destructive'}>                        <Badge variant={activity.status === 'success' ? 'default' : 'destructive'}>

                          {activity.status}                          {activity.status}

                        </Badge>                        </Badge>

                      </div>                      </div>

                    </div>                    </div>

                  ))}                  ))}

                </div>                </div>

              </CardContent>              </CardContent>

            </Card>            </Card>

          </TabsContent>          </TabsContent>



          {/* Analytics Tab */}          {/* Analytics Tab */}

          <TabsContent value="analytics" className="space-y-6">          <TabsContent value="analytics" className="space-y-6">

            <Card>            <Card>

              <CardHeader>              <CardHeader>

                <CardTitle className="flex items-center gap-2">                <CardTitle className="flex items-center gap-2">

                  <BarChart3 className="h-5 w-5" />                  <BarChart3 className="h-5 w-5" />

                  Performance Analytics                  Performance Analytics

                </CardTitle>                </CardTitle>

              </CardHeader>              </CardHeader>

              <CardContent>              <CardContent>

                <div className="text-center py-12 text-gray-500">                <div className="text-center py-12 text-gray-500">

                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />

                  <p>Advanced analytics visualization will be implemented here</p>                  <p>Advanced analytics visualization will be implemented here</p>

                  <p className="text-sm">Charts, trends, and detailed performance metrics</p>                  <p className="text-sm">Charts, trends, and detailed performance metrics</p>

                </div>                </div>

              </CardContent>              </CardContent>

            </Card>            </Card>

          </TabsContent>          </TabsContent>

        </Tabs>        </Tabs>

      </div>      </div>

    </div>    </div>

  );  );

}}
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  status: 'active' | 'coming_soon' | 'beta';
  features: string[];
  kpi: {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
  };
  subPlatforms: SubPlatform[];
}

interface SubPlatform {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  status: 'active' | 'beta' | 'coming_soon';
  kpi?: {
    label: string;
    value: string;
  };
}

// Performance-optimized KPI Card Component
const KPICard = memo(({ kpi }: { kpi: EnterpriseKPI }) => (
  <div className="card-standard kpi-card">
    <div className="flex items-center justify-between">
      <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
        <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
      </div>
      <span className={`kpi-change ${
        kpi.changeType === 'positive' ? 'text-green-600' :
        kpi.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
      }`}>
        {kpi.change}
      </span>
    </div>
    <h3 className="kpi-value">
      {kpi.value}
    </h3>
    <p className="kpi-label">
      {kpi.title}
    </p>
  </div>
));

KPICard.displayName = 'KPICard';

// Performance-optimized Platform Suite Card Component
const PlatformSuiteCard = memo(({ suite, onClick }: { suite: PlatformSuite; onClick: () => void }) => (
  <div
    className="card-standard cursor-pointer group"
    onClick={onClick}
  >
    {/* Suite Header */}
    <div className="card-header">
      <div className="flex items-center gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 group-hover:scale-105 transition-transform duration-200">
          <suite.icon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="card-title group-hover:text-blue-600 transition-colors">
            {suite.title}
          </h3>
          <p className="card-description">
            {suite.description}
          </p>
        </div>
      </div>
      <div className="text-right">
        <span className={`px-3 py-1 text-xs rounded-full font-medium ${
          suite.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
          suite.status === 'beta' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
          'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }`}>
          {suite.status.replace('_', ' ')}
        </span>
        <div className="mt-2">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {suite.kpi.value}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {suite.kpi.label}
          </div>
        </div>
      </div>
    </div>

    {/* Features */}
    <div className="flex flex-wrap gap-2 mb-6">
      {suite.features.map((feature) => (
        <span key={feature} className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
          {feature}
        </span>
      ))}
    </div>

    {/* Access Button */}
    <div className="flex items-center justify-between">
      <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
        <span className="text-sm font-medium">Access Platform</span>
        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {suite.subPlatforms.length} sub-platforms
      </div>
    </div>
  </div>
));

PlatformSuiteCard.displayName = 'PlatformSuiteCard';

// Performance-optimized Sub-Platform Card Component
const SubPlatformCard = memo(({ subPlatform, onClick }: { subPlatform: SubPlatform; onClick: () => void }) => (
  <div
    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group border border-gray-200 dark:border-gray-700"
    onClick={onClick}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:scale-105 transition-transform duration-200">
        <subPlatform.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </div>
      <span className={`px-2 py-1 text-xs rounded-full ${
        subPlatform.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
        subPlatform.status === 'beta' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
        'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
      }`}>
        {subPlatform.status.replace('_', ' ')}
      </span>
    </div>

    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
      {subPlatform.title}
    </h4>
    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
      {subPlatform.description}
    </p>

    {subPlatform.kpi && (
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">{subPlatform.kpi.label}</span>
        <span className="font-medium text-gray-900 dark:text-white">{subPlatform.kpi.value}</span>
      </div>
    )}

    <div className="flex items-center mt-2 text-blue-600 group-hover:text-blue-700 transition-colors">
      <span className="text-xs font-medium">Launch</span>
      <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
    </div>
  </div>
));

SubPlatformCard.displayName = 'SubPlatformCard';

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Simple state management
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);

  // Check for onboarding completion
  useEffect(() => {
    const onboardingComplete = searchParams?.get('onboarding') === 'complete';
    const welcomeParam = searchParams?.get('welcome') === 'true';
    const onboardingCompleteFlag = localStorage.getItem('onboardingComplete') === 'true';
    const welcomeDismissed = localStorage.getItem('onboardingWelcomeDismissed') === 'true';

    if ((onboardingComplete || welcomeParam || onboardingCompleteFlag) && !welcomeDismissed) {
      setShowWelcomeBanner(true);
    }
  }, [searchParams]);

  const handleWelcomeBannerDismiss = () => {
    setShowWelcomeBanner(false);
  };

  // Simple KPI data
  const enterpriseKPIs: EnterpriseKPI[] = [
    {
      title: 'Total Revenue',
      value: '$487,320',
      change: '+18.2%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Campaigns',
      value: '24',
      change: '+12.5%',
      changeType: 'positive',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      title: 'Total Leads',
      value: '1,847',
      change: '+8.3%',
      changeType: 'positive',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+0.8%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-emerald-600'
    }
  ];

  // Platform suites data - Secondary Level (Large Cards)
  const platformSuites: PlatformSuite[] = [
    {
      id: 'marketing',
      title: 'Marketing Command Center',
      description: 'Unified marketing automation and optimization across all channels',
      icon: Target,
      href: '/marketing',
      status: 'active',
      features: ['Multi-Channel Campaigns', 'AI Optimization', 'Real-time Analytics', 'Lead Management'],
      kpi: {
        label: 'Active Campaigns',
        value: '24',
        trend: 'up'
      },
      subPlatforms: [
        {
          id: 'social-media',
          title: 'Social Media',
          description: 'Multi-platform social media management',
          icon: Users,
          href: '/social-media',
          status: 'active',
          kpi: { label: 'Posts Today', value: '12' }
        },
        {
          id: 'email-marketing',
          title: 'Email Marketing',
          description: 'Advanced email automation',
          icon: MessageSquare,
          href: '/email-marketing',
          status: 'active',
          kpi: { label: 'Open Rate', value: '24.5%' }
        },
        {
          id: 'content-creation',
          title: 'Content Studio',
          description: 'AI-powered content creation',
          icon: FileText,
          href: '/content-suite',
          status: 'beta',
          kpi: { label: 'Generated', value: '156' }
        }
      ]
    },
    {
      id: 'business',
      title: 'Business Suite',
      description: 'Complete business management and operations platform',
      icon: Briefcase,
      href: '/business-suite',
      status: 'active',
      features: ['Financial Management', 'E-Commerce', 'CRM', 'Customer Service'],
      kpi: {
        label: 'Active Operations',
        value: '5',
        trend: 'up'
      },
      subPlatforms: [
        {
          id: 'financial',
          title: 'Financial Management',
          description: 'Accounting, invoicing, and financial reporting',
          icon: DollarSign,
          href: '/financial-management',
          status: 'active',
          kpi: { label: 'Revenue', value: '$125k' }
        },
        {
          id: 'ecommerce',
          title: 'E-Commerce',
          description: 'Online store management and sales',
          icon: ShoppingCart,
          href: '/e-commerce',
          status: 'active',
          kpi: { label: 'Orders', value: '342' }
        },
        {
          id: 'crm',
          title: 'Unified CRM',
          description: 'Customer relationship management',
          icon: Users,
          href: '/unified-crm',
          status: 'active',
          kpi: { label: 'Contacts', value: '1,247' }
        },
        {
          id: 'customer-service',
          title: 'Customer Service',
          description: 'Support tickets and helpdesk',
          icon: Headphones,
          href: '/customer-service',
          status: 'active',
          kpi: { label: 'Tickets', value: '23' }
        },
        {
          id: 'inventory',
          title: 'Inventory Management',
          description: 'Stock tracking and warehouse management',
          icon: Package,
          href: '/inventory-management',
          status: 'beta',
          kpi: { label: 'Items', value: '1,542' }
        }
      ]
    },
    {
      id: 'ai-suite',
      title: 'AI Suite',
      description: 'Advanced AI automation and intelligent optimization',
      icon: Brain,
      href: '/ai',
      status: 'active',
      features: ['AI Automation', 'Optimization', 'Predictive Analytics', 'Workflows'],
      kpi: {
        label: 'Active AI Agents',
        value: '12',
        trend: 'up'
      },
      subPlatforms: [
        {
          id: 'ai-automation',
          title: 'AI Automation',
          description: 'Intelligent task automation and decision-making',
          icon: Zap,
          href: '/ai-automation',
          status: 'active',
          kpi: { label: 'Automations', value: '18' }
        },
        {
          id: 'ai-optimization',
          title: 'AI Optimization',
          description: 'Performance optimization and recommendations',
          icon: TrendingUp,
          href: '/ai-optimization',
          status: 'active',
          kpi: { label: 'Optimized', value: '24' }
        },
        {
          id: 'workflow-automation',
          title: 'Workflow Automation',
          description: 'Custom workflow creation and management',
          icon: GitBranch,
          href: '/workflow-automation',
          status: 'active',
          kpi: { label: 'Workflows', value: '8' }
        },
        {
          id: 'autonomous',
          title: 'Autonomous Agents',
          description: 'Self-learning AI agents',
          icon: Bot,
          href: '/autonomous',
          status: 'beta',
          kpi: { label: 'Agents', value: '4' }
        }
      ]
    },
    {
      id: 'collaboration',
      title: 'Team Collaboration',
      description: 'Real-time team coordination and project management',
      icon: Users,
      href: '/collaboration',
      status: 'active',
      features: ['Live Presence', 'Activity Feeds', 'Smart Notifications', 'Team Analytics'],
      kpi: {
        label: 'Active Members',
        value: '47',
        trend: 'up'
      },
      subPlatforms: [
        {
          id: 'project-management',
          title: 'Project Management',
          description: 'Enterprise project tracking',
          icon: Activity,
          href: '/project-management',
          status: 'active',
          kpi: { label: 'Active Projects', value: '12' }
        },
        {
          id: 'team-chat',
          title: 'Team Communication',
          description: 'Real-time team messaging',
          icon: MessageSquare,
          href: '/team-collaboration',
          status: 'beta',
          kpi: { label: 'Messages', value: '1.2k' }
        },
        {
          id: 'calendar',
          title: 'Unified Calendar',
          description: 'Cross-platform scheduling',
          icon: Calendar,
          href: '/scheduler',
          status: 'coming_soon'
        }
      ]
    },
    {
      id: 'business-intelligence',
      title: 'Business Intelligence',
      description: 'Advanced analytics and business insights',
      icon: BarChart3,
      href: '/business-intelligence',
      status: 'active',
      features: ['Real-time Dashboards', 'Predictive Analytics', 'Custom Reports', 'AI Insights'],
      kpi: {
        label: 'Data Points',
        value: '2.4M',
        trend: 'up'
      },
      subPlatforms: [
        {
          id: 'analytics',
          title: 'Performance Analytics',
          description: 'Comprehensive performance tracking',
          icon: TrendingUp,
          href: '/analytics',
          status: 'active',
          kpi: { label: 'Metrics', value: '45' }
        },
        {
          id: 'reports',
          title: 'Custom Reports',
          description: 'Automated report generation',
          icon: FileText,
          href: '/reports',
          status: 'active',
          kpi: { label: 'Reports', value: '28' }
        },
        {
          id: 'insights',
          title: 'AI Insights',
          description: 'AI-powered business insights',
          icon: Brain,
          href: '/ai',
          status: 'beta',
          kpi: { label: 'Insights', value: '15' }
        }
      ]
    },
    {
      id: 'integrations',
      title: 'Integrations Marketplace',
      description: 'Universal app marketplace with 100+ business integrations',
      icon: Globe,
      href: '/integrations',
      status: 'active',
      features: ['100+ Apps', 'Revenue Tracking', 'API Management', 'Custom Workflows'],
      kpi: {
        label: 'Connected Apps',
        value: '23',
        trend: 'up'
      },
      subPlatforms: [
        {
          id: 'api-management',
          title: 'API Management',
          description: 'Centralized API control',
          icon: Settings,
          href: '/platforms',
          status: 'active',
          kpi: { label: 'APIs', value: '18' }
        },
        {
          id: 'workflows',
          title: 'Automation Workflows',
          description: 'Custom business automation',
          icon: Zap,
          href: '/workflow-automation',
          status: 'beta',
          kpi: { label: 'Workflows', value: '8' }
        },
        {
          id: 'marketplace',
          title: 'App Marketplace',
          description: 'Discover new integrations',
          icon: Globe,
          href: '/integrations',
          status: 'active',
          kpi: { label: 'Available', value: '100+' }
        }
      ]
    }
  ];

  return (
    <UniversalPageWrapper
      title="Master Terminal"
      subtitle="Unified command center for your enterprise business ecosystem"
      containerSize="full"
      showBreadcrumb={false}
      showAIChat={true}
      visualMode="standard"
      statusBadge={{
        variant: 'success',
        text: 'All Systems Operational',
        dot: true
      }}
      headerActions={
        <button
          onClick={() => router.push('/dashboard/enhanced')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="hidden sm:inline">Customize Layout</span>
        </button>
      }
    >
      {/* Welcome Banner */}
      {showWelcomeBanner && (
        <OnboardingWelcomeBanner onDismiss={handleWelcomeBannerDismiss} />
      )}

      {/* KPI Cards - Performance Optimized Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="kpi-grid">
        {enterpriseKPIs.map((kpi) => (
          <KPICard key={kpi.title} kpi={kpi} />
        ))}
      </div>

      {/* Secondary Platform Suites - Large Cards */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Platform Suites
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {platformSuites.map((suite) => (
            <PlatformSuiteCard
              key={suite.id}
              suite={suite}
              onClick={() => router.push(suite.href)}
            />
          ))}
        </div>
      </div>

      {/* Tertiary Sub-Platforms - Rows of 3 */}
      {platformSuites.map((suite) => (
        <div key={`${suite.id}-sub`} className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {suite.title} - Sub-Platforms
            </h3>
            <button
              onClick={() => router.push(suite.href)}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suite.subPlatforms.map((subPlatform) => (
              <SubPlatformCard
                key={subPlatform.id}
                subPlatform={subPlatform}
                onClick={() => router.push(subPlatform.href)}
              />
            ))}
          </div>
        </div>
      ))}
    </UniversalPageWrapper>
  );
}
