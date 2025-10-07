'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  Trophy,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';

interface WelcomeBannerProps {
  onDismiss: () => void;
}

interface BusinessProfile {
  businessName: string;
  businessType: string;
  businessSize: string;
  industry: string;
  goals: string[];
}

export default function OnboardingWelcomeBanner({ onDismiss }: WelcomeBannerProps) {
  const router = useRouter();
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Load onboarding data
    const profileData = localStorage.getItem('businessProfile');
    const platformsData = localStorage.getItem('selectedPlatforms');
    
    if (profileData) {
      setBusinessProfile(JSON.parse(profileData));
    }
    
    if (platformsData) {
      setSelectedPlatforms(JSON.parse(platformsData));
    }

    // Auto-dismiss after 10 seconds if user doesn't interact
    const timer = setTimeout(() => {
      handleDismiss();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('onboardingWelcomeDismissed', 'true');
    setTimeout(onDismiss, 300); // Wait for animation to complete
  };

  const quickActions = [
    {
      title: 'Connect First Account',
      description: 'Link your social media or email account',
      icon: Target,
      action: () => router.push('/social-media'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Create Campaign',
      description: 'Set up your first marketing campaign',
      icon: Zap,
      action: () => router.push('/marketing-command-center'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'View Analytics',
      description: 'Explore your business intelligence dashboard',
      icon: BarChart3,
      action: () => router.push('/business-intelligence'),
      color: 'from-green-500 to-emerald-500'
    }
  ];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 p-4"
      >
        <Card className="max-w-6xl mx-auto bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 border-0 shadow-2xl">
          <CardContent className="p-6 text-white relative">
            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid md:grid-cols-3 gap-6 items-center">
              {/* Welcome Message */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-8 h-8 text-yellow-300" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      🎉 Welcome to PulseBridge.ai!
                    </h2>
                    {businessProfile && (
                      <p className="text-cyan-100">
                        Your command center is ready, {businessProfile.businessName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* Setup Summary */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span className="text-sm">Business profile configured</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span className="text-sm">
                        {selectedPlatforms.length} platforms activated
                      </span>
                    </div>
                    {businessProfile && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-300" />
                        <span className="text-sm">
                          Optimized for {businessProfile.industry}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-2">
                    <div className="text-sm opacity-90">
                      Estimated productivity gain:
                    </div>
                    <div className="text-xl font-bold text-yellow-300">
                      +{selectedPlatforms.length >= 4 ? '25-40%' : '15-25%'}
                    </div>
                    <div className="text-xs opacity-75">
                      Based on your selected platforms
                    </div>
                  </div>
                </div>

                <p className="text-cyan-100 text-sm">
                  Ready to start optimizing your business operations with AI-powered automation.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h3 className="font-semibold text-white mb-3">Get Started:</h3>
                {quickActions.slice(0, 3).map((action, index) => (
                  <motion.button
                    key={action.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    onClick={action.action}
                    className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <action.icon className="w-5 h-5 text-white" />
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm">
                          {action.title}
                        </div>
                        <div className="text-xs text-cyan-100">
                          {action.description}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.button>
                ))}
                
                <Button
                  variant="secondary"
                  onClick={handleDismiss}
                  className="w-full mt-3 bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  Explore Dashboard
                </Button>
              </div>
            </div>

            {/* Sparkle Animation */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{
                    x: Math.random() * 100 + '%',
                    y: Math.random() * 100 + '%',
                    scale: 0,
                    opacity: 0
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: Math.random() * 2,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 3
                  }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}