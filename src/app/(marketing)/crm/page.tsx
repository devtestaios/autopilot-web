'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Enhanced Design System Imports - Phase 1 Visual Polish
import { designTokens } from '@/lib/designTokens';
import { animations } from '@/lib/animations';
import visualEffects from '@/lib/visualEffects';
import { Container, Grid, Flex, Section, Stack, Header, ContentArea, CardGrid } from '@/components/ui/LayoutSystem';
import { Button as EnhancedButton, Card as EnhancedCard, Badge, Spinner, Avatar, Progress } from '@/components/ui/EnhancedComponents';

import {
  Users,
  UserPlus,
  TrendingUp,
  DollarSign,
  Target,
  Phone,
  Mail,
  Calendar,
  Star,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  FileText,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Building,
  MapPin,
  Globe,
  Briefcase,
  Tag
} from 'lucide-react';

// SSR-safe imports for universal sidebar system
const UnifiedSidebar = dynamic(() => import('@/components/UnifiedSidebar'), {
  ssr: false,
  loading: () => <div className="fixed left-0 top-0 h-screen w-56 bg-gray-900 animate-pulse" />
});

const AdvancedNavigation = dynamic(() => import('@/components/DashboardNavbar'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-900 border-b animate-pulse" />
});

const NavigationTabs = dynamic(() => import('@/components/NavigationTabs'), {
  ssr: false,
  loading: () => <div className="h-12 bg-white dark:bg-gray-900 border-b animate-pulse" />
});

// CRM Types
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  value: number;
  source: string;
  assignedTo: string;
  lastContact: string;
  nextFollowUp: string;
  score: number;
  tags: string[];
  notes: string;
  location: string;
  website: string;
}

interface Deal {
  id: string;
  title: string;
  lead: Lead;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closing' | 'won' | 'lost';
  probability: number;
  closeDate: string;
  assignedTo: string;
  activities: Activity[];
  documents: Document[];
}

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  title: string;
  description: string;
  date: string;
  completed: boolean;
  leadId: string;
  userId: string;
}

export default function CRMPlatform() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'leads' | 'deals' | 'activities' | 'analytics'>('leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Mock data - will be replaced with real API calls in Phase 3
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@techstartup.com',
      phone: '+1 (555) 123-4567',
      company: 'TechStartup Inc',
      position: 'CEO',
      status: 'qualified',
      value: 25000,
      source: 'Website',
      assignedTo: 'John Smith',
      lastContact: '2025-09-28',
      nextFollowUp: '2025-10-05',
      score: 85,
      tags: ['hot-lead', 'enterprise'],
      notes: 'Very interested in our enterprise solution. Ready to schedule demo.',
      location: 'San Francisco, CA',
      website: 'https://techstartup.com'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'mike@innovate.io',
      phone: '+1 (555) 987-6543',
      company: 'Innovate.io',
      position: 'CTO',
      status: 'proposal',
      value: 45000,
      source: 'LinkedIn',
      assignedTo: 'Emily Davis',
      lastContact: '2025-09-30',
      nextFollowUp: '2025-10-02',
      score: 92,
      tags: ['technical', 'decision-maker'],
      notes: 'Technical evaluation complete. Awaiting proposal review.',
      location: 'Austin, TX',
      website: 'https://innovate.io'
    },
    {
      id: '3',
      name: 'Lisa Rodriguez',
      email: 'lisa@growthco.com',
      phone: '+1 (555) 456-7890',
      company: 'GrowthCo',
      position: 'VP Marketing',
      status: 'new',
      value: 15000,
      source: 'Referral',
      assignedTo: 'John Smith',
      lastContact: '2025-09-29',
      nextFollowUp: '2025-10-01',
      score: 67,
      tags: ['warm-lead', 'marketing'],
      notes: 'Referred by existing client. Interested in marketing automation.',
      location: 'New York, NY',
      website: 'https://growthco.com'
    }
  ]);

  const [deals, setDeals] = useState<Deal[]>([
    {
      id: '1',
      title: 'TechStartup Enterprise Package',
      lead: leads[0],
      value: 25000,
      stage: 'proposal',
      probability: 75,
      closeDate: '2025-10-15',
      assignedTo: 'John Smith',
      activities: [],
      documents: []
    },
    {
      id: '2',
      title: 'Innovate.io Technical Integration',
      lead: leads[1],
      value: 45000,
      stage: 'negotiation',
      probability: 85,
      closeDate: '2025-10-20',
      assignedTo: 'Emily Davis',
      activities: [],
      documents: []
    }
  ]);

  // CRM Analytics
  const analytics = {
    totalLeads: leads.length,
    qualifiedLeads: leads.filter(l => l.status === 'qualified').length,
    totalValue: deals.reduce((sum, deal) => sum + deal.value, 0),
    avgDealSize: deals.length > 0 ? deals.reduce((sum, deal) => sum + deal.value, 0) / deals.length : 0,
    conversionRate: leads.length > 0 ? (leads.filter(l => l.status === 'closed-won').length / leads.length) * 100 : 0,
    avgScore: leads.length > 0 ? leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length : 0
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'contacted': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      'qualified': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      'proposal': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      'negotiation': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      'closed-won': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      'closed-lost': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[status] || colors['new'];
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const renderLeadsView = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Leads</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalLeads}</p>
              <p className="text-sm text-green-600">+12% this month</p>
            </div>
            <Users className="w-12 h-12 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Qualified Leads</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.qualifiedLeads}</p>
              <p className="text-sm text-green-600">+8% this month</p>
            </div>
            <Target className="w-12 h-12 text-green-600" />
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
              <p className="text-sm text-green-600">+24% this month</p>
            </div>
            <DollarSign className="w-12 h-12 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Lead Score</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{Math.round(analytics.avgScore)}</p>
              <p className="text-sm text-green-600">+5% this month</p>
            </div>
            <TrendingUp className="w-12 h-12 text-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
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
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed-won">Closed Won</option>
              <option value="closed-lost">Closed Lost</option>
            </select>
          </div>
          <button
            onClick={() => setShowLeadModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Leads ({filteredLeads.length})</h2>
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
                    {lead.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{lead.name}</h3>
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
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">${lead.value.toLocaleString()}</p>
                    <p className={`text-sm font-medium ${getScoreColor(lead.score)}`}>Score: {lead.score}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1).replace('-', ' ')}
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

  const renderDealsView = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Sales Pipeline</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {deals.map((deal) => (
            <motion.div
              key={deal.id}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{deal.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(deal.stage)}`}>
                  {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Value:</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">${deal.value.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Probability:</span>
                  <span className="text-green-600 font-medium">{deal.probability}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Close Date:</span>
                  <span className="text-gray-900 dark:text-white">{new Date(deal.closeDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Contact:</span>
                  <span className="text-gray-900 dark:text-white">{deal.lead.name}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActivitiesView = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activities</h2>
      <div className="text-center py-12">
        <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No activities yet. Activities will appear here when leads are contacted.</p>
      </div>
    </div>
  );

  const renderAnalyticsView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lead Sources</h3>
          <div className="space-y-4">
            {['Website', 'LinkedIn', 'Referral', 'Cold Email'].map((source) => {
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Conversion Funnel</h3>
          <div className="space-y-4">
            {['New', 'Contacted', 'Qualified', 'Proposal', 'Closed Won'].map((stage, index) => {
              const count = leads.filter(l => l.status.replace('-', ' ') === stage.toLowerCase()).length;
              return (
                <div key={stage} className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 dark:text-white font-medium">{stage}</span>
                      <span className="text-gray-600 dark:text-gray-400">{count} leads</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
        {/* Unified Dashboard Navbar */}
        <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
        
        {/* CRM Content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  CRM & Sales Automation
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage leads, track deals, and automate your sales process
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { key: 'leads', label: 'Leads', icon: Users },
                { key: 'deals', label: 'Deals', icon: DollarSign },
                { key: 'activities', label: 'Activities', icon: Activity },
                { key: 'analytics', label: 'Analytics', icon: TrendingUp }
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
              {activeTab === 'leads' && renderLeadsView()}
              {activeTab === 'deals' && renderDealsView()}
              {activeTab === 'activities' && renderActivitiesView()}
              {activeTab === 'analytics' && renderAnalyticsView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}