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
  Server, 
  Globe,
  Shield,
  Zap,
  Database,
  MonitorSpeaker,
  CloudSnow,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart,
  Map,
  Lock,
  Eye,
  RefreshCw,
  Settings,
  Download,
  Upload,
  Bell,
  Calendar,
  Users,
  Building,
  Gauge,
  Layers,
  Router,
  Wifi,
  HardDriveIcon,
  CircuitBoard,
  Thermometer,
  BatteryCharging,
  Signal,
  Satellite,
  Timer,
  FileText,
  Archive,
  RotateCcw,
  AlertOctagon,
  ShieldCheck,
  Key,
  Fingerprint,
  Scan,
  Camera,
  Microchip,
  Radio,
  Radar,
  Crosshair,
  Target,
  Focus,
  Search,
  Filter,
  SortAsc,
  MoreHorizontal,
  Play,
  Pause,
  Square,
  SkipForward,
  Rewind,
  FastForward,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ExternalLink,
  LinkIcon,
  Unlink,
  Copy,
  Share,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Inbox,
  UserCheck,
  UserX,
  Plus,
  Minus,
  X,
  Check,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoveUp,
  MoveDown,
  Move,
  Navigation,
  Compass,
  MapPin,
  Route,
  Car,
  Plane,
  Ship,
  Truck,
  Bus,
  Bike,
  Home,
  Building2,
  Store,
  Hospital,
  School,
  Factory,
  Warehouse,
  ShoppingCart,
  CreditCard,
  Wallet,
  DollarSign,
  Euro,
  PoundSterling,
  Bitcoin,
  Banknote,
  Receipt,
  Calculator,
  TrendingDown,
  LineChart,
  AreaChart,
  ScatterChart,
  BarChart,
  BarChart2,
  BarChart4,
  PieChartIcon
} from 'lucide-react';

interface ProductionInfrastructureProps {
  className?: string;
}

// Mock data for production infrastructure
const mockInfrastructureData = {
  uptime: {
    current: 99.97,
    target: 99.99,
    monthlyAverage: 99.94,
    incidents: 2,
    lastIncident: new Date('2024-03-15T14:30:00Z'),
    mtbf: 720, // Mean time between failures in hours
    mttr: 12 // Mean time to recovery in minutes
  },
  performance: {
    globalLatency: 89, // ms
    throughput: 47500, // requests per minute
    errorRate: 0.012, // percentage
    availability: 99.97,
    regions: [
      { name: 'US East', latency: 45, status: 'healthy', load: 72 },
      { name: 'US West', latency: 52, status: 'healthy', load: 68 },
      { name: 'Europe', latency: 78, status: 'healthy', load: 54 },
      { name: 'Asia Pacific', latency: 134, status: 'degraded', load: 89 },
      { name: 'South America', latency: 156, status: 'healthy', load: 43 },
      { name: 'Africa', latency: 198, status: 'healthy', load: 31 }
    ]
  },
  infrastructure: {
    servers: {
      total: 245,
      active: 241,
      maintenance: 2,
      failed: 2,
      cpu: 68.5,
      memory: 74.2,
      storage: 56.8,
      network: 45.3
    },
    databases: {
      primary: { status: 'healthy', connections: 2847, cpu: 45.2, memory: 67.8 },
      replica: { status: 'healthy', connections: 1923, cpu: 38.9, memory: 52.4 },
      cache: { status: 'healthy', hitRate: 94.7, memory: 78.3 },
      analytics: { status: 'healthy', queries: 15670, cpu: 62.1 }
    },
    cdn: {
      cacheHitRate: 96.2,
      bandwidth: 12.4, // TB/day
      requests: 45600000, // per day
      origins: 6,
      edges: 180
    }
  },
  security: {
    threatLevel: 'low',
    blockedAttacks: 14567,
    vulnerabilities: {
      critical: 0,
      high: 2,
      medium: 7,
      low: 23
    },
    certificates: {
      total: 47,
      expiring: 3,
      expired: 0
    },
    compliance: {
      soc2: { status: 'certified', expires: new Date('2024-12-31') },
      iso27001: { status: 'certified', expires: new Date('2025-06-15') },
      gdpr: { status: 'compliant', lastAudit: new Date('2024-02-20') },
      hipaa: { status: 'certified', expires: new Date('2024-11-30') }
    }
  },
  monitoring: {
    alerts: {
      critical: 1,
      warning: 7,
      info: 23
    },
    metrics: {
      dataPoints: 125000000,
      retention: '2 years',
      alertRules: 156,
      dashboards: 47
    },
    logs: {
      dailyVolume: 2.8, // TB
      retention: '90 days',
      parsed: 98.7 // percentage
    }
  },
  backup: {
    databases: {
      frequency: 'hourly',
      retention: '7 years',
      lastBackup: new Date('2024-03-28T15:00:00Z'),
      size: 145.7, // GB
      success: 99.8 // percentage
    },
    files: {
      frequency: 'daily',
      retention: '1 year',
      lastBackup: new Date('2024-03-28T02:00:00Z'),
      size: 67.3, // GB
      success: 99.9
    },
    disaster: {
      rpo: 15, // minutes
      rto: 60, // minutes
      lastTest: new Date('2024-03-01'),
      success: true
    }
  },
  scaling: {
    autoScale: true,
    minInstances: 12,
    maxInstances: 500,
    currentInstances: 47,
    triggers: [
      { metric: 'CPU > 80%', enabled: true },
      { metric: 'Memory > 85%', enabled: true },
      { metric: 'Requests > 10k/min', enabled: true },
      { metric: 'Latency > 200ms', enabled: true }
    ],
    cooldown: 300, // seconds
    scaleEvents: [
      { time: new Date('2024-03-28T14:30:00Z'), action: 'scale_up', instances: 8, reason: 'High CPU' },
      { time: new Date('2024-03-28T09:15:00Z'), action: 'scale_down', instances: 5, reason: 'Low traffic' },
      { time: new Date('2024-03-27T22:45:00Z'), action: 'scale_up', instances: 12, reason: 'High requests' }
    ]
  }
};

export default function ProductionInfrastructure({ className }: ProductionInfrastructureProps) {
  const [selectedRegion, setSelectedRegion] = useState(mockInfrastructureData.performance.regions[0]);
  const [loading, setLoading] = useState(false);

  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(3)}%`;
  };

  const formatLatency = (latency: number) => {
    return `${latency}ms`;
  };

  const formatBytes = (bytes: number, unit = 'GB') => {
    return `${bytes.toFixed(1)} ${unit}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'maintenance':
        return 'text-blue-600 bg-blue-100';
      case 'certified':
      case 'compliant':
        return 'text-green-600 bg-green-100';
      case 'expiring':
        return 'text-yellow-600 bg-yellow-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
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
            <Server className="h-8 w-8 text-blue-600" />
            Production Infrastructure & Scaling
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor system health, performance, security, and automated scaling
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold">{formatUptime(mockInfrastructureData.uptime.current)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Target: {formatUptime(mockInfrastructureData.uptime.target)}</span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Global Latency</p>
                <p className="text-2xl font-bold">{formatLatency(mockInfrastructureData.performance.globalLatency)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600">{formatNumber(mockInfrastructureData.performance.throughput)} req/min</span>
                </div>
              </div>
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Security Status</p>
                <p className="text-2xl font-bold capitalize">{mockInfrastructureData.security.threatLevel}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">{formatNumber(mockInfrastructureData.security.blockedAttacks)} blocked</span>
                </div>
              </div>
              <ShieldCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Servers</p>
                <p className="text-2xl font-bold">{mockInfrastructureData.infrastructure.servers.active}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-purple-600">Auto-scaling enabled</span>
                </div>
              </div>
              <Server className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="backup">Backup & DR</TabsTrigger>
          <TabsTrigger value="scaling">Auto-Scaling</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Infrastructure Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Infrastructure Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{mockInfrastructureData.infrastructure.servers.active}</p>
                    <p className="text-sm text-muted-foreground">Active Servers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{mockInfrastructureData.infrastructure.servers.maintenance}</p>
                    <p className="text-sm text-muted-foreground">Maintenance</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">CPU Usage</span>
                      <span className="text-sm text-muted-foreground">{mockInfrastructureData.infrastructure.servers.cpu}%</span>
                    </div>
                    <Progress value={mockInfrastructureData.infrastructure.servers.cpu} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Memory Usage</span>
                      <span className="text-sm text-muted-foreground">{mockInfrastructureData.infrastructure.servers.memory}%</span>
                    </div>
                    <Progress value={mockInfrastructureData.infrastructure.servers.memory} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Storage Usage</span>
                      <span className="text-sm text-muted-foreground">{mockInfrastructureData.infrastructure.servers.storage}%</span>
                    </div>
                    <Progress value={mockInfrastructureData.infrastructure.servers.storage} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Database Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Cluster
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Primary Database</h4>
                      <p className="text-sm text-muted-foreground">{mockInfrastructureData.infrastructure.databases.primary.connections} connections</p>
                    </div>
                    <Badge className={getStatusColor(mockInfrastructureData.infrastructure.databases.primary.status)}>
                      {mockInfrastructureData.infrastructure.databases.primary.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Read Replica</h4>
                      <p className="text-sm text-muted-foreground">{mockInfrastructureData.infrastructure.databases.replica.connections} connections</p>
                    </div>
                    <Badge className={getStatusColor(mockInfrastructureData.infrastructure.databases.replica.status)}>
                      {mockInfrastructureData.infrastructure.databases.replica.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Redis Cache</h4>
                      <p className="text-sm text-muted-foreground">{mockInfrastructureData.infrastructure.databases.cache.hitRate}% hit rate</p>
                    </div>
                    <Badge className={getStatusColor(mockInfrastructureData.infrastructure.databases.cache.status)}>
                      {mockInfrastructureData.infrastructure.databases.cache.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CDN Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                CDN Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{mockInfrastructureData.infrastructure.cdn.cacheHitRate}%</p>
                  <p className="text-sm text-muted-foreground">Cache Hit Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{formatBytes(mockInfrastructureData.infrastructure.cdn.bandwidth, 'TB')}</p>
                  <p className="text-sm text-muted-foreground">Daily Bandwidth</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{formatNumber(mockInfrastructureData.infrastructure.cdn.requests)}</p>
                  <p className="text-sm text-muted-foreground">Daily Requests</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{mockInfrastructureData.infrastructure.cdn.edges}</p>
                  <p className="text-sm text-muted-foreground">Edge Locations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Regional Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Regional Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockInfrastructureData.performance.regions.map((region, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedRegion.name === region.name ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => setSelectedRegion(region)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{region.name}</h4>
                        <Badge className={getStatusColor(region.status)}>
                          {region.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Latency: </span>
                          <span className="font-medium">{formatLatency(region.latency)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Load: </span>
                          <span className="font-medium">{region.load}%</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Progress value={region.load} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{formatLatency(mockInfrastructureData.performance.globalLatency)}</p>
                    <p className="text-sm text-muted-foreground">Avg Latency</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatNumber(mockInfrastructureData.performance.throughput)}</p>
                    <p className="text-sm text-muted-foreground">Requests/min</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Error Rate</span>
                      <span className="text-sm text-muted-foreground">{mockInfrastructureData.performance.errorRate.toFixed(3)}%</span>
                    </div>
                    <Progress value={mockInfrastructureData.performance.errorRate * 10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Availability</span>
                      <span className="text-sm text-muted-foreground">{formatUptime(mockInfrastructureData.performance.availability)}</span>
                    </div>
                    <Progress value={mockInfrastructureData.performance.availability} className="h-2" />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Selected Region: {selectedRegion.name}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Latency</span>
                      <span className="text-sm font-medium">{formatLatency(selectedRegion.latency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Status</span>
                      <Badge className={getStatusColor(selectedRegion.status)}>
                        {selectedRegion.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Load</span>
                      <span className="text-sm font-medium">{selectedRegion.load}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`inline-block px-4 py-2 rounded-full font-medium text-lg ${getThreatColor(mockInfrastructureData.security.threatLevel)}`}>
                    {mockInfrastructureData.security.threatLevel.toUpperCase()} THREAT LEVEL
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{formatNumber(mockInfrastructureData.security.blockedAttacks)}</p>
                  <p className="text-sm text-muted-foreground">Attacks Blocked Today</p>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Vulnerabilities</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertOctagon className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Critical</span>
                      </div>
                      <span className="text-sm font-bold text-red-600">{mockInfrastructureData.security.vulnerabilities.critical}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">High</span>
                      </div>
                      <span className="text-sm font-bold text-orange-600">{mockInfrastructureData.security.vulnerabilities.high}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Medium</span>
                      </div>
                      <span className="text-sm font-bold text-yellow-600">{mockInfrastructureData.security.vulnerabilities.medium}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Low</span>
                      </div>
                      <span className="text-sm font-bold text-blue-600">{mockInfrastructureData.security.vulnerabilities.low}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">SOC 2 Type II</h4>
                      <p className="text-sm text-muted-foreground">Expires: {mockInfrastructureData.security.compliance.soc2.expires.toLocaleDateString()}</p>
                    </div>
                    <Badge className={getStatusColor(mockInfrastructureData.security.compliance.soc2.status)}>
                      {mockInfrastructureData.security.compliance.soc2.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">ISO 27001</h4>
                      <p className="text-sm text-muted-foreground">Expires: {mockInfrastructureData.security.compliance.iso27001.expires.toLocaleDateString()}</p>
                    </div>
                    <Badge className={getStatusColor(mockInfrastructureData.security.compliance.iso27001.status)}>
                      {mockInfrastructureData.security.compliance.iso27001.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">GDPR</h4>
                      <p className="text-sm text-muted-foreground">Last audit: {mockInfrastructureData.security.compliance.gdpr.lastAudit.toLocaleDateString()}</p>
                    </div>
                    <Badge className={getStatusColor(mockInfrastructureData.security.compliance.gdpr.status)}>
                      {mockInfrastructureData.security.compliance.gdpr.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">HIPAA</h4>
                      <p className="text-sm text-muted-foreground">Expires: {mockInfrastructureData.security.compliance.hipaa.expires.toLocaleDateString()}</p>
                    </div>
                    <Badge className={getStatusColor(mockInfrastructureData.security.compliance.hipaa.status)}>
                      {mockInfrastructureData.security.compliance.hipaa.status}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">SSL Certificates</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{mockInfrastructureData.security.certificates.total} total</span>
                      <span className="text-sm text-yellow-600">{mockInfrastructureData.security.certificates.expiring} expiring</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alerts Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-red-600">{mockInfrastructureData.monitoring.alerts.critical}</p>
                    <p className="text-sm text-muted-foreground">Critical</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">{mockInfrastructureData.monitoring.alerts.warning}</p>
                    <p className="text-sm text-muted-foreground">Warning</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{mockInfrastructureData.monitoring.alerts.info}</p>
                    <p className="text-sm text-muted-foreground">Info</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 border rounded-lg bg-red-50">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertOctagon className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-800">Database Connection Pool Full</span>
                    </div>
                    <p className="text-sm text-red-700">Primary database connection pool at 98% capacity</p>
                    <p className="text-xs text-red-600 mt-1">5 minutes ago</p>
                  </div>

                  <div className="p-3 border rounded-lg bg-yellow-50">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">High Memory Usage</span>
                    </div>
                    <p className="text-sm text-yellow-700">Server cluster memory usage above 85%</p>
                    <p className="text-xs text-yellow-600 mt-1">12 minutes ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monitoring Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Monitoring Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Data Points</span>
                    <span className="text-sm font-bold">{formatNumber(mockInfrastructureData.monitoring.metrics.dataPoints)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Alert Rules</span>
                    <span className="text-sm font-bold">{mockInfrastructureData.monitoring.metrics.alertRules}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Dashboards</span>
                    <span className="text-sm font-bold">{mockInfrastructureData.monitoring.metrics.dashboards}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Data Retention</span>
                    <span className="text-sm font-bold">{mockInfrastructureData.monitoring.metrics.retention}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Log Analytics</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Daily Volume</span>
                      <span className="text-sm font-medium">{formatBytes(mockInfrastructureData.monitoring.logs.dailyVolume, 'TB')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Retention</span>
                      <span className="text-sm font-medium">{mockInfrastructureData.monitoring.logs.retention}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Parsed</span>
                      <span className="text-sm font-medium">{mockInfrastructureData.monitoring.logs.parsed}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Backup Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="h-5 w-5" />
                  Backup Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Database Backups</h4>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Frequency: </span>
                        <span className="font-medium">{mockInfrastructureData.backup.databases.frequency}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Size: </span>
                        <span className="font-medium">{formatBytes(mockInfrastructureData.backup.databases.size)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Success: </span>
                        <span className="font-medium">{mockInfrastructureData.backup.databases.success}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Retention: </span>
                        <span className="font-medium">{mockInfrastructureData.backup.databases.retention}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Last backup: {mockInfrastructureData.backup.databases.lastBackup.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">File Backups</h4>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Frequency: </span>
                        <span className="font-medium">{mockInfrastructureData.backup.files.frequency}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Size: </span>
                        <span className="font-medium">{formatBytes(mockInfrastructureData.backup.files.size)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Success: </span>
                        <span className="font-medium">{mockInfrastructureData.backup.files.success}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Retention: </span>
                        <span className="font-medium">{mockInfrastructureData.backup.files.retention}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Last backup: {mockInfrastructureData.backup.files.lastBackup.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disaster Recovery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Disaster Recovery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <span className="font-medium text-green-800">DR Plan Active</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Last test: {mockInfrastructureData.backup.disaster.lastTest.toLocaleDateString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{mockInfrastructureData.backup.disaster.rpo}</p>
                    <p className="text-sm text-muted-foreground">RPO (minutes)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{mockInfrastructureData.backup.disaster.rto}</p>
                    <p className="text-sm text-muted-foreground">RTO (minutes)</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Recovery Objectives</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Recovery Point Objective</span>
                        <span className="font-medium">≤ {mockInfrastructureData.backup.disaster.rpo} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recovery Time Objective</span>
                        <span className="font-medium">≤ {mockInfrastructureData.backup.disaster.rto} minutes</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Button size="sm" className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Run DR Test
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scaling" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Auto-Scaling Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Auto-Scaling Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-Scaling</h4>
                    <p className="text-sm text-muted-foreground">Automatically adjust capacity based on demand</p>
                  </div>
                  <Switch 
                    checked={mockInfrastructureData.scaling.autoScale}
                    onCheckedChange={() => {}}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold">{mockInfrastructureData.scaling.minInstances}</p>
                    <p className="text-sm text-muted-foreground">Min Instances</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{mockInfrastructureData.scaling.currentInstances}</p>
                    <p className="text-sm text-muted-foreground">Current</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{mockInfrastructureData.scaling.maxInstances}</p>
                    <p className="text-sm text-muted-foreground">Max Instances</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Scaling Triggers</h4>
                  <div className="space-y-2">
                    {mockInfrastructureData.scaling.triggers.map((trigger, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{trigger.metric}</span>
                        <Switch 
                          checked={trigger.enabled}
                          onCheckedChange={() => {}}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cooldown Period</span>
                  <span className="text-sm font-bold">{mockInfrastructureData.scaling.cooldown}s</span>
                </div>
              </CardContent>
            </Card>

            {/* Scaling History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Scaling History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockInfrastructureData.scaling.scaleEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          {event.action === 'scale_up' ? (
                            <ArrowUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-blue-600" />
                          )}
                          <span className="font-medium capitalize">{event.action.replace('_', ' ')}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.reason}</p>
                        <p className="text-xs text-muted-foreground">{event.time.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{event.action === 'scale_up' ? '+' : '-'}{event.instances}</p>
                        <p className="text-sm text-muted-foreground">instances</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}