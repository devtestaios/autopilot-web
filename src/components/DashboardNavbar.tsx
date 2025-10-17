'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Settings, 
  User,
  LogOut,
  CreditCard,
  Shield,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { AnimatePresence, motion } from 'framer-motion';

interface DashboardNavbarProps {
  className?: string;
  sidebarCollapsed?: boolean;
}

/**
 * DashboardNavbar - Unified standardized navbar for all dashboard pages
 * 
 * Features:
 * - Single Home icon on the left that navigates to Master Terminal (/dashboard)
 * - Standard right-side icons: Search, Notifications, Theme Toggle, Settings, User Menu
 * - No breadcrumbs, no duplicate navigation elements
 * - Consistent across all dashboard route groups
 */
export default function DashboardNavbar({ className, sidebarCollapsed = false }: DashboardNavbarProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  // Mock notifications count (connect to real notification system)
  const notificationCount = 3;

  return (
    <nav 
      data-testid="dashboard-navbar"
      className={cn(
        'bg-background/95 backdrop-blur-xl border-b border-border',
        'sticky top-0 z-50 transition-all duration-300',
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
          {/* Left: Home Icon */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-200"
            aria-label="Go to Master Terminal"
          >
            <Home className="w-5 h-5 text-muted-foreground hover:text-foreground" />
          </Link>

          {/* Right: Universal Header Icons */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => {/* TODO: Implement global search */}}
              className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-muted rounded-lg transition-colors duration-200 relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-xl border border-border overflow-hidden"
                  >
                    <div className="p-4 border-b border-border">
                      <h3 className="font-semibold text-foreground">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notificationCount > 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          <p>{notificationCount} new notification{notificationCount > 1 ? 's' : ''}</p>
                        </div>
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          <p>No new notifications</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {/* Settings */}
            <Link
              href="/settings"
              className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Link>

            {/* User Menu */}
            <div className="relative ml-2">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 hover:bg-muted rounded-lg transition-colors duration-200"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-card rounded-lg shadow-xl border border-border overflow-hidden"
                  >
                    <div className="p-4 border-b border-border">
                      <p className="font-medium text-foreground">{user?.email || 'User'}</p>
                      <p className="text-sm text-muted-foreground">{user?.user_metadata?.tier || 'Free'} Plan</p>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">Profile</span>
                      </Link>
                      <Link
                        href="/settings/billing"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">Billing</span>
                      </Link>
                      <Link
                        href="/settings/security"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Shield className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">Security</span>
                      </Link>
                    </div>
                    <div className="border-t border-border">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-destructive/10 text-destructive transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
