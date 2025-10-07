'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Heart, 
  Star, 
  Zap, 
  Download, 
  Share, 
  Plus,
  Check,
  X,
  Mail,
  User,
  Settings,
  ShoppingCart
} from 'lucide-react';
import { 
  AdvancedButton, 
  FloatingActionButton, 
  PulsingButton,
  MagneticButton,
  MorphingButton 
} from '@/components/ui/AdvancedButton';
import NavigationTabs from '@/components/NavigationTabs';
import UnifiedSidebar from '@/components/UnifiedSidebar';

export default function ButtonInteractionsDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [likeStates, setLikeStates] = useState([false, false, false]);

  const handleAsyncAction = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const toggleLike = (index: number) => {
    setLikeStates(prev => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  const morphingStates = [
    { 
      icon: <Play className="w-4 h-4" />, 
      text: 'Play', 
      color: 'bg-green-500 hover:bg-green-600' 
    },
    { 
      icon: <Pause className="w-4 h-4" />, 
      text: 'Pause', 
      color: 'bg-yellow-500 hover:bg-yellow-600' 
    },
    { 
      icon: <Check className="w-4 h-4" />, 
      text: 'Complete', 
      color: 'bg-blue-500 hover:bg-blue-600' 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      <UnifiedSidebar />
      
      <main className="lg:pl-64 pt-16">
        <div className="p-8 space-y-12">
          {/* Header */}
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Enhanced Button Interactions
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Advanced button system with ripple effects, press feedback, and contextual animations
            </motion.p>
          </div>

          {/* Button Variants */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Button Variants
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <AdvancedButton variant="primary">
                Primary
              </AdvancedButton>
              <AdvancedButton variant="secondary">
                Secondary
              </AdvancedButton>
              <AdvancedButton variant="outline">
                Outline
              </AdvancedButton>
              <AdvancedButton variant="ghost">
                Ghost
              </AdvancedButton>
              <AdvancedButton variant="danger">
                Danger
              </AdvancedButton>
              <AdvancedButton variant="success">
                Success
              </AdvancedButton>
              <AdvancedButton variant="gradient">
                Gradient
              </AdvancedButton>
              <AdvancedButton variant="primary" disabled>
                Disabled
              </AdvancedButton>
            </div>
          </section>

          {/* Button Sizes */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Button Sizes
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <AdvancedButton size="sm" variant="primary">
                Small
              </AdvancedButton>
              <AdvancedButton size="md" variant="primary">
                Medium
              </AdvancedButton>
              <AdvancedButton size="lg" variant="primary">
                Large
              </AdvancedButton>
              <AdvancedButton size="xl" variant="primary">
                Extra Large
              </AdvancedButton>
            </div>
          </section>

          {/* Button Features */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Interactive Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Loading State */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Loading States
                </h3>
                <div className="space-y-3">
                  <AdvancedButton 
                    variant="primary" 
                    loading={isLoading}
                    onClick={handleAsyncAction}
                    className="w-full"
                  >
                    {isLoading ? 'Loading...' : 'Click to Load'}
                  </AdvancedButton>
                  <AdvancedButton 
                    variant="secondary" 
                    loading={true}
                    className="w-full"
                  >
                    Always Loading
                  </AdvancedButton>
                </div>
              </div>

              {/* Icons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  With Icons
                </h3>
                <div className="space-y-3">
                  <AdvancedButton 
                    variant="primary" 
                    icon={<Download className="w-4 h-4" />}
                    className="w-full"
                  >
                    Download
                  </AdvancedButton>
                  <AdvancedButton 
                    variant="outline" 
                    icon={<Share className="w-4 h-4" />}
                    iconPosition="right"
                    className="w-full"
                  >
                    Share
                  </AdvancedButton>
                </div>
              </div>

              {/* Effects */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Visual Effects
                </h3>
                <div className="space-y-3">
                  <AdvancedButton 
                    variant="gradient" 
                    glow={true}
                    className="w-full"
                  >
                    Glow Effect
                  </AdvancedButton>
                  <AdvancedButton 
                    variant="primary" 
                    float={true}
                    className="w-full"
                  >
                    Float on Hover
                  </AdvancedButton>
                </div>
              </div>
            </div>
          </section>

          {/* Floating Action Buttons */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Floating Action Buttons
            </h2>
            <div className="flex flex-wrap gap-6 justify-center">
              <FloatingActionButton size="sm">
                <Plus className="w-4 h-4" />
              </FloatingActionButton>
              <FloatingActionButton size="md">
                <Mail className="w-5 h-5" />
              </FloatingActionButton>
              <FloatingActionButton size="lg">
                <Settings className="w-6 h-6" />
              </FloatingActionButton>
            </div>
          </section>

          {/* Pulsing Buttons */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Pulsing Buttons (Urgent Actions)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <PulsingButton pulseColor="blue">
                <Zap className="w-4 h-4 mr-2" />
                Action
              </PulsingButton>
              <PulsingButton pulseColor="red">
                <Heart className="w-4 h-4 mr-2" />
                Alert
              </PulsingButton>
              <PulsingButton pulseColor="green">
                <Check className="w-4 h-4 mr-2" />
                Success
              </PulsingButton>
              <PulsingButton pulseColor="purple">
                <Star className="w-4 h-4 mr-2" />
                Special
              </PulsingButton>
            </div>
          </section>

          {/* Magnetic Buttons */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Magnetic Buttons (Cursor Following)
            </h2>
            <div className="flex flex-wrap gap-6 justify-center">
              <MagneticButton strength={0.2}>
                <User className="w-4 h-4 mr-2" />
                Subtle Magnetic
              </MagneticButton>
              <MagneticButton strength={0.4}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Strong Magnetic
              </MagneticButton>
            </div>
          </section>

          {/* Morphing Buttons */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Morphing State Buttons
            </h2>
            <div className="flex flex-wrap gap-6 justify-center">
              <MorphingButton 
                states={morphingStates}
                onStateChange={(index) => console.log('State changed to:', index)}
              />
              <MorphingButton 
                states={[
                  { 
                    icon: <Heart className="w-4 h-4" />, 
                    text: 'Like', 
                    color: 'bg-gray-500 hover:bg-gray-600' 
                  },
                  { 
                    icon: <Heart className="w-4 h-4 fill-current" />, 
                    text: 'Liked', 
                    color: 'bg-red-500 hover:bg-red-600' 
                  }
                ]}
              />
            </div>
          </section>

          {/* Ripple Effect Demo */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Ripple Effects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AdvancedButton 
                variant="primary" 
                ripple={true}
                className="w-full py-8"
              >
                With Ripple
              </AdvancedButton>
              <AdvancedButton 
                variant="secondary" 
                ripple={false}
                className="w-full py-8"
              >
                No Ripple
              </AdvancedButton>
              <AdvancedButton 
                variant="outline" 
                press={false}
                className="w-full py-8"
              >
                No Press Effect
              </AdvancedButton>
            </div>
          </section>

          {/* Complex Interactions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Complex Interactions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Feature {index + 1}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Advanced button interactions with smooth animations
                    </p>
                    <AdvancedButton
                      variant={likeStates[index] ? "success" : "outline"}
                      icon={
                        <Heart 
                          className={`w-4 h-4 ${likeStates[index] ? 'fill-current' : ''}`} 
                        />
                      }
                      onClick={() => toggleLike(index)}
                      glow={likeStates[index]}
                      className="w-full"
                    >
                      {likeStates[index] ? 'Liked' : 'Like'}
                    </AdvancedButton>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}