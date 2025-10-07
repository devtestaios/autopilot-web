'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, memo } from 'react';
import { Settings, User, Bell } from 'lucide-react';
import { PulseWaveLogo } from './PulseWaveLogo';
import { useTheme } from '@/contexts/ThemeContext';

interface NavItem {
  href: string;
  label: string;
  icon?: string;
}

const navigationItems: NavItem[] = [
  { href: '/dashboard', label: '🎛️ Master Terminal' },
  { href: '/marketing-command-center', label: '� Marketing Hub' },
  { href: '/project-management', label: '📋 Project Management' },
  { href: '/collaboration', label: '� Team Collaboration' },
  { href: '/business-intelligence', label: '� Business Intelligence' },
  { href: '/integrations', label: '🔗 Integrations' },
  { href: '/ai-center', label: '🤖 AI Center' },
  { href: '/platforms', label: '⚙️ Platform Setup' },
  { href: '/status', label: '🔋 System Status' },
];

const NavigationTabs = memo(() => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors relative z-50" data-testid="main-navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: PulseBridge Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <PulseWaveLogo size="small" variant="dark" animated={true} showText={false} />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                PulseBridge
              </span>
            </Link>
          </div>

          {/* Center: Page Title (Dynamic based on current path) */}
          <div className="hidden md:flex items-center">
            <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {getPageTitle(pathname)}
            </h1>
          </div>

          {/* Right: User Menu & Settings */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            
            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            </button>

            {/* Settings */}
            <Link
              href="/settings"
              className={`p-2 rounded-lg transition-colors ${
                pathname === '/settings'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* User Avatar */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </button>
              
              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      // Add logout logic here
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

// Helper function to get page title based on pathname
function getPageTitle(pathname: string): string {
  const titleMap: Record<string, string> = {
    '/dashboard': 'Master Terminal',
    '/email-marketing': 'Email Marketing',
    '/social-media': 'Social Media',
    '/project-management': 'Project Management',
    '/collaboration': 'Team Collaboration',
    '/business-intelligence': 'Business Intelligence',
    '/integrations': 'Integrations',
    '/ai-center': 'AI Center',
    '/ai-automation': 'AI Automation',
    '/marketing-command-center': 'Marketing Hub',
    '/platforms': 'Platform Setup',
    '/settings': 'Settings',
    '/status': 'System Status',
    '/analytics': 'Analytics',
    '/reports': 'Reports',
    '/crm': 'CRM',
    '/onboarding': 'Setup Wizard',
  };
  
  return titleMap[pathname] || 'PulseBridge';
}

NavigationTabs.displayName = 'NavigationTabs';

export default NavigationTabs;