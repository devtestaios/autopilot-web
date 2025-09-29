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
  RefreshCw
} from 'lucide-react';
import { PulseWaveLogo } from './PulseWaveLogo';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  badge?: string;
  subItems?: Array<{
    id: string;
    label: string;
    path: string;
  }>;
}

const sidebarItems: SidebarItem[] = [
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
      { id: 'social-media', label: 'Social Media', path: '/social' },
      { id: 'content-suite', label: 'Content Suite', path: '/content-suite' }
    ]
  },
  {
    id: 'business-platforms',
    label: 'Business Operations',
    icon: Users,
    path: '/business-suite',
    subItems: [
      { id: 'collaboration', label: 'Team Collaboration', path: '/collaboration' },
      { id: 'project-management', label: 'Project Management', path: '/project-management' },
      { id: 'leads', label: 'Lead Management', path: '/leads' },
      { id: 'unified-crm', label: 'Unified CRM', path: '/unified-crm' }
    ]
  },
  {
    id: 'analytics-platforms',
    label: 'Analytics & Insights',
    icon: BarChart3,
    path: '/analytics',
    subItems: [
      { id: 'overview', label: 'Analytics Overview', path: '/analytics' },
      { id: 'performance', label: 'Performance Tracking', path: '/analytics/performance' },
      { id: 'roi', label: 'ROI Analysis', path: '/analytics/roi' },
      { id: 'reports', label: 'Advanced Reports', path: '/reports' }
    ]
  },
  {
    id: 'ai-platforms',
    label: 'AI & Automation',
    icon: Target,
    path: '/ai-center',
    badge: 'AI',
    subItems: [
      { id: 'ai-center', label: 'AI Control Center', path: '/ai-center' },
      { id: 'optimization', label: 'AI Optimizer', path: '/optimization' },
      { id: 'ai-automation', label: 'Automation Hub', path: '/ai-automation' },
      { id: 'ai-analytics', label: 'AI Analytics', path: '/ai/analytics' }
    ]
  },
  {
    id: 'integration-platforms',
    label: 'Integrations & Tools',
    icon: RefreshCw,
    path: '/integrations',
    subItems: [
      { id: 'integrations', label: 'App Marketplace', path: '/integrations' },
      { id: 'sync', label: 'Multi-Platform Sync', path: '/sync' },
      { id: 'scheduler', label: 'Smart Scheduler', path: '/scheduler' },
      { id: 'platforms', label: 'Platform Manager', path: '/platforms' }
    ]
  },
  {
    id: 'enterprise-platforms',
    label: 'Enterprise & Settings',
    icon: Settings,
    path: '/enterprise',
    subItems: [
      { id: 'enterprise', label: 'Enterprise Suite', path: '/enterprise' },
      { id: 'business-intelligence', label: 'Business Intelligence', path: '/business-intelligence' },
      { id: 'settings', label: 'Platform Settings', path: '/settings' },
      { id: 'infrastructure', label: 'Infrastructure', path: '/infrastructure' }
    ]
  }
];

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
  }, [pathname]);

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