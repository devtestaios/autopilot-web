'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Target, 
  ShoppingCart, 
  Building, 
  Users, 
  Heart, 
  Gamepad2, 
  GraduationCap,
  Home,
  Car,
  Utensils,
  Plane,
  Star,
  TrendingUp,
  Eye,
  Copy,
  Bot,
  Zap,
  BarChart3,
  Clock,
  DollarSign,
  Search,
  Filter,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Rocket
} from 'lucide-react';

interface CampaignTemplate {
  id: string;
  name: string;
  category: string;
  industry: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedSetupTime: string;
  expectedROAS: string;
  platforms: string[];
  aiRecommendations: {
    targeting: string[];
    budget: string;
    bidding: string;
    keywords: string[];
    adFormats: string[];
  };
  templateData: {
    campaigns: number;
    adGroups: number;
    keywords: number;
    audiences: number;
  };
  performance: {
    avgCTR: string;
    avgCPC: string;
    avgConversionRate: string;
  };
  tags: string[];
  isPopular?: boolean;
  isAIRecommended?: boolean;
}

const campaignTemplates: CampaignTemplate[] = [
  {
    id: 'ecommerce-sales',
    name: 'E-commerce Sales Boost',
    category: 'Sales',
    industry: 'E-commerce',
    description: 'Drive online sales with product-focused campaigns across Google and Meta',
    icon: ShoppingCart,
    color: 'bg-green-500',
    difficulty: 'beginner',
    estimatedSetupTime: '15 minutes',
    expectedROAS: '4.2x',
    platforms: ['Google Ads', 'Meta', 'Shopping'],
    aiRecommendations: {
      targeting: ['Previous purchasers', 'Cart abandoners', 'Product viewers'],
      budget: '$50-100/day recommended',
      bidding: 'Target ROAS at 300%',
      keywords: ['buy online', 'best price', 'free shipping', 'discount'],
      adFormats: ['Shopping ads', 'Dynamic product ads', 'Carousel ads']
    },
    templateData: {
      campaigns: 3,
      adGroups: 12,
      keywords: 150,
      audiences: 8
    },
    performance: {
      avgCTR: '3.2%',
      avgCPC: '$0.85',
      avgConversionRate: '4.1%'
    },
    tags: ['sales', 'conversion', 'shopping'],
    isPopular: true,
    isAIRecommended: true
  },
  {
    id: 'lead-generation-b2b',
    name: 'B2B Lead Generation',
    category: 'Lead Generation',
    industry: 'B2B Services',
    description: 'Generate high-quality leads for professional services and B2B companies',
    icon: Building,
    color: 'bg-blue-500',
    difficulty: 'intermediate',
    estimatedSetupTime: '25 minutes',
    expectedROAS: '6.8x',
    platforms: ['Google Ads', 'LinkedIn', 'Meta'],
    aiRecommendations: {
      targeting: ['Job titles', 'Company size', 'Industry verticals'],
      budget: '$75-150/day recommended',
      bidding: 'Target CPA at $45',
      keywords: ['solutions', 'services', 'consultant', 'expert'],
      adFormats: ['Single image ads', 'Lead gen forms', 'Text ads']
    },
    templateData: {
      campaigns: 4,
      adGroups: 16,
      keywords: 200,
      audiences: 12
    },
    performance: {
      avgCTR: '2.8%',
      avgCPC: '$2.15',
      avgConversionRate: '8.2%'
    },
    tags: ['b2b', 'leads', 'professional'],
    isAIRecommended: true
  },
  {
    id: 'brand-awareness',
    name: 'Brand Awareness Campaign',
    category: 'Brand Building',
    industry: 'Consumer Brands',
    description: 'Build brand recognition and reach new audiences with engaging creative',
    icon: Star,
    color: 'bg-purple-500',
    difficulty: 'beginner',
    estimatedSetupTime: '20 minutes',
    expectedROAS: '2.1x',
    platforms: ['Meta', 'Google Display', 'YouTube'],
    aiRecommendations: {
      targeting: ['Lookalike audiences', 'Interest-based', 'Demographics'],
      budget: '$40-80/day recommended',
      bidding: 'Target impressions',
      keywords: ['brand terms', 'competitor terms', 'category terms'],
      adFormats: ['Video ads', 'Image ads', 'Stories']
    },
    templateData: {
      campaigns: 2,
      adGroups: 8,
      keywords: 75,
      audiences: 6
    },
    performance: {
      avgCTR: '1.9%',
      avgCPC: '$0.45',
      avgConversionRate: '2.3%'
    },
    tags: ['awareness', 'branding', 'reach'],
    isPopular: true
  },
  {
    id: 'local-business',
    name: 'Local Business Growth',
    category: 'Local Marketing',
    industry: 'Local Services',
    description: 'Drive foot traffic and local customers to your business location',
    icon: Home,
    color: 'bg-orange-500',
    difficulty: 'beginner',
    estimatedSetupTime: '12 minutes',
    expectedROAS: '5.4x',
    platforms: ['Google Ads', 'Meta', 'Google My Business'],
    aiRecommendations: {
      targeting: ['Local radius', 'Local interests', 'Nearby competitors'],
      budget: '$30-60/day recommended',
      bidding: 'Target local actions',
      keywords: ['near me', 'local', 'hours', 'directions'],
      adFormats: ['Local ads', 'Call extensions', 'Location extensions']
    },
    templateData: {
      campaigns: 2,
      adGroups: 6,
      keywords: 80,
      audiences: 4
    },
    performance: {
      avgCTR: '4.1%',
      avgCPC: '$1.25',
      avgConversionRate: '6.8%'
    },
    tags: ['local', 'foot traffic', 'nearby']
  },
  {
    id: 'app-promotion',
    name: 'Mobile App Promotion',
    category: 'App Marketing',
    industry: 'Mobile Apps',
    description: 'Drive app downloads and user engagement across mobile platforms',
    icon: Gamepad2,
    color: 'bg-pink-500',
    difficulty: 'intermediate',
    estimatedSetupTime: '30 minutes',
    expectedROAS: '3.7x',
    platforms: ['Google Ads', 'Meta', 'Apple Search Ads'],
    aiRecommendations: {
      targeting: ['App categories', 'Device types', 'OS versions'],
      budget: '$60-120/day recommended',
      bidding: 'Target cost per install',
      keywords: ['app download', 'mobile game', 'productivity app'],
      adFormats: ['App install ads', 'Video ads', 'Playable ads']
    },
    templateData: {
      campaigns: 3,
      adGroups: 10,
      keywords: 120,
      audiences: 8
    },
    performance: {
      avgCTR: '2.6%',
      avgCPC: '$1.80',
      avgConversionRate: '12.4%'
    },
    tags: ['mobile', 'app', 'downloads']
  },
  {
    id: 'healthcare-services',
    name: 'Healthcare Services',
    category: 'Healthcare',
    industry: 'Medical Services',
    description: 'Promote healthcare services while maintaining compliance standards',
    icon: Heart,
    color: 'bg-red-500',
    difficulty: 'advanced',
    estimatedSetupTime: '45 minutes',
    expectedROAS: '7.2x',
    platforms: ['Google Ads', 'Meta'],
    aiRecommendations: {
      targeting: ['Health conditions', 'Age groups', 'Local area'],
      budget: '$80-160/day recommended',
      bidding: 'Target CPA with compliance',
      keywords: ['doctor', 'treatment', 'clinic', 'appointment'],
      adFormats: ['Text ads', 'Call extensions', 'Sitelink extensions']
    },
    templateData: {
      campaigns: 4,
      adGroups: 14,
      keywords: 180,
      audiences: 10
    },
    performance: {
      avgCTR: '3.8%',
      avgCPC: '$3.20',
      avgConversionRate: '9.1%'
    },
    tags: ['healthcare', 'medical', 'compliance']
  }
];

interface CampaignTemplateLibraryProps {
  onSelectTemplate?: (template: CampaignTemplate) => void;
  onPreviewTemplate?: (template: CampaignTemplate) => void;
}

const CampaignTemplateLibrary: React.FC<CampaignTemplateLibraryProps> = ({
  onSelectTemplate,
  onPreviewTemplate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [filteredTemplates, setFilteredTemplates] = useState(campaignTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);

  const categories = ['all', 'Sales', 'Lead Generation', 'Brand Building', 'Local Marketing', 'App Marketing', 'Healthcare'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    let filtered = campaignTemplates;

    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(template => template.difficulty === selectedDifficulty);
    }

    setFilteredTemplates(filtered);
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'intermediate': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'advanced': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI-Powered Campaign Templates
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose from industry-optimized templates with AI recommendations to launch successful campaigns faster
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-end">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => {
            const IconComponent = template.icon;
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTemplate(template)}
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-lg ${template.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex space-x-1">
                      {template.isAIRecommended && (
                        <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full flex items-center space-x-1">
                          <Bot className="h-3 w-3" />
                          <span>AI Pick</span>
                        </div>
                      )}
                      {template.isPopular && (
                        <div className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium rounded-full flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>Popular</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {template.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-1 rounded-full ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {template.industry}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Setup Time</span>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">{template.estimatedSetupTime}</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Expected ROAS</span>
                      </div>
                      <p className="font-medium text-green-600 dark:text-green-400">{template.expectedROAS}</p>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Avg CTR</p>
                      <p className="font-medium text-gray-900 dark:text-white">{template.performance.avgCTR}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Avg CPC</p>
                      <p className="font-medium text-gray-900 dark:text-white">{template.performance.avgCPC}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Conv Rate</p>
                      <p className="font-medium text-gray-900 dark:text-white">{template.performance.avgConversionRate}</p>
                    </div>
                  </div>

                  {/* Platforms */}
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Platforms:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.platforms.map(platform => (
                        <span key={platform} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewTemplate?.(template);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                    >
                      <Eye className="h-4 w-4 mr-2 inline-block" />
                      Preview
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTemplate?.(template);
                      }}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Rocket className="h-4 w-4 mr-2 inline-block" />
                      Use Template
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Template Detail Modal */}
        <AnimatePresence>
          {selectedTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedTemplate(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal content would go here */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedTemplate.name}
                    </h2>
                    <button
                      onClick={() => setSelectedTemplate(null)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {/* Detailed template information would be rendered here */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        AI Recommendations
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Targeting</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {selectedTemplate.aiRecommendations.targeting.map((item, index) => (
                              <li key={index}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Keywords</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedTemplate.aiRecommendations.keywords.map((keyword, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setSelectedTemplate(null)}
                        className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => {
                          onSelectTemplate?.(selectedTemplate);
                          setSelectedTemplate(null);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Use This Template
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CampaignTemplateLibrary;