'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon?: string;
}

const navigationItems: NavItem[] = [
  { href: '/', label: 'Single Platform Dashboard' },
  { href: '/unified', label: '🌐 Unified Platform Command Center' },
  { href: '/platforms', label: '⚙️ Platform Setup' },
  { href: '/leads', label: '🎯 Lead Management' },
  { href: '/alerts', label: '🚨 Smart Alerts' },
  { href: '/status', label: '📈 System Status' },
];

export default function NavigationTabs() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 overflow-x-auto scrollbar-hide" aria-label="Tabs">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  border-b-2 py-4 px-1 text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${
                    isActive
                      ? 'border-pulse-cyan text-pulse-cyan dark:text-pulse-cyan'
                      : 'border-transparent text-black dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex items-center justify-between py-3">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {navigationItems.find(item => item.href === pathname)?.label || 'Navigation'}
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700 pt-3">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      block px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}