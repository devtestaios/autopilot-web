'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  LayoutDashboard, 
  Megaphone, 
  BarChart3, 
  Settings, 
  Users, 
  Calendar,
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  RefreshCw,
  Brain,
  Zap,
  Mail,
  Share2,
  PenTool,
  ShoppingCart,
  Briefcase,
  FileText,
  Globe,
  Database,
  Shield,
  Monitor,
  Smartphone,
  MessageSquare,
  Layers,
  GitBranch,
  Clock,
  UserCheck,
  Workflow,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';
import { PulseWaveLogo } from './PulseWaveLogo';

// ============================================================================
// CONTEXT-AWARE SIDEBAR CONFIGURATIONS
// ============================================================================

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  badge?: string;
  description?: string;
  subItems?: Array<{
    id: string;
    label: string;
    path: string;
    description?: string;
  }>;
}

interface SidebarContext {
  id: string;
  name: string;
  description: string;
  items: SidebarItem[];
}

// ============================================================================
// DASHBOARD CONTEXTS AND THEIR SPECIFIC SIDEBAR CONTENT
// ============================================================================

const sidebarContexts: Record<string, SidebarContext> = {
  // PRIMARY DASHBOARD - Master Terminal Command Center
  'dashboard': {
    id: 'dashboard',
    name: 'Master Terminal',
    description: 'Enterprise Command Center',
    items: [
      {
        id: 'overview',
        label: 'Command Overview',
        icon: LayoutDashboard,
        path: '/dashboard',
        badge: 'Live',
        description: 'Master Terminal command center with platform overview'
      },
      {
        id: 'platforms',
        label: 'Platform Registry',
        icon: Layers,
        path: '/platforms',
        description: 'Manage all connected business platforms',
        subItems: [
          { id: 'marketing-platforms', label: 'Marketing Suite', path: '/marketing' },
          { id: 'business-platforms', label: 'Business Operations', path: '/business-suite' },
          { id: 'analytics-platforms', label: 'Analytics Hub', path: '/analytics' },
          { id: 'ai-platforms', label: 'AI & Automation', path: '/ai' }
        ]
      },
      {
        id: 'quick-actions',
        label: 'Quick Actions',
        icon: Zap,
        path: '/dashboard/quick-actions',
        description: 'Rapid platform control and automation',
        subItems: [
          { id: 'create-campaign', label: 'New Campaign', path: '/campaigns/new' },
          { id: 'optimize-all', label: 'Optimize All', path: '/optimization' },
          { id: 'generate-report', label: 'Generate Report', path: '/reports' },
          { id: 'sync-platforms', label: 'Sync Platforms', path: '/sync' }
        ]
      },
      {
        id: 'system-status',
        label: 'System Status',
        icon: Activity,
        path: '/status',
        description: 'Real-time platform health and performance monitoring'
      }
    ]
  },

  // MARKETING COMMAND CENTER - Consolidated Marketing Hub
  'marketing': {
    id: 'marketing',
    name: 'Marketing Command Center',
    description: 'Unified Marketing Ecosystem',
    items: [
      {
        id: 'marketing-overview',
        label: 'Marketing Overview',
        icon: Megaphone,
        path: '/marketing',
        badge: 'Hub',
        description: 'Unified marketing dashboard and control center'
      },
      {
        id: 'campaign-management',
        label: 'Campaign Management',
        icon: Target,
        path: '/campaigns',
        description: 'Create, manage, and optimize marketing campaigns',
        subItems: [
          { id: 'active-campaigns', label: 'Active Campaigns', path: '/campaigns' },
          { id: 'create-campaign', label: 'Create Campaign', path: '/campaigns/new' },
          { id: 'campaign-templates', label: 'Templates', path: '/campaigns/templates' },
          { id: 'campaign-optimization', label: 'Optimization', path: '/optimization' }
        ]
      },
      {
        id: 'social-media',
        label: 'Social Media Suite',
        icon: Share2,
        path: '/social-media',
        description: 'Multi-platform social media management',
        subItems: [
          { id: 'social-overview', label: 'Social Overview', path: '/social-media' },
          { id: 'content-composer', label: 'Content Composer', path: '/social/composer' },
          { id: 'social-calendar', label: 'Content Calendar', path: '/social/calendar' },
          { id: 'social-analytics', label: 'Social Analytics', path: '/social-media/analytics' }
        ]
      },
      {
        id: 'email-marketing',
        label: 'Email Marketing',
        icon: Mail,
        path: '/email-marketing',
        description: 'Advanced email automation and analytics',
        subItems: [
          { id: 'email-campaigns', label: 'Email Campaigns', path: '/email-marketing' },
          { id: 'email-automation', label: 'Automation', path: '/email-marketing/automation' },
          { id: 'email-templates', label: 'Templates', path: '/email-marketing/templates' },
          { id: 'email-analytics', label: 'Email Analytics', path: '/email-marketing/analytics' }
        ]
      },
      {
        id: 'content-suite',
        label: 'Content Creation',
        icon: PenTool,
        path: '/content-suite',
        description: 'AI-powered content creation and optimization'
      }
    ]
  },

  // PROJECT MANAGEMENT - Enterprise Project Suite
  'project-management': {
    id: 'project-management',
    name: 'Project Management',
    description: 'Enterprise Project Command Center',
    items: [
      {
        id: 'project-overview',
        label: 'Project Dashboard',
        icon: Briefcase,
        path: '/project-management',
        badge: 'Projects',
        description: 'Comprehensive project analytics and overview'
      },
      {
        id: 'project-views',
        label: 'Project Views',
        icon: Layers,
        path: '/project-management/views',
        description: 'Multiple project visualization modes',
        subItems: [
          { id: 'kanban-board', label: 'Kanban Board', path: '/project-management?view=kanban' },
          { id: 'project-list', label: 'Project List', path: '/project-management?view=list' },
          { id: 'calendar-view', label: 'Calendar View', path: '/project-management?view=calendar' },
          { id: 'timeline-view', label: 'Timeline View', path: '/project-management?view=timeline' }
        ]
      },
      {
        id: 'team-management',
        label: 'Team Management',
        icon: Users,
        path: '/collaboration',
        description: 'Team collaboration and member management',
        subItems: [
          { id: 'team-overview', label: 'Team Overview', path: '/collaboration' },
          { id: 'team-members', label: 'Team Members', path: '/collaboration/members' },
          { id: 'team-activities', label: 'Team Activities', path: '/collaboration/activities' },
          { id: 'team-settings', label: 'Team Settings', path: '/collaboration/settings' }
        ]
      },
      {
        id: 'project-analytics',
        label: 'Project Analytics',
        icon: BarChart3,
        path: '/project-management/analytics',
        description: 'Project performance and team productivity analytics'
      },
      {
        id: 'resource-management',
        label: 'Resource Management',
        icon: Clock,
        path: '/project-management/resources',
        description: 'Resource allocation and workload optimization'
      }
    ]
  },

  // BUSINESS INTELLIGENCE - Analytics and Insights
  'business-intelligence': {
    id: 'business-intelligence',
    name: 'Business Intelligence',
    description: 'Advanced Analytics Hub',
    items: [
      {
        id: 'bi-overview',
        label: 'Intelligence Dashboard',
        icon: BarChart3,
        path: '/business-intelligence',
        badge: 'BI',
        description: 'Executive dashboard with key business insights'
      },
      {
        id: 'performance-analytics',
        label: 'Performance Analytics',
        icon: TrendingUp,
        path: '/analytics/performance',
        description: 'Comprehensive performance tracking and analysis',
        subItems: [
          { id: 'real-time-analytics', label: 'Real-time Analytics', path: '/analytics/real-time' },
          { id: 'historical-analysis', label: 'Historical Analysis', path: '/analytics/performance' },
          { id: 'predictive-insights', label: 'Predictive Insights', path: '/ai/predictive-analytics' },
          { id: 'custom-reports', label: 'Custom Reports', path: '/analytics/report-builder' }
        ]
      },
      {
        id: 'financial-analytics',
        label: 'Financial Analytics',
        icon: PieChart,
        path: '/analytics/roi',
        description: 'ROI analysis and financial performance tracking'
      },
      {
        id: 'advanced-reports',
        label: 'Advanced Reports',
        icon: FileText,
        path: '/reports',
        description: 'Comprehensive reporting and data visualization'
      },
      {
        id: 'ai-insights',
        label: 'AI-Powered Insights',
        icon: Brain,
        path: '/ai/analytics',
        description: 'Machine learning-driven business insights'
      }
    ]
  },

  // AI CENTER - Artificial Intelligence and Automation
  'ai': {
    id: 'ai',
    name: 'AI Control Center',
    description: 'Artificial Intelligence Hub',
    items: [
      {
        id: 'ai-overview',
        label: 'AI Dashboard',
        icon: Brain,
        path: '/ai',
        badge: 'AI',
        description: 'Central AI control and monitoring dashboard'
      },
      {
        id: 'ai-automation',
        label: 'AI Automation',
        icon: Workflow,
        path: '/ai-automation',
        description: 'Automated workflows and intelligent processes',
        subItems: [
          { id: 'automation-hub', label: 'Automation Hub', path: '/ai-automation' },
          { id: 'workflow-builder', label: 'Workflow Builder', path: '/ai/automation' },
          { id: 'smart-scheduling', label: 'Smart Scheduling', path: '/scheduler' },
          { id: 'auto-optimization', label: 'Auto Optimization', path: '/optimization' }
        ]
      },
      {
        id: 'ai-analytics',
        label: 'AI Analytics',
        icon: LineChart,
        path: '/ai/analytics',
        description: 'Machine learning insights and predictions',
        subItems: [
          { id: 'predictive-analytics', label: 'Predictive Analytics', path: '/ai/predictive-analytics' },
          { id: 'performance-advisor', label: 'Performance Advisor', path: '/ai/performance-advisor' },
          { id: 'recommendation-engine', label: 'Recommendations', path: '/ai/recommendation-engine' },
          { id: 'intelligent-alerts', label: 'Intelligent Alerts', path: '/ai/intelligent-alerts' }
        ]
      },
      {
        id: 'ai-settings',
        label: 'AI Configuration',
        icon: Settings,
        path: '/ai/settings',
        description: 'AI model configuration and preferences'
      }
    ]
  },

  // COLLABORATION - Team and Communication
  'collaboration': {
    id: 'collaboration',
    name: 'Team Collaboration',
    description: 'Real-time Collaboration Hub',
    items: [
      {
        id: 'collaboration-overview',
        label: 'Collaboration Hub',
        icon: Users,
        path: '/collaboration',
        badge: 'Live',
        description: 'Real-time team collaboration and communication'
      },
      {
        id: 'team-management',
        label: 'Team Management',
        icon: UserCheck,
        path: '/collaboration/team',
        description: 'Team member management and permissions',
        subItems: [
          { id: 'team-members', label: 'Team Members', path: '/collaboration' },
          { id: 'team-roles', label: 'Roles & Permissions', path: '/collaboration/roles' },
          { id: 'team-activities', label: 'Team Activities', path: '/collaboration/activities' },
          { id: 'presence-tracking', label: 'Presence Tracking', path: '/collaboration/presence' }
        ]
      },
      {
        id: 'communication',
        label: 'Communication',
        icon: MessageSquare,
        path: '/collaboration/communication',
        description: 'Team chat and communication tools'
      },
      {
        id: 'shared-workspace',
        label: 'Shared Workspace',
        icon: Layers,
        path: '/collaboration/workspace',
        description: 'Collaborative workspace and file sharing'
      }
    ]
  },

  // INTEGRATIONS - App Marketplace and Connections
  'integrations': {
    id: 'integrations',
    name: 'Integrations Marketplace',
    description: 'Universal App Ecosystem',
    items: [
      {
        id: 'integrations-overview',
        label: 'Marketplace Hub',
        icon: RefreshCw,
        path: '/integrations',
        badge: 'Apps',
        description: 'Universal app marketplace and integration management'
      },
      {
        id: 'app-categories',
        label: 'App Categories',
        icon: Layers,
        path: '/integrations/categories',
        description: 'Browse apps by category and functionality',
        subItems: [
          { id: 'marketing-apps', label: 'Marketing Apps', path: '/integrations?category=marketing' },
          { id: 'productivity-apps', label: 'Productivity Apps', path: '/integrations?category=productivity' },
          { id: 'analytics-apps', label: 'Analytics Apps', path: '/integrations?category=analytics' },
          { id: 'communication-apps', label: 'Communication Apps', path: '/integrations?category=communication' }
        ]
      },
      {
        id: 'installed-integrations',
        label: 'My Integrations',
        icon: GitBranch,
        path: '/integrations/installed',
        description: 'Manage installed apps and integrations'
      },
      {
        id: 'api-management',
        label: 'API Management',
        icon: Database,
        path: '/integrations/api',
        description: 'API keys and connection management'
      },
      {
        id: 'integration-analytics',
        label: 'Usage Analytics',
        icon: BarChart3,
        path: '/integrations/analytics',
        description: 'Integration performance and usage analytics'
      }
    ]
  },

  // ENTERPRISE SETTINGS - Configuration and Administration
  'enterprise': {
    id: 'enterprise',
    name: 'Enterprise Suite',
    description: 'Enterprise Administration',
    items: [
      {
        id: 'enterprise-overview',
        label: 'Enterprise Dashboard',
        icon: Shield,
        path: '/enterprise',
        badge: 'Admin',
        description: 'Enterprise administration and configuration'
      },
      {
        id: 'platform-settings',
        label: 'Platform Settings',
        icon: Settings,
        path: '/settings',
        description: 'Global platform configuration and preferences',
        subItems: [
          { id: 'general-settings', label: 'General Settings', path: '/settings' },
          { id: 'security-settings', label: 'Security Settings', path: '/settings/security' },
          { id: 'integration-settings', label: 'Integration Settings', path: '/settings/integrations' },
          { id: 'notification-settings', label: 'Notifications', path: '/settings/notifications' }
        ]
      },
      {
        id: 'infrastructure',
        label: 'Infrastructure',
        icon: Monitor,
        path: '/infrastructure',
        description: 'System infrastructure and deployment management'
      },
      {
        id: 'white-label',
        label: 'White-label Platform',
        icon: Globe,
        path: '/whitelabel',
        description: 'Custom branding and white-label configuration'
      }
    ]
  }
};

// ============================================================================
// CONTEXT DETECTION LOGIC
// ============================================================================

function detectDashboardContext(pathname: string): string {
  // Primary Dashboard - Master Terminal
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    return 'dashboard';
  }
  
  // Marketing Command Center and related platforms
  if (pathname.startsWith('/marketing') || 
      pathname.startsWith('/campaigns') || 
      pathname.startsWith('/email-marketing') || 
      pathname.startsWith('/social') ||
      pathname === '/content-suite') {
    return 'marketing';
  }
  
  // Project Management Suite
  if (pathname.startsWith('/project-management')) {
    return 'project-management';
  }
  
  // Business Intelligence and Analytics
  if (pathname.startsWith('/business-intelligence') || 
      pathname.startsWith('/analytics') || 
      pathname.startsWith('/reports')) {
    return 'business-intelligence';
  }
  
  // AI Center and Automation
  if (pathname.startsWith('/ai') ||
      pathname.startsWith('/optimization') ||
      pathname === '/ai-automation') {
    return 'ai';
  }
  
  // Team Collaboration
  if (pathname.startsWith('/collaboration')) {
    return 'collaboration';
  }
  
  // Integrations Marketplace
  if (pathname.startsWith('/integrations') || 
      pathname.startsWith('/sync') ||
      pathname === '/scheduler' ||
      pathname === '/platforms') {
    return 'integrations';
  }
  
  // Enterprise and Settings
  if (pathname.startsWith('/enterprise') || 
      pathname.startsWith('/settings') || 
      pathname.startsWith('/infrastructure') ||
      pathname === '/whitelabel') {
    return 'enterprise';
  }
  
  // Default to dashboard context
  return 'dashboard';
}

// ============================================================================
// CONTEXTUAL UNIFIED SIDEBAR COMPONENT
// ============================================================================

interface ContextualUnifiedSidebarProps {
  defaultCollapsed?: boolean;
  className?: string;
  onCollapseChange?: (collapsed: boolean) => void;
}

export default function ContextualUnifiedSidebar({ 
  defaultCollapsed = false, 
  className = '',
  onCollapseChange
}: ContextualUnifiedSidebarProps) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Detect current dashboard context
  const currentContext = detectDashboardContext(pathname);
  const contextConfig = sidebarContexts[currentContext] || sidebarContexts['dashboard'];

  // Check for mobile screen
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-expand current section
  useEffect(() => {
    const currentItem = contextConfig.items.find(item => 
      pathname === item.path || 
      (item.subItems && item.subItems.some(sub => pathname === sub.path))
    );
    
    if (currentItem && currentItem.subItems) {
      setExpandedItem(currentItem.id);
    }
  }, [pathname, contextConfig.items]);

  // Notify parent of collapse state changes
  useEffect(() => {
    onCollapseChange?.(isCollapsed);
  }, [isCollapsed, onCollapseChange]);

  const handleItemClick = (item: SidebarItem) => {
    if (item.subItems) {
      setExpandedItem(expandedItem === item.id ? null : item.id);
    } else {
      if (pathname !== item.path) {
        router.push(item.path);
      }
      if (isMobile) {
        setIsMobileOpen(false);
      }
    }
  };

  const handleSubItemClick = (path: string) => {
    router.push(path);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const isItemActive = (item: SidebarItem) => {
    if (pathname === item.path) return true;
    if (item.subItems) {
      return item.subItems.some(sub => pathname === sub.path);
    }
    return false;
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Mobile overlay
  if (isMobile && isMobileOpen) {
    return (
      <>
        {/* Mobile Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
        
        {/* Mobile Sidebar */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl z-50 md:hidden"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <PulseWaveLogo className="w-8 h-8" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {contextConfig.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {contextConfig.description}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleMobileMenu}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {contextConfig.items.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                      isItemActive(item)
                        ? 'bg-teal-100 dark:bg-teal-900/20 text-teal-900 dark:text-teal-100'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.subItems && (
                      <ChevronRight 
                        className={`w-4 h-4 transition-transform ${
                          expandedItem === item.id ? 'rotate-90' : ''
                        }`}
                      />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {item.subItems && expandedItem === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-8 mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            <button
                              key={subItem.id}
                              onClick={() => handleSubItemClick(subItem.path)}
                              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                                pathname === subItem.path
                                  ? 'bg-teal-50 dark:bg-teal-900/10 text-teal-700 dark:text-teal-300'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400'
                              }`}
                            >
                              {subItem.label}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </div>
        </motion.div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-30 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg md:hidden"
      >
        <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Desktop Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          width: isCollapsed ? '3.5rem' : '15rem',
          opacity: 1 
        }}
        className={`hidden md:flex flex-col fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg z-30 ${className}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center space-x-3"
                >
                  <PulseWaveLogo className="w-8 h-8" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {contextConfig.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {contextConfig.description}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              onClick={toggleCollapse}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {contextConfig.items.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all group ${
                    isItemActive(item)
                      ? 'bg-teal-100 dark:bg-teal-900/20 text-teal-900 dark:text-teal-100'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="flex items-center space-x-2"
                        >
                          <span className="font-medium">{item.label}</span>
                          {item.badge && (
                            <span className="px-2 py-0.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {!isCollapsed && item.subItems && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <ChevronRight 
                          className={`w-4 h-4 transition-transform ${
                            expandedItem === item.id ? 'rotate-90' : ''
                          }`}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
                
                <AnimatePresence>
                  {item.subItems && expandedItem === item.id && !isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-8 mt-1 space-y-1">
                        {item.subItems.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => handleSubItemClick(subItem.path)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                              pathname === subItem.path
                                ? 'bg-teal-50 dark:bg-teal-900/10 text-teal-700 dark:text-teal-300'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400'
                            }`}
                            title={subItem.description}
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Context: {currentContext}</span>
                </div>
                <p>Contextual navigation for {contextConfig.description.toLowerCase()}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}