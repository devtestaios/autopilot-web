'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Brain,
  Target,
  MessageSquare,
  Mail,
  BarChart3,
  Users,
  Globe,
  DollarSign,
  Sparkles,
  ArrowRight,
  Clock,
  Star,
  PlayCircle,
  Trophy,
  Timer,
  CheckCircle,
  Gauge,
  FileText,
  ShoppingCart
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      
      {/* Hero Section - Problem/Solution */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Marketing Platform
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
              Stop Managing 15+ Tools.
              <span className="block text-teal-600 dark:text-teal-400">
                Start Growing Instead.
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Replace 15+ scattered tools with one AI-powered platform that connects every aspect of your business.
            </p>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 mb-8 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>10,000+ Active Users</span>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">4.9/5 rating</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Trophy className="w-4 h-4" />
                <span>Industry Leader</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-teal-200 dark:border-teal-800 mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Timer className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <Badge className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
                  Limited Time
                </Badge>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Free 15-Day Trial - No Credit Card Required
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white">
                    <Clock className="w-5 h-5 mr-2" />
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="px-6 py-4 text-teal-600 border-teal-300 hover:bg-teal-50">
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Power Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-white">
              The Power of Integration
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto text-center">
              Everything your business needs in one unified platform. No more switching between tools.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                icon: <Brain className="w-8 h-8 text-teal-600" />,
                title: "AI Automation",
                description: "Claude AI handles routine tasks while you focus on growth strategy."
              },
              {
                icon: <Target className="w-8 h-8 text-teal-600" />,
                title: "Smart Optimization",
                description: "AI optimizes campaigns, budgets, and performance automatically."
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-teal-600" />,
                title: "Unified Analytics",
                description: "Track performance across all channels with actionable insights."
              },
              {
                icon: <MessageSquare className="w-8 h-8 text-teal-600" />,
                title: "Content Creation",
                description: "Generate high-converting content for every platform instantly."
              },
              {
                icon: <Mail className="w-8 h-8 text-teal-600" />,
                title: "Email Marketing",
                description: "Sophisticated email campaigns with automated sequences."
              },
              {
                icon: <Users className="w-8 h-8 text-teal-600" />,
                title: "Team Collaboration",
                description: "Seamless teamwork with real-time collaboration tools."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 transition-colors">
                  <CardContent className="p-6">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white">
              The Numbers Don't Lie
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
              {[
                { number: "400%", label: "Average ROI Increase", icon: <DollarSign className="w-6 h-6" /> },
                { number: "15+", label: "Tools Replaced", icon: <FileText className="w-6 h-6" /> },
                { number: "80%", label: "Time Saved", icon: <Clock className="w-6 h-6" /> },
                { number: "10k+", label: "Happy Customers", icon: <Users className="w-6 h-6" /> }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-center mb-4 text-teal-600 dark:text-teal-400">
                      {stat.icon}
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 dark:bg-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join thousands of businesses already using PulseBridge.ai to automate their marketing and scale faster.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="px-6 py-4 border-gray-400 text-gray-300 hover:bg-gray-800">
                  <DollarSign className="w-5 h-5 mr-2" />
                  View Pricing
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-gray-400 mt-4">
              No credit card required • 15-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}