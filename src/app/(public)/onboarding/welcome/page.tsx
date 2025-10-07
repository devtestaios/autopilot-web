'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  Users,
  Calendar,
  BarChart3,
  MessageSquare,
  Zap,
  ShoppingCart,
  Brain,
  Settings,
  Trophy,
  Clock,
  Star
} from 'lucide-react';

interface BusinessProfile {
  businessName: string;
  businessType: string;
  businessSize: string;
  industry: string;
  goals: string[];
}

// Platform icons mapping
const platformIcons: { [key: string]: React.ComponentType<any> } = {
  'social-media': MessageSquare,
  'email-marketing': Target,
  'project-management': Calendar,
  'business-intelligence': BarChart3,
  'collaboration': Users,
  'ai-automation': Brain,
  'e-commerce': ShoppingCart,
  'marketing-command-center': Zap
};

// Platform display names
const platformNames: { [key: string]: string } = {
  'social-media': 'Social Media Management',
  'email-marketing': 'Email Marketing',
  'project-management': 'Project Management',
  'business-intelligence': 'Business Intelligence',
  'collaboration': 'Team Collaboration',
  'ai-automation': 'AI Automation',
  'e-commerce': 'E-commerce Platform',
  'marketing-command-center': 'Marketing Command Center'
};

function OnboardingWelcomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Load onboarding data from localStorage
    const profileData = localStorage.getItem('businessProfile');
    const platformsData = localStorage.getItem('selectedPlatforms');
    
    if (profileData) {
      setBusinessProfile(JSON.parse(profileData));
    }
    
    if (platformsData) {
      setSelectedPlatforms(JSON.parse(platformsData));
    }

    // Stop confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleGoToDashboard = () => {
    // Mark welcome as viewed
    localStorage.setItem('welcomeViewed', 'true');
    router.push('/dashboard?setup=complete');
  };

  const estimatedValue = () => {
    const platformCount = selectedPlatforms.length;
    if (platformCount >= 6) return 'Enterprise-level optimization expected';
    if (platformCount >= 4) return '25-40% efficiency improvement expected';
    if (platformCount >= 2) return '15-25% productivity boost expected';
    return '10-15% workflow improvement expected';
  };

  const nextSteps = [
    {
      title: 'Explore Your Dashboard',
      description: 'Get familiar with your new Master Terminal command center',
      icon: Target,
      timeframe: 'First 10 minutes'
    },
    {
      title: 'Connect Your Accounts',
      description: 'Link your social media, email, and business accounts',
      icon: Settings,
      timeframe: 'Next 15 minutes'
    },
    {
      title: 'Set Up Automations',
      description: 'Configure AI-powered workflows to save time',
      icon: Zap,
      timeframe: 'This week'
    },
    {
      title: 'Monitor Performance',
      description: 'Track your business metrics and optimization progress',
      icon: BarChart3,
      timeframe: 'Ongoing'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: -10,
                opacity: 1,
                rotate: 0
              }}
              animate={{
                y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 10,
                opacity: 0,
                rotate: 360
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 3,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 w-24 h-24 mx-auto mb-8"
            >
              <Trophy className="w-12 h-12 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              🎉 Setup Complete!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            >
              Congratulations! Your personalized PulseBridge.ai command center is ready.
              <br />
              {businessProfile && (
                <span className="text-teal-600 dark:text-teal-400 font-semibold">
                  Welcome aboard, {businessProfile.businessName}!
                </span>
              )}
            </motion.p>
          </motion.div>

          {/* Setup Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-2 gap-8 mb-12"
          >
            {/* Business Profile Summary */}
            {businessProfile && (
              <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Business Profile Configured
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Business Type:</span>
                    <Badge variant="secondary">{businessProfile.businessType}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Industry:</span>
                    <Badge variant="secondary">{businessProfile.industry}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Size:</span>
                    <Badge variant="secondary">{businessProfile.businessSize}</Badge>
                  </div>
                  <div className="pt-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Goals:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {businessProfile.goals.slice(0, 3).map((goal, index) => (
                        <Badge key={index} className="text-xs bg-teal-100 text-teal-700">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selected Platforms Summary */}
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Command Suite Activated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Platforms Selected:</span>
                    <Badge className="bg-teal-100 text-teal-700">{selectedPlatforms.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {selectedPlatforms.slice(0, 4).map((platformId) => {
                      const Icon = platformIcons[platformId] || Sparkles;
                      const name = platformNames[platformId] || platformId;
                      return (
                        <div key={platformId} className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-teal-600" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {name}
                          </span>
                        </div>
                      );
                    })}
                    {selectedPlatforms.length > 4 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{selectedPlatforms.length - 4} more platforms
                      </div>
                    )}
                  </div>
                  <div className="pt-2 text-sm text-green-600 dark:text-green-400 font-medium">
                    {estimatedValue()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Your Next Steps to Success
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {nextSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex-shrink-0">
                          <step.icon className="w-5 h-5 text-teal-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {step.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {step.description}
                          </p>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {step.timeframe}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <Button
              onClick={handleGoToDashboard}
              size="lg"
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-4 text-lg"
            >
              Launch Your Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Ready to transform your business operations
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingWelcomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <OnboardingWelcomeContent />
    </Suspense>
  );
}