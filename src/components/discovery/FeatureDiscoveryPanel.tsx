'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  X, 
  ChevronRight, 
  Star, 
  Zap, 
  Users, 
  BarChart3, 
  PenTool,
  Mail,
  Share2,
  Puzzle,
  Calendar,
  Bot,
  Search,
  ArrowRight,
  Lightbulb,
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

// Feature categories with their routes and descriptions
interface FeatureCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: Feature[];
  userTypes: UserType[];
}

interface Feature {
  id: string;
  name: string;
  description: string;
  route: string;
  isNew?: boolean;
  isPremium?: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  benefits: string[];
}

type UserType = 'marketer' | 'agency' | 'enterprise' | 'creator' | 'developer';

const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: 'ai-automation',
    name: 'AI & Automation',
    description: 'Autonomous AI decision-making and intelligent automation',
    icon: <Bot className="w-5 h-5" />,
    color: 'from-purple-500 to-pink-500',
    userTypes: ['marketer', 'agency', 'enterprise'],
    features: [
      {
        id: 'ai-center',
        name: 'AI Command Center',
        description: 'Chat with AI and control platform autonomously',
        route: '/ai-center',
        isNew: true,
        difficulty: 'intermediate',
        estimatedTime: '5 min',
        benefits: ['Autonomous decision-making', 'Real-time optimization', 'Smart recommendations']
      },
      {
        id: 'autonomous',
        name: 'Autonomous Control',
        description: 'Full AI autonomy with safety guardrails',
        route: '/autonomous',
        isPremium: true,
        difficulty: 'advanced',
        estimatedTime: '10 min',
        benefits: ['Zero manual intervention', 'Risk management', 'Emergency controls']
      }
    ]
  },
  {
    id: 'content-creation',
    name: 'Content Creation',
    description: 'Canva + Planoly + AI content generation suite',
    icon: <PenTool className="w-5 h-5" />,
    color: 'from-blue-500 to-cyan-500',
    userTypes: ['creator', 'marketer', 'agency'],
    features: [
      {
        id: 'content-suite',
        name: 'Content Creation Suite',
        description: 'Complete design studio with AI generation',
        route: '/content-suite',
        isNew: true,
        difficulty: 'beginner',
        estimatedTime: '3 min',
        benefits: ['Visual design tools', 'AI content generation', 'Brand management']
      },
      {
        id: 'design-studio',
        name: 'Advanced Design Studio',
        description: 'Professional canvas-based design tools',
        route: '/content-suite',
        difficulty: 'intermediate',
        estimatedTime: '7 min',
        benefits: ['Layer management', 'Professional tools', 'Export options']
      }
    ]
  },
  {
    id: 'social-media',
    name: 'Social Media Management',
    description: 'Multi-platform publishing and analytics',
    icon: <Share2 className="w-5 h-5" />,
    color: 'from-green-500 to-emerald-500',
    userTypes: ['creator', 'marketer', 'agency'],
    features: [
      {
        id: 'social-hub',
        name: 'Social Media Hub',
        description: 'Manage all platforms from one dashboard',
        route: '/social-media',
        difficulty: 'beginner',
        estimatedTime: '5 min',
        benefits: ['Multi-platform posting', 'Engagement tracking', 'Content planning']
      },
      {
        id: 'feed-planner',
        name: 'Instagram Feed Planner',
        description: '3x3 visual grid planning with drag & drop',
        route: '/content-suite',
        difficulty: 'beginner',
        estimatedTime: '4 min',
        benefits: ['Visual planning', 'Drag & drop', 'Scheduling integration']
      }
    ]
  },
  {
    id: 'email-marketing',
    name: 'Email Marketing',
    description: 'Campaign automation and subscriber management',
    icon: <Mail className="w-5 h-5" />,
    color: 'from-orange-500 to-red-500',
    userTypes: ['marketer', 'agency', 'enterprise'],
    features: [
      {
        id: 'email-campaigns',
        name: 'Email Campaigns',
        description: 'Create, schedule, and analyze email campaigns',
        route: '/email-marketing',
        difficulty: 'intermediate',
        estimatedTime: '8 min',
        benefits: ['Campaign automation', 'A/B testing', 'Advanced analytics']
      }
    ]
  },
  {
    id: 'project-management',
    name: 'Project Management',
    description: 'Enterprise project suite with team collaboration',
    icon: <Users className="w-5 h-5" />,
    color: 'from-indigo-500 to-purple-500',
    userTypes: ['agency', 'enterprise'],
    features: [
      {
        id: 'projects',
        name: 'Project Management Suite',
        description: 'Kanban boards, time tracking, team analytics',
        route: '/project-management',
        difficulty: 'intermediate',
        estimatedTime: '10 min',
        benefits: ['Team collaboration', 'Time tracking', 'Budget management']
      }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics & Reporting',
    description: 'ML-powered insights and performance analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'from-teal-500 to-blue-500',
    userTypes: ['marketer', 'agency', 'enterprise'],
    features: [
      {
        id: 'analytics-advanced',
        name: 'Advanced Analytics',
        description: 'ML-powered predictive analytics',
        route: '/analytics/advanced',
        isPremium: true,
        difficulty: 'advanced',
        estimatedTime: '12 min',
        benefits: ['Predictive modeling', 'Cross-platform insights', 'AI recommendations']
      },
      {
        id: 'real-time-analytics',
        name: 'Real-time Analytics',
        description: 'Live performance monitoring',
        route: '/analytics/real-time',
        difficulty: 'intermediate',
        estimatedTime: '6 min',
        benefits: ['Live monitoring', 'Performance alerts', 'Instant insights']
      }
    ]
  },
  {
    id: 'integrations',
    name: 'Integrations & Marketplace',
    description: '100+ app ecosystem and workflow automation',
    icon: <Puzzle className="w-5 h-5" />,
    color: 'from-pink-500 to-rose-500',
    userTypes: ['developer', 'enterprise', 'agency'],
    features: [
      {
        id: 'integrations-marketplace',
        name: 'Integration Marketplace',
        description: 'Connect with 100+ apps and services',
        route: '/integrations',
        difficulty: 'beginner',
        estimatedTime: '5 min',
        benefits: ['Workflow automation', 'API management', 'Custom integrations']
      }
    ]
  }
];

interface FeatureDiscoveryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userType?: UserType;
  onFeatureSelect?: (feature: Feature) => void;
}

export default function FeatureDiscoveryPanel({ 
  isOpen, 
  onClose, 
  userType = 'marketer',
  onFeatureSelect 
}: FeatureDiscoveryPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [bookmarkedFeatures, setBookmarkedFeatures] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load bookmarked features from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pulsebridge-bookmarked-features');
    if (saved) {
      setBookmarkedFeatures(JSON.parse(saved));
    }
  }, []);

  // Save bookmarked features to localStorage
  const toggleBookmark = (featureId: string) => {
    const updated = bookmarkedFeatures.includes(featureId)
      ? bookmarkedFeatures.filter(id => id !== featureId)
      : [...bookmarkedFeatures, featureId];
    
    setBookmarkedFeatures(updated);
    localStorage.setItem('pulsebridge-bookmarked-features', JSON.stringify(updated));
  };

  // Filter categories based on user type and search
  const filteredCategories = FEATURE_CATEGORIES.filter(category => {
    const matchesUserType = category.userTypes.includes(userType);
    const matchesSearch = !searchQuery || 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.features.some(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    return matchesUserType && matchesSearch;
  });

  const handleFeatureClick = (feature: Feature) => {
    onFeatureSelect?.(feature);
    // Navigate to feature route
    window.location.href = feature.route;
  };

  const getDifficultyColor = (difficulty: Feature['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Feature Discovery
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Explore PulseBridge.ai's {FEATURE_CATEGORIES.reduce((acc, cat) => acc + cat.features.length, 0)}+ features
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search features, capabilities, or use cases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Categories Sidebar */}
              <div className="w-80 border-r border-gray-200 dark:border-gray-700">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-2">
                    {filteredCategories.map((category) => (
                      <motion.div
                        key={category.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all duration-200 ${
                            selectedCategory === category.id 
                              ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center text-white`}>
                                {category.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                  {category.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                  {category.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {category.features.length} features
                                  </Badge>
                                  {category.features.some(f => f.isNew) && (
                                    <Badge className="text-xs bg-green-500">New</Badge>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Features Detail Panel */}
              <div className="flex-1">
                <ScrollArea className="h-full">
                  {selectedCategory ? (
                    <div className="p-6">
                      {(() => {
                        const category = filteredCategories.find(c => c.id === selectedCategory);
                        if (!category) return null;

                        return (
                          <div>
                            <div className="flex items-center gap-3 mb-6">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center text-white`}>
                                {category.icon}
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                  {category.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                  {category.description}
                                </p>
                              </div>
                            </div>

                            <div className="grid gap-4">
                              {category.features.map((feature) => (
                                <motion.div
                                  key={feature.id}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-200">
                                    <CardHeader>
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-2">
                                            <CardTitle className="text-lg">
                                              {feature.name}
                                            </CardTitle>
                                            {feature.isNew && (
                                              <Badge className="bg-green-500">New</Badge>
                                            )}
                                            {feature.isPremium && (
                                              <Badge className="bg-purple-500">Premium</Badge>
                                            )}
                                          </div>
                                          <p className="text-gray-600 dark:text-gray-400">
                                            {feature.description}
                                          </p>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleBookmark(feature.id);
                                          }}
                                        >
                                          <Bookmark 
                                            className={`w-4 h-4 ${
                                              bookmarkedFeatures.includes(feature.id)
                                                ? 'fill-current text-yellow-500'
                                                : 'text-gray-400'
                                            }`}
                                          />
                                        </Button>
                                      </div>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="flex items-center gap-4 mb-4">
                                        <Badge className={getDifficultyColor(feature.difficulty)}>
                                          {feature.difficulty}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                          <Calendar className="w-4 h-4" />
                                          {feature.estimatedTime}
                                        </div>
                                      </div>

                                      <div className="space-y-2 mb-4">
                                        <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                                          Key Benefits:
                                        </h4>
                                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                          {feature.benefits.map((benefit, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                              <Zap className="w-3 h-3 text-yellow-500" />
                                              {benefit}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>

                                      <Button 
                                        onClick={() => handleFeatureClick(feature)}
                                        className="w-full"
                                      >
                                        Explore Feature
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                      </Button>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <Lightbulb className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Discover Amazing Features
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-md">
                        Select a category from the left to explore features tailored for {userType}s. 
                        Each feature includes guided tutorials and estimated learning time.
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}