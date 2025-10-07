'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserTier, TIER_INFO } from '@/contexts/UserTierContext';
import {
  Lock,
  ArrowUp,
  Star,
  Zap,
  Shield,
  Users,
  BarChart3,
  DollarSign,
  Settings,
  Crown
} from 'lucide-react';

interface UpgradePromptProps {
  feature: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  size?: 'small' | 'medium' | 'large';
}

export default function UpgradePrompt({ 
  feature, 
  description, 
  icon: IconComponent = Lock,
  size = 'medium' 
}: UpgradePromptProps) {
  const { tier, setTier } = useUserTier();
  const currentTierInfo = TIER_INFO[tier];
  const targetTierInfo = TIER_INFO.projectsuite;

  const handleUpgrade = () => {
    // TODO: In production, this would trigger actual upgrade flow
    setTier('projectsuite');
  };

  const handleDemo = () => {
    // Allow temporary access for demo purposes
    setTier('projectsuite');
  };

  if (size === 'small') {
    return (
      <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
        <IconComponent className="h-4 w-4 text-purple-600" />
        <span className="text-sm text-purple-700 dark:text-purple-300">
          {feature} - Enterprise Feature
        </span>
        <Button 
          size="sm" 
          variant="outline"
          onClick={handleUpgrade}
          className="ml-auto text-xs h-6 px-2"
        >
          Upgrade
        </Button>
      </div>
    );
  }

  if (size === 'large') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="border-2 border-purple-200 dark:border-purple-700 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900/20 dark:via-gray-800 dark:to-blue-900/20">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-6 w-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Crown className="h-3 w-3 text-yellow-800" />
                </div>
              </div>
            </div>
            
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {feature}
            </CardTitle>
            
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 mb-4">
              Enterprise Feature
            </Badge>
            
            {description && (
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {description}
              </p>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Current vs Target Tier Comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Plan</div>
                <div className="font-semibold text-gray-900 dark:text-white">{currentTierInfo.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{currentTierInfo.price}</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg border-2 border-purple-200 dark:border-purple-600">
                <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Upgrade To</div>
                <div className="font-semibold text-purple-900 dark:text-purple-100">{targetTierInfo.name}</div>
                <div className="text-sm text-purple-700 dark:text-purple-300">{targetTierInfo.price}</div>
              </div>
            </div>

            {/* Feature Benefits */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">Unlock Enterprise Features:</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: BarChart3, text: 'Advanced Analytics' },
                  { icon: Users, text: 'Team Management' },
                  { icon: DollarSign, text: 'Budget Tracking' },
                  { icon: Settings, text: 'Custom Workflows' }
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Icon className="h-4 w-4 text-purple-600" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={handleUpgrade}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Upgrade to Enterprise
              </Button>
              <Button 
                onClick={handleDemo}
                variant="outline"
                className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/20"
              >
                <Zap className="h-4 w-4 mr-2" />
                Try Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                30-day money back
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                Cancel anytime
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Medium size (default)
  return (
    <Card className="border-2 border-purple-200 dark:border-purple-700 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900/20 dark:via-gray-800 dark:to-blue-900/20">
      <CardContent className="text-center p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <IconComponent className="h-6 w-6 text-white" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {feature}
        </h3>
        
        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 mb-3">
          Enterprise Feature
        </Badge>
        
        {description && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
            {description}
          </p>
        )}
        
        <div className="flex gap-2">
          <Button 
            onClick={handleUpgrade}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <ArrowUp className="h-4 w-4 mr-2" />
            Upgrade
          </Button>
          <Button 
            onClick={handleDemo}
            variant="outline"
            className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300"
          >
            Try Demo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}