'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Users, 
  Building, 
  Target, 
  Zap,
  CheckCircle,
  Star,
  BarChart3,
  MessageSquare,
  Calendar,
  ShoppingCart,
  Brain,
  Settings,
  Globe,
  Palette,
  TrendingUp,
  Shield
} from 'lucide-react';

interface PlatformModule {
  id: string;
  name: string;
  description: string;
  category: 'marketing' | 'operations' | 'analytics' | 'ai' | 'enterprise';
  complexity: 'beginner' | 'intermediate' | 'advanced';
  pricing: 'free' | 'starter' | 'pro' | 'enterprise';
  recommended: boolean;
  dependencies?: string[];
  icon: React.ComponentType<any>;
  features: string[];
  estimatedSetupTime: string;
}

interface BusinessProfile {
  businessName: string;
  businessType: string;
  businessSize: string;
  industry: string;
  goals: string[];
}

interface CommandSuiteSelectorProps {
  businessProfile: BusinessProfile;
  onSelectionComplete: (selectedPlatforms: string[]) => void;
  onBack: () => void;
}

// Available platform modules
const availablePlatforms: PlatformModule[] = [
  {
    id: 'social-media',
    name: 'Social Media Management',
    description: 'Manage all your social platforms from one place with AI-powered content creation',
    category: 'marketing',
    complexity: 'beginner',
    pricing: 'free',
    recommended: true,
    icon: MessageSquare,
    features: ['Multi-platform posting', 'Content scheduling', 'Analytics', 'AI content generation'],
    estimatedSetupTime: '10 minutes'
  },
  {
    id: 'email-marketing',
    name: 'Email Marketing',
    description: 'Automated email campaigns with advanced segmentation and personalization',
    category: 'marketing',
    complexity: 'beginner',
    pricing: 'starter',
    recommended: true,
    icon: Target,
    features: ['Campaign automation', 'Subscriber segmentation', 'A/B testing', 'Performance tracking'],
    estimatedSetupTime: '15 minutes'
  },
  {
    id: 'project-management',
    name: 'Project Management',
    description: 'Kanban boards, task management, and team collaboration tools',
    category: 'operations',
    complexity: 'intermediate',
    pricing: 'starter',
    recommended: false,
    icon: Calendar,
    features: ['Kanban boards', 'Task assignments', 'Time tracking', 'Team collaboration'],
    estimatedSetupTime: '20 minutes'
  },
  {
    id: 'business-intelligence',
    name: 'Business Intelligence',
    description: 'Advanced analytics and insights to drive data-driven decisions',
    category: 'analytics',
    complexity: 'intermediate',
    pricing: 'pro',
    recommended: false,
    icon: BarChart3,
    features: ['Custom dashboards', 'KPI tracking', 'Predictive analytics', 'Reporting'],
    estimatedSetupTime: '25 minutes'
  },
  {
    id: 'collaboration',
    name: 'Team Collaboration',
    description: 'Real-time collaboration with live cursors, comments, and presence tracking',
    category: 'operations',
    complexity: 'beginner',
    pricing: 'free',
    recommended: false,
    icon: Users,
    features: ['Live collaboration', 'Real-time comments', 'Presence tracking', 'File sharing'],
    estimatedSetupTime: '5 minutes'
  },
  {
    id: 'ai-automation',
    name: 'AI Automation',
    description: 'Intelligent workflow automation and AI-powered business optimization',
    category: 'ai',
    complexity: 'advanced',
    pricing: 'pro',
    recommended: false,
    icon: Brain,
    features: ['Workflow automation', 'AI insights', 'Predictive modeling', 'Smart notifications'],
    estimatedSetupTime: '30 minutes'
  },
  {
    id: 'e-commerce',
    name: 'E-commerce Platform',
    description: 'Complete online store management with inventory and order tracking',
    category: 'enterprise',
    complexity: 'intermediate',
    pricing: 'pro',
    recommended: false,
    icon: ShoppingCart,
    features: ['Product catalog', 'Order management', 'Inventory tracking', 'Payment processing'],
    estimatedSetupTime: '45 minutes'
  },
  {
    id: 'marketing-command-center',
    name: 'Marketing Command Center',
    description: 'Unified marketing hub combining campaigns, analytics, and optimization',
    category: 'marketing',
    complexity: 'intermediate',
    pricing: 'starter',
    recommended: true,
    icon: Zap,
    features: ['Campaign management', 'Cross-platform analytics', 'Budget optimization', 'ROI tracking'],
    estimatedSetupTime: '20 minutes'
  }
];

// Pre-configured suites
const suiteConfigurations = [
  {
    id: 'marketing-focused',
    name: 'Marketing Command Suite',
    description: 'Perfect for businesses focused on growth and customer acquisition',
    platforms: ['social-media', 'email-marketing', 'marketing-command-center'],
    bestFor: ['startup', 'small_business', 'agency'],
    complexity: 'beginner',
    icon: Target,
    color: 'from-pink-500 to-purple-500',
    estimatedValue: 'Increase leads by 40%',
    setupTime: '35 minutes'
  },
  {
    id: 'operations-focused', 
    name: 'Operations Command Suite',
    description: 'Streamline workflows and boost team productivity',
    platforms: ['project-management', 'collaboration', 'business-intelligence'],
    bestFor: ['growing_business', 'medium_business', 'agency'],
    complexity: 'intermediate',
    icon: Settings,
    color: 'from-green-500 to-blue-500',
    estimatedValue: 'Save 15 hours per week',
    setupTime: '50 minutes'
  },
  {
    id: 'analytics-focused',
    name: 'Analytics Command Suite',
    description: 'Data-driven insights and intelligent business optimization',
    platforms: ['business-intelligence', 'ai-automation', 'marketing-command-center'],
    bestFor: ['medium_business', 'enterprise'],
    complexity: 'advanced',
    icon: TrendingUp,
    color: 'from-blue-500 to-indigo-500',
    estimatedValue: 'Improve ROI by 25%',
    setupTime: '75 minutes'
  },
  {
    id: 'enterprise-suite',
    name: 'Enterprise Command Suite', 
    description: 'Complete business ecosystem with all platforms and advanced features',
    platforms: ['all'],
    bestFor: ['enterprise'],
    complexity: 'advanced',
    icon: Building,
    color: 'from-purple-500 to-pink-500',
    estimatedValue: 'Transform operations',
    setupTime: '120 minutes'
  }
];

export default function CommandSuiteSelector({ 
  businessProfile, 
  onSelectionComplete, 
  onBack 
}: CommandSuiteSelectorProps) {
  const [selectedSuite, setSelectedSuite] = useState<string | null>(null);
  const [customPlatforms, setCustomPlatforms] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'suites' | 'custom'>('suites');

  // AI-powered suite recommendation based on business profile
  const recommendedSuite = useMemo(() => {
    if (businessProfile.businessType === 'solo_entrepreneur' || businessProfile.businessType === 'freelancer') {
      return 'marketing-focused';
    }
    if (businessProfile.goals.includes('Increase sales and revenue')) {
      return 'marketing-focused';
    }
    if (businessProfile.goals.includes('Streamline operations')) {
      return 'operations-focused';
    }
    if (businessProfile.businessSize === 'enterprise' || businessProfile.businessSize === 'large') {
      return 'enterprise-suite';
    }
    return 'marketing-focused'; // Default recommendation
  }, [businessProfile]);

  // Get recommended platforms based on business profile
  const recommendedPlatforms = useMemo(() => {
    const recommendations: string[] = [];
    
    // Always recommend social media for marketing goals
    if (businessProfile.goals.includes('Increase sales and revenue')) {
      recommendations.push('social-media', 'marketing-command-center');
    }
    
    // Recommend collaboration for team-based businesses
    if (businessProfile.businessSize !== 'solo') {
      recommendations.push('collaboration');
    }
    
    // Recommend analytics for data-driven goals
    if (businessProfile.goals.includes('Improve data insights')) {
      recommendations.push('business-intelligence');
    }
    
    // Industry-specific recommendations
    if (businessProfile.industry.includes('E-commerce')) {
      recommendations.push('e-commerce');
    }
    
    return [...new Set(recommendations)]; // Remove duplicates
  }, [businessProfile]);

  // Auto-select the recommended suite when component loads
  useEffect(() => {
    if (!selectedSuite && recommendedSuite) {
      setSelectedSuite(recommendedSuite);
    }
  }, [recommendedSuite, selectedSuite]);

  const handleSuiteSelection = (suiteId: string) => {
    setSelectedSuite(suiteId);
    if (suiteId === 'custom-suite') {
      setViewMode('custom');
      setCustomPlatforms(recommendedPlatforms);
    } else {
      setViewMode('suites');
    }
  };

  const handlePlatformToggle = (platformId: string) => {
    setCustomPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const getSelectedPlatforms = () => {
    if (selectedSuite === 'custom-suite') {
      return customPlatforms;
    }
    
    const suite = suiteConfigurations.find(s => s.id === selectedSuite);
    if (!suite) return [];
    
    if (suite.platforms.includes('all')) {
      return availablePlatforms.map(p => p.id);
    }
    
    return suite.platforms;
  };

  const handleComplete = () => {
    const selectedPlatforms = getSelectedPlatforms();
    onSelectionComplete(selectedPlatforms);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="p-4 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 w-20 h-20 mx-auto mb-6">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Customize Your Command Suite
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
          Based on your business profile as a <strong>{businessProfile.businessType.replace('_', ' ')}</strong> in <strong>{businessProfile.industry}</strong>, 
          we've curated the perfect platform combination to achieve your goals. You can customize this selection anytime.
        </p>
        
        <div className="flex justify-center gap-2 mb-8">
          <Button
            variant={viewMode === 'suites' ? 'default' : 'outline'}
            onClick={() => setViewMode('suites')}
            className="min-w-[120px]"
          >
            Recommended Suites
          </Button>
          <Button
            variant={viewMode === 'custom' ? 'default' : 'outline'}
            onClick={() => setViewMode('custom')}
            className="min-w-[120px]"
          >
            Custom Selection
          </Button>
        </div>
      </motion.div>

      {/* Suite Selection View */}
      {viewMode === 'suites' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Recommended Suite Highlight */}
          <Card className="border-2 border-teal-500 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-teal-500" />
                <CardTitle className="text-teal-700 dark:text-teal-300">
                  Recommended for Your Business
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {suiteConfigurations
                .filter(suite => suite.id === recommendedSuite)
                .map(suite => (
                  <SuiteCard
                    key={suite.id}
                    suite={suite}
                    isSelected={selectedSuite === suite.id}
                    isRecommended={true}
                    onSelect={() => handleSuiteSelection(suite.id)}
                  />
                ))}
            </CardContent>
          </Card>

          {/* Other Suite Options */}
          <div className="grid md:grid-cols-2 gap-6">
            {suiteConfigurations
              .filter(suite => suite.id !== recommendedSuite)
              .map(suite => (
                <SuiteCard
                  key={suite.id}
                  suite={suite}
                  isSelected={selectedSuite === suite.id}
                  isRecommended={false}
                  onSelect={() => handleSuiteSelection(suite.id)}
                />
              ))}
            
            {/* Custom Suite Option */}
            <div 
              className="cursor-pointer transition-all hover:shadow-lg"
              onClick={() => handleSuiteSelection('custom-suite')}
            >
              <Card 
                className={`${
                  selectedSuite === 'custom-suite' ? 'ring-2 ring-teal-500 bg-teal-50 dark:bg-teal-900/20' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 text-white">
                        <Settings className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Custom Suite</CardTitle>
                        <Badge className="mt-1 bg-gray-100 text-gray-700">
                          Choose Your Own
                        </Badge>
                      </div>
                    </div>
                    {selectedSuite === 'custom-suite' && <CheckCircle className="w-6 h-6 text-teal-500" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Hand-pick the exact platforms you need for your business
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Flexibility:</span>
                      <div className="text-blue-600 dark:text-blue-400">Complete Control</div>
                    </div>
                    <div>
                      <span className="font-medium">Setup Time:</span>
                      <div className="text-gray-600 dark:text-gray-400">Variable</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      )}

      {/* Custom Platform Selection View */}
      {viewMode === 'custom' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Choose Your Platforms
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Select the platforms that best fit your business needs. You can always add or remove platforms later.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availablePlatforms.map(platform => (
                  <PlatformCard
                    key={platform.id}
                    platform={platform}
                    isSelected={customPlatforms.includes(platform.id)}
                    isRecommended={recommendedPlatforms.includes(platform.id)}
                    onToggle={() => handlePlatformToggle(platform.id)}
                  />
                ))}
              </div>
              
              {customPlatforms.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium mb-2">Selected Platforms ({customPlatforms.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {customPlatforms.map(platformId => {
                      const platform = availablePlatforms.find(p => p.id === platformId);
                      return platform ? (
                        <Badge key={platformId} variant="default" className="text-sm">
                          {platform.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Total setup time: {calculateTotalSetupTime(customPlatforms)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Business Setup
        </Button>
        
        <div className="flex flex-col items-end">
          {selectedSuite && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Selected: {selectedSuite === 'custom-suite' ? 
                `Custom Suite (${customPlatforms.length} platforms)` :
                suiteConfigurations.find(s => s.id === selectedSuite)?.name || 'Custom Suite'
              }
            </p>
          )}
          <Button 
            onClick={handleComplete}
            disabled={!selectedSuite && (viewMode === 'custom' && customPlatforms.length === 0)}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
          >
            Complete Setup & Launch Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Suite Card Component
function SuiteCard({ suite, isSelected, isRecommended, onSelect }: {
  suite: any;
  isSelected: boolean;
  isRecommended: boolean;
  onSelect: () => void;
}) {
  return (
    <div 
      className="cursor-pointer transition-all hover:shadow-lg"
      onClick={onSelect}
    >
      <Card 
        className={`${
          isSelected ? 'ring-2 ring-teal-500 bg-teal-50 dark:bg-teal-900/20' : ''
        }`}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${suite.color} text-white`}>
                <suite.icon className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{suite.name}</CardTitle>
                {isRecommended && (
                  <Badge className="mt-1 bg-teal-100 text-teal-700">
                    Recommended
                  </Badge>
                )}
              </div>
            </div>
            {isSelected && <CheckCircle className="w-6 h-6 text-teal-500" />}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {suite.description}
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Estimated Value:</span>
              <span className="text-green-600 font-semibold">{suite.estimatedValue}</span>
            </div>
            
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Includes:</p>
              <div className="flex flex-wrap gap-1">
                {suite.platforms.filter((p: string) => p !== 'all').slice(0, 3).map((platformId: string) => {
                  const platform = availablePlatforms.find(p => p.id === platformId);
                  return platform ? (
                    <Badge key={platformId} variant="outline" className="text-xs">
                      {platform.name}
                    </Badge>
                  ) : null;
                })}
                {suite.platforms.includes('all') && (
                  <Badge variant="outline" className="text-xs">All Platforms</Badge>
                )}
              </div>
            </div>
            
            <div className="text-xs text-gray-500 border-t pt-2">
              Setup time: {suite.setupTime} • {suite.complexity} level
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Platform Card Component
function PlatformCard({ platform, isSelected, isRecommended, onToggle }: {
  platform: PlatformModule;
  isSelected: boolean;
  isRecommended: boolean;
  onToggle: () => void;
}) {
  return (
    <div 
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={onToggle}
    >
      <Card 
        className={`${
          isSelected ? 'ring-2 ring-teal-500 bg-teal-50 dark:bg-teal-900/20' : ''
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <platform.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <CardTitle className="text-base">{platform.name}</CardTitle>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {platform.pricing}
                  </Badge>
                  {isRecommended && (
                    <Badge className="text-xs bg-teal-100 text-teal-700">
                      Recommended
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Checkbox checked={isSelected} onChange={() => {}} />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            {platform.description}
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Setup time: {platform.estimatedSetupTime}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Utility function to calculate total setup time
function calculateTotalSetupTime(platformIds: string[]): string {
  const totalMinutes = platformIds.reduce((total, id) => {
    const platform = availablePlatforms.find(p => p.id === id);
    if (!platform) return total;
    
    const timeStr = platform.estimatedSetupTime;
    const minutes = parseInt(timeStr);
    return total + (isNaN(minutes) ? 15 : minutes); // Default 15 minutes if parsing fails
  }, 0);
  
  if (totalMinutes < 60) {
    return `${totalMinutes} minutes`;
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
  }
}