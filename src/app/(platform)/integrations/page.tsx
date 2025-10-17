'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useIntegrations } from '@/contexts/IntegrationsContext';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Check, 
  ExternalLink,
  Settings,
  Trash2,
  Play,
  Pause,
  RefreshCw,
  TrendingUp,
  Users,
  Calendar,
  Zap,
  Shield,
  Globe,
  ChevronDown,
  Heart,
  Eye,
  MessageCircle
} from 'lucide-react';

// SSR-safe imports for universal sidebar system
const UnifiedSidebar = dynamic(() => import('@/components/UnifiedSidebar'), {
  ssr: false,
  loading: () => <div className="fixed left-0 top-0 h-screen w-56 bg-gray-900 animate-pulse" />
});

const AdvancedNavigation = dynamic(() => import('@/components/DashboardNavbar'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-900 border-b animate-pulse" />
});

const NavigationTabs = dynamic(() => import('@/components/NavigationTabs'), {
  ssr: false,
  loading: () => <div className="h-12 bg-white dark:bg-gray-900 border-b animate-pulse" />
});

// ============================================================================
// APP CARD COMPONENT
// ============================================================================

function IntegrationAppCard({ 
  app, 
  onInstall, 
  onUninstall, 
  onConfigure 
}: {
  app: any;
  onInstall: (appId: string) => void;
  onUninstall: (appId: string) => void;
  onConfigure: (appId: string) => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  const getPricingBadge = () => {
    if (app.pricing.model === 'free') {
      return <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">Free</span>;
    } else if (app.pricing.model === 'freemium') {
      return <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">Freemium</span>;
    } else {
      return <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
        ${app.pricing.price}/{app.pricing.billingCycle}
      </span>;
    }
  };

  const getStatusBadge = () => {
    if (app.isInstalled && app.isEnabled) {
      return <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full flex items-center space-x-1">
        <Check className="w-3 h-3" />
        <span>Active</span>
      </span>;
    } else if (app.isInstalled) {
      return <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">Disabled</span>;
    }
    return null;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200"
    >
      {/* Cover Image */}
      {app.coverImage && (
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center space-x-2">
              <div className="text-2xl bg-white rounded-lg p-2">
                {app.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{app.name}</h3>
                <p className="text-white/80 text-sm">{app.developer.name}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header (if no cover image) */}
        {!app.coverImage && (
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-2xl bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
              {app.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">{app.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{app.developer.name}</p>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="flex items-center space-x-2 mb-3">
          {getPricingBadge()}
          {getStatusBadge()}
          {app.developer.verified && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>Verified</span>
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {app.description}
        </p>

        {/* Rating & Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-gray-900 dark:text-white font-medium">
                {app.rating.average.toFixed(1)}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                ({app.rating.count.toLocaleString()})
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
            <Download className="w-3 h-3" />
            <span>{app.downloadCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {app.features.slice(0, 3).map((feature: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                {feature}
              </span>
            ))}
            {app.features.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                +{app.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {!app.isInstalled ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onInstall(app.id)}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
            >
              Install
            </motion.button>
          ) : (
            <div className="flex-1 flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onConfigure(app.id)}
                className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm transition-colors flex items-center justify-center space-x-1"
              >
                <Settings className="w-4 h-4" />
                <span>Configure</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onUninstall(app.id)}
                className="px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg font-medium text-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm transition-colors"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {app.features.map((feature: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {app.tags.map((tag: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Version {app.version}</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Updated {new Date(app.lastUpdated).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  {app.documentation && (
                    <a
                      href={app.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Docs</span>
                    </a>
                  )}
                  {app.supportUrl && (
                    <a
                      href={app.supportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Support</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN INTEGRATIONS MARKETPLACE
// ============================================================================

export default function IntegrationsMarketplace() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const {
    availableApps,
    featuredApps,
    categories,
    searchQuery,
    selectedCategory,
    sortBy,
    searchApps,
    filterByCategory,
    setSortBy,
    getFilteredApps,
    installApp,
    uninstallApp,
    installedApps,
    getUsageStats,
    isLoading,
    error,
    refreshApps
  } = useIntegrations();

  const [activeTab, setActiveTab] = useState<'discover' | 'installed' | 'analytics'>('discover');
  const [showFilters, setShowFilters] = useState(false);

  const filteredApps = getFilteredApps();
  const usageStats = getUsageStats();

  const handleInstall = async (appId: string) => {
    await installApp(appId);
  };

  const handleUninstall = async (appId: string) => {
    await uninstallApp(appId);
  };

  const handleConfigure = (appId: string) => {
    // TODO: Open configuration modal
    console.log('Configure app:', appId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Unified Sidebar */}
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-14' : 'ml-56'
      }`}>
        {/* Unified Dashboard Navbar */}
        <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
        
        {/* Integrations Content */}
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg text-white">
                    <Zap className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Integrations Marketplace
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      Connect your workflow with 100+ powerful integrations
                    </p>
                  </div>
                </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={refreshApps}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </motion.button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-8">
            {[
              { key: 'discover' as const, label: 'Discover', count: availableApps.length },
              { key: 'installed' as const, label: 'Installed', count: installedApps.length },
              { key: 'analytics' as const, label: 'Analytics', count: usageStats.activeIntegrations }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <>
            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search integrations..."
                    value={searchQuery}
                    onChange={(e) => searchApps(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-3 border rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                    showFilters || selectedCategory
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="popular">Most Popular</option>
                  <option value="recent">Recently Updated</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>

              {/* Category Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => filterByCategory('')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedCategory === ''
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => filterByCategory(category.id)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                            selectedCategory === category.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                          <span className="ml-1 text-xs opacity-75">({category.count})</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Featured Apps */}
            {!searchQuery && !selectedCategory && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Integrations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredApps.map((app) => (
                    <IntegrationAppCard
                      key={app.id}
                      app={app}
                      onInstall={handleInstall}
                      onUninstall={handleUninstall}
                      onConfigure={handleConfigure}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Apps */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {searchQuery || selectedCategory ? 'Search Results' : 'All Integrations'}
                </h2>
                <span className="text-gray-500 dark:text-gray-400">
                  {filteredApps.length} integration{filteredApps.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredApps.map((app) => (
                    <IntegrationAppCard
                      key={app.id}
                      app={app}
                      onInstall={handleInstall}
                      onUninstall={handleUninstall}
                      onConfigure={handleConfigure}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {filteredApps.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    No integrations found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Try adjusting your search terms or filters
                  </p>
                  <button
                    onClick={() => {
                      searchApps('');
                      filterByCategory('');
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Installed Tab */}
        {activeTab === 'installed' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Installed Integrations ({installedApps.length})
            </h2>
            
            {installedApps.length === 0 ? (
              <div className="text-center py-12">
                <Zap className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No integrations installed
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Browse the marketplace to find integrations for your workflow
                </p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Browse Integrations
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {installedApps.map((installed) => {
                  const app = availableApps.find(a => a.id === installed.appId);
                  if (!app) return null;
                  
                  return (
                    <IntegrationAppCard
                      key={app.id}
                      app={app}
                      onInstall={handleInstall}
                      onUninstall={handleUninstall}
                      onConfigure={handleConfigure}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Integration Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                {
                  label: 'Active Integrations',
                  value: usageStats.activeIntegrations,
                  icon: <Zap className="w-6 h-6" />,
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  label: 'Total API Calls',
                  value: usageStats.totalApiCalls.toLocaleString(),
                  icon: <Globe className="w-6 h-6" />,
                  color: 'from-green-500 to-emerald-500'
                },
                {
                  label: 'Monthly Usage',
                  value: usageStats.monthlyUsage.toLocaleString(),
                  icon: <TrendingUp className="w-6 h-6" />,
                  color: 'from-purple-500 to-pink-500'
                },
                {
                  label: 'Apps Available',
                  value: availableApps.length,
                  icon: <Heart className="w-6 h-6" />,
                  color: 'from-yellow-500 to-orange-500'
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg text-white`}>
                      {stat.icon}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Top Apps */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Integrations</h3>
              <div className="space-y-4">
                {usageStats.topApps.map((app, index) => (
                  <div key={app.appId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">{app.name}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {app.usage.toLocaleString()} API calls
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
    </div>
  );
}