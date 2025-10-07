import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertTriangle, TrendingUp, FileText, Download } from 'lucide-react';

interface ComplianceMetrics {
  compliance_score: number;
  score_breakdown: {
    mfa_adoption: number;
    data_encryption: number;
    audit_coverage: number;
  };
  security_metrics: {
    total_users: number;
    active_users: number;
    mfa_enabled: number;
    new_users_30d: number;
  };
  audit_trail: {
    total_events: number;
    high_risk_events: number;
    events_24h: number;
  };
  recent_events: Array<{
    action: string;
    risk_level: string;
    timestamp: string;
    details: any;
  }>;
}

interface AuditReadiness {
  readiness_percentage: number;
  total_criteria: number;
  compliant_criteria: number;
  trust_service_criteria: any;
  recommendations: Array<{
    category: string;
    item: string;
    priority: string;
    action: string;
  }>;
}

export default function ComplianceDashboard() {
  const [metrics, setMetrics] = useState<ComplianceMetrics | null>(null);
  const [auditReadiness, setAuditReadiness] = useState<AuditReadiness | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplianceData();
  }, []);

  const fetchComplianceData = async () => {
    try {
      const [metricsRes, auditRes] = await Promise.all([
        fetch('/api/compliance/dashboard'),
        fetch('/api/compliance/audit-readiness')
      ]);
      
      setMetrics(await metricsRes.json());
      setAuditReadiness(await auditRes.json());
    } catch (error) {
      console.error('Failed to fetch compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type: string) => {
    try {
      const response = await fetch(`/api/compliance/generate-report?report_type=${type}`, {
        method: 'POST'
      });
      const report = await response.json();
      
      // Trigger download
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliance-report-${type}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SOC 2 Compliance Dashboard</h1>
          <p className="text-gray-600">Monitor security posture and audit readiness</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => generateReport('monthly')}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Compliance Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Score</p>
              <p className={`text-3xl font-bold ${getScoreColor(metrics?.compliance_score || 0)}`}>
                {metrics?.compliance_score}%
              </p>
            </div>
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Audit Readiness</p>
              <p className={`text-3xl font-bold ${getScoreColor(auditReadiness?.readiness_percentage || 0)}`}>
                {auditReadiness?.readiness_percentage}%
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Security Events (24h)</p>
              <p className="text-3xl font-bold text-gray-900">
                {metrics?.audit_trail.events_24h}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Risk Events</p>
              <p className="text-3xl font-bold text-red-600">
                {metrics?.audit_trail.high_risk_events}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Compliance Score Breakdown</h3>
        <div className="space-y-4">
          {metrics?.score_breakdown && Object.entries(metrics.score_breakdown).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm font-medium capitalize">
                {key.replace('_', ' ')}
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
                <span className={`text-sm font-medium ${getScoreColor(value)}`}>
                  {value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SOC 2 Trust Service Criteria */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">SOC 2 Trust Service Criteria</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {auditReadiness?.trust_service_criteria && Object.entries(auditReadiness.trust_service_criteria).map(([key, category]: [string, any]) => (
            <div key={key} className="border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{category.name}</h4>
              <div className="space-y-2">
                {category.criteria.map((criterion: any, index: number) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{criterion.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      criterion.status === 'compliant' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {criterion.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Security Events */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Security Events</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics?.recent_events.map((event, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(event.risk_level)}`}>
                      {event.risk_level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Priority Recommendations</h3>
        <div className="space-y-3">
          {auditReadiness?.recommendations.slice(0, 5).map((rec, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                rec.priority === 'high' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {rec.priority}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{rec.category}: {rec.item}</p>
                <p className="text-sm text-gray-600">{rec.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
