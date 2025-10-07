'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, X, ArrowRight, Filter, Clock, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BusinessType, BusinessSize } from '@/contexts/BusinessConfigurationContext';

interface EnhancedSearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'pages' | 'campaigns' | 'analytics' | 'reports' | 'settings' | 'features' | 'integrations';
  subcategory?: string;
  icon: React.ComponentType<{ className?: string }>;
  relevanceScore: number;
  businessTypes?: BusinessType[];
  businessSizes?: BusinessSize[];
  estimatedTime?: string;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  isPremium?: boolean;
  quickActions?: Array<{
    label: string;
    action: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
}

interface EnhancedGlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  businessType?: BusinessType;
  businessSize?: BusinessSize;
  userGoals?: string[];
  className?: string;
}

// Import icons dynamically to avoid import issues
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    'BarChart3': ({ className }) => <div className={`${className} bg-blue-500 rounded`}>📊</div>,
    'Target': ({ className }) => <div className={`${className} bg-green-500 rounded`}>🎯</div>,
    'Mail': ({ className }) => <div className={`${className} bg-purple-500 rounded`}>📧</div>,
    'Share2': ({ className }) => <div className={`${className} bg-pink-500 rounded`}>📱</div>,
    'Users': ({ className }) => <div className={`${className} bg-orange-500 rounded`}>👥</div>,
    'Settings': ({ className }) => <div className={`${className} bg-gray-500 rounded`}>⚙️</div>,
    'FileText': ({ className }) => <div className={`${className} bg-indigo-500 rounded`}>📄</div>,
    'Calendar': ({ className }) => <div className={`${className} bg-yellow-500 rounded`}>📅</div>,
    'Zap': ({ className }) => <div className={`${className} bg-red-500 rounded`}>⚡</div>,
    'Globe': ({ className }) => <div className={`${className} bg-teal-500 rounded`}>🌐</div>,
  };
  
  return iconMap[iconName] || iconMap['Settings'];
};

// Enhanced search data with business-specific relevance
const generateEnhancedSearchData = (
  businessType?: BusinessType, 
  businessSize?: BusinessSize,
  userGoals?: string[]
): EnhancedSearchResult[] => {
  const baseResults: Omit<EnhancedSearchResult, 'relevanceScore'>[] = [
    // Core Pages
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Main platform overview with key metrics and insights',
      url: '/dashboard',
      category: 'pages',
      icon: getIconComponent('BarChart3'),
      estimatedTime: '2 min',
      difficultyLevel: 'beginner',
      quickActions: [
        { label: 'View KPIs', action: () => {} },
        { label: 'Customize Layout', action: () => {} }
      ]
    },
    {
      id: 'email-marketing',
      title: 'Email Marketing',
      description: 'Create and manage email campaigns with AI optimization',
      url: '/email-marketing',
      category: 'campaigns',
      subcategory: 'email',
      icon: getIconComponent('Mail'),
      businessTypes: ['startup', 'small_business', 'growing_business', 'medium_business', 'agency'],
      businessSizes: ['micro', 'small', 'medium', 'large'],
      estimatedTime: '15 min',
      difficultyLevel: 'beginner',
      quickActions: [
        { label: 'Create Campaign', action: () => {} },
        { label: 'View Templates', action: () => {} }
      ]
    },
    {
      id: 'social-media',
      title: 'Social Media Management',
      description: 'Manage multiple social platforms with automated posting',
      url: '/social-media',
      category: 'campaigns',
      subcategory: 'social',
      icon: getIconComponent('Share2'),
      businessTypes: ['solo_entrepreneur', 'freelancer', 'startup', 'small_business', 'agency'],
      businessSizes: ['solo', 'micro', 'small', 'medium'],
      estimatedTime: '20 min',
      difficultyLevel: 'beginner',
      quickActions: [
        { label: 'Connect Accounts', action: () => {} },
        { label: 'Schedule Posts', action: () => {} }
      ]
    },
    {
      id: 'analytics-performance',
      title: 'Performance Analytics',
      description: 'Detailed performance metrics and ROI analysis',
      url: '/analytics/performance',
      category: 'analytics',
      subcategory: 'performance',
      icon: getIconComponent('BarChart3'),
      businessTypes: ['growing_business', 'medium_business', 'agency'],
      businessSizes: ['small', 'medium', 'large', 'enterprise'],
      estimatedTime: '10 min',
      difficultyLevel: 'intermediate',
      quickActions: [
        { label: 'View Reports', action: () => {} },
        { label: 'Export Data', action: () => {} }
      ]
    },
    {
      id: 'team-collaboration',
      title: 'Team Collaboration',
      description: 'Real-time collaboration and project management',
      url: '/collaboration/team',
      category: 'features',
      subcategory: 'collaboration',
      icon: getIconComponent('Users'),
      businessTypes: ['startup', 'growing_business', 'medium_business', 'agency'],
      businessSizes: ['micro', 'small', 'medium', 'large', 'enterprise'],
      estimatedTime: '5 min',
      difficultyLevel: 'beginner',
      quickActions: [
        { label: 'Invite Team', action: () => {} },
        { label: 'Assign Tasks', action: () => {} }
      ]
    },
    {
      id: 'automation-workflows',
      title: 'AI Automation',
      description: 'Set up intelligent workflows and automated optimizations',
      url: '/automation/workflows',
      category: 'features',
      subcategory: 'automation',
      icon: getIconComponent('Zap'),
      businessTypes: ['growing_business', 'medium_business', 'agency'],
      businessSizes: ['medium', 'large', 'enterprise'],
      estimatedTime: '30 min',
      difficultyLevel: 'advanced',
      isPremium: true,
      quickActions: [
        { label: 'Create Workflow', action: () => {} },
        { label: 'View Templates', action: () => {} }
      ]
    },
    {
      id: 'integrations-marketplace',
      title: 'Integration Marketplace',
      description: 'Connect with 100+ tools and services',
      url: '/integrations/marketplace',
      category: 'integrations',
      icon: getIconComponent('Globe'),
      businessTypes: ['growing_business', 'medium_business', 'agency'],
      businessSizes: ['small', 'medium', 'large', 'enterprise'],
      estimatedTime: '15 min',
      difficultyLevel: 'intermediate',
      quickActions: [
        { label: 'Browse Apps', action: () => {} },
        { label: 'Connect CRM', action: () => {} }
      ]
    },
    {
      id: 'project-management',
      title: 'Project Management',
      description: 'Advanced project tracking and resource management',
      url: '/project-management',
      category: 'features',
      subcategory: 'projects',
      icon: getIconComponent('Target'),
      businessTypes: ['agency', 'medium_business'],
      businessSizes: ['medium', 'large', 'enterprise'],
      estimatedTime: '25 min',
      difficultyLevel: 'intermediate',
      quickActions: [
        { label: 'Create Project', action: () => {} },
        { label: 'View Timeline', action: () => {} }
      ]
    },
    // Quick Actions & Settings
    {
      id: 'create-campaign',
      title: 'Create New Campaign',
      description: 'Start a new marketing campaign with AI assistance',
      url: '/campaigns/new',
      category: 'campaigns',
      icon: getIconComponent('Target'),
      estimatedTime: '20 min',
      difficultyLevel: 'beginner',
      quickActions: [
        { label: 'Email Campaign', action: () => {} },
        { label: 'Social Campaign', action: () => {} }
      ]
    },
    {
      id: 'settings',
      title: 'Platform Settings',
      description: 'Configure your account and platform preferences',
      url: '/settings',
      category: 'settings',
      icon: getIconComponent('Settings'),
      estimatedTime: '10 min',
      difficultyLevel: 'beginner',
      quickActions: [
        { label: 'Account Settings', action: () => {} },
        { label: 'Billing', action: () => {} }
      ]
    }
  ];

  // Calculate relevance scores based on business profile
  return baseResults.map(result => {
    let relevanceScore = 50; // Base score

    // Business type relevance
    if (businessType && result.businessTypes?.includes(businessType)) {
      relevanceScore += 30;
    }

    // Business size relevance  
    if (businessSize && result.businessSizes?.includes(businessSize)) {
      relevanceScore += 20;
    }

    // Goal alignment
    if (userGoals) {
      if (userGoals.includes('Increase sales and revenue') && result.category === 'campaigns') {
        relevanceScore += 25;
      }
      if (userGoals.includes('Improve marketing effectiveness') && result.subcategory === 'performance') {
        relevanceScore += 25;
      }
      if (userGoals.includes('Enhance team productivity') && result.subcategory === 'collaboration') {
        relevanceScore += 25;
      }
      if (userGoals.includes('Reduce manual tasks') && result.subcategory === 'automation') {
        relevanceScore += 25;
      }
    }

    // Difficulty level adjustment
    if (businessSize === 'solo' && result.difficultyLevel === 'beginner') {
      relevanceScore += 15;
    }
    if (businessSize === 'enterprise' && result.difficultyLevel === 'advanced') {
      relevanceScore += 15;
    }

    return { ...result, relevanceScore: Math.min(100, relevanceScore) };
  });
};

export default function EnhancedGlobalSearch({
  isOpen,
  onClose,
  businessType,
  businessSize,
  userGoals = [],
  className = ""
}: EnhancedGlobalSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<EnhancedSearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<EnhancedSearchResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Initialize search data based on business profile
  useEffect(() => {
    const enhancedData = generateEnhancedSearchData(businessType, businessSize, userGoals);
    setResults(enhancedData.sort((a, b) => b.relevanceScore - a.relevanceScore));
  }, [businessType, businessSize, userGoals]);

  // Filter and search logic
  useEffect(() => {
    let filtered = results;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(item => item.difficultyLevel === selectedDifficulty);
    }

    // Search term filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.subcategory?.toLowerCase().includes(term)
      );
    }

    setFilteredResults(filtered);
    setSelectedIndex(0);
  }, [results, searchTerm, selectedCategory, selectedDifficulty]);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredResults.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredResults.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredResults[selectedIndex]) {
            handleSelectResult(filteredResults[selectedIndex]);
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, onClose]);

  const handleSelectResult = (result: EnhancedSearchResult) => {
    router.push(result.url);
    onClose();
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'pages', label: 'Pages' },
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'features', label: 'Features' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'settings', label: 'Settings' }
  ];

  const difficulties = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50 ${className}`}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={`Search features, pages, and tools${businessType ? ` for ${businessType.replace('_', ' ')}` : ''}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500"
              />
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">↑↓</kbd>
                <span>navigate</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">↵</kbd>
                <span>select</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">esc</kbd>
                <span>close</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
              >
                {difficulties.map(diff => (
                  <option key={diff.id} value={diff.id}>{diff.label}</option>
                ))}
              </select>

              {businessType && (
                <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                  Personalized for {businessType.replace('_', ' ')}
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {filteredResults.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No results found</p>
                <p className="text-sm">Try adjusting your search terms or filters</p>
              </div>
            ) : (
              <div className="p-2">
                {filteredResults.map((result, index) => {
                  const Icon = result.icon;
                  const isSelected = index === selectedIndex;
                  
                  return (
                    <div
                      key={result.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => handleSelectResult(result)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {result.title}
                                </h3>
                                
                                {result.relevanceScore > 80 && (
                                  <div className="flex items-center text-xs text-yellow-600 dark:text-yellow-400">
                                    <Star className="h-3 w-3 mr-1" />
                                    <span>Recommended</span>
                                  </div>
                                )}
                                
                                {result.isPremium && (
                                  <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded">
                                    Premium
                                  </span>
                                )}
                              </div>
                              
                              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                                {result.description}
                              </p>
                              
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span className="capitalize">{result.category}</span>
                                {result.estimatedTime && (
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {result.estimatedTime}
                                  </div>
                                )}
                                {result.difficultyLevel && (
                                  <span className={`px-2 py-0.5 rounded ${
                                    result.difficultyLevel === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                    result.difficultyLevel === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                    'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                  }`}>
                                    {result.difficultyLevel}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                          </div>

                          {/* Quick Actions */}
                          {result.quickActions && result.quickActions.length > 0 && (
                            <div className="flex items-center space-x-2 mt-2">
                              {result.quickActions.slice(0, 2).map((action, actionIndex) => (
                                <button
                                  key={actionIndex}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.action();
                                  }}
                                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {filteredResults.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 text-xs text-gray-500 text-center">
              Showing {filteredResults.length} results
              {businessType && ` • Personalized for ${businessType.replace('_', ' ')}`}
              {userGoals.length > 0 && ` • Based on your goals`}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}