'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced Design System Imports - Phase 1 Visual Polish
import { designTokens } from '@/lib/designTokens';
import { animations } from '@/lib/animations';
import visualEffects from '@/lib/visualEffects';
import { Container, Grid, Flex, Section, Stack, Header, ContentArea, CardGrid } from '@/components/ui/LayoutSystem';
import { Button as EnhancedButton, Card as EnhancedCard, Badge, Spinner, Avatar, Progress } from '@/components/ui/EnhancedComponents';
import UniversalPageWrapper from '@/components/ui/UniversalPageWrapper';
import { Button } from '@/components/ui/button';

import {
  Workflow,
  Play,
  Pause,
  Settings,
  Plus,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Users,
  BarChart3,
  Calendar,
  Filter,
  Search,
  MoreVertical,
  ArrowRight,
  Timer,
  Activity,
  Target,
  TrendingUp,
  TrendingDown,
  PlayCircle,
  PauseCircle,
  Square,
  RefreshCw,
  FileText,
  Tag,
  Star,
  Database,
  GitBranch,
  Code,
  MessageSquare,
  Bell,
  Eye,
  Download,
  Upload,
  Copy,
  Archive,
  Bookmark,
  Hash,
  ExternalLink,
  Mail,
  Phone,
  Send,
  Cpu,
  Globe,
  Shield
} from 'lucide-react';

// Workflow Types
interface WorkflowStep {
  id: string;
  name: string;
  type: 'trigger' | 'condition' | 'action' | 'delay' | 'loop';
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  config: Record<string, any>;
  position: { x: number; y: number };
  connections: string[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'disabled';
  trigger: string;
  category: string;
  steps: WorkflowStep[];
  executions: number;
  successRate: number;
  lastRun: string;
  createdAt: string;
  createdBy: string;
  tags: string[];
  isTemplate: boolean;
  permissions: string[];
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: string;
  endTime?: string;
  duration?: number;
  trigger: string;
  steps: {
    stepId: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    startTime?: string;
    endTime?: string;
    output?: any;
    error?: string;
  }[];
  logs: {
    timestamp: string;
    level: 'info' | 'warning' | 'error';
    message: string;
    stepId?: string;
  }[];
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail: string;
  rating: number;
  downloads: number;
  steps: Omit<WorkflowStep, 'id' | 'status'>[];
  useCase: string;
  benefits: string[];
}

export default function WorkflowAutomation() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workflows' | 'executions' | 'templates' | 'logs'>('dashboard');
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Mock data - will be replaced with real API calls in Phase 3
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: 'wf-001',
      name: 'Lead Qualification Automation',
      description: 'Automatically qualify leads based on scoring criteria and route to appropriate sales team',
      status: 'active',
      trigger: 'New Lead Created',
      category: 'Sales',
      steps: [
        {
          id: 'step-001',
          name: 'Lead Data Collection',
          type: 'trigger',
          description: 'Collect lead data from form submission',
          status: 'completed',
          config: { source: 'contact_form' },
          position: { x: 100, y: 100 },
          connections: ['step-002']
        },
        {
          id: 'step-002',
          name: 'Score Calculation',
          type: 'action',
          description: 'Calculate lead score based on criteria',
          status: 'completed',
          config: { scoring_model: 'advanced' },
          position: { x: 300, y: 100 },
          connections: ['step-003']
        },
        {
          id: 'step-003',
          name: 'Qualification Check',
          type: 'condition',
          description: 'Check if lead meets qualification threshold',
          status: 'running',
          config: { threshold: 75 },
          position: { x: 500, y: 100 },
          connections: ['step-004', 'step-005']
        },
        {
          id: 'step-004',
          name: 'Assign to Sales Rep',
          type: 'action',
          description: 'Assign qualified lead to appropriate sales representative',
          status: 'pending',
          config: { assignment_logic: 'round_robin' },
          position: { x: 700, y: 50 },
          connections: []
        },
        {
          id: 'step-005',
          name: 'Send to Nurture Campaign',
          type: 'action',
          description: 'Add unqualified lead to nurture email campaign',
          status: 'pending',
          config: { campaign_id: 'nurture_001' },
          position: { x: 700, y: 150 },
          connections: []
        }
      ],
      executions: 247,
      successRate: 94.7,
      lastRun: '2025-09-30T08:30:00Z',
      createdAt: '2025-09-15T10:00:00Z',
      createdBy: 'Sarah Johnson',
      tags: ['sales', 'automation', 'lead-qualification'],
      isTemplate: false,
      permissions: ['edit', 'execute', 'view']
    },
    {
      id: 'wf-002',
      name: 'Customer Onboarding Flow',
      description: 'Comprehensive onboarding workflow for new customers including welcome emails, account setup, and training',
      status: 'active',
      trigger: 'New Customer Signup',
      category: 'Customer Success',
      steps: [
        {
          id: 'step-101',
          name: 'Welcome Email',
          type: 'action',
          description: 'Send personalized welcome email to new customer',
          status: 'completed',
          config: { template: 'welcome_email_v2' },
          position: { x: 100, y: 100 },
          connections: ['step-102']
        },
        {
          id: 'step-102',
          name: 'Account Setup',
          type: 'action',
          description: 'Create customer account and configure initial settings',
          status: 'completed',
          config: { auto_provision: true },
          position: { x: 300, y: 100 },
          connections: ['step-103']
        },
        {
          id: 'step-103',
          name: 'Delay',
          type: 'delay',
          description: 'Wait 24 hours before sending training materials',
          status: 'running',
          config: { duration: '24h' },
          position: { x: 500, y: 100 },
          connections: ['step-104']
        },
        {
          id: 'step-104',
          name: 'Send Training Materials',
          type: 'action',
          description: 'Email training resources and schedule onboarding call',
          status: 'pending',
          config: { include_calendar_link: true },
          position: { x: 700, y: 100 },
          connections: []
        }
      ],
      executions: 89,
      successRate: 98.9,
      lastRun: '2025-09-30T07:15:00Z',
      createdAt: '2025-09-10T14:30:00Z',
      createdBy: 'Michael Chen',
      tags: ['onboarding', 'customer-success', 'automation'],
      isTemplate: false,
      permissions: ['view', 'execute']
    },
    {
      id: 'wf-003',
      name: 'Invoice Payment Reminder',
      description: 'Automated payment reminder sequence for overdue invoices with escalating urgency',
      status: 'active',
      trigger: 'Invoice Overdue',
      category: 'Finance',
      steps: [
        {
          id: 'step-201',
          name: 'Initial Reminder',
          type: 'action',
          description: 'Send friendly payment reminder email',
          status: 'completed',
          config: { tone: 'friendly' },
          position: { x: 100, y: 100 },
          connections: ['step-202']
        },
        {
          id: 'step-202',
          name: 'Wait 7 Days',
          type: 'delay',
          description: 'Wait 7 days before escalation',
          status: 'running',
          config: { duration: '7d' },
          position: { x: 300, y: 100 },
          connections: ['step-203']
        },
        {
          id: 'step-203',
          name: 'Second Reminder',
          type: 'action',
          description: 'Send more urgent payment reminder',
          status: 'pending',
          config: { tone: 'urgent' },
          position: { x: 500, y: 100 },
          connections: ['step-204']
        },
        {
          id: 'step-204',
          name: 'Escalate to Manager',
          type: 'action',
          description: 'Notify accounts manager for personal follow-up',
          status: 'pending',
          config: { notify_manager: true },
          position: { x: 700, y: 100 },
          connections: []
        }
      ],
      executions: 56,
      successRate: 89.3,
      lastRun: '2025-09-29T16:45:00Z',
      createdAt: '2025-09-08T09:20:00Z',
      createdBy: 'David Wilson',
      tags: ['finance', 'payment', 'reminders'],
      isTemplate: false,
      permissions: ['view']
    },
    {
      id: 'wf-004',
      name: 'Social Media Content Publishing',
      description: 'Automated content publishing across multiple social media platforms with optimal timing',
      status: 'paused',
      trigger: 'Content Scheduled',
      category: 'Marketing',
      steps: [
        {
          id: 'step-301',
          name: 'Content Optimization',
          type: 'action',
          description: 'Optimize content for each platform',
          status: 'completed',
          config: { platforms: ['twitter', 'linkedin', 'facebook'] },
          position: { x: 100, y: 100 },
          connections: ['step-302']
        },
        {
          id: 'step-302',
          name: 'Schedule Check',
          type: 'condition',
          description: 'Check if current time matches optimal posting schedule',
          status: 'pending',
          config: { use_ai_timing: true },
          position: { x: 300, y: 100 },
          connections: ['step-303', 'step-304']
        },
        {
          id: 'step-303',
          name: 'Publish Content',
          type: 'action',
          description: 'Publish content to selected platforms',
          status: 'pending',
          config: { simultaneous: false },
          position: { x: 500, y: 50 },
          connections: []
        },
        {
          id: 'step-304',
          name: 'Reschedule',
          type: 'action',
          description: 'Reschedule for next optimal time slot',
          status: 'pending',
          config: { max_reschedules: 3 },
          position: { x: 500, y: 150 },
          connections: []
        }
      ],
      executions: 134,
      successRate: 92.5,
      lastRun: '2025-09-28T12:00:00Z',
      createdAt: '2025-09-05T11:15:00Z',
      createdBy: 'Lisa Rodriguez',
      tags: ['marketing', 'social-media', 'content'],
      isTemplate: false,
      permissions: ['edit', 'execute', 'view']
    }
  ]);

  const [executions, setExecutions] = useState<WorkflowExecution[]>([
    {
      id: 'exec-001',
      workflowId: 'wf-001',
      status: 'completed',
      startTime: '2025-09-30T08:30:00Z',
      endTime: '2025-09-30T08:32:15Z',
      duration: 135,
      trigger: 'Form submission from contact page',
      steps: [
        { stepId: 'step-001', status: 'completed', startTime: '2025-09-30T08:30:00Z', endTime: '2025-09-30T08:30:05Z' },
        { stepId: 'step-002', status: 'completed', startTime: '2025-09-30T08:30:05Z', endTime: '2025-09-30T08:30:45Z' },
        { stepId: 'step-003', status: 'completed', startTime: '2025-09-30T08:30:45Z', endTime: '2025-09-30T08:31:00Z' },
        { stepId: 'step-004', status: 'completed', startTime: '2025-09-30T08:31:00Z', endTime: '2025-09-30T08:32:15Z' }
      ],
      logs: [
        { timestamp: '2025-09-30T08:30:00Z', level: 'info', message: 'Workflow execution started', stepId: 'step-001' },
        { timestamp: '2025-09-30T08:30:05Z', level: 'info', message: 'Lead data collected successfully', stepId: 'step-001' },
        { timestamp: '2025-09-30T08:30:45Z', level: 'info', message: 'Lead score calculated: 87', stepId: 'step-002' },
        { timestamp: '2025-09-30T08:31:00Z', level: 'info', message: 'Lead qualified for sales assignment', stepId: 'step-003' },
        { timestamp: '2025-09-30T08:32:15Z', level: 'info', message: 'Lead assigned to Sarah Johnson', stepId: 'step-004' }
      ]
    },
    {
      id: 'exec-002',
      workflowId: 'wf-002',
      status: 'running',
      startTime: '2025-09-30T07:15:00Z',
      trigger: 'New customer signup - TechCorp Inc',
      steps: [
        { stepId: 'step-101', status: 'completed', startTime: '2025-09-30T07:15:00Z', endTime: '2025-09-30T07:15:30Z' },
        { stepId: 'step-102', status: 'completed', startTime: '2025-09-30T07:15:30Z', endTime: '2025-09-30T07:18:45Z' },
        { stepId: 'step-103', status: 'running', startTime: '2025-09-30T07:18:45Z' },
        { stepId: 'step-104', status: 'pending' }
      ],
      logs: [
        { timestamp: '2025-09-30T07:15:00Z', level: 'info', message: 'Customer onboarding started', stepId: 'step-101' },
        { timestamp: '2025-09-30T07:15:30Z', level: 'info', message: 'Welcome email sent successfully', stepId: 'step-101' },
        { timestamp: '2025-09-30T07:18:45Z', level: 'info', message: 'Customer account created and configured', stepId: 'step-102' }
      ]
    }
  ]);

  const [templates, setTemplates] = useState<WorkflowTemplate[]>([
    {
      id: 'tmpl-001',
      name: 'E-commerce Order Processing',
      description: 'Complete order processing workflow from payment to fulfillment',
      category: 'E-commerce',
      tags: ['orders', 'fulfillment', 'notifications'],
      thumbnail: '/templates/ecommerce-order.png',
      rating: 4.8,
      downloads: 1247,
      useCase: 'Automate order processing, inventory updates, and customer notifications',
      benefits: ['Reduce manual work', 'Improve accuracy', 'Faster fulfillment'],
      steps: [
        { name: 'Order Received', type: 'trigger', description: 'Trigger when new order is placed', config: {}, position: { x: 100, y: 100 }, connections: ['step-2'] },
        { name: 'Payment Verification', type: 'condition', description: 'Verify payment status', config: {}, position: { x: 300, y: 100 }, connections: ['step-3'] },
        { name: 'Update Inventory', type: 'action', description: 'Update product inventory levels', config: {}, position: { x: 500, y: 100 }, connections: ['step-4'] },
        { name: 'Send Confirmation', type: 'action', description: 'Send order confirmation email', config: {}, position: { x: 700, y: 100 }, connections: [] }
      ]
    },
    {
      id: 'tmpl-002',
      name: 'Employee Onboarding',
      description: 'Comprehensive new employee onboarding process',
      category: 'HR',
      tags: ['hr', 'onboarding', 'training'],
      thumbnail: '/templates/employee-onboarding.png',
      rating: 4.6,
      downloads: 892,
      useCase: 'Streamline new employee onboarding with automated task assignment',
      benefits: ['Consistent experience', 'Reduced HR workload', 'Better compliance'],
      steps: [
        { name: 'New Hire Trigger', type: 'trigger', description: 'Triggered when new employee is added', config: {}, position: { x: 100, y: 100 }, connections: ['step-2'] },
        { name: 'Create Accounts', type: 'action', description: 'Create IT accounts and access', config: {}, position: { x: 300, y: 100 }, connections: ['step-3'] },
        { name: 'Send Welcome Pack', type: 'action', description: 'Send welcome email and documents', config: {}, position: { x: 500, y: 100 }, connections: ['step-4'] },
        { name: 'Schedule Training', type: 'action', description: 'Schedule mandatory training sessions', config: {}, position: { x: 700, y: 100 }, connections: [] }
      ]
    }
  ]);

  // Analytics
  const analytics = {
    totalWorkflows: workflows.length,
    activeWorkflows: workflows.filter(w => w.status === 'active').length,
    totalExecutions: workflows.reduce((sum, w) => sum + w.executions, 0),
    avgSuccessRate: workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length,
    runningExecutions: executions.filter(e => e.status === 'running').length,
    completedToday: executions.filter(e => e.status === 'completed' && 
      new Date(e.startTime).toDateString() === new Date().toDateString()).length
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300',
      'paused': 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300',
      'draft': 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300',
      'disabled': 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300',
      'running': 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300',
      'completed': 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300',
      'failed': 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300',
      'cancelled': 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300'
    };
    return colors[status] || colors['draft'];
  };

  const getStepIcon = (type: string) => {
    const icons = {
      'trigger': PlayCircle,
      'condition': GitBranch,
      'action': Zap,
      'delay': Timer,
      'loop': RefreshCw
    };
    const Icon = icons[type] || Activity;
    return <Icon className="w-4 h-4" />;
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || workflow.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [...new Set(workflows.map(w => w.category))];

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
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Workflows</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalWorkflows}</p>
              <p className="text-sm text-blue-600">{analytics.activeWorkflows} active</p>
            </div>
            <Workflow className="w-12 h-12 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Executions</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalExecutions.toLocaleString()}</p>
              <p className="text-sm text-green-600">{analytics.completedToday} today</p>
            </div>
            <PlayCircle className="w-12 h-12 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.avgSuccessRate.toFixed(1)}%</p>
              <p className="text-sm text-purple-600">Above benchmark</p>
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Running Now</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.runningExecutions}</p>
              <p className="text-sm text-orange-600">Active executions</p>
            </div>
            <Activity className="w-12 h-12 text-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* Active Workflows & Recent Executions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Workflows</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {workflows.filter(w => w.status === 'active').slice(0, 4).map((workflow) => (
              <div key={workflow.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Workflow className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{workflow.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{workflow.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{workflow.executions}</p>
                  <p className="text-xs text-gray-500">executions</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Executions</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {executions.slice(0, 4).map((execution) => {
              const workflow = workflows.find(w => w.id === execution.workflowId);
              return (
                <div key={execution.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-1 rounded-full ${
                      execution.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' :
                      execution.status === 'running' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      execution.status === 'failed' ? 'bg-red-100 dark:bg-red-900/30' :
                      'bg-gray-100 dark:bg-gray-900/30'
                    }`}>
                      {execution.status === 'completed' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                       execution.status === 'running' ? <PlayCircle className="w-4 h-4 text-blue-600" /> :
                       execution.status === 'failed' ? <XCircle className="w-4 h-4 text-red-600" /> :
                       <Clock className="w-4 h-4 text-gray-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{workflow?.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(execution.startTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(execution.status)}`}>
                      {execution.status}
                    </span>
                    {execution.duration && (
                      <p className="text-xs text-gray-500 mt-1">{execution.duration}s</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Workflow Categories & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Workflows by Category</h3>
          <div className="space-y-4">
            {categories.map((category) => {
              const count = workflows.filter(w => w.category === category).length;
              const percentage = workflows.length > 0 ? (count / workflows.length) * 100 : 0;
              return (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{category}</span>
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Trends</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-medium">+2.3%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Execution Time</span>
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-medium">-15s</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Daily Executions</span>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-blue-600 font-medium">+12%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Error Rate</span>
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-medium">-0.8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkflowsTab = () => (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search workflows..."
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
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
              <option value="disabled">Disabled</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Create Workflow</span>
            </button>
          </div>
        </div>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredWorkflows.map((workflow) => (
          <motion.div
            key={workflow.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedWorkflow(workflow)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Workflow className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{workflow.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{workflow.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                  {workflow.status}
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {workflow.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{workflow.executions}</p>
                  <p className="text-xs text-gray-500">Executions</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-600">{workflow.successRate}%</p>
                  <p className="text-xs text-gray-500">Success</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Last run</p>
                <p className="text-xs text-gray-500">{new Date(workflow.lastRun).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {workflow.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {workflow.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                  +{workflow.tags.length - 3}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Trigger:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{workflow.trigger}</span>
              </div>
              <div className="flex items-center space-x-2">
                {workflow.status === 'active' ? (
                  <button className="p-1 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded">
                    <Pause className="w-4 h-4" />
                  </button>
                ) : (
                  <button className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded">
                    <Play className="w-4 h-4" />
                  </button>
                )}
                <button className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900/30 rounded">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <UniversalPageWrapper
      title="Workflow Automation"
      subtitle="Automate business processes and increase operational efficiency"
      showBreadcrumb={false}
      visualMode="standard"
      showAIChat={true}
      headerActions={
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { key: 'workflows', label: 'Workflows', icon: Workflow },
            { key: 'executions', label: 'Executions', icon: PlayCircle },
            { key: 'templates', label: 'Templates', icon: FileText },
            { key: 'logs', label: 'Logs', icon: Activity }
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
            {activeTab === 'workflows' && renderWorkflowsTab()}
            {activeTab === 'executions' && (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                <PlayCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Execution monitoring interface coming soon</p>
              </div>
            )}
            {activeTab === 'templates' && (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Workflow templates library coming soon</p>
              </div>
            )}
            {activeTab === 'logs' && (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Execution logs viewer coming soon</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </UniversalPageWrapper>
  );
}