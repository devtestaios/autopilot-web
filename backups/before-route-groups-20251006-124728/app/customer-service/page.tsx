'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  MessageSquare,
  Phone,
  Mail,
  Clock,
  User,
  Users,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  ArrowLeft,
  ArrowRight,
  Tag,
  Calendar,
  Timer,
  Headphones,
  MessageCircle,
  PhoneCall,
  AtSign,
  FileText,
  Zap,
  Target,
  Award
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

// Customer Service Types
interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  customer: Customer;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  responseTime: number;
  resolutionTime?: number;
  satisfaction?: number;
  tags: string[];
  messages: Message[];
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  tier: 'basic' | 'premium' | 'enterprise';
  joinDate: string;
  totalTickets: number;
  satisfaction: number;
  avatar?: string;
}

interface Message {
  id: string;
  ticketId: string;
  sender: 'customer' | 'agent';
  content: string;
  timestamp: string;
  type: 'message' | 'note' | 'status-change';
  attachments?: string[];
}

interface Agent {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  activeTickets: number;
  resolvedToday: number;
  avgResponseTime: number;
  satisfaction: number;
  specialties: string[];
}

export default function CustomerService() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tickets' | 'customers' | 'agents' | 'analytics'>('dashboard');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Mock data - will be replaced with real API calls in Phase 3
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TCK-001',
      subject: 'Unable to access dashboard features',
      description: 'I cannot access the analytics dashboard. Getting error message when trying to load charts.',
      status: 'open',
      priority: 'high',
      category: 'Technical',
      customer: {
        id: 'cust-001',
        name: 'Sarah Johnson',
        email: 'sarah@techstartup.com',
        phone: '+1 (555) 123-4567',
        company: 'TechStartup Inc',
        tier: 'enterprise',
        joinDate: '2025-01-15',
        totalTickets: 12,
        satisfaction: 4.8
      },
      assignedTo: 'John Smith',
      createdAt: '2025-09-30T09:30:00Z',
      updatedAt: '2025-09-30T10:15:00Z',
      responseTime: 45,
      tags: ['dashboard', 'analytics', 'enterprise'],
      messages: [
        {
          id: 'msg-001',
          ticketId: 'TCK-001',
          sender: 'customer',
          content: 'I cannot access the analytics dashboard. Getting error message when trying to load charts.',
          timestamp: '2025-09-30T09:30:00Z',
          type: 'message'
        },
        {
          id: 'msg-002',
          ticketId: 'TCK-001',
          sender: 'agent',
          content: 'Thank you for contacting us. I\'m looking into this issue right away. Can you please share a screenshot of the error message?',
          timestamp: '2025-09-30T10:15:00Z',
          type: 'message'
        }
      ]
    },
    {
      id: 'TCK-002',
      subject: 'Billing question about subscription',
      description: 'I have a question about my monthly subscription charges.',
      status: 'in-progress',
      priority: 'medium',
      category: 'Billing',
      customer: {
        id: 'cust-002',
        name: 'Michael Chen',
        email: 'mike@innovate.io',
        phone: '+1 (555) 987-6543',
        company: 'Innovate.io',
        tier: 'premium',
        joinDate: '2025-03-20',
        totalTickets: 8,
        satisfaction: 4.5
      },
      assignedTo: 'Emily Davis',
      createdAt: '2025-09-29T14:20:00Z',
      updatedAt: '2025-09-30T08:45:00Z',
      responseTime: 120,
      tags: ['billing', 'subscription'],
      messages: []
    },
    {
      id: 'TCK-003',
      subject: 'Feature request: Export functionality',
      description: 'Would like to request data export feature for reports.',
      status: 'resolved',
      priority: 'low',
      category: 'Feature Request',
      customer: {
        id: 'cust-003',
        name: 'Lisa Rodriguez',
        email: 'lisa@growthco.com',
        phone: '+1 (555) 456-7890',
        company: 'GrowthCo',
        tier: 'basic',
        joinDate: '2025-06-10',
        totalTickets: 3,
        satisfaction: 4.2
      },
      assignedTo: 'David Wilson',
      createdAt: '2025-09-28T11:00:00Z',
      updatedAt: '2025-09-29T16:30:00Z',
      responseTime: 30,
      resolutionTime: 1800,
      satisfaction: 5,
      tags: ['feature-request', 'export'],
      messages: []
    }
  ]);

  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'agent-001',
      name: 'John Smith',
      email: 'john@pulsebridge.com',
      status: 'online',
      activeTickets: 5,
      resolvedToday: 12,
      avgResponseTime: 15,
      satisfaction: 4.8,
      specialties: ['Technical', 'Enterprise']
    },
    {
      id: 'agent-002',
      name: 'Emily Davis',
      email: 'emily@pulsebridge.com',
      status: 'busy',
      activeTickets: 8,
      resolvedToday: 9,
      avgResponseTime: 22,
      satisfaction: 4.6,
      specialties: ['Billing', 'Account Management']
    },
    {
      id: 'agent-003',
      name: 'David Wilson',
      email: 'david@pulsebridge.com',
      status: 'online',
      activeTickets: 3,
      resolvedToday: 15,
      avgResponseTime: 18,
      satisfaction: 4.9,
      specialties: ['Feature Requests', 'Training']
    }
  ]);

  // Customer Service Analytics
  const analytics = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === 'open').length,
    inProgressTickets: tickets.filter(t => t.status === 'in-progress').length,
    resolvedTickets: tickets.filter(t => t.status === 'resolved').length,
    avgResponseTime: tickets.reduce((sum, t) => sum + t.responseTime, 0) / tickets.length,
    avgSatisfaction: tickets.filter(t => t.satisfaction).reduce((sum, t) => sum + (t.satisfaction || 0), 0) / tickets.filter(t => t.satisfaction).length,
    totalAgents: agents.length,
    onlineAgents: agents.filter(a => a.status === 'online').length
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'open': 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300',
      'in-progress': 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300',
      'resolved': 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300',
      'closed': 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300'
    };
    return colors[status] || colors['open'];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300',
      'medium': 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300',
      'high': 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300',
      'urgent': 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[priority] || colors['medium'];
  };

  const getAgentStatusColor = (status: string) => {
    const colors = {
      'online': 'text-green-600',
      'busy': 'text-yellow-600',
      'away': 'text-orange-600',
      'offline': 'text-gray-600'
    };
    return colors[status] || colors['offline'];
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.customer.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const renderDashboardTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Open Tickets</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.openTickets}</p>
              <p className="text-sm text-blue-600">+3 today</p>
            </div>
            <MessageSquare className="w-12 h-12 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{Math.round(analytics.avgResponseTime)}m</p>
              <p className="text-sm text-green-600">-5m vs yesterday</p>
            </div>
            <Clock className="w-12 h-12 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Score</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.avgSatisfaction.toFixed(1)}</p>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 ${star <= analytics.avgSatisfaction ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </div>
            <Star className="w-12 h-12 text-yellow-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Online Agents</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.onlineAgents}/{analytics.totalAgents}</p>
              <p className="text-sm text-green-600">All hands on deck</p>
            </div>
            <Headphones className="w-12 h-12 text-purple-600" />
          </div>
        </motion.div>
      </div>

      {/* Recent Tickets & Agent Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tickets</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {tickets.slice(0, 5).map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                   onClick={() => setSelectedTicket(ticket)}>
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    ticket.priority === 'urgent' ? 'bg-red-500' :
                    ticket.priority === 'high' ? 'bg-orange-500' :
                    ticket.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{ticket.subject}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{ticket.customer.name} • {ticket.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('-', ' ')}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Agent Status</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Manage</button>
          </div>
          <div className="space-y-4">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      agent.status === 'online' ? 'bg-green-500' :
                      agent.status === 'busy' ? 'bg-yellow-500' :
                      agent.status === 'away' ? 'bg-orange-500' :
                      'bg-gray-500'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{agent.name}</p>
                    <p className={`text-sm ${getAgentStatusColor(agent.status)}`}>
                      {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active: {agent.activeTickets}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Resolved: {agent.resolvedToday}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ticket Status Distribution</h3>
          <div className="space-y-4">
            {[
              { status: 'open', count: analytics.openTickets, label: 'Open' },
              { status: 'in-progress', count: analytics.inProgressTickets, label: 'In Progress' },
              { status: 'resolved', count: analytics.resolvedTickets, label: 'Resolved' }
            ].map((item) => {
              const percentage = analytics.totalTickets > 0 ? (item.count / analytics.totalTickets) * 100 : 0;
              return (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      item.status === 'open' ? 'bg-blue-500' :
                      item.status === 'in-progress' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <span className="text-gray-900 dark:text-white font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          item.status === 'open' ? 'bg-blue-500' :
                          item.status === 'in-progress' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{item.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Response Time Trend</h3>
          <div className="h-32 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-end justify-around p-3">
            {Array.from({ length: 7 }, (_, index) => {
              const height = Math.random() * 80 + 20;
              return (
                <div key={index} className="flex flex-col items-center space-y-1">
                  <div
                    className="bg-blue-500 rounded-t w-4"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-500">{index + 1}d</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>7 days ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTicketsTab = () => (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tickets..."
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
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Ticket</span>
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tickets ({filteredTickets.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredTickets.map((ticket) => (
            <motion.div
              key={ticket.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
              onClick={() => setSelectedTicket(ticket)}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    ticket.priority === 'urgent' ? 'bg-red-500' :
                    ticket.priority === 'high' ? 'bg-orange-500' :
                    ticket.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`} />
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{ticket.subject}</h3>
                      <span className="text-sm text-gray-500">#{ticket.id}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{ticket.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{ticket.customer.name}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Tag className="w-4 h-4" />
                        <span>{ticket.category}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Headphones className="w-4 h-4" />
                        <span>{ticket.assignedTo}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </span>
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {ticket.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
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
        
        {/* Customer Service Content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl text-white">
                <Headphones className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Customer Service
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage support tickets, track customer satisfaction, and monitor agent performance
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { key: 'tickets', label: 'Tickets', icon: MessageSquare },
                { key: 'customers', label: 'Customers', icon: Users },
                { key: 'agents', label: 'Agents', icon: Headphones },
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
                  {tab.key === 'tickets' && analytics.openTickets > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {analytics.openTickets}
                    </span>
                  )}
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
              {activeTab === 'dashboard' && renderDashboardTab()}
              {activeTab === 'tickets' && renderTicketsTab()}
              {activeTab === 'customers' && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Customer management interface coming soon</p>
                </div>
              )}
              {activeTab === 'agents' && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <Headphones className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Agent management interface coming soon</p>
                </div>
              )}
              {activeTab === 'analytics' && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Advanced analytics interface coming soon</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}