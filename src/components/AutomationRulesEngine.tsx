'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Settings, 
  Activity, 
  Zap, 
  Target, 
  Shield, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';

interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  campaign_id?: string;
  rule_type: string;
  conditions: any;
  actions: any;
  is_active: boolean;
  priority: number;
  last_triggered?: string;
  trigger_count: number;
  created_at: string;
  updated_at: string;
}

interface AutomationLog {
  id: string;
  rule_id: string;
  campaign_id: string;
  action_taken: string;
  conditions_met: any;
  results: any;
  success: boolean;
  error_message?: string;
  triggered_at: string;
}

interface AutomationDashboard {
  total_rules: number;
  active_rules: number;
  recent_executions_24h: number;
  success_rate_24h: number;
  recent_activity: AutomationLog[];
}

export default function AutomationRulesEngine() {
  const [dashboardData, setDashboardData] = useState<AutomationDashboard | null>(null);
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'logs' | 'create'>('overview');
  const [executingRules, setExecutingRules] = useState(false);

  const API_BASE = process.env.NODE_ENV === 'production' 
    ? 'https://autopilot-api-1.onrender.com' 
    : 'http://localhost:8000';

  useEffect(() => {
    fetchDashboardData();
    fetchRules();
    fetchLogs();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE}/automation/dashboard`);
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchRules = async () => {
    try {
      const response = await fetch(`${API_BASE}/automation/rules`);
      if (response.ok) {
        const data = await response.json();
        setRules(data);
      }
    } catch (error) {
      console.error('Error fetching rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${API_BASE}/automation/logs?days=7&limit=50`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const toggleRule = async (ruleId: string) => {
    try {
      const response = await fetch(`${API_BASE}/automation/rules/${ruleId}/toggle`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchRules();
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error toggling rule:', error);
    }
  };

  const executeRules = async () => {
    setExecutingRules(true);
    try {
      const response = await fetch(`${API_BASE}/automation/execute`, {
        method: 'POST',
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Automation execution result:', result);
        fetchDashboardData();
        fetchLogs();
      }
    } catch (error) {
      console.error('Error executing rules:', error);
    } finally {
      setExecutingRules(false);
    }
  };

  const getRuleTypeIcon = (ruleType: string) => {
    switch (ruleType) {
      case 'budget_optimization': return <Target className="w-4 h-4" />;
      case 'performance_trigger': return <TrendingUp className="w-4 h-4" />;
      case 'auto_pause': return <Shield className="w-4 h-4" />;
      case 'bid_adjustment': return <Zap className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getRuleTypeColor = (ruleType: string) => {
    switch (ruleType) {
      case 'budget_optimization': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'performance_trigger': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'auto_pause': return 'bg-red-500/10 text-red-600 border-red-200';
      case 'bid_adjustment': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading automation engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Automation Rules Engine
          </h1>
          <p className="text-muted-foreground mt-2">
            Intelligent campaign optimization with AI-powered automation
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={executeRules}
            disabled={executingRules}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {executingRules ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Execute Rules
              </>
            )}
          </Button>
          <Button
            onClick={() => setActiveTab('create')}
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Rule
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'rules', label: 'Rules', icon: Settings },
          { id: 'logs', label: 'Activity', icon: Clock },
          { id: 'create', label: 'Create Rule', icon: Plus }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Rules</p>
                <p className="text-2xl font-bold">{dashboardData.total_rules}</p>
              </div>
              <Settings className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Rules</p>
                <p className="text-2xl font-bold text-green-600">{dashboardData.active_rules}</p>
              </div>
              <Play className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">24h Executions</p>
                <p className="text-2xl font-bold">{dashboardData.recent_executions_24h}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">{dashboardData.success_rate_24h.toFixed(1)}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <Progress value={dashboardData.success_rate_24h} className="mt-2" />
          </Card>

          {/* Recent Activity */}
          <Card className="col-span-full p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {dashboardData.recent_activity.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {log.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium">{log.action_taken}</p>
                      <p className="text-sm text-muted-foreground">Campaign {log.campaign_id.slice(0, 8)}...</p>
                    </div>
                  </div>
                  <Badge variant={log.success ? "default" : "destructive"}>
                    {log.success ? 'Success' : 'Failed'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          {rules.map((rule) => (
            <Card key={rule.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getRuleTypeColor(rule.rule_type)}`}>
                    {getRuleTypeIcon(rule.rule_type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{rule.name}</h3>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="outline">{rule.rule_type.replace('_', ' ')}</Badge>
                      <span className="text-sm text-muted-foreground">
                        Priority: {rule.priority} | Triggered: {rule.trigger_count} times
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={rule.is_active}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Automation Logs</h3>
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {log.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium">{log.action_taken}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(log.triggered_at).toLocaleString()} | Campaign {log.campaign_id.slice(0, 8)}...
                    </p>
                    {log.error_message && (
                      <p className="text-sm text-red-600 mt-1">{log.error_message}</p>
                    )}
                  </div>
                </div>
                <Badge variant={log.success ? "default" : "destructive"}>
                  {log.success ? 'Success' : 'Failed'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Create Rule Tab */}
      {activeTab === 'create' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Create Automation Rule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Pre-built Rule Templates</h4>
              
              <div className="space-y-3">
                {[
                  {
                    name: 'Auto-Pause Low CTR',
                    description: 'Pause campaigns with CTR below 1%',
                    type: 'performance_trigger',
                    icon: Shield
                  },
                  {
                    name: 'Budget Protection',
                    description: 'Pause when spend exceeds budget threshold',
                    type: 'budget_optimization',
                    icon: Target
                  },
                  {
                    name: 'Bid Optimization',
                    description: 'Increase bids for high-performing campaigns',
                    type: 'bid_adjustment',
                    icon: Zap
                  },
                  {
                    name: 'Keyword Cleanup',
                    description: 'Pause underperforming keywords',
                    type: 'performance_trigger',
                    icon: TrendingUp
                  }
                ].map((template) => {
                  const Icon = template.icon;
                  return (
                    <div key={template.name} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getRuleTypeColor(template.type)}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Quick Setup</h4>
              <p className="text-sm text-muted-foreground">
                Advanced rule creation with custom conditions and actions coming soon. 
                Use the pre-built templates to get started with automation.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}