'use client';

// React hooks removed - no longer needed after legacy feature cleanup
// Phase 2C.1: Optimized Framer Motion imports for tree shaking
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import {
  ChevronRight,
  Sparkles,
  BarChart3,
  Settings,
  HelpCircle,
  User,
  Home,
  Bell,
  Search,
  Sun,
  Moon,
  LogOut,
  CreditCard,
  Shield,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/EnhancedAuthContext';
// PremiumButton import removed - legacy "New Campaign" button removed
// Removed GlobalSearch import - legacy marketing feature removed

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

// Legacy interfaces for marketing quick actions removed

// Legacy marketing-specific quick actions removed - no longer needed in universal header

export interface AdvancedNavigationProps {
  className?: string;
  sidebarCollapsed?: boolean;
}

export default function AdvancedNavigation({ className, sidebarCollapsed = false }: AdvancedNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  // Legacy quick actions state removed

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/dashboard', icon: <Home className="w-4 h-4" /> }
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

  // Legacy keyboard shortcuts for quick actions removed

  return (
    <nav 
      data-testid="dashboard-navigation"
      className={cn(
        'bg-background/95 backdrop-blur-xl border-b border-border',
        'sticky top-0 z-50 transition-all duration-300',
        'pointer-events-auto',
        className
      )}
      style={{
        background: 'var(--bg-card)',
        borderBottomColor: 'var(--border-subtle)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300',
        sidebarCollapsed ? 'max-w-none lg:ml-14' : 'max-w-7xl lg:ml-0'
      )}>
        <div className="flex items-center justify-between h-16">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((item, index) => (
              <div key={item.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />
                )}
                
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1 rounded-lg transition-colors duration-200',
                    index === breadcrumbs.length - 1
                      ? 'font-medium'
                      : 'hover:bg-muted'
                  )}
                  style={{
                    color: index === breadcrumbs.length - 1 ? 'var(--brand-teal)' : 'var(--text-secondary)',
                    backgroundColor: index === breadcrumbs.length - 1 ? 'rgba(var(--brand-teal-rgb), 0.1)' : 'transparent'
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </div>
            ))}
          </nav>

          {/* Universal Header - User Navigation */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                    No new notifications
                  </div>
                </motion.div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {/* Settings */}
            <button
              onClick={() => router.push('/settings')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="User menu"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                >
                  {/* User Info */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white">{user?.email || 'User'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Free Plan</p>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        router.push('/profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        router.push('/settings/billing');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <CreditCard className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">Billing</span>
                    </button>

                    <button
                      onClick={() => {
                        router.push('/settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        router.push('/help');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <HelpCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">Help & Support</span>
                    </button>
                  </div>

                  {/* Sign Out */}
                  <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        signOut();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-red-600 dark:text-red-400">Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}