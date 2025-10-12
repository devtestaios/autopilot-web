'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { 
  Clock,
  Calendar,
  Settings,
  Play,
  Pause,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Timer,
  Zap,
  Target,
  Brain,
  BarChart3,
  Mail,
  MessageSquare,
  Webhook,
  Plus,
  RefreshCw,
  TrendingUp,
  Activity,
  Filter,
  Download,
  Upload
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface ScheduledOptimization {
  id: string;
  recommendationId: string;
  scheduledFor: string;
  status: 'pending' | 'executed' | 'failed' | 'cancelled';
  platform: string;
  campaignId: string;
  campaignName: string;
  type: string;
  title: string;
  expectedImpact: number;
  confidence: number;
  createdAt: string;
  executedAt?: string;
  error?: string;
}

interface AutoOptimizationSettings {
  enabled: boolean;
  minimumConfidence: number;
  maxExecutionsPerDay: number;
  excludedPlatforms: string[];
  excludedCampaigns: string[];
  scheduleHours: {
    start: number;
    end: number;
  };
  notificationPreferences: {
    email: boolean;
    slack: boolean;
    webhook: boolean;
  };
}

interface SchedulerSummary {
  total: number;
  pending: number;
  executed: number;
  failed: number;
  cancelled: number;
  nextExecution: string | null;
  totalPotentialImpact: number;
}

// =============================================================================
// AUTOMATION SCHEDULER COMPONENT
// =============================================================================

export default function AutomationScheduler() {
  const [scheduledOptimizations, setScheduledOptimizations] = useState<ScheduledOptimization[]>([]);
  const [summary, setSummary] = useState<SchedulerSummary | null>(null);
  const [settings, setSettings] = useState<AutoOptimizationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    loadScheduledOptimizations();
    
    // Set up real-time updates
    const interval = setInterval(loadScheduledOptimizations, 60000); // Every minute
    return () => clearInterval(interval);
  }, [selectedStatus, selectedPlatform]);

  const loadScheduledOptimizations = async () => {
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams();
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (selectedPlatform !== 'all') params.append('platform', selectedPlatform);
      
      const response = await fetch(`/api/optimization/scheduler?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setScheduledOptimizations(data.scheduled);
        setSummary(data.summary);
        setSettings(data.settings);
        setError(null);
      } else {
        setError('Failed to load scheduled optimizations');
      }
    } catch (error) {
      console.error('Error loading scheduled optimizations:', error);
      setError('Failed to load scheduled optimizations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteNow = async (scheduledId: string) => {
    try {
      const response = await fetch('/api/optimization/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'execute',
          scheduledId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Optimization Executed',
          description: 'The scheduled optimization has been executed successfully.',
        });
        loadScheduledOptimizations();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'Execution Failed',
        description: 'Failed to execute the optimization. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleCancelScheduled = async (scheduledId: string) => {
    try {
      const response = await fetch('/api/optimization/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel',
          scheduledId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Optimization Cancelled',
          description: 'The scheduled optimization has been cancelled.',
        });
        loadScheduledOptimizations();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'Cancellation Failed',
        description: 'Failed to cancel the optimization. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateSettings = async (newSettings: Partial<AutoOptimizationSettings>) => {
    try {
      const response = await fetch('/api/optimization/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_settings',
          settings: newSettings
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSettings(data.settings);
        toast({
          title: 'Settings Updated',
          description: 'Auto-optimization settings have been updated successfully.',
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'executed': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'executed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPlatformEmoji = (platform: string) => {
    switch (platform) {
      case 'facebook': return '📘';
      case 'google-ads': return '🎯';
      case 'linkedin': return '💼';
      case 'tiktok': return '🎵';
      case 'twitter': return '🐦';
      default: return '🔗';
    }
  };

  const formatTimeToExecution = (scheduledFor: string) => {
    const now = new Date();
    const scheduled = new Date(scheduledFor);
    const diffMs = scheduled.getTime() - now.getTime();
    
    if (diffMs < 0) {
      return 'Overdue';
    }
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  if (isLoading && scheduledOptimizations.length === 0) {
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="h-8 w-8 text-orange-500" />
              Automation Scheduler
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor automated campaign optimizations
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="executed">Executed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Platforms</option>
              <option value="facebook">Facebook</option>
              <option value="google-ads">Google Ads</option>
              <option value="linkedin">LinkedIn</option>
            </select>
            
            <Button
              onClick={loadScheduledOptimizations}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="scheduled" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scheduled">Scheduled Optimizations</TabsTrigger>
            <TabsTrigger value="settings">Auto-Optimization Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="scheduled" className="space-y-6">
            {/* Summary Cards */}
            {summary && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Scheduled</p>
                        <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">{summary.pending}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Executed</p>
                        <p className="text-2xl font-bold text-green-600">{summary.executed}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Potential Impact</p>
                        <p className="text-2xl font-bold text-purple-600">+{summary.totalPotentialImpact.toFixed(1)}%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Next Execution Alert */}
            {summary?.nextExecution && (
              <Alert className="border-blue-200 bg-blue-50">
                <Timer className="h-4 w-4" />
                <AlertDescription>
                  Next optimization scheduled for {new Date(summary.nextExecution).toLocaleString()}
                  ({formatTimeToExecution(summary.nextExecution)} from now)
                </AlertDescription>
              </Alert>
            )}

            {/* Scheduled Optimizations List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Scheduled Optimizations</h2>
              
              {scheduledOptimizations.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Scheduled Optimizations</h3>
                    <p className="text-gray-600">
                      No optimizations are currently scheduled. Visit the optimization page to schedule new ones.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                scheduledOptimizations.map((optimization) => (
                  <Card key={optimization.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <Brain className="h-6 w-6 text-purple-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xl">{getPlatformEmoji(optimization.platform)}</span>
                              <h3 className="text-lg font-semibold text-gray-900">{optimization.title}</h3>
                              <Badge className={getStatusColor(optimization.status)}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(optimization.status)}
                                  {optimization.status}
                                </div>
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              Campaign: {optimization.campaignName}
                            </p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-gray-500">Scheduled For</p>
                                <p className="text-sm font-medium">
                                  {new Date(optimization.scheduledFor).toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Time to Execute</p>
                                <p className="text-sm font-medium">
                                  {formatTimeToExecution(optimization.scheduledFor)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Expected Impact</p>
                                <p className="text-sm font-medium text-green-600">
                                  +{optimization.expectedImpact}%
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Confidence</p>
                                <p className="text-sm font-medium text-blue-600">
                                  {optimization.confidence}%
                                </p>
                              </div>
                            </div>

                            {optimization.executedAt && (
                              <p className="text-xs text-gray-500">
                                Executed: {new Date(optimization.executedAt).toLocaleString()}
                              </p>
                            )}

                            {optimization.error && (
                              <Alert className="mt-2 border-red-200 bg-red-50">
                                <XCircle className="h-4 w-4" />
                                <AlertDescription className="text-sm">
                                  {optimization.error}
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </div>
                        
                        {optimization.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelScheduled(optimization.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleExecuteNow(optimization.id)}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Execute Now
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {settings && (
              <div className="space-y-6">
                {/* Auto-Optimization Toggle */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Auto-Optimization Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Enable Auto-Optimization</h3>
                        <p className="text-sm text-gray-600">
                          Automatically execute high-confidence optimizations without manual review
                        </p>
                      </div>
                      <Switch
                        checked={settings.enabled}
                        onCheckedChange={(checked) => 
                          handleUpdateSettings({ enabled: checked })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Confidence Level
                        </label>
                        <select
                          value={settings.minimumConfidence}
                          onChange={(e) => 
                            handleUpdateSettings({ minimumConfidence: parseInt(e.target.value) })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value={80}>80%</option>
                          <option value={85}>85%</option>
                          <option value={90}>90%</option>
                          <option value={95}>95%</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Executions Per Day
                        </label>
                        <select
                          value={settings.maxExecutionsPerDay}
                          onChange={(e) => 
                            handleUpdateSettings({ maxExecutionsPerDay: parseInt(e.target.value) })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Schedule Hours</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                          <select
                            value={settings.scheduleHours.start}
                            onChange={(e) => 
                              handleUpdateSettings({ 
                                scheduleHours: { 
                                  ...settings.scheduleHours, 
                                  start: parseInt(e.target.value) 
                                } 
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            {Array.from({length: 24}, (_, i) => (
                              <option key={i} value={i}>{i}:00</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">End Time</label>
                          <select
                            value={settings.scheduleHours.end}
                            onChange={(e) => 
                              handleUpdateSettings({ 
                                scheduleHours: { 
                                  ...settings.scheduleHours, 
                                  end: parseInt(e.target.value) 
                                } 
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            {Array.from({length: 24}, (_, i) => (
                              <option key={i} value={i}>{i}:00</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notification Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>Email Notifications</span>
                      </div>
                      <Switch
                        checked={settings.notificationPreferences.email}
                        onCheckedChange={(checked) => 
                          handleUpdateSettings({ 
                            notificationPreferences: { 
                              ...settings.notificationPreferences, 
                              email: checked 
                            } 
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-gray-500" />
                        <span>Slack Notifications</span>
                      </div>
                      <Switch
                        checked={settings.notificationPreferences.slack}
                        onCheckedChange={(checked) => 
                          handleUpdateSettings({ 
                            notificationPreferences: { 
                              ...settings.notificationPreferences, 
                              slack: checked 
                            } 
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Webhook className="h-4 w-4 text-gray-500" />
                        <span>Webhook Notifications</span>
                      </div>
                      <Switch
                        checked={settings.notificationPreferences.webhook}
                        onCheckedChange={(checked) => 
                          handleUpdateSettings({ 
                            notificationPreferences: { 
                              ...settings.notificationPreferences, 
                              webhook: checked 
                            } 
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}