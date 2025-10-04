'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  Lightbulb, 
  HelpCircle, 
  Sparkles,
  X,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FeatureDiscoveryPanel from './FeatureDiscoveryPanel';

interface DiscoveryFloatingButtonProps {
  userType?: 'marketer' | 'agency' | 'enterprise' | 'creator' | 'developer';
  className?: string;
}

export default function DiscoveryFloatingButton({ 
  userType = 'marketer',
  className = ''
}: DiscoveryFloatingButtonProps) {
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Show hint for new users
  useEffect(() => {
    const hasSeenDiscovery = localStorage.getItem('pulsebridge-seen-discovery');
    if (!hasSeenDiscovery) {
      const timer = setTimeout(() => {
        setShowHint(true);
      }, 3000); // Show hint after 3 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDiscoveryOpen = () => {
    setIsDiscoveryOpen(true);
    setShowHint(false);
    setIsMinimized(false);
    localStorage.setItem('pulsebridge-seen-discovery', 'true');
  };

  const handleHintDismiss = () => {
    setShowHint(false);
    localStorage.setItem('pulsebridge-seen-discovery', 'true');
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
        <AnimatePresence>
          {showHint && !isDiscoveryOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-20 right-0 w-72 mb-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      New to PulseBridge.ai?
                    </h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleHintDismiss}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Click the compass to discover features tailored for {userType}s. 
                  We'll show you the fastest path to success!
                </p>
                <Button 
                  onClick={handleDiscoveryOpen}
                  size="sm"
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Explore Features
                </Button>
                
                {/* Arrow pointing to button */}
                <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 transform rotate-45" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Discovery Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Button
            onClick={handleDiscoveryOpen}
            className={`w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all duration-200 ${
              isMinimized ? 'opacity-50' : ''
            }`}
          >
            <Compass className="w-6 h-6 text-white" />
          </Button>

          {/* New features badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1"
          >
            <Badge className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              New
            </Badge>
          </motion.div>

          {/* Pulse animation for attention */}
          {!localStorage.getItem('pulsebridge-seen-discovery') && (
            <motion.div
              className="absolute inset-0 rounded-full bg-purple-500"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.div>

        {/* Minimize/Expand Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-3 -left-3"
        >
          <Button
            onClick={toggleMinimize}
            variant="ghost"
            size="sm"
            className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <ChevronUp 
              className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform duration-200 ${
                isMinimized ? 'rotate-180' : ''
              }`} 
            />
          </Button>
        </motion.div>

        {/* Quick Help Tooltip */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-16 top-1/2 transform -translate-y-1/2 hidden lg:block"
            >
              <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                Discover features ({userType})
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feature Discovery Panel */}
      <FeatureDiscoveryPanel
        isOpen={isDiscoveryOpen}
        onClose={() => setIsDiscoveryOpen(false)}
        userType={userType}
        onFeatureSelect={(feature) => {
          console.log('Feature selected:', feature);
          // Analytics tracking could go here
        }}
      />
    </>
  );
}