'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, memo } from 'react';
import { Settings, User, Bell, ChevronDown, Menu, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { primaryNavigation, utilityNavigation } from '@/config/navigation';

const MainNavigation = memo(() => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Check if current path matches nav item or its children
  const isActive = (href: string) => {
    if (pathname === href) return true;
    if (pathname.startsWith(href + '/')) return true;
    return false;
  };

  // Check if nav item's children contain active path
  const hasActiveChild = (item: typeof primaryNavigation[0]) => {
    if (!item.children) return false;
    return item.children.some(child => isActive(child.href));
  };

  return (
    <header
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
      data-testid="main-navigation"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Main Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PB</span>
              </div>
              <span className="text-h4 font-bold text-gray-900 dark:text-white hidden sm:block">
                PulseBridge
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {primaryNavigation.map((item) => (
                <div key={item.id} className="relative">
                  {item.children ? (
                    // Dropdown menu for items with children
                    <div
                      onMouseEnter={() => setOpenDropdown(item.id)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button
                        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          hasActiveChild(item) || isActive(item.href)
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      {/* Dropdown */}
                      {openDropdown === item.id && (
                        <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                          <Link
                            href={item.href}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <div className="font-medium">{item.label} Overview</div>
                            {item.description && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {item.description}
                              </div>
                            )}
                          </Link>
                          <div className="border-t border-gray-200 dark:border-gray-600 my-2" />
                          {item.children.map((child) => (
                            <Link
                              key={child.id}
                              href={child.href}
                              className={`block px-4 py-2 text-sm transition-colors ${
                                isActive(child.href)
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <child.icon className="w-4 h-4" />
                                {child.label}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Simple link for items without children
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Utility Nav & User Menu */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Notifications */}
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Settings (Desktop) */}
            <Link
              href="/settings"
              className={`hidden md:flex p-2 rounded-lg transition-colors ${
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
                aria-label="User menu"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            {primaryNavigation.map((item) => (
              <div key={item.id} className="space-y-1">
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg ${
                    isActive(item.href)
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-8 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        href={child.href}
                        className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${
                          isActive(child.href)
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <child.icon className="w-4 h-4" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
              {utilityNavigation.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg ${
                    isActive(item.href)
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
});

MainNavigation.displayName = 'MainNavigation';

export default MainNavigation;
