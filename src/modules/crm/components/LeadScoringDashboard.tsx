// Lead Scoring Dashboard Component
// Advanced lead scoring with AI-powered analytics and real-time updates

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Brain, 
  Filter,
  Download,
  RefreshCw,
  Search,
  BarChart3,
  PieChart,
  Users,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import CRMApiService from '../services/crm-api.service';
import { Lead, LeadScore, ScoreFactor } from '../types/crm.types';

interface LeadScoringDashboardProps {
  className?: string;
}

interface ScoreDistribution {
  range: string;
  count: number;
  percentage: number;
  color: string;
}

interface ScoringMetrics {
  totalLeads: number;
  avgScore: number;
  highQualityLeads: number;
  scoreTrend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  distribution: ScoreDistribution[];
  topFactors: ScoreFactor[];
}

const LeadScoringDashboard: React.FC<LeadScoringDashboardProps> = ({ className = '' }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadScores, setLeadScores] = useState<LeadScore[]>([]);
  const [metrics, setMetrics] = useState<ScoringMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScoreRange, setSelectedScoreRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'stage' | 'value'>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Mock data for demonstration
  const mockLeads: Lead[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@techcorp.com',
      company: 'TechCorp Solutions',
      position: 'CTO',
      score: 92,
      stage: 'qualified',
      lastActivity: '2024-01-15T10:30:00Z',
      value: 75000,
      source: 'LinkedIn',
      probability: 85,
      assignedTo: 'Sarah Johnson',
      tags: ['Enterprise', 'Hot Lead', 'Decision Maker'],
      customFields: {},
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-15'),
      activities: [],
      notes: []
    },
    {
      id: '2',
      name: 'Emily Davis',
      email: 'emily.davis@innovate.io',
      company: 'Innovate Digital',
      position: 'Marketing Director',
      score: 78,
      stage: 'nurturing',
      lastActivity: '2024-01-14T14:20:00Z',
      value: 45000,
      source: 'Website',
      probability: 65,
      assignedTo: 'Mike Chen',
      tags: ['Mid-Market', 'Content Download'],
      customFields: {},
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-14'),
      activities: [],
      notes: []
    },
    {
      id: '3',
      name: 'Robert Wilson',
      email: 'r.wilson@startup.com',
      company: 'Startup Ventures',
      position: 'Founder',
      score: 65,
      stage: 'discovery',
      lastActivity: '2024-01-13T09:15:00Z',
      value: 25000,
      source: 'Google Ads',
      probability: 45,
      assignedTo: 'Lisa Park',
      tags: ['Startup', 'Budget Conscious'],
      customFields: {},
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-13'),
      activities: [],
      notes: []
    },
    {
      id: '4',
      name: 'Maria Garcia',
      email: 'maria.garcia@globaltech.com',
      company: 'GlobalTech Industries',
      position: 'VP of Operations',
      score: 89,
      stage: 'proposal',
      lastActivity: '2024-01-15T16:45:00Z',
      value: 120000,
      source: 'Referral',
      probability: 80,
      assignedTo: 'David Kim',
      tags: ['Enterprise', 'Referral', 'High Value'],
      customFields: {},
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-15'),
      activities: [],
      notes: []
    },
    {
      id: '5',
      name: 'Alex Thompson',
      email: 'alex.t@fastgrow.com',
      company: 'FastGrow Marketing',
      position: 'CEO',
      score: 42,
      stage: 'lead',
      lastActivity: '2024-01-11T11:30:00Z',
      value: 18000,
      source: 'Email Campaign',
      probability: 25,
      assignedTo: 'Sarah Johnson',
      tags: ['Small Business', 'Price Sensitive'],
      customFields: {},
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-11'),
      activities: [],
      notes: []
    }
  ];

  const mockScores: LeadScore[] = mockLeads.map(lead => ({
    leadId: lead.id,
    score: lead.score,
    factors: [
      {
        category: 'demographic',
        factor: 'Company Size',
        weight: 0.3,
        value: lead.value > 50000 ? 0.9 : lead.value > 25000 ? 0.6 : 0.3,
        impact: lead.value > 50000 ? 27 : lead.value > 25000 ? 18 : 9
      },
      {
        category: 'engagement',
        factor: 'Email Engagement',
        weight: 0.25,
        value: Math.random() * 0.8 + 0.2,
        impact: Math.floor((Math.random() * 0.8 + 0.2) * 25)
      },
      {
        category: 'behavioral',
        factor: 'Website Activity',
        weight: 0.2,
        value: Math.random() * 0.9 + 0.1,
        impact: Math.floor((Math.random() * 0.9 + 0.1) * 20)
      },
      {
        category: 'company_fit',
        factor: 'Industry Match',
        weight: 0.15,
        value: Math.random() * 0.7 + 0.3,
        impact: Math.floor((Math.random() * 0.7 + 0.3) * 15)
      },
      {
        category: 'intent_signals',
        factor: 'Purchase Intent',
        weight: 0.1,
        value: Math.random() * 0.6 + 0.4,
        impact: Math.floor((Math.random() * 0.6 + 0.4) * 10)
      }
    ],
    lastCalculated: new Date(),
    trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.25 ? 'stable' : 'down'
  }));

  const mockMetrics: ScoringMetrics = {
    totalLeads: mockLeads.length,
    avgScore: Math.round(mockLeads.reduce((sum, lead) => sum + lead.score, 0) / mockLeads.length),
    highQualityLeads: mockLeads.filter(lead => lead.score >= 80).length,
    scoreTrend: 'up',
    trendPercentage: 8.5,
    distribution: [
      { range: '90-100', count: 2, percentage: 40, color: '#10b981' },
      { range: '80-89', count: 1, percentage: 20, color: '#3b82f6' },
      { range: '70-79', count: 1, percentage: 20, color: '#8b5cf6' },
      { range: '60-69', count: 1, percentage: 20, color: '#f59e0b' },
      { range: '0-59', count: 0, percentage: 0, color: '#ef4444' }
    ],
    topFactors: [
      {
        category: 'demographic',
        factor: 'Company Size',
        weight: 0.3,
        value: 0.75,
        impact: 22.5
      },
      {
        category: 'engagement',
        factor: 'Email Engagement',
        weight: 0.25,
        value: 0.68,
        impact: 17
      },
      {
        category: 'behavioral',
        factor: 'Website Activity',
        weight: 0.2,
        value: 0.72,
        impact: 14.4
      }
    ]
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // In a real implementation, these would be actual API calls
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      setLeads(mockLeads);
      setLeadScores(mockScores);
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to load lead scoring data:', error);
      // Use mock data on error
      setLeads(mockLeads);
      setLeadScores(mockScores);
      setMetrics(mockMetrics);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredAndSortedLeads = useMemo(() => {
    let filtered = leads.filter(lead => {
      const matchesSearch = !searchQuery || 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesScoreRange = lead.score >= selectedScoreRange[0] && lead.score <= selectedScoreRange[1];
      
      return matchesSearch && matchesScoreRange;
    });

    return filtered.sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      switch (sortBy) {
        case 'score':
          return (a.score - b.score) * direction;
        case 'name':
          return a.name.localeCompare(b.name) * direction;
        case 'stage':
          return a.stage.localeCompare(b.stage) * direction;
        case 'value':
          return (a.value - b.value) * direction;
        default:
          return 0;
      }
    });
  }, [leads, searchQuery, selectedScoreRange, sortBy, sortDirection]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-purple-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'Hot', color: 'bg-emerald-100 text-emerald-800' };
    if (score >= 80) return { label: 'Qualified', color: 'bg-blue-100 text-blue-800' };
    if (score >= 70) return { label: 'Warm', color: 'bg-purple-100 text-purple-800' };
    if (score >= 60) return { label: 'Potential', color: 'bg-amber-100 text-amber-800' };
    return { label: 'Cold', color: 'bg-red-100 text-red-800' };
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  if (loading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Brain className="w-7 h-7 text-blue-600" />
            Lead Scoring Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            AI-powered lead scoring and qualification insights
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.totalLeads}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 text-sm font-medium">+12.5% this month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Average Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.avgScore}</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex items-center gap-1 mt-3">
              {getTrendIcon(metrics.scoreTrend)}
              <span className={`text-sm font-medium ${
                metrics.scoreTrend === 'up' ? 'text-emerald-600' : 
                metrics.scoreTrend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metrics.scoreTrend === 'up' ? '+' : metrics.scoreTrend === 'down' ? '-' : ''}{metrics.trendPercentage}%
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">High Quality Leads</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.highQualityLeads}</p>
              </div>
              <Award className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="flex items-center gap-1 mt-3">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 text-sm font-medium">Score ≥ 80</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">24.8%</p>
              </div>
              <Zap className="w-8 h-8 text-amber-600" />
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 text-sm font-medium">+3.2% this month</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lead List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Lead Scores</h3>
              <button className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            
            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search leads..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="flex gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="score">Sort by Score</option>
                  <option value="name">Sort by Name</option>
                  <option value="stage">Sort by Stage</option>
                  <option value="value">Sort by Value</option>
                </select>
                
                <select
                  value={sortDirection}
                  onChange={(e) => setSortDirection(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="desc">High to Low</option>
                  <option value="asc">Low to High</option>
                </select>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredAndSortedLeads.map((lead) => {
              const score = leadScores.find(s => s.leadId === lead.id);
              const badge = getScoreBadge(lead.score);
              
              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{lead.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                          {badge.label}
                        </span>
                        {score && getTrendIcon(score.trend)}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{lead.company}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{lead.email}</p>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Stage: <span className="capitalize font-medium">{lead.stage}</span>
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Value: ${lead.value.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {lead.probability}% prob
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Score Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Score Distribution</h3>
          
          {metrics && (
            <div className="space-y-4">
              {metrics.distribution.map((item) => (
                <div key={item.range} className="flex items-center gap-4">
                  <div className="w-16 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {item.range}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white w-12">
                        {item.count}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Top Scoring Factors */}
          <div className="mt-8">
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Top Scoring Factors</h4>
            {metrics && (
              <div className="space-y-3">
                {metrics.topFactors.map((factor, index) => (
                  <div key={factor.factor} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        index === 0 ? 'bg-emerald-500' :
                        index === 1 ? 'bg-blue-500' : 'bg-purple-500'
                      }`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {factor.factor}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        +{factor.impact}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {Math.round(factor.weight * 100)}% weight
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeadScoringDashboard;