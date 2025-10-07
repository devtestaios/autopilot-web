'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Star, Sparkles, Heart, Zap } from 'lucide-react';
import { 
  BlurBackground, 
  HeroBlurBackground, 
  CardBlurBackground, 
  ModalBlurBackground,
  SidebarBlurBackground,
  FloatingBlurBackground 
} from '@/components/ui/BlurBackground';
import NavigationTabs from '@/components/NavigationTabs';
import UnifiedSidebar from '@/components/UnifiedSidebar';

export default function BlurBackgroundDemo() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      <UnifiedSidebar />
      
      <main className="lg:pl-64 pt-16">
        {/* Hero Section with Blur Background */}
        <HeroBlurBackground className="relative min-h-[60vh] flex items-center justify-center">
          <div className="text-center z-10 relative">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Progressive Blur Backgrounds
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Sophisticated glassmorphism effects that adapt to content and theme
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button 
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                View Modal Demo
              </Button>
            </motion.div>
          </div>
        </HeroBlurBackground>

        <div className="p-6 space-y-8">
          {/* Blur Intensity Demo */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Blur Intensity Levels
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {['light', 'medium', 'strong', 'dynamic'].map((intensity) => (
                <BlurBackground
                  key={intensity}
                  intensity={intensity as any}
                  overlay="subtle"
                  gradient="radial"
                  className="p-6 rounded-xl border border-white/20"
                >
                  <div className="text-center">
                    <Eye className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 capitalize">
                      {intensity}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {intensity === 'light' && 'Subtle blur effect'}
                      {intensity === 'medium' && 'Balanced blur'}
                      {intensity === 'strong' && 'Heavy blur effect'}
                      {intensity === 'dynamic' && 'Enhanced saturation'}
                    </p>
                  </div>
                </BlurBackground>
              ))}
            </div>
          </section>

          {/* Interactive Cards */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Interactive Card Backgrounds
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Star, title: 'Premium Features', desc: 'Hover for enhanced blur' },
                { icon: Heart, title: 'User Experience', desc: 'Smooth transitions' },
                { icon: Zap, title: 'Performance', desc: 'Optimized rendering' }
              ].map((item, index) => (
                <CardBlurBackground
                  key={index}
                  hover={true}
                  className="p-6 rounded-xl"
                >
                  <div className="text-center">
                    <item.icon className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {item.desc}
                    </p>
                  </div>
                </CardBlurBackground>
              ))}
            </div>
          </section>

          {/* Floating Elements */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Floating Blur Elements
            </h2>
            <div className="flex flex-wrap gap-6 justify-center">
              {[1, 2, 3].map((index) => (
                <FloatingBlurBackground
                  key={index}
                  float={true}
                  className="w-32 h-32 rounded-2xl"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="w-8 h-8 mx-auto mb-2 text-cyan-500" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Float {index}
                      </p>
                    </div>
                  </div>
                </FloatingBlurBackground>
              ))}
            </div>
          </section>

          {/* Gradient Patterns */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Gradient Patterns
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {['radial', 'linear', 'mesh', 'animated'].map((gradient) => (
                <BlurBackground
                  key={gradient}
                  intensity="medium"
                  overlay="medium"
                  gradient={gradient as any}
                  animate={gradient === 'animated'}
                  className="p-6 rounded-xl border border-white/20 h-32 flex items-center justify-center"
                >
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 dark:text-white capitalize">
                      {gradient}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                      Gradient Pattern
                    </p>
                  </div>
                </BlurBackground>
              ))}
            </div>
          </section>
        </div>

        {/* Modal Demo */}
        <ModalBlurBackground
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        >
          <CardBlurBackground className="max-w-md mx-4 p-6 rounded-xl">
            <div className="text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-500" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Modal with Blur Background
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This modal demonstrates sophisticated backdrop blur effects with theme adaptation.
              </p>
              <Button
                onClick={() => setShowModal(false)}
                className="w-full"
              >
                Close Modal
              </Button>
            </div>
          </CardBlurBackground>
        </ModalBlurBackground>
      </main>
    </div>
  );
}