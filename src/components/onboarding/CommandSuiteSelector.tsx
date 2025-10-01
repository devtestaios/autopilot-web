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

  // Auto-select the recommended suite when component loads
  useEffect(() => {
    if (!selectedSuite && recommendedSuite) {
      setSelectedSuite(recommendedSuite);
    }
  }, [recommendedSuite, selectedSuite]);

  const handleSuiteSelection = (suiteId: string) => {
    setSelectedSuite(suiteId);
  };

  const getSelectedPlatforms = () => {
    const suite = suiteConfigurations.find(s => s.id === selectedSuite);
    if (!suite) return ['social-media', 'email-marketing']; // Default platforms
    
    if (suite.platforms.includes('all')) {
      return ['social-media', 'email-marketing', 'project-management', 'business-intelligence', 'marketing-command-center', 'collaboration'];
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
          we've curated the perfect platform combination to achieve your goals.
        </p>
      </motion.div>

      {/* Suite Selection */}
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
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Business Setup
        </Button>
        
        <div className="flex flex-col items-end">
          {selectedSuite && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Selected: {suiteConfigurations.find(s => s.id === selectedSuite)?.name || 'Custom Suite'}
            </p>
          )}
          <Button 
            onClick={handleComplete}
            disabled={!selectedSuite}
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
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Estimated Value:</span>
              <div className="text-green-600 dark:text-green-400">{suite.estimatedValue}</div>
            </div>
            <div>
              <span className="font-medium">Setup Time:</span>
              <div className="text-gray-600 dark:text-gray-400">{suite.setupTime}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}