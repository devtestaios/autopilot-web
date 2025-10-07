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
  MessageSquare,
  Video,
  Calendar,
  FileText,
  Folder,
  Clock,
  Bell,
  Activity,
  Star,
  Settings,
  Plus,
  Filter,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Phone,
  UserPlus,
  Edit,
  Trash2,
  Download,
  Share2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  Hash,
  Globe,
  Shield,
  Archive,
  Bookmark,
  Tag,
  UserCheck,
  UserX,
  MousePointer,
  Wifi,
  WifiOff,
  Headphones,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  Layers,
  GitBranch,
  Code,
  Database,
  Server,
  Cloud
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

// Team Collaboration Types
interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'manager' | 'member' | 'guest';
  status: 'online' | 'away' | 'busy' | 'offline';
  lastActive: string;
  department: string;
  timezone: string;
  permissions: string[];
  cursorPosition?: { x: number; y: number; page: string };
}

interface Channel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'direct';
  members: string[];
  unreadCount: number;
  lastMessage?: {
    id: string;
    content: string;
    sender: string;
    timestamp: string;
  };
  isPinned: boolean;
  isMuted: boolean;
}

interface Message {
  id: string;
  content: string;
  sender: string;
  channelId: string;
  timestamp: string;
  type: 'text' | 'file' | 'image' | 'system';
  attachments?: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
  reactions?: {
    emoji: string;
    users: string[];
    count: number;
  }[];
  threadCount?: number;
  isEdited?: boolean;
  mentions?: string[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed';
  progress: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  team: string[];
  deadline: string;
  createdAt: string;
  lastActivity: string;
  channels: string[];
  files: number;
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
  };
}

interface Activity {
  id: string;
  type: 'message' | 'file_upload' | 'member_join' | 'member_leave' | 'channel_create' | 'project_update' | 'task_complete';
  actor: string;
  description: string;
  timestamp: string;
  context?: {
    channelId?: string;
    projectId?: string;
    fileId?: string;
  };
}

interface Meeting {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  organizer: string;
  attendees: string[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  meetingLink: string;
  recording?: string;
  agenda: string[];
  notes?: string;
}

export default function TeamCollaboration() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'meetings' | 'projects' | 'files' | 'members'>('overview');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [messageInput, setMessageInput] = useState('');

  // Mock data - will be replaced with real API calls in Phase 3
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 'user-001',
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      avatar: '/avatars/sarah.jpg',
      role: 'admin',
      status: 'online',
      lastActive: '2025-09-30T09:30:00Z',
      department: 'Engineering',
      timezone: 'PST',
      permissions: ['admin', 'edit', 'delete'],
      cursorPosition: { x: 450, y: 300, page: 'project-alpha' }
    },
    {
      id: 'user-002',
      name: 'Michael Chen',
      email: 'michael@company.com',
      avatar: '/avatars/michael.jpg',
      role: 'manager',
      status: 'online',
      lastActive: '2025-09-30T09:25:00Z',
      department: 'Product',
      timezone: 'EST',
      permissions: ['edit', 'create'],
      cursorPosition: { x: 200, y: 150, page: 'dashboard' }
    },
    {
      id: 'user-003',
      name: 'Emily Davis',
      email: 'emily@company.com',
      avatar: '/avatars/emily.jpg',
      role: 'member',
      status: 'away',
      lastActive: '2025-09-30T08:45:00Z',
      department: 'Design',
      timezone: 'CST',
      permissions: ['edit'],
    },
    {
      id: 'user-004',
      name: 'David Wilson',
      email: 'david@company.com',
      avatar: '/avatars/david.jpg',
      role: 'member',
      status: 'busy',
      lastActive: '2025-09-30T09:15:00Z',
      department: 'Marketing',
      timezone: 'PST',
      permissions: ['view', 'comment'],
    },
    {
      id: 'user-005',
      name: 'Lisa Rodriguez',
      email: 'lisa@company.com',
      avatar: '/avatars/lisa.jpg',
      role: 'guest',
      status: 'offline',
      lastActive: '2025-09-29T17:30:00Z',
      department: 'External',
      timezone: 'EST',
      permissions: ['view'],
    }
  ]);

  const [channels, setChannels] = useState<Channel[]>([
    {
      id: 'channel-001',
      name: 'general',
      description: 'General team discussions',
      type: 'public',
      members: ['user-001', 'user-002', 'user-003', 'user-004'],
      unreadCount: 3,
      lastMessage: {
        id: 'msg-101',
        content: 'Great work on the presentation today!',
        sender: 'user-002',
        timestamp: '2025-09-30T09:20:00Z'
      },
      isPinned: true,
      isMuted: false
    },
    {
      id: 'channel-002',
      name: 'engineering',
      description: 'Engineering team coordination',
      type: 'private',
      members: ['user-001', 'user-003'],
      unreadCount: 7,
      lastMessage: {
        id: 'msg-102',
        content: 'The new deployment is ready for testing',
        sender: 'user-001',
        timestamp: '2025-09-30T08:45:00Z'
      },
      isPinned: false,
      isMuted: false
    },
    {
      id: 'channel-003',
      name: 'product-updates',
      description: 'Product announcements and updates',
      type: 'public',
      members: ['user-001', 'user-002', 'user-003', 'user-004', 'user-005'],
      unreadCount: 0,
      lastMessage: {
        id: 'msg-103',
        content: 'Q4 roadmap has been finalized',
        sender: 'user-002',
        timestamp: '2025-09-29T16:30:00Z'
      },
      isPinned: true,
      isMuted: false
    },
    {
      id: 'channel-004',
      name: 'random',
      description: 'Off-topic discussions and fun',
      type: 'public',
      members: ['user-001', 'user-002', 'user-003', 'user-004'],
      unreadCount: 1,
      lastMessage: {
        id: 'msg-104',
        content: 'Who wants to grab lunch together?',
        sender: 'user-004',
        timestamp: '2025-09-30T07:30:00Z'
      },
      isPinned: false,
      isMuted: true
    }
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'proj-001',
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with modern design',
      status: 'active',
      progress: 65,
      priority: 'high',
      team: ['user-001', 'user-003', 'user-004'],
      deadline: '2025-11-15',
      createdAt: '2025-09-01T10:00:00Z',
      lastActivity: '2025-09-30T09:15:00Z',
      channels: ['channel-002'],
      files: 47,
      tasks: { total: 28, completed: 18, inProgress: 6, todo: 4 }
    },
    {
      id: 'proj-002',
      name: 'Mobile App Launch',
      description: 'iOS and Android app development and launch strategy',
      status: 'active',
      progress: 40,
      priority: 'urgent',
      team: ['user-001', 'user-002', 'user-003'],
      deadline: '2025-12-01',
      createdAt: '2025-08-15T14:00:00Z',
      lastActivity: '2025-09-30T08:30:00Z',
      channels: ['channel-001', 'channel-002'],
      files: 89,
      tasks: { total: 45, completed: 18, inProgress: 12, todo: 15 }
    },
    {
      id: 'proj-003',
      name: 'Q4 Marketing Campaign',
      description: 'Comprehensive marketing campaign for Q4 product launches',
      status: 'planning',
      progress: 15,
      priority: 'medium',
      team: ['user-002', 'user-004'],
      deadline: '2025-10-31',
      createdAt: '2025-09-20T11:00:00Z',
      lastActivity: '2025-09-29T16:45:00Z',
      channels: ['channel-003'],
      files: 23,
      tasks: { total: 20, completed: 3, inProgress: 2, todo: 15 }
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 'act-001',
      type: 'message',
      actor: 'user-002',
      description: 'sent a message in #general',
      timestamp: '2025-09-30T09:20:00Z',
      context: { channelId: 'channel-001' }
    },
    {
      id: 'act-002',
      type: 'file_upload',
      actor: 'user-001',
      description: 'uploaded design mockups to Website Redesign',
      timestamp: '2025-09-30T09:15:00Z',
      context: { projectId: 'proj-001' }
    },
    {
      id: 'act-003',
      type: 'task_complete',
      actor: 'user-003',
      description: 'completed "Homepage wireframes" task',
      timestamp: '2025-09-30T08:45:00Z',
      context: { projectId: 'proj-001' }
    },
    {
      id: 'act-004',
      type: 'member_join',
      actor: 'user-005',
      description: 'joined the team as a guest',
      timestamp: '2025-09-29T17:30:00Z'
    }
  ]);

  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: 'meet-001',
      title: 'Weekly Team Standup',
      description: 'Weekly progress updates and planning',
      startTime: '2025-09-30T10:00:00Z',
      endTime: '2025-09-30T10:30:00Z',
      organizer: 'user-002',
      attendees: ['user-001', 'user-002', 'user-003', 'user-004'],
      status: 'scheduled',
      meetingLink: 'https://meet.company.com/standup-weekly',
      agenda: ['Sprint progress review', 'Blockers discussion', 'Next week planning'],
    },
    {
      id: 'meet-002',
      title: 'Design Review',
      description: 'Review of website redesign mockups',
      startTime: '2025-09-30T14:00:00Z',
      endTime: '2025-09-30T15:00:00Z',
      organizer: 'user-003',
      attendees: ['user-001', 'user-003', 'user-004'],
      status: 'scheduled',
      meetingLink: 'https://meet.company.com/design-review',
      agenda: ['Homepage mockup review', 'Color scheme discussion', 'Mobile responsiveness'],
    }
  ]);

  // Analytics
  const analytics = {
    totalMembers: teamMembers.length,
    onlineMembers: teamMembers.filter(m => m.status === 'online').length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalChannels: channels.length,
    unreadMessages: channels.reduce((sum, c) => sum + c.unreadCount, 0),
    todayActivities: activities.filter(a => 
      new Date(a.timestamp).toDateString() === new Date().toDateString()).length,
    upcomingMeetings: meetings.filter(m => 
      m.status === 'scheduled' && new Date(m.startTime) > new Date()).length
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'online': 'bg-green-500',
      'away': 'bg-yellow-500',
      'busy': 'bg-red-500',
      'offline': 'bg-gray-400'
    };
    return colors[status] || colors['offline'];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400',
      'medium': 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300',
      'high': 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300',
      'urgent': 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[priority] || colors['medium'];
  };

  const getProjectStatusColor = (status: string) => {
    const colors = {
      'planning': 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400',
      'active': 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300',
      'on-hold': 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300',
      'completed': 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300'
    };
    return colors[status] || colors['planning'];
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      'message': MessageSquare,
      'file_upload': FileText,
      'member_join': UserPlus,
      'member_leave': UserX,
      'channel_create': Hash,
      'project_update': Folder,
      'task_complete': CheckCircle
    };
    const Icon = icons[type] || Activity;
    return <Icon className="w-4 h-4" />;
  };

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
              <p className="text-sm text-gray-600 dark:text-gray-400">Team Members</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalMembers}</p>
              <p className="text-sm text-green-600">{analytics.onlineMembers} online</p>
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.activeProjects}</p>
              <p className="text-sm text-purple-600">In progress</p>
            </div>
            <Folder className="w-12 h-12 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unread Messages</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.unreadMessages}</p>
              <p className="text-sm text-orange-600">Across {analytics.totalChannels} channels</p>
            </div>
            <MessageSquare className="w-12 h-12 text-orange-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Meetings</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.upcomingMeetings}</p>
              <p className="text-sm text-green-600">Today</p>
            </div>
            <Video className="w-12 h-12 text-green-600" />
          </div>
        </motion.div>
      </div>

      {/* Online Team Members & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Online Team Members</h3>
            <span className="text-sm text-gray-500">{analytics.onlineMembers} online</span>
          </div>
          <div className="space-y-3">
            {teamMembers.filter(m => m.status === 'online').map((member) => (
              <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{member.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                      member.role === 'manager' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                    }`}>
                      {member.role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{member.department}</p>
                </div>
                {member.cursorPosition && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <MousePointer className="w-3 h-3" />
                    <span>Active</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Projects</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {projects.filter(p => p.status === 'active').map((project) => (
              <div key={project.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Folder className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{project.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {project.progress}%
                  </span>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((memberId) => {
                      const member = teamMembers.find(m => m.id === memberId);
                      return member ? (
                        <div
                          key={memberId}
                          className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-medium"
                          title={member.name}
                        >
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      ) : null;
                    })}
                    {project.team.length > 3 && (
                      <div className="w-6 h-6 bg-gray-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-gray-500">
                    Due {new Date(project.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {activities.slice(0, 6).map((activity) => {
              const actor = teamMembers.find(m => m.id === activity.actor);
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">{actor?.name}</span> {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Channels</h3>
          <div className="space-y-2">
            {channels.map((channel) => (
              <div
                key={channel.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer"
                onClick={() => setSelectedChannel(channel)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {channel.type === 'private' ? (
                      <Shield className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Hash className="w-4 h-4 text-gray-600" />
                    )}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {channel.name}
                    </span>
                    {channel.isPinned && (
                      <Star className="w-3 h-3 text-yellow-500" />
                    )}
                    {channel.isMuted && (
                      <Bell className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{channel.members.length}</span>
                  {channel.unreadCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                      {channel.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderChatTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-[600px] flex">
        {/* Channels Sidebar */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 p-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Channels</h4>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            {channels.map((channel) => (
              <div
                key={channel.id}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedChannel?.id === channel.id 
                    ? 'bg-blue-100 dark:bg-blue-900/30' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => setSelectedChannel(channel)}
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  {channel.type === 'private' ? (
                    <Shield className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  ) : (
                    <Hash className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {channel.name}
                  </span>
                </div>
                {channel.unreadCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                    {channel.unreadCount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChannel ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      #{selectedChannel.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedChannel.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <Phone className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <Video className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <Settings className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {/* Sample messages */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      SC
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">Sarah Chen</span>
                        <span className="text-xs text-gray-500">9:20 AM</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        Hey team! The new design mockups are ready for review. I've uploaded them to the project folder.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      MD
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">Mike Davis</span>
                        <span className="text-xs text-gray-500">9:22 AM</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        Awesome! I'll take a look at them this afternoon. 
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-xs">👍</span>
                        <span className="text-xs text-gray-500">2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder={`Message #${selectedChannel.name}...`}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <Paperclip className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <Smile className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Select a channel to start chatting</p>
              </div>
            </div>
          )}
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
        
        {/* Team Collaboration Content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl text-white">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Team Collaboration
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Connect, communicate, and collaborate with your team in real-time
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { key: 'overview', label: 'Overview', icon: BarChart3 },
                { key: 'chat', label: 'Chat', icon: MessageSquare },
                { key: 'meetings', label: 'Meetings', icon: Video },
                { key: 'projects', label: 'Projects', icon: Folder },
                { key: 'files', label: 'Files', icon: FileText },
                { key: 'members', label: 'Members', icon: Users }
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
                  {tab.key === 'chat' && analytics.unreadMessages > 0 && (
                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {analytics.unreadMessages}
                    </span>
                  )}
                  {tab.key === 'meetings' && analytics.upcomingMeetings > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {analytics.upcomingMeetings}
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
              {activeTab === 'overview' && renderOverviewTab()}
              {activeTab === 'chat' && renderChatTab()}
              {activeTab === 'meetings' && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Video meetings interface coming soon</p>
                </div>
              )}
              {activeTab === 'projects' && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Project collaboration interface coming soon</p>
                </div>
              )}
              {activeTab === 'files' && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">File sharing interface coming soon</p>
                </div>
              )}
              {activeTab === 'members' && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Team management interface coming soon</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}