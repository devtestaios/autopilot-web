'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Plus, 
  Search,
  Filter,
  Download,
  Upload,
  Copy,
  Edit,
  Trash2,
  Star,
  Eye,
  Bookmark,
  Tag,
  Calendar,
  Target,
  TrendingUp,
  Users,
  Globe,
  Smartphone,
  Monitor,
  PlayCircle,
  Image,
  Type,
  BarChart3,
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import NavigationTabs from '@/components/NavigationTabs';
import UnifiedSidebar from '@/components/UnifiedSidebar';

// Mock template data
const campaignTemplates = [
  {
    id: 1,
    name: 'Holiday Sale Campaign',
    description: 'Proven template for seasonal sales with high conversion rates',
    category: 'E-commerce',
    platform: 'Google Ads',
    type: 'Search & Display',
    rating: 4.8,
    uses: 1247,
    lastUpdated: '2024-12-15',
    tags: ['seasonal', 'sale', 'conversion'],
    preview: 'https://example.com/preview1',
    author: 'Autopilot Team',
    performance: { ctr: 6.2, cvr: 3.8, cpa: 24.50, roas: 4.2 },
    features: ['Dynamic Product Ads', 'Countdown Timer', 'Location Targeting'],
    targetAudience: 'Shoppers aged 25-54 with purchase intent',
    budget: '$2,000 - $10,000',
    duration: '2-4 weeks',
    thumbnail: '/templates/holiday-sale.jpg'
  },
  {
    id: 2,
    name: 'B2B Lead Generation',
    description: 'Comprehensive template for B2B lead acquisition with LinkedIn targeting',
    category: 'B2B',
    platform: 'LinkedIn',
    type: 'Sponsored Content',
    rating: 4.6,
    uses: 892,
    lastUpdated: '2024-12-10',
    tags: ['b2b', 'leads', 'enterprise'],
    preview: 'https://example.com/preview2',
    author: 'Marketing Pro',
    performance: { ctr: 2.1, cvr: 8.5, cpa: 89.00, roas: 2.8 },
    features: ['Job Title Targeting', 'Company Size Filter', 'Lead Forms'],
    targetAudience: 'Decision makers in target industries',
    budget: '$5,000 - $25,000',
    duration: '4-8 weeks',
    thumbnail: '/templates/b2b-leads.jpg'
  },
  {
    id: 3,
    name: 'Brand Awareness Video',
    description: 'Video-first campaign template for brand awareness and reach',
    category: 'Branding',
    platform: 'Meta',
    type: 'Video Ads',
    rating: 4.4,
    uses: 1567,
    lastUpdated: '2024-12-08',
    tags: ['video', 'awareness', 'reach'],
    preview: 'https://example.com/preview3',
    author: 'Creative Agency',
    performance: { ctr: 4.5, cvr: 1.2, cpa: 12.30, roas: 1.8 },
    features: ['Video Views Optimization', 'Lookalike Audiences', 'Creative Testing'],
    targetAudience: 'Broad audience with brand affinity',
    budget: '$1,000 - $15,000',
    duration: '2-6 weeks',
    thumbnail: '/templates/brand-video.jpg'
  },
  {
    id: 4,
    name: 'Local Service Business',
    description: 'Location-based template for service businesses and local commerce',
    category: 'Local',
    platform: 'Google Ads',
    type: 'Local Campaigns',
    rating: 4.7,
    uses: 743,
    lastUpdated: '2024-12-12',
    tags: ['local', 'service', 'proximity'],
    preview: 'https://example.com/preview4',
    author: 'Local Marketing Expert',
    performance: { ctr: 5.8, cvr: 12.4, cpa: 35.60, roas: 5.2 },
    features: ['Radius Targeting', 'Call Extensions', 'Store Visits Tracking'],
    targetAudience: 'Local customers within service area',
    budget: '$500 - $5,000',
    duration: 'Ongoing',
    thumbnail: '/templates/local-service.jpg'
  },
  {
    id: 5,
    name: 'Mobile App Install',
    description: 'Optimized template for mobile app downloads and user acquisition',
    category: 'Mobile',
    platform: 'TikTok',
    type: 'App Install',
    rating: 4.3,
    uses: 623,
    lastUpdated: '2024-12-05',
    tags: ['mobile', 'app', 'install'],
    preview: 'https://example.com/preview5',
    author: 'App Growth Team',
    performance: { ctr: 3.2, cvr: 18.5, cpa: 8.90, roas: 3.1 },
    features: ['App Store Optimization', 'Creative Automation', 'Event Tracking'],
    targetAudience: 'Mobile users interested in app category',
    budget: '$1,500 - $20,000',
    duration: '3-12 weeks',
    thumbnail: '/templates/mobile-app.jpg'
  },
  {
    id: 6,
    name: 'Retargeting Recovery',
    description: 'Win back previous visitors with personalized retargeting campaigns',
    category: 'Retargeting',
    platform: 'Multi-Platform',
    type: 'Display & Social',
    rating: 4.9,
    uses: 2156,
    lastUpdated: '2024-12-14',
    tags: ['retargeting', 'recovery', 'personalization'],
    preview: 'https://example.com/preview6',
    author: 'Conversion Experts',
    performance: { ctr: 8.1, cvr: 15.3, cpa: 18.20, roas: 6.8 },
    features: ['Dynamic Retargeting', 'Frequency Capping', 'Sequential Messaging'],
    targetAudience: 'Previous website visitors and cart abandoners',
    budget: '$800 - $8,000',
    duration: '2-8 weeks',
    thumbnail: '/templates/retargeting.jpg'
  }
];

const templateCategories = [
  { id: 'all', name: 'All Templates', count: 6 },
  { id: 'e-commerce', name: 'E-commerce', count: 1 },
  { id: 'b2b', name: 'B2B', count: 1 },
  { id: 'branding', name: 'Branding', count: 1 },
  { id: 'local', name: 'Local', count: 1 },
  { id: 'mobile', name: 'Mobile', count: 1 },
  { id: 'retargeting', name: 'Retargeting', count: 1 }
];

const platforms = [
  { id: 'all', name: 'All Platforms', icon: Globe },
  { id: 'google', name: 'Google Ads', icon: Globe },
  { id: 'meta', name: 'Meta', icon: Globe },
  { id: 'linkedin', name: 'LinkedIn', icon: Globe },
  { id: 'tiktok', name: 'TikTok', icon: Globe }
];

export default function CampaignTemplatesPage() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'recent'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const filteredTemplates = campaignTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
                           template.category.toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesPlatform = selectedPlatform === 'all' || 
                           template.platform.toLowerCase().includes(selectedPlatform.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesPlatform;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'popular': return b.uses - a.uses;
      case 'rating': return b.rating - a.rating;
      case 'recent': return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      default: return 0;
    }
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'google ads': return Globe;
      case 'meta': return Users;
      case 'linkedin': return Users;
      case 'tiktok': return PlayCircle;
      default: return Globe;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video ads': return PlayCircle;
      case 'search & display': return Search;
      case 'sponsored content': return Type;
      case 'app install': return Smartphone;
      default: return BarChart3;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-56'
      }`}>
        <NavigationTabs />
        
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Campaign Templates
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Ready-to-use campaign templates for faster setup and better results
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <Upload className="w-4 h-4" />
                Import
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                Create Template
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search templates by name, description, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {templateCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>

              {/* Platform Filter */}
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {platforms.map(platform => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="recent">Recently Updated</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Type className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {sortedTemplates.length} of {campaignTemplates.length} templates
            </p>
          </div>

          {/* Templates Grid */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {sortedTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow ${
                  viewMode === 'list' ? 'flex items-center' : ''
                }`}
              >
                {/* Template Image/Thumbnail */}
                <div className={`${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'h-48'} bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        {React.createElement(getTypeIcon(template.type), { className: 'w-6 h-6' })}
                      </div>
                      <p className="text-sm font-medium">{template.type}</p>
                    </div>
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {template.rating}
                    </span>
                  </div>
                </div>

                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                    <button className="ml-2 p-1 text-gray-400 hover:text-yellow-500 transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Platform & Category */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 rounded-md">
                      {React.createElement(getPlatformIcon(template.platform), { className: 'w-3 h-3 text-blue-600 dark:text-blue-400' })}
                      <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                        {template.platform}
                      </span>
                    </div>
                    <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {template.category}
                      </span>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400">CTR</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {template.performance.ctr}%
                      </p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400">ROAS</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {template.performance.roas}x
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span>{template.uses} uses</span>
                    <span>Updated {new Date(template.lastUpdated).toLocaleDateString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      <Copy className="w-3 h-3" />
                      Use Template
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {sortedTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No templates found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search criteria or filters to find more templates.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}