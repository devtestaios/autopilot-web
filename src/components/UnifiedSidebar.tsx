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
// CONTEXTUAL SIDEBAR CONTENT BASED ON CURRENT PAGE
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

// ============================================================================
// CONTEXT DETECTION AND DYNAMIC SIDEBAR CONTENT
// ============================================================================

function getContextualSidebarItems(pathname: string): { contextName: string; items: SidebarItem[] } {
  // Master Terminal / Dashboard Context
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    return {
      contextName: 'Master Terminal',
      items: [
        {
          id: 'dashboard-overview',
          label: 'Master Terminal',
          icon: LayoutDashboard,
          path: '/dashboard',
          badge: 'Live',
          description: 'Master Terminal command center'
        },
        {
          id: 'marketing-hub',
          label: 'Marketing Hub',
          icon: Megaphone,
          path: '/marketing-command-center',
          description: 'Marketing automation center',
          subItems: [
            { id: 'email-marketing', label: 'Email Marketing', path: '/email-marketing' },
            { id: 'social-media', label: 'Social Media', path: '/social-media' },
            { id: 'campaigns', label: 'Campaigns', path: '/campaigns' },
            { id: 'content-suite', label: 'Content Suite', path: '/content-suite' }
          ]
        },
        {
          id: 'project-management',
          label: 'Project Management',
          icon: Briefcase,
          path: '/project-management',
          description: 'Enterprise project management'
        },
        {
          id: 'team-collaboration',
          label: 'Team Collaboration',
          icon: Users,
          path: '/collaboration',
          description: 'Real-time team coordination'
        },
        {
          id: 'business-intelligence',
          label: 'Business Intelligence',
          icon: BarChart3,
          path: '/business-intelligence',
          description: 'Advanced analytics and insights',
          subItems: [
            { id: 'analytics', label: 'Analytics', path: '/analytics' },
            { id: 'reports', label: 'Reports', path: '/reports' },
            { id: 'performance', label: 'Performance', path: '/performance' }
          ]
        },
        {
          id: 'integrations',
          label: 'Integrations',
          icon: Globe,
          path: '/integrations',
          description: 'Universal app marketplace'
        },
        {
          id: 'ai-center',
          label: 'AI Center',
          icon: Brain,
          path: '/ai-center',
          description: 'AI automation and insights',
          subItems: [
            { id: 'ai-automation', label: 'AI Automation', path: '/ai-automation' },
            { id: 'ai-analytics', label: 'AI Analytics', path: '/ai/analytics' },
            { id: 'ai-settings', label: 'AI Settings', path: '/ai/settings' }
          ]
        },
        {
          id: 'platform-setup',
          label: 'Platform Setup',
          icon: Settings,
          path: '/platforms',
          description: 'Configure all platforms'
        },
        {
          id: 'system-status',
          label: 'System Status',
          icon: Activity,
          path: '/status',
          description: 'Platform health monitoring'
        }
      ]
    };
  }

  // Marketing Context
  if (pathname.startsWith('/marketing') || pathname.startsWith('/campaigns') || 
      pathname.startsWith('/email-marketing') || pathname.startsWith('/social') ||
      pathname === '/content-suite') {
    return {
      contextName: 'Marketing Command Center',
      items: [
        {
          id: 'marketing-overview',
          label: 'Marketing Hub',
          icon: Megaphone,
          path: '/email-marketing',
          badge: 'Hub',
          description: 'Unified marketing dashboard'
        },
        {
          id: 'campaigns',
          label: 'Campaign Management',
          icon: Target,
          path: '/campaigns',
          description: 'Create and manage campaigns',
          subItems: [
            { id: 'active-campaigns', label: 'Active Campaigns', path: '/campaigns' },
            { id: 'create-campaign', label: 'Create Campaign', path: '/campaigns' },
            { id: 'templates', label: 'Templates', path: '/campaigns' }
          ]
        },
        {
          id: 'social-media',
          label: 'Social Media',
          icon: Share2,
          path: '/social-media',
          description: 'Multi-platform social management',
          subItems: [
            { id: 'social-overview', label: 'Social Overview', path: '/social-media' },
            { id: 'composer', label: 'Content Composer', path: '/social-media' },
            { id: 'calendar', label: 'Content Calendar', path: '/social-media' }
          ]
        },
        {
          id: 'email-marketing',
          label: 'Email Marketing',
          icon: Mail,
          path: '/email-marketing',
          description: 'Email automation and analytics'
        },
        {
          id: 'content-creation',
          label: 'Content Suite',
          icon: PenTool,
          path: '/social-media',
          description: 'AI-powered content creation'
        }
      ]
    };
  }

  // Project Management Context
  if (pathname.startsWith('/project-management')) {
    return {
      contextName: 'Project Management',
      items: [
        {
          id: 'project-dashboard',
          label: 'Project Dashboard',
          icon: Briefcase,
          path: '/project-management',
          badge: 'Projects',
          description: 'Project analytics and overview'
        },
        {
          id: 'project-views',
          label: 'Project Views',
          icon: Layers,
          path: '/project-management/views',
          description: 'Multiple project visualization modes',
          subItems: [
            { id: 'kanban', label: 'Kanban Board', path: '/project-management?view=kanban' },
            { id: 'list', label: 'Project List', path: '/project-management?view=list' },
            { id: 'calendar', label: 'Calendar View', path: '/project-management?view=calendar' },
            { id: 'timeline', label: 'Timeline View', path: '/project-management?view=timeline' }
          ]
        },
        {
          id: 'team-collaboration',
          label: 'Team Management',
          icon: Users,
          path: '/collaboration',
          description: 'Team collaboration tools'
        },
        {
          id: 'project-analytics',
          label: 'Project Analytics',
          icon: BarChart3,
          path: '/project-management/analytics',
          description: 'Performance and productivity analytics'
        }
      ]
    };
  }

  // Business Intelligence / Analytics Context
  if (pathname.startsWith('/business-intelligence') || pathname.startsWith('/analytics') || 
      pathname.startsWith('/reports')) {
    return {
      contextName: 'Business Intelligence',
      items: [
        {
          id: 'bi-dashboard',
          label: 'Intelligence Hub',
          icon: BarChart3,
          path: '/business-intelligence',
          badge: 'BI',
          description: 'Executive dashboard with insights'
        },
        {
          id: 'performance-analytics',
          label: 'Performance Analytics',
          icon: TrendingUp,
          path: '/analytics/performance',
          description: 'Comprehensive performance tracking',
          subItems: [
            { id: 'real-time', label: 'Real-time Analytics', path: '/analytics/real-time' },
            { id: 'historical', label: 'Historical Analysis', path: '/analytics/performance' },
            { id: 'predictive', label: 'Predictive Insights', path: '/ai/predictive-analytics' }
          ]
        },
        {
          id: 'financial-analytics',
          label: 'Financial Analytics',
          icon: PieChart,
          path: '/analytics/roi',
          description: 'ROI analysis and financial tracking'
        },
        {
          id: 'advanced-reports',
          label: 'Advanced Reports',
          icon: FileText,
          path: '/reports',
          description: 'Comprehensive reporting'
        }
      ]
    };
  }

  // AI Center Context
  if (pathname.startsWith('/ai') || pathname.startsWith('/optimization') || 
      pathname === '/ai-center' || pathname === '/ai-automation') {
    return {
      contextName: 'AI Control Center',
      items: [
        {
          id: 'ai-dashboard',
          label: 'AI Dashboard',
          icon: Brain,
          path: '/ai-center',
          badge: 'AI',
          description: 'Central AI control and monitoring'
        },
        {
          id: 'ai-automation',
          label: 'AI Automation',
          icon: Workflow,
          path: '/ai-automation',
          description: 'Automated workflows',
          subItems: [
            { id: 'automation-hub', label: 'Automation Hub', path: '/ai-automation' },
            { id: 'workflow-builder', label: 'Workflow Builder', path: '/ai/automation' },
            { id: 'optimization', label: 'Auto Optimization', path: '/optimization' }
          ]
        },
        {
          id: 'ai-analytics',
          label: 'AI Analytics',
          icon: LineChart,
          path: '/ai/analytics',
          description: 'Machine learning insights'
        },
        {
          id: 'ai-settings',
          label: 'AI Configuration',
          icon: Settings,
          path: '/ai/settings',
          description: 'AI model configuration'
        }
      ]
    };
  }

  // Collaboration Context
  if (pathname.startsWith('/collaboration')) {
    return {
      contextName: 'Team Collaboration',
      items: [
        {
          id: 'collaboration-hub',
          label: 'Collaboration Hub',
          icon: Users,
          path: '/collaboration',
          badge: 'Live',
          description: 'Real-time team collaboration'
        },
        {
          id: 'team-management',
          label: 'Team Management',
          icon: UserCheck,
          path: '/collaboration/team',
          description: 'Team member management',
          subItems: [
            { id: 'members', label: 'Team Members', path: '/collaboration' },
            { id: 'roles', label: 'Roles & Permissions', path: '/collaboration/roles' },
            { id: 'activities', label: 'Team Activities', path: '/collaboration/activities' }
          ]
        },
        {
          id: 'communication',
          label: 'Communication',
          icon: MessageSquare,
          path: '/collaboration/communication',
          description: 'Team chat and communication'
        }
      ]
    };
  }

  // Integrations Context
  if (pathname.startsWith('/integrations') || pathname.startsWith('/sync') ||
      pathname === '/scheduler' || pathname === '/platforms') {
    return {
      contextName: 'Integrations Hub',
      items: [
        {
          id: 'integrations-hub',
          label: 'Marketplace Hub',
          icon: RefreshCw,
          path: '/integrations',
          badge: 'Apps',
          description: 'Universal app marketplace'
        },
        {
          id: 'app-categories',
          label: 'App Categories',
          icon: Layers,
          path: '/integrations/categories',
          description: 'Browse apps by category',
          subItems: [
            { id: 'marketing-apps', label: 'Marketing Apps', path: '/integrations?category=marketing' },
            { id: 'productivity-apps', label: 'Productivity Apps', path: '/integrations?category=productivity' },
            { id: 'analytics-apps', label: 'Analytics Apps', path: '/integrations?category=analytics' }
          ]
        },
        {
          id: 'installed-integrations',
          label: 'My Integrations',
          icon: GitBranch,
          path: '/integrations/installed',
          description: 'Manage installed apps'
        },
        {
          id: 'sync-scheduler',
          label: 'Sync & Scheduler',
          icon: Clock,
          path: '/scheduler',
          description: 'Platform synchronization'
        }
      ]
    };
  }

  // Enterprise Settings Context
  if (pathname.startsWith('/enterprise') || pathname.startsWith('/settings') || 
      pathname.startsWith('/infrastructure') || pathname === '/whitelabel') {
    return {
      contextName: 'Enterprise Suite',
      items: [
        {
          id: 'enterprise-dashboard',
          label: 'Enterprise Dashboard',
          icon: Shield,
          path: '/enterprise',
          badge: 'Admin',
          description: 'Enterprise administration'
        },
        {
          id: 'platform-settings',
          label: 'Platform Settings',
          icon: Settings,
          path: '/settings',
          description: 'Global platform configuration',
          subItems: [
            { id: 'general', label: 'General Settings', path: '/settings' },
            { id: 'security', label: 'Security Settings', path: '/settings/security' },
            { id: 'notifications', label: 'Notifications', path: '/settings/notifications' }
          ]
        },
        {
          id: 'infrastructure',
          label: 'Infrastructure',
          icon: Monitor,
          path: '/infrastructure',
          description: 'System infrastructure management'
        },
        {
          id: 'white-label',
          label: 'White-label Platform',
          icon: Globe,
          path: '/whitelabel',
          description: 'Custom branding configuration'
        }
      ]
    };
  }

  // Default fallback to Master Terminal items
  return {
    contextName: 'Master Terminal',
    items: [
      {
        id: 'master-terminal',
        label: 'Master Terminal',
        icon: LayoutDashboard,
        path: '/dashboard',
        badge: 'Command'
      },
      {
        id: 'marketing-platforms',
        label: 'Marketing Platforms',
        icon: Megaphone,
        path: '/marketing',
        subItems: [
          { id: 'campaigns', label: 'Campaign Management', path: '/campaigns' },
          { id: 'email-marketing', label: 'Email Marketing', path: '/email-marketing' },
          { id: 'social-media', label: 'Social Media', path: '/social' }
        ]
      },
      {
        id: 'business-platforms',
        label: 'Business Operations',
        icon: Users,
        path: '/business-suite',
        subItems: [
          { id: 'collaboration', label: 'Team Collaboration', path: '/collaboration' },
          { id: 'project-management', label: 'Project Management', path: '/project-management' }
        ]
      },
      {
        id: 'analytics-platforms',
        label: 'Analytics & Insights',
        icon: BarChart3,
        path: '/analytics'
      }
    ]
  };
}

interface UnifiedSidebarProps {
  defaultCollapsed?: boolean;
  className?: string;
  onCollapseChange?: (collapsed: boolean) => void;
}

export default function UnifiedSidebar({ 
  defaultCollapsed = false, 
  className = '',
  onCollapseChange
}: UnifiedSidebarProps) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Get contextual sidebar content based on current page
  const { contextName, items: sidebarItems } = getContextualSidebarItems(pathname);

  // Check for mobile screen
  useEffect(() => {
    // Only run on client side to prevent SSR issues
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
    const currentItem = sidebarItems.find(item => 
      pathname === item.path || 
      (item.subItems && item.subItems.some(sub => pathname === sub.path))
    );
    
    if (currentItem && currentItem.subItems) {
      setExpandedItem(currentItem.id);
    }
  }, [pathname, sidebarItems]);

  // Notify parent of collapse state changes
  useEffect(() => {
    onCollapseChange?.(isCollapsed);
  }, [isCollapsed, onCollapseChange]);

  const handleItemClick = (item: SidebarItem) => {
    if (item.subItems) {
      setExpandedItem(expandedItem === item.id ? null : item.id);
    } else {
      // Don't navigate if we're already on the same page
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

  const sidebarVariants = {
    expanded: { width: isMobile ? '220px' : '220px' },
    collapsed: { width: isMobile ? '0px' : '56px' }
  };

  const contentVariants = {
    expanded: { opacity: 1, scale: 1 },
    collapsed: { opacity: 0, scale: 0.8 }
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className={`fixed top-4 left-4 z-50 p-2 rounded-lg backdrop-blur-sm border transition-all duration-200 md:hidden ${
            theme === 'dark'
              ? 'bg-gray-900/50 border-gray-700 text-gray-200 hover:bg-gray-800/60'
              : 'bg-white/50 border-gray-200 text-gray-700 hover:bg-white/60'
          }`}
        >
          <Menu size={20} />
        </button>

        {/* Mobile Overlay */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsMobileOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`fixed left-0 top-0 h-full w-72 z-50 backdrop-blur-md border-r shadow-2xl ${
                  theme === 'dark'
                    ? 'bg-gray-900/95 border-gray-700'
                    : 'bg-white/95 border-gray-200'
                } ${className}`}
              >
                <SidebarContent 
                  isCollapsed={false}
                  expandedItem={expandedItem}
                  onItemClick={handleItemClick}
                  onSubItemClick={handleSubItemClick}
                  isItemActive={isItemActive}
                  theme={theme}
                  pathname={pathname}
                  sidebarItems={sidebarItems}
                  contextName={contextName}
                  onClose={() => setIsMobileOpen(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.div
      variants={sidebarVariants}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] backdrop-blur-md border-r shadow-lg z-30 ${
        theme === 'dark'
          ? 'bg-gray-900/95 border-gray-700'
          : 'bg-white/95 border-gray-200'
      } ${className}`}
      data-testid="unified-sidebar"
    >
      <SidebarContent 
        isCollapsed={isCollapsed}
        expandedItem={expandedItem}
        onItemClick={handleItemClick}
        onSubItemClick={handleSubItemClick}
        isItemActive={isItemActive}
        theme={theme}
        pathname={pathname}
        sidebarItems={sidebarItems}
        contextName={contextName}
      />

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute -right-3 top-6 p-1.5 rounded-full border backdrop-blur-sm transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
            : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
        }`}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </motion.div>
  );
}

interface SidebarContentProps {
  isCollapsed: boolean;
  expandedItem: string | null;
  onItemClick: (item: SidebarItem) => void;
  onSubItemClick: (path: string) => void;
  isItemActive: (item: SidebarItem) => boolean;
  theme: string;
  pathname: string;
  sidebarItems: SidebarItem[];
  contextName: string;
  onClose?: () => void;
}

function SidebarContent({
  isCollapsed,
  expandedItem,
  onItemClick,
  onSubItemClick,
  isItemActive,
  theme,
  pathname,
  sidebarItems,
  contextName,
  onClose
}: SidebarContentProps) {
  const contentVariants = {
    expanded: { opacity: 1, scale: 1 },
    collapsed: { opacity: 0, scale: 0.8 }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="flex items-center space-x-3"
            >
              <PulseWaveLogo size="medium" className="text-pulse-cyan" />
              <span className={`font-semibold text-lg ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                PulseBridge
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {onClose && (
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <div key={item.id}>
              {/* Main Item */}
              <button
                onClick={() => onItemClick(item)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group ${
                  isItemActive(item)
                    ? theme === 'dark'
                      ? 'bg-teal-600/20 text-teal-400 border border-teal-500/30'
                      : 'bg-teal-50 text-teal-600 border border-teal-200'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                      : 'text-gray-800 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon 
                  size={20} 
                  className={`flex-shrink-0 transition-colors ${
                    isItemActive(item) ? 'text-current' : 'text-current opacity-75'
                  }`} 
                />
                
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      variants={contentVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="flex-1 flex items-center justify-between min-w-0"
                    >
                      <span className="font-medium truncate">{item.label}</span>
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                            item.badge === 'Beta'
                              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        {item.subItems && (
                          <ChevronRight 
                            size={16} 
                            className={`transition-transform duration-200 ${
                              expandedItem === item.id ? 'rotate-90' : ''
                            }`} 
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Sub Items */}
              <AnimatePresence>
                {!isCollapsed && item.subItems && expandedItem === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => onSubItemClick(subItem.path)}
                          className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                            pathname === subItem.path
                              ? theme === 'dark'
                                ? 'bg-teal-600/30 text-teal-300'
                                : 'bg-teal-100 text-teal-700'
                              : theme === 'dark'
                                ? 'text-gray-400 hover:bg-gray-800/40 hover:text-gray-200'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-800'
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

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>Version 1.0.0</span>
                <span>Beta</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}