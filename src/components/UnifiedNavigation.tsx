'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Home, 
  BarChart3, 
  Brain, 
  Settings, 
  Zap,
  Target,
  Globe,
  Menu,
  X,
  FileText,
  Megaphone,
  Users,
  Shield,
  Workflow,
  TrendingUp,
  User,
  LogOut,
  ChevronDown,
  Building2,
  Mail,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { PulseWaveLogo } from './PulseWaveLogo';
import { primaryNavigation } from '@/config/navigation';

interface UnifiedNavigationProps {
  variant?: 'landing' | 'app';
  className?: string;
}

export default function UnifiedNavigation({ 
  variant = 'app', 
  className = '' 
}: UnifiedNavigationProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Landing page navigation items
  const landingNavItems = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  // App navigation items - using the config
  const appNavItems = primaryNavigation;

  const isActive = (href: string) => {
    if (pathname === href) return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  const hasActiveChild = (item: typeof primaryNavigation[0]) => {
    if (!item.children) return false;
    return item.children.some(child => isActive(child.href));
  };

  // Determine if we should show landing or app navigation
  const showLandingNav = variant === 'landing' || pathname === '/' || !isAuthenticated;
  const navigationItems = showLandingNav ? landingNavItems : appNavItems;

  return (
    <nav className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
              <PulseWaveLogo 
                size="small" 
                variant={theme === 'dark' ? 'light' : 'dark'} 
                animated={false} 
                showText={true}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {showLandingNav ? (
              // Landing Navigation
              <>
                {landingNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Auth Buttons for Landing */}
                {!isAuthenticated && (
                  <div className="flex items-center space-x-2 ml-4">
                    <Link href="/login">
                      <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        Sign In
                      </button>
                    </Link>
                    <Link href="/register">
                      <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                        Get Started
                      </button>
                    </Link>
                  </div>
                )}
              </>
            ) : (
              // App Navigation
              <>
                {appNavItems.map((item) => {
                  const IconComponent = item.icon;
                  const isItemActive = isActive(item.href) || hasActiveChild(item);
                  const hasChildren = item.children && item.children.length > 0;

                  if (hasChildren) {
                    return (
                      <div
                        key={item.id}
                        className="relative"
                        onMouseEnter={() => setOpenDropdown(item.id)}
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        <button
                          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            isItemActive
                              ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <IconComponent className="h-4 w-4" />
                          <span>{item.label}</span>
                          <ChevronDown className="h-3 w-3" />
                        </button>

                        {/* Dropdown */}
                        {openDropdown === item.id && (
                          <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                            {item.children?.map((child) => {
                              const ChildIcon = child.icon;
                              return (
                                <Link
                                  key={child.id}
                                  href={child.href}
                                  className={`flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                    isActive(child.href)
                                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                      : 'text-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  <ChildIcon className="h-4 w-4" />
                                  <div>
                                    <div className="font-medium">{child.label}</div>
                                    {child.description && (
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {child.description}
                                      </div>
                                    )}
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isItemActive
                          ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </>
            )}
          </div>

          {/* Right Side - User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            {/* User Menu (App Only) */}
            {!showLandingNav && isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:block">{user?.email || 'Account'}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                    <Link
                      href="/settings"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900">
            {showLandingNav ? (
              // Landing Mobile Menu
              <>
                {landingNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {!isAuthenticated && (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </>
            ) : (
              // App Mobile Menu
              <>
                {appNavItems.map((item) => {
                  const IconComponent = item.icon;
                  const isItemActive = isActive(item.href) || hasActiveChild(item);

                  return (
                    <div key={item.id}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                          isItemActive
                            ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                      
                      {/* Mobile submenu */}
                      {item.children && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.children.map((child) => {
                            const ChildIcon = child.icon;
                            return (
                              <Link
                                key={child.id}
                                href={child.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                  isActive(child.href)
                                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                              >
                                <ChildIcon className="h-4 w-4" />
                                <span>{child.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {isAuthenticated && (
                  <>
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                      <Link
                        href="/settings"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}