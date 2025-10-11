'use client';

import { motion } from 'framer-motion';
import { Bot, Cpu, Zap, ArrowRight, Shield, Target } from 'lucide-react';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumButton } from '@/components/ui/PremiumButton';

export default function AIBridgePage() {
  const capabilities = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: 'AI Campaign Management',
      description: 'Autonomous campaign creation, optimization, and management across all platforms.',
      color: 'text-blue-600'
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: 'Intelligent Analytics',
      description: 'Real-time performance analysis with predictive insights and recommendations.',
      color: 'text-purple-600'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Automated Optimization',
      description: 'Continuous bid adjustments, budget optimization, and performance enhancement.',
      color: 'text-green-600'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Smart Safety Controls',
      description: 'Built-in guardrails and approval workflows for autonomous operations.',
      color: 'text-orange-600'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Goal-Driven Results',
      description: 'AI focuses on your specific KPIs and business objectives automatically.',
      color: 'text-red-600'
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
            AI Bridge Capabilities
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover how our AI Bridge connects and orchestrates your entire marketing ecosystem with 
            intelligent automation and strategic decision-making capabilities.
          </p>
        </motion.div>

        {/* Capabilities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <PremiumCard variant="glassmorphism" hover className="p-6 h-full">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 mb-4 ${capability.color}`}>
                  {capability.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {capability.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {capability.description}
                </p>
              </PremiumCard>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <PremiumCard variant="glassmorphism" className="p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Bridge Your Marketing?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Experience the power of AI-driven marketing automation with our intelligent bridge technology.
            </p>
            <PremiumButton
              variant="primary"
              size="lg"
              glow
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Explore AI Features
            </PremiumButton>
          </PremiumCard>
        </motion.div>
      </div>
    </div>
  );
}