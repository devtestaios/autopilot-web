'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain,
  Zap,
  BarChart3,
  Users,
  Target,
  Globe,
  Mail,
  ShoppingCart,
  Building,
  MessageSquare,
  Calendar,
  FileText,
  DollarSign,
  TrendingUp,
  Activity,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Clock,
  Settings,
  Rocket,
  Star,
  Eye,
  PlayCircle,
  Shield,
  Gauge,
  Cpu,
  Network
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      title: 'AI-Powered Analytics',
      description: 'Advanced machine learning algorithms analyze your business data in real-time',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      demoLink: '/analytics'
    },
    {
      title: 'Unified Platform Control',
      description: 'Manage all your business platforms from one intelligent command center',
      icon: Gauge,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      demoLink: '/unified'
    },
    {
      title: 'Smart Campaign Management',
      description: 'Automated campaign optimization across Google Ads, Meta, and LinkedIn',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      demoLink: '/campaigns'
    },
    {
      title: 'Intelligent Alerts',
      description: 'AI-driven notifications that prioritize what matters most to your business',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      demoLink: '/alerts'
    },
    {
      title: 'Performance Monitoring',
      description: 'Real-time performance tracking with predictive analytics and optimization',
      icon: Activity,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      demoLink: '/performance'
    },
    {
      title: 'Business Intelligence',
      description: 'Advanced BI platform with executive dashboards and AI-powered insights',
      icon: BarChart3,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      demoLink: '/business-intelligence'
    }
  ];

  const platformModules = [
    { name: 'Marketing Optimization', route: '/unified', icon: Brain },
    { name: 'Email Marketing Suite', route: '/email-marketing', icon: Mail },
    { name: 'Social Media Platform', route: '/social-media', icon: MessageSquare },
    { name: 'Lead Management', route: '/leads', icon: Users },
    { name: 'Business Suite', route: '/business-suite', icon: Building },
    { name: 'AI Automation', route: '/ai-automation', icon: Cpu },
    { name: 'Collaboration Hub', route: '/collaboration', icon: Network },
    { name: 'Integrations Marketplace', route: '/integrations', icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10"></div>
        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="p-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                PulseBridge.ai
              </h1>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Master Command Suite Architecture
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              The world's most advanced <span className="font-semibold text-teal-600">AI-powered business dashboard</span>. 
              Fully customizable, intelligently automated, and designed for the future of business management.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-3 text-lg">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-gray-300 dark:border-gray-600 px-8 py-3 text-lg"
                disabled
              >
                <Shield className="w-5 h-5 mr-2" />
                Login (Under Development)
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Fully Customizable</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Enterprise Ready</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Core Features Section */}
      <div className="py-20 bg-white dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Intelligent Business Automation
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the future of business management with our AI-first approach to platform orchestration
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className={`p-3 rounded-lg ${feature.bgColor} mb-4 w-fit`}>
                        <IconComponent className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {feature.description}
                      </p>
                      <Link href={feature.demoLink}>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="group-hover:bg-teal-50 group-hover:text-teal-600 dark:group-hover:bg-teal-900/20"
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          View Demo
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Platform Modules Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Integrated Platform Ecosystem
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our comprehensive suite of business platforms, each designed to work seamlessly together
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformModules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <motion.div
                  key={module.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={module.route}>
                    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                      <CardContent className="p-6 text-center">
                        <div className="p-4 rounded-full bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 mb-4 w-fit mx-auto group-hover:scale-110 transition-transform">
                          <IconComponent className="w-6 h-6 text-teal-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-teal-600 transition-colors">
                          {module.name}
                        </h4>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Badge variant="secondary" className="text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            Live Demo
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-teal-600 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h3 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h3>
            <p className="text-xl text-teal-100 mb-8">
              Join the future of intelligent business management with PulseBridge.ai's master command suite
            </p>
            <Link href="/signup">
              <Button 
                size="lg" 
                className="bg-white text-teal-600 hover:bg-gray-50 px-8 py-3 text-lg font-semibold"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-teal-400" />
            <span className="text-xl font-bold">PulseBridge.ai</span>
          </div>
          <p className="text-gray-400">
            The Future of AI-Powered Business Management
          </p>
        </div>
      </footer>
    </div>
  );
}