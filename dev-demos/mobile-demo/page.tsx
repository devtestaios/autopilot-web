'use client';

import { motion } from 'framer-motion';
import { Smartphone, Tablet, Monitor, Zap, BarChart3, Bell } from 'lucide-react';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumButton } from '@/components/ui/PremiumButton';

export default function MobileDemoPage() {
  const devices = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      name: 'Mobile Phone',
      description: 'Optimized for iOS and Android devices',
      screenSize: '375px × 667px'
    },
    {
      icon: <Tablet className="w-8 h-8" />,
      name: 'Tablet',
      description: 'Perfect for iPad and Android tablets',
      screenSize: '768px × 1024px'
    },
    {
      icon: <Monitor className="w-8 h-8" />,
      name: 'Desktop',
      description: 'Full desktop experience',
      screenSize: '1920px × 1080px'
    }
  ];

  const mobileFeatures = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Touch-Optimized Interface',
      description: 'Intuitive gestures and touch-friendly controls for seamless mobile interaction.'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Mobile Analytics',
      description: 'View campaign performance and analytics optimized for mobile screens.'
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: 'Push Notifications',
      description: 'Real-time alerts and notifications for campaign updates and performance.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pulse-cyan to-pulse-purple bg-clip-text text-transparent mb-6">
            Mobile Experience Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Experience PulseBridge.ai's fully responsive design across all devices. 
            Our platform provides a seamless experience whether you're on mobile, tablet, or desktop.
          </p>
        </motion.div>

        {/* Device Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {devices.map((device, index) => (
            <motion.div
              key={device.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <PremiumCard variant="glassmorphism" hover className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-pulse-cyan to-pulse-purple text-white mb-4">
                  {device.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {device.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {device.description}
                </p>
                <div className="text-sm text-pulse-cyan font-medium">
                  {device.screenSize}
                </div>
              </PremiumCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Mobile-First Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mobileFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <PremiumCard variant="glassmorphism" className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-pulse-cyan to-pulse-purple text-white">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </PremiumCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Demo CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <PremiumCard variant="glassmorphism" className="p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Try it on Your Device
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Open this platform on your mobile device to experience the full responsive design and mobile optimization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PremiumButton variant="primary" size="lg" glow>
                View on Mobile
              </PremiumButton>
              <PremiumButton variant="outline" size="lg">
                Desktop Demo
              </PremiumButton>
            </div>
          </PremiumCard>
        </motion.div>
      </div>
    </div>
  );
}