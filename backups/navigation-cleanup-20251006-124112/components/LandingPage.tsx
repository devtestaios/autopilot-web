'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Bot, 
  Zap, 
  Brain, 
  TrendingUp, 
  Target, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  Shield,
  Clock,
  BarChart3,
  Users,
  Globe,
  ChevronRight
} from 'lucide-react';

interface FeatureCard {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  badge?: string;
}

const features: FeatureCard[] = [
  {
    icon: Bot,
    title: "AI Autopilot",
    description: "Autonomous campaign optimization that never sleeps. Our AI makes thousands of micro-adjustments daily.",
    badge: "Core Feature"
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Real-time insights and predictive analytics to maximize your marketing ROI across all platforms.",
    badge: "Live"
  },
  {
    icon: Target,
    title: "Multi-Platform Management",
    description: "Unified control of Google Ads, Meta, LinkedIn, and more from a single, intuitive dashboard.",
    badge: "Enterprise"
  },
  {
    icon: Brain,
    title: "Smart Optimization",
    description: "Machine learning algorithms continuously improve performance based on your specific goals.",
    badge: "AI-Powered"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with SOC 2 compliance, role-based access, and audit trails.",
    badge: "Secure"
  },
  {
    icon: Clock,
    title: "24/7 Automation",
    description: "Round-the-clock monitoring and optimization while you focus on strategy and growth.",
    badge: "Always On"
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marketing Director",
    company: "TechCorp Inc.",
    content: "Autopilot increased our ROI by 340% in just 3 months. The AI insights are incredible.",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    role: "CMO",
    company: "Growth Labs",
    content: "Finally, a marketing platform that actually works autonomously. Game-changing technology.",
    rating: 5
  },
  {
    name: "Emily Zhang",
    role: "Performance Marketing Lead",
    company: "Scale Dynamics",
    content: "The unified dashboard saved us 20+ hours per week. ROI improvement was immediate.",
    rating: 5
  }
];

export default function LandingPage() {
  const { theme } = useTheme();
  const [emailSignup, setEmailSignup] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-teal-500 text-white"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black bg-opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div variants={itemVariants} className="flex items-center justify-center mb-8">
              <div className="p-6 bg-white bg-opacity-20 rounded-3xl backdrop-blur-sm">
                <Bot className="h-20 w-20 text-white drop-shadow-lg" />
              </div>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Marketing on Autopilot
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              The world's most advanced AI marketing platform. Surpass Google Marketing Platform and Adobe Analytics with autonomous optimization.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link 
                href="/signup"
                className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <Zap className="h-6 w-6 group-hover:text-yellow-500 transition-colors" />
                <span>Start Free Trial</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/login"
                className="group bg-blue-500 bg-opacity-20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center space-x-3 border border-white border-opacity-20 hover:border-opacity-40"
              >
                <span>Sign In</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-6 text-center border border-white border-opacity-20 hover:bg-opacity-95 transition-all duration-300 shadow-lg">
                <TrendingUp className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <div className="text-3xl font-bold text-black">340%</div>
                <div className="text-black font-semibold">Avg ROI Improvement</div>
              </div>
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-6 text-center border border-white border-opacity-20 hover:bg-opacity-95 transition-all duration-300 shadow-lg">
                <Bot className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <div className="text-3xl font-bold text-black">24/7</div>
                <div className="text-black font-semibold">Autonomous Optimization</div>
              </div>
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-6 text-center border border-white border-opacity-20 hover:bg-opacity-95 transition-all duration-300 shadow-lg">
                <Target className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <div className="text-3xl font-bold text-black">98%</div>
                <div className="text-black font-semibold">AI Prediction Accuracy</div>
              </div>
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-6 text-center border border-white border-opacity-20 hover:bg-opacity-95 transition-all duration-300 shadow-lg">
                <Sparkles className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <div className="text-3xl font-bold text-black">$4.8M</div>
                <div className="text-black font-semibold">Revenue Optimized</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className={`py-20 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className={`text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Why Choose Autopilot?
            </motion.h2>
            <motion.p variants={itemVariants} className={`text-xl ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Advanced AI technology that revolutionizes marketing automation
            </motion.p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`p-6 rounded-lg border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                    : 'bg-white/50 border-gray-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-100'
                  }`}>
                    <feature.icon size={24} className="text-blue-600" />
                  </div>
                  {feature.badge && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-20 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className={`text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Trusted by Marketing Leaders
            </motion.h2>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`p-6 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-900/50 border-gray-700'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className={`mb-4 italic ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  "{testimonial.content}"
                </p>
                <div>
                  <div className={`font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {testimonial.name}
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-4">
              Ready to Transform Your Marketing?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl mb-8 text-blue-100">
              Join thousands of marketers who've revolutionized their campaigns with AI
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/signup"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <Zap className="h-6 w-6" />
                <span>Start Your Free Trial</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <Link 
                href="/demo"
                className="bg-blue-500 bg-opacity-20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center space-x-3 border border-white border-opacity-20 hover:border-opacity-40"
              >
                <BarChart3 className="h-6 w-6" />
                <span>Watch Demo</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}