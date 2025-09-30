'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import NavigationTabs from '@/components/NavigationTabs';
import BusinessSetupWizard from '@/components/BusinessSetupWizard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  BarChart3,
  Zap,
  Clock
} from 'lucide-react';

function OnboardingContent() {
  const searchParams = useSearchParams();
  const step = searchParams?.get('step') || 'setup';
  const [currentStep, setCurrentStep] = useState(step);

  useEffect(() => {
    if (step === 'welcome') {
      setCurrentStep('welcome');
    }
  }, [step]);

  const handleSetupComplete = () => {
    // Redirect to dashboard with customization enabled after setup
    window.location.href = '/dashboard?setup=complete&customize=true';
  };

  const handleSetupSkip = () => {
    // Redirect to dashboard after skipping
    window.location.href = '/dashboard';
  };

  const handleStartSetup = () => {
    setCurrentStep('setup');
  };

  // Welcome step for new users coming from signup
  if (currentStep === 'welcome') {
    const benefits = [
      {
        icon: Target,
        title: 'Personalized Dashboard',
        description: 'Get a custom dashboard tailored to your specific business needs and industry'
      },
      {
        icon: BarChart3,
        title: 'Smart Analytics',
        description: 'AI-powered insights that help you make data-driven decisions for your business'
      },
      {
        icon: Zap,
        title: 'Automated Workflows',
        description: 'Set up intelligent automation that saves time and reduces manual work'
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
              <div className="p-4 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 w-20 h-20 mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to PulseBridge.ai!
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Congratulations! Your account has been created successfully. 
                Now let's set up your personalized AI-powered business dashboard.
              </p>
            </div>

            <Card className="mb-8 text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-600" />
                  Quick Setup Process (2-3 minutes)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => {
                    const IconComponent = benefit.icon;
                    return (
                      <motion.div
                        key={benefit.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {benefit.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            {benefit.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
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

  // Main setup wizard
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Let's Set Up Your Dashboard
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