'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Target, 
  Globe,
  Smartphone,
  Monitor,
  Settings,
  BarChart3,
  Users,
  TrendingUp
} from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PremiumCard } from '@/components/ui/PremiumCard';

const platforms = [
  { name: "Google Ads", users: "2.5B+", color: "from-blue-500 to-blue-600", icon: "🔍" },
  { name: "Meta Ads", users: "3.8B+", color: "from-blue-600 to-purple-600", icon: "📘" },
  { name: "LinkedIn", users: "930M+", color: "from-blue-700 to-blue-800", icon: "💼" },
  { name: "TikTok Ads", users: "1.7B+", color: "from-pink-500 to-red-500", icon: "🎵" },
  { name: "Twitter Ads", users: "450M+", color: "from-blue-400 to-blue-500", icon: "🐦" },
  { name: "Pinterest", users: "480M+", color: "from-red-500 to-pink-500", icon: "📌" },
];

const unifiedFeatures = [
  {
    icon: Monitor,
    title: "Single Dashboard Control",
    description: "Manage all your campaigns across every platform from one unified interface.",
    example: "Monitor Google, Meta, LinkedIn, and TikTok campaigns side-by-side with real-time performance metrics."
  },
  {
    icon: Settings,
    title: "Cross-Platform Optimization",
    description: "AI automatically shifts budget between platforms based on performance and opportunities.",
    example: "Detected 40% lower CPCs on LinkedIn for B2B audience, automatically reallocated 30% of Google budget."
  },
  {
    icon: Users,
    title: "Unified Audience Insights",
    description: "Combine audience data across platforms for deeper insights and better targeting.",
    example: "Found that Instagram users convert better after seeing LinkedIn ads first, optimized sequential targeting."
  },
  {
    icon: BarChart3,
    title: "Holistic Reporting",
    description: "Get complete performance overview with attribution across all platforms and touchpoints.",
    example: "Discovered that 60% of conversions involved 3+ touchpoints, optimized multi-platform funnels accordingly."
  }
];

export default function MultiPlatformPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="relative z-50 p-6">
        <Link 
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="px-6 py-20 bg-gradient-to-br from-deep-space via-bridge-purple/10 to-pulse-blue/10"
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pulse-blue/10 to-bridge-purple/10 border border-pulse-blue/30 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Target className="w-5 h-5 text-pulse-blue mr-2" />
            <span className="text-sm font-medium text-pulse-blue">Multi-Platform Mastery</span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-orbitron font-bold mb-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-pulse-blue via-bridge-purple to-energy-magenta bg-clip-text text-transparent">
              One Dashboard
            </span>
            <br />
            <span className="text-foreground">Rules Them All</span>
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Unified control across Google Ads, Meta, LinkedIn, TikTok, and more. Seamless cross-platform optimization that maximizes your reach and ROI across the entire digital ecosystem.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <PremiumButton size="lg" className="text-lg px-8 py-4">
              See All Platforms
            </PremiumButton>
            <PremiumButton variant="outline" size="lg" className="text-lg px-8 py-4">
              Connect Your Accounts
            </PremiumButton>
          </motion.div>
        </div>
      </motion.section>

      {/* Platform Integration Grid */}
      <motion.section
        className="py-20 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-pulse-blue to-bridge-purple bg-clip-text text-transparent">
                Integrated Platforms
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Connect and manage campaigns across all major advertising platforms
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <PremiumCard className="p-6 text-center h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${platform.color} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4`}>
                    {platform.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{platform.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{platform.users} active users</p>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className={`bg-gradient-to-r ${platform.color} h-2 rounded-full`} style={{ width: `${Math.min(90, Math.random() * 40 + 50)}%` }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Integration Status: Connected</p>
                </PremiumCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Unified Features */}
      <motion.section
        ref={featuresRef}
        className="py-20 px-6 bg-secondary"
        initial={{ opacity: 0 }}
        animate={featuresInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-pulse-blue to-bridge-purple bg-clip-text text-transparent">Unified Control</span> Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful tools that work seamlessly across all your advertising platforms
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {unifiedFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <PremiumCard className="p-8 h-full">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-gradient-to-br from-pulse-blue to-bridge-purple rounded-xl">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground mb-4">{feature.description}</p>
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
                        <p className="text-sm"><strong>Real Example:</strong> {feature.example}</p>
                      </div>
                    </div>
                  </div>
                </PremiumCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Dashboard Preview */}
      <motion.section
        className="py-20 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-pulse-blue to-bridge-purple bg-clip-text text-transparent">
                Unified Dashboard Preview
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              See how all your platforms come together in one powerful interface
            </p>
          </div>

          <PremiumCard className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold mb-4">Campaign Performance Overview</h3>
                <div className="h-48 bg-gradient-to-br from-pulse-blue/5 to-bridge-purple/5 rounded-lg flex items-center justify-center border">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-pulse-blue mx-auto mb-2" />
                    <p className="text-muted-foreground">Multi-Platform Performance Chart</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4">Platform Breakdown</h3>
                <div className="space-y-3">
                  {platforms.slice(0, 4).map((platform, index) => (
                    <div key={platform.name} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 bg-gradient-to-br ${platform.color} rounded-lg flex items-center justify-center text-sm`}>
                          {platform.icon}
                        </div>
                        <span className="font-medium">{platform.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600">+{Math.floor(Math.random() * 30 + 10)}%</div>
                        <div className="text-xs text-muted-foreground">ROAS</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PremiumCard>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="py-20 px-6 bg-gradient-to-br from-pulse-blue/10 to-bridge-purple/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Master <span className="bg-gradient-to-r from-pulse-blue to-bridge-purple bg-clip-text text-transparent">Every Platform</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Stop switching between dozens of dashboards. Manage everything from one powerful, unified interface.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PremiumButton size="lg" className="text-lg px-8 py-4">
              Connect All Platforms
            </PremiumButton>
            <PremiumButton variant="outline" size="lg" className="text-lg px-8 py-4">
              See Dashboard Demo
            </PremiumButton>
          </div>
        </div>
      </motion.section>
    </div>
  );
}