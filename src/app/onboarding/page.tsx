'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import NavigationTabs from '@/components/NavigationTabs';
import BusinessSetupWizard from '@/components/BusinessSetupWizard';
import CommandSuiteSelector from '@/components/onboarding/CommandSuiteSelector';
import RoleBasedLanding from '@/components/onboarding/RoleBasedLanding';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  BarChart3,
  Zap,
  Clock,
  TrendingUp,
  Shield,
  User,
  Building,
  Users,
  Briefcase
} from 'lucide-react';

interface BusinessProfile {
  businessName: string;
  businessType: string;
  businessSize: string;
  industry: string;
  goals: string[];
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
}

function OnboardingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const step = searchParams?.get('step') || 'welcome';
  const [currentStep, setCurrentStep] = useState(step);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);

  const onboardingSteps: OnboardingStep[] = [
    { id: 'welcome', title: 'Welcome', description: 'Get started with PulseBridge.ai' },
    { id: 'role-discovery', title: 'Role Discovery', description: 'Find your perfect path' },
    { id: 'business-setup', title: 'Business Setup', description: 'Tell us about your business' },
    { id: 'command-suite', title: 'Command Suite', description: 'Choose your platforms' },
    { id: 'complete', title: 'Complete', description: 'All set up!' }
  ];

  useEffect(() => {
    if (step === 'welcome') {
      setCurrentStep('welcome');
    }
  }, [step]);

  const handleSetupComplete = (businessProfileData: {
    businessName: string;
    businessType: string;
    businessSize: string;
    industry: string;
    goals: string[];
    selectedPlatforms: string[];
  }) => {
    try {
      // Use the actual business profile data from the wizard
      const businessData: BusinessProfile = {
        businessName: businessProfileData.businessName,
        businessType: businessProfileData.businessType,
        businessSize: businessProfileData.businessSize,
        industry: businessProfileData.industry,
        goals: businessProfileData.goals
      };
      
      setBusinessProfile(businessData);
      setCompletedSteps(prev => [...prev, 'business-setup']);
      
      // Store the business profile data immediately
      localStorage.setItem('businessProfile', JSON.stringify(businessData));
      localStorage.setItem('selectedPlatforms', JSON.stringify(businessProfileData.selectedPlatforms));
      localStorage.setItem('businessSetupComplete', 'true');
      localStorage.setItem('setupTimestamp', new Date().toISOString());
      
      // Show success and move to next step
      setCurrentStep('command-suite');
    } catch (error) {
      console.error('Failed to save business profile:', error);
      // You could add a toast notification here
    }
  };

  const handleCommandSuiteComplete = (selectedPlatforms: string[]) => {
    try {
      setCompletedSteps(prev => [...prev, 'command-suite']);
      
      // Store all onboarding data with validation
      const onboardingData = {
        selectedPlatforms,
        businessProfile,
        onboardingComplete: true,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      localStorage.setItem('selectedPlatforms', JSON.stringify(selectedPlatforms));
      localStorage.setItem('businessProfile', JSON.stringify(businessProfile));
      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('onboardingTimestamp', new Date().toISOString());
      localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
      
      // Navigate to dashboard with welcome flow
      router.push('/dashboard?onboarding=complete&welcome=true');
    } catch (error) {
      console.error('Failed to complete command suite setup:', error);
      // Fallback: still navigate but with minimal data
      router.push('/dashboard?onboarding=error');
    }
  };

  const handleSetupSkip = () => {
    // Store minimal data for skip flow
    localStorage.setItem('onboardingSkipped', 'true');
    localStorage.setItem('onboardingTimestamp', new Date().toISOString());
    router.push('/dashboard?onboarding=skipped');
  };

  const handleStartSetup = () => {
    setCurrentStep('role-discovery');
    setCompletedSteps(prev => [...prev, 'welcome']);
  };

  const handleRoleDiscoveryComplete = () => {
    setCurrentStep('business-setup');
    setCompletedSteps(prev => [...prev, 'role-discovery']);
  };

  const handleBackToBusinessSetup = () => {
    setCurrentStep('business-setup');
  };

  // Welcome step for new users coming from signup
  if (currentStep === 'welcome') {
    const benefits = [
      {
        icon: Target,
        title: 'Personalized Dashboard',
        description: 'Get a custom dashboard tailored to your specific business needs and industry',
        color: 'from-pink-500 to-purple-500'
      },
      {
        icon: BarChart3,
        title: 'Smart Analytics',
        description: 'AI-powered insights that help you make data-driven decisions for your business',
        color: 'from-blue-500 to-cyan-500'
      },
      {
        icon: Zap,
        title: 'Automated Workflows',
        description: 'Set up intelligent automation that saves time and reduces manual work',
        color: 'from-green-500 to-emerald-500'
      }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <NavigationTabs />
        
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="mb-8">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="p-4 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 w-20 h-20 mx-auto mb-6"
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to Your
                <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  {' '}Business Command Center
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Congratulations! Your account has been created successfully. 
                Now let's set up your personalized AI-powered business dashboard in just a few steps.
              </p>
            </div>

            {/* Enhanced Benefits Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid md:grid-cols-3 gap-6 mb-8"
            >
              {benefits.map((benefit, index) => (
                <Card key={benefit.title} className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <CardContent className="p-6 text-center">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${benefit.color} w-16 h-16 mx-auto mb-4`}>
                      <benefit.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            {/* Setup Process Preview */}
            <Card className="mb-8 text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-600" />
                  Quick Setup Process (3-5 minutes)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {onboardingSteps.slice(1, -1).map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-teal-600">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Button 
                size="lg" 
                onClick={handleStartSetup}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-3 text-lg"
              >
                Start Business Setup
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You can always customize these settings later in your account preferences
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Role Discovery Step
  if (currentStep === 'role-discovery') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavigationTabs />
        
        <div className="container mx-auto px-4 py-8">
          {/* Progress Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Step 2 of 4 • Role Discovery
              </span>
              <button
                onClick={() => setCurrentStep('business-setup')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Skip this step
              </button>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full w-2/4"></div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <User className="h-6 w-6 text-teal-600" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Find Your Perfect Path
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Choose the path that best describes your business to get personalized recommendations and setup guides.
            </p>
          </motion.div>

          <RoleBasedLanding
            onRouteSelect={(route) => {
              console.log('Selected route:', route.title);
              // Store the selected route preference
              localStorage.setItem('selectedRoute', JSON.stringify(route));
              handleRoleDiscoveryComplete();
            }}
            className="max-w-6xl mx-auto"
          />

          {/* Navigation */}
          <div className="max-w-4xl mx-auto mt-12 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep('welcome')}
              className="flex items-center space-x-2"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              <span>Back</span>
            </Button>
            
            <Button
              onClick={handleRoleDiscoveryComplete}
              className="flex items-center space-x-2"
            >
              <span>Continue to Business Setup</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Command Suite Selection Step
  if (currentStep === 'command-suite' && businessProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavigationTabs />
        
        <div className="container mx-auto px-4 py-8">
          {/* Progress Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Setup Progress
              </span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {Math.round(((completedSteps.length + 1) / onboardingSteps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full"
                initial={{ width: `${(completedSteps.length / onboardingSteps.length) * 100}%` }}
                animate={{ 
                  width: `${((completedSteps.length + 1) / onboardingSteps.length) * 100}%` 
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <CommandSuiteSelector
            businessProfile={businessProfile || {
              businessName: 'My Business',
              businessType: 'startup',
              businessSize: 'small',
              industry: 'general',
              goals: []
            }}
            onSelectionComplete={handleCommandSuiteComplete}
            onBack={handleBackToBusinessSetup}
          />
        </div>
      </div>
    );
  }

  // Business Setup Step
  if (currentStep === 'business-setup') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavigationTabs />
        
        <div className="container mx-auto px-4 py-8">
          {/* Progress Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Step 3 of 5 • Business Setup
              </span>
              <button
                onClick={() => setCurrentStep('role-discovery')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Back to Role Discovery
              </button>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full w-3/5"></div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Let's Set Up Your Business Profile
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Tell us about your business so we can customize your experience
            </p>
          </motion.div>

          <BusinessSetupWizard 
            onComplete={handleSetupComplete}
            onSkip={handleSetupSkip}
          />
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        <Button 
          onClick={() => setCurrentStep('welcome')}
          className="mt-4"
        >
          Return to Welcome
        </Button>
      </div>
    </div>
  );
}
export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}