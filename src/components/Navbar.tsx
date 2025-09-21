'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Settings, User, Search, Menu, Plus, Sun, Moon, ChevronDown, HelpCircle, LogOut } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSearchContext } from '@/contexts/SearchContext';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { SearchResults } from '@/components/SearchResults';
import { PulseWaveLogo } from './PulseWaveLogo';
import GlobalSearch from './ui/GlobalSearch';

interface NavbarProps {
  onMenuToggle?: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Search functionality with context data
  const { campaigns, leads } = useSearchContext();
  const { 
    searchTerm, 
    setSearchTerm, 
    isSearching, 
    results, 
    showResults,
    isSearchModalOpen,
    openSearch,
    closeSearch
  } = useGlobalSearch({
    campaigns,
    leads
  });
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchTerm('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setSearchTerm]);

  const notifications = [
    { id: 1, title: 'Campaign Performance Alert', message: 'Summer Sale campaign is performing above target', time: '5 min ago', unread: true },
    { id: 2, title: 'Budget Update', message: 'Monthly budget utilization at 75%', time: '1 hour ago', unread: true },
    { id: 3, title: 'Google Ads Sync', message: 'Campaign data synchronized successfully', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <nav className="bg-white dark:bg-black/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-4 py-3 transition-all duration-300 sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Side */}
        <div className="flex items-center gap-2">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-black dark:text-gray-300" />
          </button>
          
          <button
            onClick={openSearch}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5 text-black dark:text-gray-300" />
          </button>
          
          <div className="flex items-center gap-3">
            <PulseWaveLogo size="medium" className="text-pulse-cyan" />
            <div className="hidden md:block">
              <span className="font-bold text-xl bg-gradient-to-r from-pulse-cyan to-pulse-purple bg-clip-text text-transparent">
                PulseBridge
              </span>
              <div className="text-xs text-black dark:text-gray-400 -mt-1">
                AI Marketing Intelligence
              </div>
            </div>
          </div>
        </div>

        {/* Center - Enhanced Search Button */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <button 
            onClick={openSearch}
            className="w-full flex items-center pl-4 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 group"
          >
            <Search className="w-5 h-5 mr-3 group-hover:text-pulse-cyan transition-colors" />
            <span className="flex-1 text-left">Search campaigns, analytics, reports...</span>
            <div className="flex items-center space-x-1 text-xs">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded border">⌘</kbd>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded border">K</kbd>
            </div>
          </button>
        </div>

        {/* Right Side - Enhanced Notifications and Profile */}
        <div className="flex items-center gap-4">
          {/* Quick Action Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <button className="p-2 text-black dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group relative">
              <Plus className="w-5 h-5" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                New Campaign
              </span>
            </button>
            <button className="p-2 text-black dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group relative">
              <Settings className="w-5 h-5" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Settings
              </span>
            </button>
          </div>

          {/* Enhanced Notifications */}
          <div className="relative">
            <button className="p-2 text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">3</span>
              </span>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Notifications
              </span>
            </button>
          </div>

          {/* Enhanced Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group relative"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 animate-pulse" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          {/* Enhanced User Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User"
                  className="w-9 h-9 rounded-full border-2 border-transparent group-hover:border-blue-500 transition-all duration-200"
                />
                <div className="hidden xl:block text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">John Doe</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Marketing Director</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform group-hover:rotate-180" />
            </button>

            {/* Enhanced User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in slide-in-from-top-5 duration-200">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">John Doe</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">john.doe@company.com</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 dark:text-green-400">Online</span>
                  </div>
                </div>
                
                <div className="py-2">
                  <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <User className="w-4 h-4" />
                    View Profile
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Settings className="w-4 h-4" />
                    Account Settings
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <HelpCircle className="w-4 h-4" />
                    Help & Support
                  </a>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                  <button className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden mt-3">
        <button 
          onClick={openSearch}
          className="w-full flex items-center pl-3 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg"
        >
          <Search className="w-4 h-4 mr-3" />
          <span className="flex-1 text-left">Search...</span>
          <span className="text-xs">⌘K</span>
        </button>
      </div>

      {/* Click outside handlers */}
      {(isProfileOpen || isNotificationOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileOpen(false);
            setIsNotificationOpen(false);
          }}
        />
      )}

      {/* Global Search Modal */}
      <GlobalSearch isOpen={isSearchModalOpen} onClose={closeSearch} />
    </nav>
  );
}