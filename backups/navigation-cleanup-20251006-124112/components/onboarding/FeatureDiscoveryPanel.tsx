'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb,
  Target,
  BarChart3,
  Mail,
  Share2,
  Users,
  Zap,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  Clock,
  TrendingUp,
  MessageSquare,
  Calendar,
  Settings,
  Shield,
  Globe,
  Smartphone
} from 'lucide-react';
import { BusinessType, BusinessSize } from '@/contexts/BusinessConfigurationContext';

interface Feature {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  category: 'marketing' | 'analytics' | 'collaboration' | 'automation' | 'advanced';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  icon: React.ComponentType<{ className?: string }>;
  businessTypes: BusinessType[];
  businessSizes: BusinessSize[];
  prerequisites?: string[];
  quickStartUrl: string;
  videoTutorialUrl?: string;
}

interface FeatureDiscoveryPanelProps {
  businessType?: BusinessType;
  businessSize?: BusinessSize;
  selectedGoals?: string[];
  onFeatureSelect?: (feature: Feature) => void;
  onStartQuickTour?: () => void;
  className?: string;
}

const features: Feature[] = [
  {
    id: 'email-campaigns',
    title: 'Email Marketing Campaigns',
    description: 'Create, schedule, and track email marketing campaigns with AI-powered optimization',
    benefits: [
      'Automated A/B testing',
      'Smart send time optimization',
      'Real-time performance tracking',
      'Drag-and-drop email builder'
    ],
    category: 'marketing',
    difficulty: 'beginner',
    estimatedTime: '15 minutes',
    icon: Mail,
    businessTypes: ['startup', 'small_business', 'growing_business', 'medium_business', 'agency'],
    businessSizes: ['micro', 'small', 'medium', 'large'],
    quickStartUrl: '/email-marketing/campaigns/new',
    videoTutorialUrl: '/tutorials/email-campaigns'
  },
  {
    id: 'social-media-automation',
    title: 'Social Media Automation',
    description: 'Connect and manage multiple social platforms with automated posting and engagement tracking',
    benefits: [
      'Multi-platform posting',
      'Content scheduling',
      'Engagement analytics',
      'Hashtag optimization'
    ],
    category: 'marketing',
    difficulty: 'beginner',
    estimatedTime: '20 minutes',
    icon: Share2,
    businessTypes: ['solo_entrepreneur', 'freelancer', 'startup', 'small_business', 'agency'],
    businessSizes: ['solo', 'micro', 'small', 'medium'],
    quickStartUrl: '/social-media',
    videoTutorialUrl: '/tutorials/social-automation'
  },
  {
    id: 'analytics-dashboard',
    title: 'Advanced Analytics Dashboard',
    description: 'Get comprehensive insights into your marketing performance with AI-powered recommendations',
    benefits: [
      'Real-time performance metrics',
      'ROI tracking and optimization',
      'Predictive analytics',
      'Custom report generation'
    ],
    category: 'analytics',
    difficulty: 'intermediate',
    estimatedTime: '25 minutes',
    icon: BarChart3,
    businessTypes: ['growing_business', 'medium_business', 'agency'],
    businessSizes: ['small', 'medium', 'large', 'enterprise'],
    prerequisites: ['Have existing campaigns running'],
    quickStartUrl: '/analytics/performance',
    videoTutorialUrl: '/tutorials/analytics-setup'
  },
  {
    id: 'team-collaboration',
    title: 'Team Collaboration Hub',
    description: 'Manage team members, assign tasks, and collaborate on campaigns in real-time',
    benefits: [
      'Real-time collaboration',
      'Task assignment and tracking',
      'Team performance insights',
      'Live editing and comments'
    ],
    category: 'collaboration',
    difficulty: 'beginner',
    estimatedTime: '10 minutes',
    icon: Users,
    businessTypes: ['startup', 'growing_business', 'medium_business', 'agency'],
    businessSizes: ['micro', 'small', 'medium', 'large', 'enterprise'],
    quickStartUrl: '/collaboration/team',
    videoTutorialUrl: '/tutorials/team-setup'
  },
  {
    id: 'ai-automation',
    title: 'AI-Powered Automation',
    description: 'Set up intelligent workflows that optimize your campaigns automatically',
    benefits: [
      'Automatic budget optimization',
      'Smart audience targeting',
      'Performance-based adjustments',
      'Predictive scaling'
    ],
    category: 'automation',
    difficulty: 'advanced',
    estimatedTime: '45 minutes',
    icon: Zap,
    businessTypes: ['growing_business', 'medium_business', 'agency'],
    businessSizes: ['medium', 'large', 'enterprise'],
    prerequisites: ['Have campaigns with historical data', 'Complete analytics setup'],
    quickStartUrl: '/automation/workflows',
    videoTutorialUrl: '/tutorials/ai-automation'
  },
  {
    id: 'integration-marketplace',
    title: 'Integration Marketplace',
    description: 'Connect with 100+ tools and services to streamline your marketing stack',
    benefits: [
      'CRM integrations',
      'E-commerce platform sync',
      'Custom API connections',
      'Data synchronization'
    ],
    category: 'advanced',
    difficulty: 'intermediate',
    estimatedTime: '30 minutes',
    icon: Globe,
    businessTypes: ['growing_business', 'medium_business', 'agency'],
    businessSizes: ['small', 'medium', 'large', 'enterprise'],
    quickStartUrl: '/integrations/marketplace',
    videoTutorialUrl: '/tutorials/integrations'
  }
];

export default function FeatureDiscoveryPanel({ 
  businessType, 
  businessSize, 
  selectedGoals = [],
  onFeatureSelect,
  onStartQuickTour,
  className = "" 
}: FeatureDiscoveryPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Filter features based on business profile
  const getRecommendedFeatures = (): Feature[] => {
    return features.filter(feature => {
      // Filter by business type
      if (businessType && !feature.businessTypes.includes(businessType)) {
        return false;
      }
      
      // Filter by business size
      if (businessSize && !feature.businessSizes.includes(businessSize)) {
        return false;
      }
      
      // Filter by category
      if (selectedCategory !== 'all' && feature.category !== selectedCategory) {
        return false;
      }
      
      // Filter by difficulty
      if (selectedDifficulty !== 'all' && feature.difficulty !== selectedDifficulty) {
        return false;
      }
      
      return true;
    });
  };

  const recommendedFeatures = getRecommendedFeatures();

  // Get feature priority score based on goals and business profile
  const getFeaturePriority = (feature: Feature): number => {
    let score = 0;
    
    // Goal alignment scoring
    if (selectedGoals.includes('Increase sales and revenue') && feature.category === 'marketing') score += 3;
    if (selectedGoals.includes('Improve marketing effectiveness') && feature.category === 'marketing') score += 3;
    if (selectedGoals.includes('Better data insights') && feature.category === 'analytics') score += 3;
    if (selectedGoals.includes('Enhance team productivity') && feature.category === 'collaboration') score += 3;
    if (selectedGoals.includes('Reduce manual tasks') && feature.category === 'automation') score += 3;
    
    // Business size scoring
    if (businessSize === 'solo' && feature.difficulty === 'beginner') score += 2;
    if (businessSize === 'enterprise' && feature.difficulty === 'advanced') score += 2;
    
    return score;
  };

  const sortedFeatures = recommendedFeatures.sort((a, b) => 
    getFeaturePriority(b) - getFeaturePriority(a)
  );

  const categories = [
    { id: 'all', label: 'All Features', icon: Target },
    { id: 'marketing', label: 'Marketing', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'collaboration', label: 'Collaboration', icon: Users },
    { id: 'automation', label: 'Automation', icon: Zap },
    { id: 'advanced', label: 'Advanced', icon: Settings }
  ];

  const difficulties = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Lightbulb className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Discover Your Perfect Features
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Based on your business profile, here are the features that will help you achieve your goals faster.
          Start with beginner-friendly options and work your way up.
        </p>
        
        {onStartQuickTour && (
          <Button
            onClick={onStartQuickTour}
            variant="outline"
            className="mx-auto"
          >
            <Play className="h-4 w-4 mr-2" />
            Take a Quick Tour
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-1"
              >
                <Icon className="h-3 w-3" />
                <span>{category.label}</span>
              </Button>
            );
          })}
        </div>
        
        <div className="flex gap-2">
          {difficulties.map((difficulty) => (
            <Button
              key={difficulty.id}
              variant={selectedDifficulty === difficulty.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDifficulty(difficulty.id)}
            >
              {difficulty.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Recommended Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {sortedFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const priority = getFeaturePriority(feature);
            
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        {priority > 3 && (
                          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            <Star className="h-3 w-3 mr-1" />
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          feature.difficulty === 'beginner' ? 'border-green-200 text-green-700 dark:border-green-800 dark:text-green-400' :
                          feature.difficulty === 'intermediate' ? 'border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-400' :
                          'border-red-200 text-red-700 dark:border-red-800 dark:text-red-400'
                        }
                      >
                        {feature.difficulty}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </CardTitle>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Benefits */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        Key Benefits
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        {feature.benefits.slice(0, 3).map((benefit, idx) => (
                          <li key={idx} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                        {feature.benefits.length > 3 && (
                          <li className="text-blue-600 dark:text-blue-400 text-xs">
                            +{feature.benefits.length - 3} more benefits
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Time estimate */}
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      Setup time: {feature.estimatedTime}
                    </div>

                    {/* Prerequisites */}
                    {feature.prerequisites && feature.prerequisites.length > 0 && (
                      <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                        <span className="font-medium">Prerequisites:</span> {feature.prerequisites.join(', ')}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => onFeatureSelect?.(feature)}
                        className="flex-1"
                      >
                        Get Started
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                      
                      {feature.videoTutorialUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(feature.videoTutorialUrl, '_blank')}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* No results message */}
      {sortedFeatures.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No features match your current filters
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Try adjusting your category or difficulty level to see more options.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Quick stats */}
      {sortedFeatures.length > 0 && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Showing {sortedFeatures.length} features 
          {businessType && businessSize && (
            <span> personalized for {businessType.replace('_', ' ')} ({businessSize} size)</span>
          )}
        </div>
      )}
    </div>
  );
}