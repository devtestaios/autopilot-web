'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Command,
  Sparkles,
  Zap,
  Target,
  BarChart3,
  Settings,
  HelpCircle,
  User,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PremiumButton } from './PremiumButton';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface QuickAction {
  label: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  shortcut?: string;
}

const quickActions: QuickAction[] = [
  {
    label: 'New Campaign',
    description: 'Create a new marketing campaign',
    icon: <Sparkles className="w-4 h-4" />,
    href: '/campaigns/new',
    shortcut: '⌘+N'
  },
  {
    label: 'Analytics Dashboard',
    description: 'View performance insights',
    icon: <BarChart3 className="w-4 h-4" />,
    href: '/analytics',
    shortcut: '⌘+A'
  },
  {
    label: 'AI Optimizer',
    description: 'Enable automatic optimization',
    icon: <Zap className="w-4 h-4" />,
    href: '/optimizer',
    shortcut: '⌘+O'
  },
  {
    label: 'Campaign Goals',
    description: 'Set and track objectives',
    icon: <Target className="w-4 h-4" />,
    href: '/goals',
    shortcut: '⌘+G'
  }
];

export interface AdvancedNavigationProps {
  className?: string;
}

export default function AdvancedNavigation({ className }: AdvancedNavigationProps) {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/', icon: <Home className="w-4 h-4" /> }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      
      let icon = null;
      switch (segment) {
        case 'campaigns':
          icon = <Sparkles className="w-4 h-4" />;
          break;
        case 'analytics':
          icon = <BarChart3 className="w-4 h-4" />;
          break;
        case 'settings':
          icon = <Settings className="w-4 h-4" />;
          break;
        case 'profile':
          icon = <User className="w-4 h-4" />;
          break;
        case 'help':
          icon = <HelpCircle className="w-4 h-4" />;
          break;
      }

      breadcrumbs.push({
        label,
        href: currentPath,
        icon
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsQuickActionsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setIsQuickActionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredQuickActions = quickActions.filter(action =>
    action.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    action.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <nav className={cn(
      'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50',
      'sticky top-0 z-50 transition-all duration-300',
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((item, index) => (
              <div key={item.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                )}
                
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1 rounded-lg transition-colors duration-200',
                    index === breadcrumbs.length - 1
                      ? 'text-pulse-cyan font-medium bg-pulse-cyan/10'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </div>
            ))}
          </nav>

          {/* Advanced Search & Quick Actions */}
          <div className="flex items-center gap-4">
            <div ref={searchRef} className="relative">
              <motion.button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200',
                  'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700',
                  'border border-gray-200 dark:border-gray-700',
                  isSearchOpen && 'ring-2 ring-pulse-cyan/50'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Search className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500 hidden sm:block">
                  Search or run command...
                </span>
                <div className="hidden sm:flex items-center gap-1 ml-2">
                  <kbd className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded">
                    ⌘
                  </kbd>
                  <kbd className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded">
                    K
                  </kbd>
                </div>
              </motion.button>

              {/* Advanced Search Modal */}
              <AnimatePresence>
                {isSearchOpen && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                      onClick={() => setIsSearchOpen(false)}
                    />
                    
                    {/* Search Modal */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50"
                    >
                      <div className="p-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search campaigns, analytics, settings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pulse-cyan/50"
                            autoFocus
                          />
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="mt-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Command className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Quick Actions
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                            {filteredQuickActions.map((action) => (
                              <Link
                                key={action.href}
                                href={action.href}
                                onClick={() => setIsSearchOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                              >
                                <div className="flex-shrink-0 p-2 bg-pulse-cyan/10 rounded-lg group-hover:bg-pulse-cyan/20 transition-colors">
                                  {action.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {action.label}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {action.description}
                                  </div>
                                </div>
                                {action.shortcut && (
                                  <div className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                                    {action.shortcut}
                                  </div>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Action Button */}
            <PremiumButton
              variant="primary"
              size="md"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
              className="hidden md:flex"
            >
              New Campaign
            </PremiumButton>
          </div>
        </div>
      </div>
    </nav>
  );
}