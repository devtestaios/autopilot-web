'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Alert, AlertRule, smartAlertEngine } from '@/lib/smartAlertEngine';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Target,
  Zap,
  Brain,
  Bell,
  BellOff,
  Settings,
  Filter,
  CheckCircle,
  X,
  RefreshCw,
  Clock,
  Activity
} from 'lucide-react';

interface AlertDashboardProps {
  className?: string;
}

export default function AlertDashboard({ className }: AlertDashboardProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    severity: [] as string[],
    type: [] as string[],
    dismissed: false
  });
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Load initial data
  useEffect(() => {
    loadData();
    setAlertRules(smartAlertEngine.getAlertRules());
  }, []);

  // Auto-refresh alerts
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshAlerts();
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadData = async () => {
    setLoading(true);
    try {
      await refreshAlerts();
    } finally {
      setLoading(false);
    }
  };

  const refreshAlerts = async () => {
    try {
      // Get current alerts and generate new ones
      await smartAlertEngine.analyzeAllCampaigns();
      const predictiveAlerts = await smartAlertEngine.generatePredictiveAlerts();
      
      // Get filtered alerts
      const currentAlerts = smartAlertEngine.getAlerts({
        severity: filters.severity.length ? filters.severity as Alert['severity'][] : undefined,
        type: filters.type.length ? filters.type as Alert['type'][] : undefined,
        dismissed: filters.dismissed
      });

      setAlerts(currentAlerts);
    } catch (error) {
      console.error('Error refreshing alerts:', error);
    }
  };

  const dismissAlert = (alertId: string) => {
    smartAlertEngine.dismissAlert(alertId);
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  };

  const dismissAllAlerts = () => {
    smartAlertEngine.dismissAllAlerts();
    setAlerts(prev => prev.map(alert => ({ ...alert, dismissed: true })));
  };

  const toggleAlertRule = (ruleId: string, enabled: boolean) => {
    smartAlertEngine.updateAlertRule(ruleId, { enabled });
    setAlertRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled } : rule
    ));
  };

  const getAlertIcon = (alert: Alert) => {
    const iconClass = "h-5 w-5";
    
    switch (alert.type) {
      case 'budget':
        return <DollarSign className={iconClass} />;
      case 'performance':
        return alert.severity === 'critical' ? <TrendingDown className={iconClass} /> : <Activity className={iconClass} />;
      case 'opportunity':
        return <TrendingUp className={iconClass} />;
      case 'anomaly':
        return <Zap className={iconClass} />;
      case 'prediction':
        return <Brain className={iconClass} />;
      default:
        return <AlertCircle className={iconClass} />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeColor = (type: Alert['type']) => {
    switch (type) {
      case 'budget': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'performance': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'opportunity': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'anomaly': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'prediction': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const activeAlerts = alerts.filter(alert => !alert.dismissed);
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');
  const highAlerts = activeAlerts.filter(alert => alert.severity === 'high');
  const opportunities = activeAlerts.filter(alert => alert.type === 'opportunity');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold">{activeAlerts.length}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-600">{criticalAlerts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-orange-600">{highAlerts.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Opportunities</p>
                <p className="text-2xl font-bold text-green-600">{opportunities.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="alerts" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
            <TabsTrigger value="history">Alert History</TabsTrigger>
            <TabsTrigger value="rules">Alert Rules</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Auto-refresh</span>
              <Switch 
                checked={autoRefresh} 
                onCheckedChange={setAutoRefresh}
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshAlerts}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {activeAlerts.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={dismissAllAlerts}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Dismiss All
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="alerts" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : activeAlerts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">All Clear!</h3>
                <p className="text-muted-foreground">No active alerts at this time.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <Card key={alert.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(alert.type)}`}>
                          {getAlertIcon(alert)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg">{alert.title}</CardTitle>
                            <Badge variant={getSeverityColor(alert.severity)}>
                              {alert.severity.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className={getTypeColor(alert.type)}>
                              {alert.type.toUpperCase()}
                            </Badge>
                          </div>
                          <CardDescription className="text-sm">
                            {alert.campaignName && (
                              <span className="font-medium">Campaign: {alert.campaignName} • </span>
                            )}
                            <Clock className="inline h-3 w-3 mr-1" />
                            {formatTimeAgo(alert.timestamp)}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">{alert.message}</p>
                    
                    {alert.metrics && Object.keys(alert.metrics).length > 0 && (
                      <div className="mb-4 p-3 bg-muted rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Key Metrics</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          {Object.entries(alert.metrics).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-muted-foreground">{key.replace(/_/g, ' ')}:</span>
                              <span className="ml-1 font-medium">
                                {typeof value === 'number' ? value.toFixed(2) : value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {alert.actionable && alert.suggestedActions && alert.suggestedActions.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Suggested Actions
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {alert.suggestedActions.map((action, index) => (
                            <li key={index}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            {alerts.filter(alert => alert.dismissed).map((alert) => (
              <Card key={alert.id} className="opacity-60">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(alert.type)}`}>
                      {getAlertIcon(alert)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                        <Badge variant="outline">DISMISSED</Badge>
                        <Badge variant={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {alert.campaignName && (
                          <span className="font-medium">Campaign: {alert.campaignName} • </span>
                        )}
                        <Clock className="inline h-3 w-3 mr-1" />
                        {formatTimeAgo(alert.timestamp)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="space-y-4">
            {alertRules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      <CardDescription>
                        Type: {rule.type} • Severity: {rule.severity}
                        {rule.cooldown && ` • Cooldown: ${rule.cooldown}m`}
                      </CardDescription>
                    </div>
                    <Switch 
                      checked={rule.enabled} 
                      onCheckedChange={(enabled) => toggleAlertRule(rule.id, enabled)}
                    />
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Conditions</h4>
                    {rule.conditions.map((condition, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        {condition.metric} {condition.operator} {condition.value}
                        {condition.timeframe && ` (${condition.timeframe})`}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Settings</CardTitle>
              <CardDescription>Configure how alerts are generated and displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Auto-refresh Alerts</h4>
                  <p className="text-sm text-muted-foreground">Automatically check for new alerts every minute</p>
                </div>
                <Switch 
                  checked={autoRefresh} 
                  onCheckedChange={setAutoRefresh}
                />
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Alert Filters</h4>
                
                <div>
                  <label className="text-sm font-medium">Severity Levels</label>
                  <div className="flex gap-2 mt-2">
                    {['critical', 'high', 'medium', 'low'].map((severity) => (
                      <Badge 
                        key={severity}
                        variant={filters.severity.includes(severity) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          setFilters(prev => ({
                            ...prev,
                            severity: prev.severity.includes(severity)
                              ? prev.severity.filter(s => s !== severity)
                              : [...prev.severity, severity]
                          }));
                        }}
                      >
                        {severity}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Alert Types</label>
                  <div className="flex gap-2 mt-2">
                    {['budget', 'performance', 'opportunity', 'anomaly', 'prediction'].map((type) => (
                      <Badge 
                        key={type}
                        variant={filters.type.includes(type) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          setFilters(prev => ({
                            ...prev,
                            type: prev.type.includes(type)
                              ? prev.type.filter(t => t !== type)
                              : [...prev.type, type]
                          }));
                        }}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}