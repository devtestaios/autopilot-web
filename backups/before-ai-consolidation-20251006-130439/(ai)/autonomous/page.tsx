'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Brain, 
  Play, 
  Pause, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Shield,
  Zap,
  Settings,
  Activity,
  TrendingUp
} from 'lucide-react';

interface Decision {
  decision_id: string;
  decision_type: string;
  campaign_id: string;
  platform: string;
  proposed_action: any;
  reasoning: string;
  confidence_score: number;
  risk_level: string;
  expected_impact: any;
  requires_human_approval: boolean;
  auto_execute_allowed: boolean;
  safety_checks: any[];
  expires_at: string;
}

interface AutonomySettings {
  auto_execution_enabled: boolean;
  risk_tolerance: string;
  approval_thresholds: {
    budget_change_percentage: number;
    minimum_confidence_score: number;
    maximum_daily_spend: number;
  };
  safety_guardrails_enabled: boolean;
  emergency_stop_enabled: boolean;
}

export default function AutonomousControlCenter() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [settings, setSettings] = useState<AutonomySettings | null>(null);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [decisionsRes, settingsRes, performanceRes] = await Promise.all([
        fetch('/api/v1/autonomous/decisions/pending'),
        fetch('/api/v1/autonomous/settings'),
        fetch('/api/v1/autonomous/performance/summary')
      ]);

      if (decisionsRes.ok) {
        const decisionsData = await decisionsRes.json();
        setDecisions(decisionsData.decisions || []);
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData.settings);
      }

      if (performanceRes.ok) {
        const performanceData = await performanceRes.json();
        setPerformanceData(performanceData);
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to load autonomous control data');
      setLoading(false);
    }
  };

  const approveDecision = async (decisionId: string, approved: boolean) => {
    try {
      const response = await fetch(`/api/v1/autonomous/decisions/${decisionId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision_id: decisionId,
          approved,
          approval_notes: approved ? 'Approved via control center' : 'Rejected via control center'
        })
      });

      if (response.ok) {
        loadData(); // Refresh data
      }
    } catch (err) {
      setError('Failed to approve/reject decision');
    }
  };

  const executeDecision = async (decisionId: string) => {
    try {
      const response = await fetch('/api/v1/autonomous/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision_id: decisionId,
          priority: 1
        })
      });

      if (response.ok) {
        loadData(); // Refresh data
      }
    } catch (err) {
      setError('Failed to execute decision');
    }
  };

  const toggleAutonomousMode = async () => {
    if (!settings) return;

    try {
      const newSettings = {
        ...settings,
        auto_execution_enabled: !settings.auto_execution_enabled
      };

      const response = await fetch('/api/v1/autonomous/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });

      if (response.ok) {
        setSettings(newSettings);
      }
    } catch (err) {
      setError('Failed to update autonomy settings');
    }
  };

  const emergencyStop = async () => {
    try {
      const response = await fetch('/api/v1/autonomous/emergency-stop', {
        method: 'POST'
      });

      if (response.ok) {
        loadData(); // Refresh data
      }
    } catch (err) {
      setError('Failed to activate emergency stop');
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDecisionTypeIcon = (type: string) => {
    switch (type) {
      case 'budget_adjustment': return <TrendingUp className="w-4 h-4" />;
      case 'bid_optimization': return <Zap className="w-4 h-4" />;
      case 'campaign_pause': return <Pause className="w-4 h-4" />;
      case 'emergency_stop': return <AlertTriangle className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Brain className="w-8 h-8" />
                Autonomous Control Center
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                AI-powered autonomous decision making and campaign optimization
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {settings && (
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Autonomous Mode</label>
                  <Switch
                    checked={settings.auto_execution_enabled}
                    onCheckedChange={toggleAutonomousMode}
                  />
                </div>
              )}
              
              <Button
                variant="destructive"
                onClick={emergencyStop}
                className="flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Emergency Stop
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* System Status */}
        {performanceData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Decisions</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {performanceData.decision_metrics?.total_decisions_generated || 0}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                    <p className="text-2xl font-bold text-green-600">
                      {((performanceData.decision_metrics?.success_rate || 0) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Accuracy</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {((performanceData.learning_metrics?.average_accuracy_score || 0) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <Brain className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Queue Status</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {performanceData.execution_metrics?.total_queued || 0}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pending Decisions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Pending Decisions ({decisions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {decisions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No pending decisions. The AI is monitoring campaigns and will propose optimizations as needed.
              </div>
            ) : (
              <div className="space-y-4">
                {decisions.map((decision) => (
                  <div key={decision.decision_id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getDecisionTypeIcon(decision.decision_type)}
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {decision.decision_type.replace('_', ' ').toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Campaign: {decision.campaign_id} • Platform: {decision.platform}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskColor(decision.risk_level)}>
                          {decision.risk_level.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {(decision.confidence_score * 100).toFixed(0)}% confidence
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-700 dark:text-gray-300 mb-2">
                        {decision.reasoning}
                      </p>
                      
                      {decision.expected_impact && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Expected Impact: {Object.entries(decision.expected_impact).map(([key, value]) => 
                            `${key}: ${value}`
                          ).join(', ')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        Expires: {new Date(decision.expires_at).toLocaleString()}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {decision.requires_human_approval && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => approveDecision(decision.decision_id, false)}
                              className="flex items-center gap-1"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => approveDecision(decision.decision_id, true)}
                              className="flex items-center gap-1"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </Button>
                          </>
                        )}
                        
                        {decision.auto_execute_allowed && (
                          <Button
                            size="sm"
                            onClick={() => executeDecision(decision.decision_id)}
                            className="flex items-center gap-1"
                          >
                            <Play className="w-4 h-4" />
                            Execute
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Settings */}
        {settings && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Autonomy Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">System Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Auto Execution:</span>
                      <Badge variant={settings.auto_execution_enabled ? "default" : "secondary"}>
                        {settings.auto_execution_enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Safety Guardrails:</span>
                      <Badge variant={settings.safety_guardrails_enabled ? "default" : "destructive"}>
                        {settings.safety_guardrails_enabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Tolerance:</span>
                      <Badge variant="outline">{settings.risk_tolerance.toUpperCase()}</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Approval Thresholds</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Budget Change Limit:</span>
                      <span>{settings.approval_thresholds.budget_change_percentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min Confidence Score:</span>
                      <span>{(settings.approval_thresholds.minimum_confidence_score * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Daily Spend:</span>
                      <span>${settings.approval_thresholds.maximum_daily_spend}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}