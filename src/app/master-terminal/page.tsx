'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Target, 
  BarChart3, 
  Users, 
  Bell, 
  Activity, 
  Settings,
  ChevronRight,
  Sparkles,
  Filter,
  Search
} from 'lucide-react';

import NavigationTabs from '@/components/NavigationTabs';
import { EXISTING_PLATFORMS, PLANNED_PLATFORMS, PLATFORM_CATEGORIES, PlatformModule } from '@/config/platformRegistry';
import { FEATURE_FLAGS, isFeatureEnabled } from '@/config/featureFlags';

// Icon mapping for platforms
const iconMap = {
  Target,
  BarChart3, 
  Users,
  Bell,
  Activity,
  Settings,
  LayoutDashboard
};

export default function MasterTerminal() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter platforms based on category and feature flags
  const availablePlatforms = useMemo(() => {
    let platforms = [...EXISTING_PLATFORMS];
    
    // Add development platforms if their feature flags are enabled
    const enabledPlannedPlatforms = PLANNED_PLATFORMS.filter(platform => 
      isFeatureEnabled('masterTerminal') && // Master terminal must be enabled
      (platform.status === 'development' ? 
        isFeatureEnabled(platform.id.replace('-', '') as any) : 
        false)
    );
    
    platforms = [...platforms, ...enabledPlannedPlatforms];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      platforms = platforms.filter(platform => platform.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      platforms = platforms.filter(platform =>
        platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        platform.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        platform.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return platforms;
  }, [selectedCategory, searchQuery]);

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: EXISTING_PLATFORMS.length };
    
    Object.keys(PLATFORM_CATEGORIES).forEach(category => {
      counts[category] = EXISTING_PLATFORMS.filter(p => p.category === category).length;
    });
    
    return counts;
  }, []);

  if (!isFeatureEnabled('masterTerminal')) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavigationTabs />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Master Terminal Coming Soon
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The unified platform interface is currently being developed.
          </p>
          <Link 
            href="/campaigns" 
            className="mt-6 inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Visit Campaign Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Preserve existing navigation */}
      <NavigationTabs />
      
      {/* Master Terminal Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl">
                <LayoutDashboard className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Master Terminal
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Unified command center for all platform operations
                </p>
              </div>
            </div>
            
            {/* Beta Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-300 dark:border-purple-700">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Beta Preview
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Filter & Search */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-teal-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                All Platforms ({categoryCounts.all})
              </button>
              
              {Object.entries(PLATFORM_CATEGORIES).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === key
                      ? 'bg-teal-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {label} ({categoryCounts[key] || 0})
                </button>
              ))}
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search platforms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {availablePlatforms.map((platform, index) => (
            <PlatformCard key={platform.id} platform={platform} index={index} />
          ))}
        </div>

        {/* No Results */}
        {availablePlatforms.length === 0 && (
          <div className="text-center py-16">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No platforms found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or search query.
            </p>
          </div>
        )}

        {/* Development Notice */}
        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            🚀 Platform Roadmap
          </h3>
          <p className="text-blue-700 dark:text-blue-200 mb-4">
            We're building toward 20 integrated platforms. Currently {EXISTING_PLATFORMS.length} platforms are active 
            with {PLANNED_PLATFORMS.length} more in development.
          </p>
          <div className="flex flex-wrap gap-2">
            {PLANNED_PLATFORMS.slice(0, 6).map(platform => (
              <span 
                key={platform.id}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                {platform.name} - {platform.status}
              </span>
            ))}
            {PLANNED_PLATFORMS.length > 6 && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                +{PLANNED_PLATFORMS.length - 6} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface PlatformCardProps {
  platform: PlatformModule;
  index: number;
}

function PlatformCard({ platform, index }: PlatformCardProps) {
  const Icon = iconMap[platform.icon as keyof typeof iconMap] || LayoutDashboard;
  const isActive = platform.status === 'active';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={isActive ? platform.route : '#'}>
        <div className={`p-6 rounded-xl border transition-all duration-200 ${
          isActive 
            ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-600 cursor-pointer'
            : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-75'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${
              isActive 
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex items-center gap-2">
              {/* Status Badge */}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                platform.status === 'active' 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                  : platform.status === 'development'
                  ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'  
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {platform.status}
              </span>
              
              {isActive && (
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-500 transition-colors" />
              )}
            </div>
          </div>
          
          {/* Content */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {platform.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {platform.description}
          </p>
          
          {/* Features */}
          <div className="flex flex-wrap gap-1 mb-4">
            {platform.features.slice(0, 3).map(feature => (
              <span 
                key={feature}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
              >
                {feature.replace('-', ' ')}
              </span>
            ))}
            {platform.features.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                +{platform.features.length - 3}
              </span>
            )}
          </div>
          
          {/* Quick Actions */}
          {isActive && platform.quickActions.length > 0 && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {platform.quickActions.length} quick actions
                </span>
                {platform.aiCapabilities.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    <span className="text-xs text-purple-600 dark:text-purple-400">AI Powered</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}