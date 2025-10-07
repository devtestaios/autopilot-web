'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Enhanced Design System Imports - Phase 1 Visual Polish
import { designTokens } from '@/lib/designTokens';
import animations from '@/lib/animations';
import visualEffects from '@/lib/visualEffects';
import { Container, Grid, Flex, Section, Stack, Header, ContentArea, CardGrid } from '@/components/ui/LayoutSystem';
import { Button as EnhancedButton, Card as EnhancedCard, Badge, Spinner, Avatar, Progress } from '@/components/ui/EnhancedComponents';
import {
  UserPlus,
  Users,
  Target,
  TrendingUp,
  TrendingDown,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  Star,
  Award,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Send,
  FileText,
  Tag,
  MapPin,
  Building,
  Briefcase,
  Globe,
  Zap,
  Timer,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

// SSR-safe imports for universal sidebar system
const UnifiedSidebar = dynamic(() => import('@/components/UnifiedSidebar'), {
  ssr: false,
  loading: () => <div className="fixed left-0 top-0 h-screen w-56 bg-gray-900 animate-pulse" />
});

const AdvancedNavigation = dynamic(() => import('@/components/ui/AdvancedNavigation'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-900 border-b animate-pulse" />
});

const NavigationTabs = dynamic(() => import('@/components/NavigationTabs'), {
  ssr: false,
  loading: () => <div className="h-12 bg-white dark:bg-gray-900 border-b animate-pulse" />
});

// Lead Management Types
interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'opportunity' | 'customer' | 'lost';
  score: number;
  value: number;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  nextFollowUp: string;
  tags: string[];
  notes: string;
  location: string;
  industry: string;
  website: string;
  socialProfiles: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

interface Activity {
  id: string;
  leadId: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  subject: string;
  description: string;
  date: string;
  completed: boolean;
  outcome?: 'positive' | 'neutral' | 'negative';
  duration?: number;
  nextAction?: string;
}

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'content' | 'event' | 'direct';
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  leads: number;
  conversions: number;
  roi: number;
}

interface LeadSegment {
  id: string;
  name: string;
  criteria: string;
  count: number;
  conversionRate: number;
  avgValue: number;
}

export default function LeadManagement() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'activities' | 'campaigns' | 'segments'>('overview');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // Mock data - will be replaced with real API calls in Phase 3
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 'lead-001',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@techstartup.com',
      phone: '+1 (555) 123-4567',
      company: 'TechStartup Inc',
      position: 'CEO',
      source: 'Website',
      status: 'qualified',
      score: 92,
      value: 50000,
      assignedTo: 'John Smith',
      createdAt: '2025-09-28T10:00:00Z',
      lastContact: '2025-09-29T14:30:00Z',
      nextFollowUp: '2025-10-02T10:00:00Z',
      tags: ['enterprise', 'hot-lead', 'technical'],
      notes: 'Very interested in our enterprise solution. Technical team has evaluated our platform.',
      location: 'San Francisco, CA',
      industry: 'Technology',
      website: 'https://techstartup.com',
      socialProfiles: {
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        twitter: 'https://twitter.com/sarahj_ceo'
      }
    },
    {
      id: 'lead-002',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'mike@innovate.io',
      phone: '+1 (555) 987-6543',
      company: 'Innovate.io',
      position: 'CTO',
      source: 'LinkedIn',
      status: 'opportunity',
      score: 88,
      value: 35000,
      assignedTo: 'Emily Davis',
      createdAt: '2025-09-25T15:20:00Z',
      lastContact: '2025-09-30T09:15:00Z',
      nextFollowUp: '2025-10-01T14:00:00Z',
      tags: ['technical', 'decision-maker', 'warm'],
      notes: 'Technical decision maker. Needs integration with existing systems.',
      location: 'Austin, TX',
      industry: 'Software',
      website: 'https://innovate.io',
      socialProfiles: {
        linkedin: 'https://linkedin.com/in/michaelchen'
      }
    },
    {
      id: 'lead-003',
      firstName: 'Lisa',
      lastName: 'Rodriguez',
      email: 'lisa@growthco.com',
      phone: '+1 (555) 456-7890',
      company: 'GrowthCo',
      position: 'VP Marketing',
      source: 'Referral',
      status: 'contacted',
      score: 75,
      value: 25000,
      assignedTo: 'David Wilson',
      createdAt: '2025-09-20T11:45:00Z',
      lastContact: '2025-09-28T16:20:00Z',
      nextFollowUp: '2025-10-03T11:00:00Z',
      tags: ['marketing', 'referral', 'mid-market'],
      notes: 'Referred by existing client. Interested in marketing automation features.',
      location: 'New York, NY',
      industry: 'Marketing',
      website: 'https://growthco.com',
      socialProfiles: {
        linkedin: 'https://linkedin.com/in/lisarodriguez'
      }
    },
    {
      id: 'lead-004',
      firstName: 'Robert',
      lastName: 'Kim',
      email: 'robert@fintech.com',
      phone: '+1 (555) 321-9876',
      company: 'FinTech Solutions',
      position: 'Director of Operations',
      source: 'Cold Email',
      status: 'new',
      score: 65,
      value: 40000,
      assignedTo: 'Sarah Thompson',
      createdAt: '2025-09-30T08:30:00Z',
      lastContact: '2025-09-30T08:30:00Z',
      nextFollowUp: '2025-10-01T09:00:00Z',
      tags: ['fintech', 'operations', 'new'],
      notes: 'Recently reached out via cold email. Showed initial interest.',
      location: 'Chicago, IL',
      industry: 'Financial Services',
      website: 'https://fintech.com',
      socialProfiles: {
        linkedin: 'https://linkedin.com/in/robertkim'
      }
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 'act-001',
      leadId: 'lead-001',
      type: 'call',
      subject: 'Technical Requirements Discussion',
      description: 'Discussed technical requirements and integration needs',
      date: '2025-09-29T14:30:00Z',
      completed: true,
      outcome: 'positive',
      duration: 45,
      nextAction: 'Send technical documentation and pricing proposal'
    },
    {
      id: 'act-002',
      leadId: 'lead-002',
      type: 'email',
      subject: 'Follow-up on Demo',
      description: 'Sent follow-up email after product demo',
      date: '2025-09-30T09:15:00Z',
      completed: true,
      outcome: 'positive',
      nextAction: 'Schedule call with technical team'
    },
    {
      id: 'act-003',
      leadId: 'lead-003',
      type: 'meeting',
      subject: 'Discovery Call',
      description: 'Initial discovery call to understand needs',
      date: '2025-09-28T16:20:00Z',
      completed: true,
      outcome: 'neutral',
      nextAction: 'Send case studies and ROI analysis'
    }
  ]);

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'camp-001',
      name: 'Enterprise Outreach Q4',
      type: 'email',
      status: 'active',
      startDate: '2025-10-01',
      endDate: '2025-12-31',
      budget: 15000,
      spent: 3500,
      leads: 47,
      conversions: 8,
      roi: 320
    },
    {
      id: 'camp-002',
      name: 'LinkedIn Lead Generation',
      type: 'social',
      status: 'active',
      startDate: '2025-09-15',
      endDate: '2025-11-15',
      budget: 8000,
      spent: 4200,
      leads: 23,
      conversions: 5,
      roi: 275
    },
    {
      id: 'camp-003',
      name: 'Tech Conference Follow-up',
      type: 'event',
      status: 'completed',
      startDate: '2025-09-01',
      endDate: '2025-09-30',
      budget: 12000,
      spent: 11800,
      leads: 89,
      conversions: 12,
      roi: 410
    }
  ]);

  // Lead Analytics
  const analytics = {
    totalLeads: leads.length,
    newLeads: leads.filter(l => l.status === 'new').length,
    qualifiedLeads: leads.filter(l => l.status === 'qualified').length,
    opportunityLeads: leads.filter(l => l.status === 'opportunity').length,
    customers: leads.filter(l => l.status === 'customer').length,
    totalValue: leads.reduce((sum, lead) => sum + lead.value, 0),
    avgScore: leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length,
    conversionRate: leads.length > 0 ? (leads.filter(l => l.status === 'customer').length / leads.length) * 100 : 0
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'new': 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300',
      'contacted': 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300',
      'qualified': 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300',
      'opportunity': 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300',
      'customer': 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300',
      'lost': 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[status] || colors['new'];
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      'call': Phone,
      'email': Mail,
      'meeting': Calendar,
      'note': FileText,
      'task': CheckCircle
    };
    const Icon = icons[type] || Activity;
    return <Icon className="w-4 h-4" />;
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const sources = [...new Set(leads.map(l => l.source))];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Leads</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalLeads}</p>
              <p className="text-sm text-blue-600">{analytics.newLeads} new this week</p>
            </div>
            <UserPlus className="w-12 h-12 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pipeline Value</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">${analytics.totalValue.toLocaleString()}</p>
              <p className="text-sm text-green-600">+15% this month</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Lead Score</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{Math.round(analytics.avgScore)}</p>
              <p className="text-sm text-purple-600">High quality leads</p>
            </div>
            <Target className="w-12 h-12 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.conversionRate.toFixed(1)}%</p>
              <p className="text-sm text-orange-600">Above industry avg</p>
            </div>
            <TrendingUp className="w-12 h-12 text-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* Lead Pipeline & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lead Pipeline</h3>
          <div className="space-y-4">
            {[
              { status: 'new', count: analytics.newLeads, label: 'New Leads' },
              { status: 'contacted', count: leads.filter(l => l.status === 'contacted').length, label: 'Contacted' },
              { status: 'qualified', count: analytics.qualifiedLeads, label: 'Qualified' },
              { status: 'opportunity', count: analytics.opportunityLeads, label: 'Opportunity' },
              { status: 'customer', count: analytics.customers, label: 'Customers' }
            ].map((stage) => {
              const percentage = analytics.totalLeads > 0 ? (stage.count / analytics.totalLeads) * 100 : 0;
              return (
                <div key={stage.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      stage.status === 'new' ? 'bg-blue-500' :
                      stage.status === 'contacted' ? 'bg-yellow-500' :
                      stage.status === 'qualified' ? 'bg-green-500' :
                      stage.status === 'opportunity' ? 'bg-purple-500' :
                      'bg-emerald-500'
                    }`} />
                    <span className="text-gray-900 dark:text-white font-medium">{stage.label}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          stage.status === 'new' ? 'bg-blue-500' :
                          stage.status === 'contacted' ? 'bg-yellow-500' :
                          stage.status === 'qualified' ? 'bg-green-500' :
                          stage.status === 'opportunity' ? 'bg-purple-500' :
                          'bg-emerald-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{stage.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {activities.slice(0, 5).map((activity) => {
              const lead = leads.find(l => l.id === activity.leadId);
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className={`p-1 rounded-full ${
                    activity.type === 'call' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    activity.type === 'email' ? 'bg-green-100 dark:bg-green-900/30' :
                    activity.type === 'meeting' ? 'bg-purple-100 dark:bg-purple-900/30' :
                    'bg-gray-100 dark:bg-gray-900/30'
                  }`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.subject}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {lead?.firstName} {lead?.lastName} • {activity.type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                  {activity.outcome && (
                    <div className={`p-1 rounded-full ${
                      activity.outcome === 'positive' ? 'text-green-600' :
                      activity.outcome === 'negative' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {activity.outcome === 'positive' ? <ThumbsUp className="w-3 h-3" /> :
                       activity.outcome === 'negative' ? <ThumbsDown className="w-3 h-3" /> :
                       <AlertCircle className="w-3 h-3" />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lead Sources & Campaign Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lead Sources</h3>
          <div className="space-y-4">
            {sources.map((source) => {
              const count = leads.filter(l => l.source === source).length;
              const percentage = leads.length > 0 ? (count / leads.length) * 100 : 0;
              return (
                <div key={source} className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{source}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Campaigns</h3>
          <div className="space-y-3">
            {campaigns.filter(c => c.status === 'active').map((campaign) => (
              <div key={campaign.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{campaign.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.type === 'email' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                    campaign.type === 'social' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  }`}>
                    {campaign.type}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Leads</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{campaign.leads}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Conversions</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{campaign.conversions}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">ROI</p>
                    <p className="font-semibold text-green-600">{campaign.roi}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLeadsTab = () => (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="opportunity">Opportunity</option>
              <option value="customer">Customer</option>
              <option value="lost">Lost</option>
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Sources</option>
              {sources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <UserPlus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Leads ({filteredLeads.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredLeads.map((lead) => (
            <motion.div
              key={lead.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
              onClick={() => setSelectedLead(lead)}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {lead.firstName[0]}{lead.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {lead.firstName} {lead.lastName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{lead.position} at {lead.company}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center text-sm text-gray-500">
                        <Mail className="w-4 h-4 mr-1" />
                        {lead.email}
                      </span>
                      <span className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-1" />
                        {lead.phone}
                      </span>
                      <span className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        {lead.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">${lead.value.toLocaleString()}</p>
                    <p className={`text-sm font-medium ${getScoreColor(lead.score)}`}>Score: {lead.score}</p>
                    <p className="text-sm text-gray-500">{lead.source}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {lead.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Next follow-up: {new Date(lead.nextFollowUp).toLocaleDateString()}</span>
                  <span>Assigned to: {lead.assignedTo}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Unified Sidebar */}
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-14' : 'ml-56'
      }`}>
        {/* Advanced Navigation */}
        <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
        
        {/* Navigation Tabs */}
        <NavigationTabs />
        
        {/* Lead Management Content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Lead Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Track prospects, manage pipeline, and convert leads into customers
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { key: 'overview', label: 'Overview', icon: BarChart3 },
                { key: 'leads', label: 'Leads', icon: Users },
                { key: 'activities', label: 'Activities', icon: Activity },
                { key: 'campaigns', label: 'Campaigns', icon: Zap },
                { key: 'segments', label: 'Segments', icon: PieChart }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && renderOverviewTab()}
              {activeTab === 'leads' && renderLeadsTab()}
              {activeTab === 'activities' && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Activities management interface coming soon</p>
                </div>
              )}
              {activeTab === 'campaigns' && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Campaign management interface coming soon</p>
                </div>
              )}
              {activeTab === 'segments' && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Lead segmentation interface coming soon</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}