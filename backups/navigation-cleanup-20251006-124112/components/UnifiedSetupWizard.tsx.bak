'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useBusinessConfiguration, BusinessType, BusinessSize } from '@/contexts/BusinessConfigurationContext';
import { useDashboardCustomization } from '@/contexts/DashboardCustomizationContext';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Users, 
  Building, 
  Target, 
  Zap,
  Clock,
  DollarSign,
  CheckCircle,
  Star,
  Rocket,
  User,
  UserPlus,
  Building2,
  Briefcase,
  Lightbulb,
  Map,
  MessageSquare,
  Calendar,
  BarChart3,
  ShoppingCart,
  Brain,
  Settings,
  Globe,
  Palette,
  TrendingUp,
  Shield,
  Home
} from 'lucide-react';

interface UnifiedSetupWizardProps {
  onComplete?: (businessProfile: {
    businessName: string;
    businessType: string;
    businessSize: string;
    industry: string;
    goals: string[];
    selectedPlatforms: string[];
  }) => void;
  onSkip?: () => void;
}

// Business type options
const businessTypeOptions: { value: BusinessType; label: string; icon: any; description: string; }[] = [
  { value: 'solo_entrepreneur', label: 'Solo Entrepreneur', icon: User, description: 'Individual creator, freelancer, or consultant working alone' },
  { value: 'freelancer', label: 'Freelancer', icon: Briefcase, description: 'Independent professional offering specialized services' },
  { value: 'startup', label: 'Startup', icon: Rocket, description: 'Early-stage company building innovative products or services' },
  { value: 'small_business', label: 'Small Business', icon: Building, description: 'Local business serving customers in your community' },
  { value: 'growing_business', label: 'Growing Business', icon: Target, description: 'Established business ready to scale operations' },
  { value: 'medium_business', label: 'Medium Business', icon: Building2, description: 'Mid-size company with multiple departments' },
  { value: 'agency', label: 'Agency', icon: Users, description: 'Service provider managing multiple clients' }
];

// Business size options  
const businessSizeOptions: { value: BusinessSize; label: string; range: string; }[] = [
  { value: 'solo', label: 'Just Me', range: '1 person' },
  { value: 'micro', label: 'Micro Team', range: '2-9 people' },
  { value: 'small', label: 'Small Team', range: '10-49 people' },
  { value: 'medium', label: 'Medium Company', range: '50-249 people' },
  { value: 'large', label: 'Large Company', range: '250-999 people' },
  { value: 'enterprise', label: 'Enterprise', range: '1000+ people' }
];

// Industry options
const industryOptions = [
  'E-commerce & Retail', 'Professional Services', 'Healthcare & Wellness', 'Technology & Software',
  'Education & Training', 'Real Estate', 'Financial Services', 'Food & Beverage',
  'Travel & Hospitality', 'Manufacturing', 'Non-profit', 'Entertainment & Media',
  'Automotive', 'Beauty & Fashion', 'Construction', 'Agriculture', 'Other'
];

// Goal options
const goalOptions = [
  'Increase sales and revenue', 'Improve brand awareness', 'Generate more leads',
  'Streamline operations', 'Improve customer engagement', 'Scale my business',
  'Improve data insights', 'Reduce manual work', 'Better team collaboration',
  'Expand to new markets', 'Improve customer retention', 'Optimize marketing spend'
];

// Platform modules
interface PlatformModule {
  id: string;
  name: string;
  description: string;
  category: 'marketing' | 'operations' | 'analytics' | 'ai' | 'enterprise';
  complexity: 'beginner' | 'intermediate' | 'advanced';
  pricing: 'free' | 'starter' | 'pro' | 'enterprise';
  recommended: boolean;
  icon: React.ComponentType<any>;
  features: string[];
  estimatedSetupTime: string;
}

const availablePlatforms: PlatformModule[] = [
  {
    id: 'marketing-command-center',
    name: 'Marketing Command Center',
    description: 'Unified marketing hub with AI-powered campaign management and analytics',
    category: 'marketing',
    complexity: 'beginner',
    pricing: 'free',
    recommended: true,
    icon: Target,
    features: ['Campaign management', 'Multi-platform integration', 'AI insights', 'Performance tracking'],
    estimatedSetupTime: '15 minutes'
  },
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
    id: 'collaboration',
    name: 'Team Collaboration',
    description: 'Real-time team communication, file sharing, and project coordination',
    category: 'operations',
    complexity: 'beginner',
    pricing: 'starter',
    recommended: false,
    icon: Users,
    features: ['Real-time chat', 'File sharing', 'Video meetings', 'Activity feeds'],
    estimatedSetupTime: '10 minutes'
  },
  {
    id: 'business-intelligence',
    name: 'Business Intelligence',
    description: 'Advanced analytics and insights to drive data-driven decisions',
    category: 'analytics',
    complexity: 'advanced',
    pricing: 'pro',
    recommended: false,
    icon: BarChart3,
    features: ['Custom dashboards', 'Advanced reporting', 'Predictive analytics', 'Data visualization'],
    estimatedSetupTime: '30 minutes'
  },
  {
    id: 'e-commerce',
    name: 'E-commerce Suite',
    description: 'Complete online store management with inventory and order tracking',
    category: 'enterprise',
    complexity: 'intermediate',
    pricing: 'pro',
    recommended: false,
    icon: ShoppingCart,
    features: ['Product catalog', 'Order management', 'Inventory tracking', 'Customer management'],
    estimatedSetupTime: '45 minutes'
  },
  {
    id: 'ai-optimization',
    name: 'AI Optimization',
    description: 'Intelligent performance optimization and automated decision making',
    category: 'ai',
    complexity: 'advanced',
    pricing: 'pro',
    recommended: false,
    icon: Brain,
    features: ['Auto-optimization', 'Performance insights', 'Predictive analytics', 'Smart recommendations'],
    estimatedSetupTime: '25 minutes'
  }
];

// Suite configurations
const suiteConfigurations = [
  {
    id: 'marketing-focused',
    name: 'Marketing Focused',
    description: 'Perfect for businesses focused on growing their marketing reach and sales',
    platforms: ['marketing-command-center', 'social-media', 'email-marketing'],
    bestFor: ['solo_entrepreneur', 'small_business', 'growing_business'],
    complexity: 'beginner',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    estimatedValue: 'Boost marketing ROI',
    setupTime: '40 minutes'
  },
  {
    id: 'operations-focused',
    name: 'Operations Focused',
    description: 'Streamline business operations with project management and team collaboration',
    platforms: ['project-management', 'collaboration', 'business-intelligence'],
    bestFor: ['medium_business', 'agency'],
    complexity: 'intermediate',
    icon: Settings,
    color: 'from-green-500 to-emerald-500',
    estimatedValue: 'Improve efficiency',
    setupTime: '60 minutes'
  },
  {
    id: 'enterprise-suite',
    name: 'Enterprise Suite',
    description: 'Complete business ecosystem with all platforms and advanced features',
    platforms: ['marketing-command-center', 'social-media', 'email-marketing', 'project-management', 'collaboration', 'business-intelligence', 'ai-optimization'],
    bestFor: ['large', 'enterprise'],
    complexity: 'advanced',
    icon: Building,
    color: 'from-purple-500 to-pink-500',
    estimatedValue: 'Transform operations',
    setupTime: '120 minutes'
  }
];

export default function UnifiedSetupWizard({ onComplete, onSkip }: UnifiedSetupWizardProps) {
  const router = useRouter();
  const { updateConfiguration, completeSetup } = useBusinessConfiguration();
  const { updateLayout } = useDashboardCustomization();

  // Form state
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '' as BusinessType,
    businessSize: '' as BusinessSize,
    industry: '',
    goals: [] as string[],
    selectedSuite: '' as string,
    customPlatforms: [] as string[]
  });

  // Platform selection state
  const [viewMode, setViewMode] = useState<'suites' | 'custom'>('suites');

  // Steps
  const steps = [
    'Business Details',
    'Business Type', 
    'Team Size',
    'Industry & Goals',
    'Platform Selection',
    'Final Review'
  ];

  // AI-powered suite recommendation
  const recommendedSuite = useMemo(() => {
    if (formData.businessType === 'solo_entrepreneur' || formData.businessType === 'freelancer') {
      return 'marketing-focused';
    }
    if (formData.goals.includes('Increase sales and revenue')) {
      return 'marketing-focused';
    }
    if (formData.goals.includes('Streamline operations')) {
      return 'operations-focused';
    }
    if (formData.businessSize === 'enterprise' || formData.businessSize === 'large') {
      return 'enterprise-suite';
    }
    return 'marketing-focused';
  }, [formData.businessType, formData.businessSize, formData.goals]);

  // Get recommended platforms based on business profile
  const recommendedPlatforms = useMemo(() => {
    const recommendations: string[] = ['marketing-command-center']; // Always include marketing hub
    
    if (formData.goals.includes('Increase sales and revenue')) {
      recommendations.push('social-media', 'email-marketing');
    }
    
    if (formData.businessSize !== 'solo') {
      recommendations.push('collaboration');
    }
    
    if (formData.goals.includes('Improve data insights')) {
      recommendations.push('business-intelligence');
    }
    
    if (formData.industry.includes('E-commerce')) {
      recommendations.push('e-commerce');
    }
    
    return [...new Set(recommendations)];
  }, [formData]);

  // Auto-select recommended suite when user reaches platform selection
  useEffect(() => {
    if (currentStep === 4 && !formData.selectedSuite && recommendedSuite) {
      setFormData(prev => ({ ...prev, selectedSuite: recommendedSuite }));
    }
  }, [currentStep, recommendedSuite, formData.selectedSuite]);

  // Navigation functions
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSuiteSelection = (suiteId: string) => {
    setFormData(prev => ({ ...prev, selectedSuite: suiteId }));
    if (suiteId === 'custom-suite') {
      setViewMode('custom');
      setFormData(prev => ({ ...prev, customPlatforms: recommendedPlatforms }));
    } else {
      setViewMode('suites');
    }
  };

  const handlePlatformToggle = (platformId: string) => {
    setFormData(prev => ({
      ...prev,
      customPlatforms: prev.customPlatforms.includes(platformId)
        ? prev.customPlatforms.filter(id => id !== platformId)
        : [...prev.customPlatforms, platformId]
    }));
  };

  const getSelectedPlatforms = () => {
    if (formData.selectedSuite === 'custom-suite') {
      return formData.customPlatforms;
    }
    
    const suite = suiteConfigurations.find(s => s.id === formData.selectedSuite);
    if (!suite) return ['marketing-command-center']; // Fallback
    
    return suite.platforms;
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called');
    setIsSubmitting(true);
    
    try {
      const selectedPlatforms = getSelectedPlatforms();
      console.log('Selected platforms:', selectedPlatforms);
      
      // Update business configuration
      updateConfiguration({
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessSize: formData.businessSize,
        industry: formData.industry,
        goals: formData.goals,
        selectedPlatforms,
        setupComplete: true,
        automationLevel: formData.businessSize === 'solo' ? 'basic' : 
                        formData.businessSize === 'enterprise' ? 'advanced' : 'intermediate'
      });

      // Update dashboard customization
      updateLayout({
        theme: 'modern',
        layout: formData.businessSize === 'solo' ? 'minimal' : 'comprehensive',
        enabledModules: selectedPlatforms
      });

      completeSetup();
      
      // Create business profile data
      const businessProfileData = {
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessSize: formData.businessSize,
        industry: formData.industry,
        goals: formData.goals,
        selectedPlatforms
      };
      
      console.log('Business profile data:', businessProfileData);
      
      // Store in localStorage for persistence
      localStorage.setItem('businessProfile', JSON.stringify(businessProfileData));
      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('onboardingTimestamp', new Date().toISOString());
      
      // Call onComplete callback if provided
      console.log('Calling onComplete callback...');
      onComplete?.(businessProfileData);
      
      // Navigate to dashboard
      console.log('Navigating to dashboard...');
      router.push('/dashboard?onboarding=complete&welcome=true');
    } catch (error) {
      console.error('Failed to complete setup:', error);
      // Show error to user
      alert('Setup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation functions
  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.businessName.trim().length > 0;
      case 1: return Boolean(formData.businessType);
      case 2: return Boolean(formData.businessSize);
      case 3: return formData.industry !== '' && formData.goals.length > 0;
      case 4: return formData.selectedSuite !== '' && 
                     (formData.selectedSuite !== 'custom-suite' || formData.customPlatforms.length > 0);
      case 5: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome to PulseBridge.ai
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Let's customize your business command center in just a few minutes
          </p>
          
          {/* Progress indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-2">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-1 mx-2 ${
                      index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-2">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          <AnimatePresence mode="wait">
            {/* Step 0: Business Details */}
            {currentStep === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Tell us about your business
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    This helps us personalize your experience
                  </p>
                </div>

                <div className="max-w-md mx-auto">
                  <Label htmlFor="businessName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Business Name *
                  </Label>
                  <Input
                    id="businessName"
                    placeholder="Enter your business name"
                    value={formData.businessName}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 1: Business Type */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    What type of business is {formData.businessName}?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    This helps us suggest the right tools for you
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {businessTypeOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`cursor-pointer p-4 border rounded-lg transition-all hover:shadow-md ${
                        formData.businessType === option.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, businessType: option.value }))}
                    >
                      <div className="flex items-center gap-3">
                        <option.icon className="w-6 h-6 text-blue-600" />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {option.label}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Team Size */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    How big is your team?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    We'll customize features based on your team size
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {businessSizeOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`cursor-pointer p-4 border rounded-lg transition-all hover:shadow-md text-center ${
                        formData.businessSize === option.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, businessSize: option.value }))}
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {option.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {option.range}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Industry & Goals */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Tell us more about your business
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    This helps us recommend the perfect platform combination
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Industry Selection */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                      What industry are you in? *
                    </Label>
                    <div className="grid md:grid-cols-3 gap-3">
                      {industryOptions.map((industry) => (
                        <div
                          key={industry}
                          className={`cursor-pointer p-3 border rounded-lg text-center transition-all hover:shadow-sm ${
                            formData.industry === industry
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, industry }))}
                        >
                          <span className="text-sm font-medium">{industry}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Goals Selection */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                      What are your main goals? (Select all that apply) *
                    </Label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {goalOptions.map((goal) => (
                        <div
                          key={goal}
                          className={`cursor-pointer p-3 border rounded-lg transition-all hover:shadow-sm ${
                            formData.goals.includes(goal)
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              goals: prev.goals.includes(goal)
                                ? prev.goals.filter(g => g !== goal)
                                : [...prev.goals, goal]
                            }));
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle 
                              className={`w-4 h-4 ${
                                formData.goals.includes(goal) ? 'text-blue-600' : 'text-gray-300'
                              }`} 
                            />
                            <span className="text-sm">{goal}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Platform Selection */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Choose Your Platform Suite
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Based on your profile, we recommend the <strong>{suiteConfigurations.find(s => s.id === recommendedSuite)?.name}</strong> suite
                  </p>
                </div>

                {/* Suite/Custom Toggle */}
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

                {/* Suite Selection */}
                {viewMode === 'suites' && (
                  <div className="space-y-4">
                    {/* Recommended Suite Highlight */}
                    <Card className="border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Star className="w-6 h-6 text-blue-500" />
                          <CardTitle className="text-blue-700 dark:text-blue-300">
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
                              isSelected={formData.selectedSuite === suite.id}
                              isRecommended={true}
                              onSelect={() => handleSuiteSelection(suite.id)}
                            />
                          ))}
                      </CardContent>
                    </Card>

                    {/* Other Suites */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {suiteConfigurations
                        .filter(suite => suite.id !== recommendedSuite)
                        .map(suite => (
                          <SuiteCard
                            key={suite.id}
                            suite={suite}
                            isSelected={formData.selectedSuite === suite.id}
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
                            formData.selectedSuite === 'custom-suite' ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
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
                              {formData.selectedSuite === 'custom-suite' && <CheckCircle className="w-6 h-6 text-blue-500" />}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                              Hand-pick the exact platforms you need for your business
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                )}

                {/* Custom Platform Selection */}
                {viewMode === 'custom' && (
                  <div className="space-y-6">
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
                              isSelected={formData.customPlatforms.includes(platform.id)}
                              isRecommended={recommendedPlatforms.includes(platform.id)}
                              onToggle={() => handlePlatformToggle(platform.id)}
                            />
                          ))}
                        </div>
                        
                        {formData.customPlatforms.length > 0 && (
                          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <h4 className="font-medium mb-2">Selected Platforms ({formData.customPlatforms.length})</h4>
                            <div className="flex flex-wrap gap-2">
                              {formData.customPlatforms.map(platformId => {
                                const platform = availablePlatforms.find(p => p.id === platformId);
                                return platform ? (
                                  <Badge key={platformId} variant="default" className="text-sm">
                                    {platform.name}
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 5: Final Review */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ready to launch your command center!</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Review your setup and launch your personalized PulseBridge.ai platform
                  </p>
                </div>

                {/* Review Summary */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Setup Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Business Details</h4>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          <li><strong className="text-gray-900 dark:text-white">Name:</strong> {formData.businessName}</li>
                          <li><strong className="text-gray-900 dark:text-white">Type:</strong> {businessTypeOptions.find(o => o.value === formData.businessType)?.label}</li>
                          <li><strong className="text-gray-900 dark:text-white">Size:</strong> {businessSizeOptions.find(o => o.value === formData.businessSize)?.label}</li>
                          <li><strong className="text-gray-900 dark:text-white">Industry:</strong> {formData.industry}</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Selected Platforms</h4>
                        <div className="flex flex-wrap gap-2">
                          {getSelectedPlatforms().map(platformId => {
                            const platform = availablePlatforms.find(p => p.id === platformId);
                            return platform ? (
                              <Badge key={platformId} className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
                                {platform.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Primary Goals</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.goals.map(goal => (
                          <Badge key={goal} className="text-sm bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200">
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-800/30 dark:to-indigo-800/30 border border-blue-200 dark:border-blue-700 rounded-lg mb-6">
                    <Rocket className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      🎉 Your personalized business platform is ready!
                    </h3>
                    <p className="text-gray-700 dark:text-gray-200">
                      We've configured everything based on your preferences. You can always customize further from your dashboard.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <div>
              {currentStep > 0 && (
                <Button variant="outline" onClick={handleBack} className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
            </div>
            
            <div className="flex gap-3">
              {currentStep < steps.length - 1 && (
                <Button variant="outline" onClick={onSkip} className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200">
                  Skip Setup
                </Button>
              )}
              
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext} disabled={!canProceed()} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="button"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    console.log('Launch button clicked, submitting...');
                    handleSubmit();
                  }}
                  disabled={isSubmitting || !canProceed()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      Launch My Command Center
                      <Rocket className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
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
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
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
                  <Badge className="mt-1 bg-blue-100 text-blue-800 dark:bg-blue-800/60 dark:text-blue-200">
                    Recommended
                  </Badge>
                )}
              </div>
            </div>
            {isSelected && <CheckCircle className="w-6 h-6 text-blue-500" />}
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
                {suite.platforms.slice(0, 3).map((platformId: string) => {
                  const platform = availablePlatforms.find(p => p.id === platformId);
                  return platform ? (
                    <Badge key={platformId} variant="outline" className="text-xs">
                      {platform.name}
                    </Badge>
                  ) : null;
                })}
                {suite.platforms.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{suite.platforms.length - 3} more
                  </Badge>
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
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <platform.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <CardTitle className="text-base">{platform.name}</CardTitle>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    {platform.pricing}
                  </Badge>
                  {isRecommended && (
                    <Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-800/60 dark:text-blue-200">
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