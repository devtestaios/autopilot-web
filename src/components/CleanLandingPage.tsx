'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { 
  Zap, 
  Brain, 
  TrendingUp, 
  Target, 
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Globe,
  BarChart3,
  Shield,
  Rocket,
  Bot
} from 'lucide-react';

export default function CleanLandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.7]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Optimization",
      description: "Advanced machine learning algorithms optimize your campaigns 24/7 for maximum ROI.",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: Target,
      title: "Multi-Platform Management",
      description: "Manage Google Ads, Meta, LinkedIn, and more from a single, unified dashboard.",
      color: "from-teal-600 to-teal-400"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Analytics",
      description: "Get instant insights with live performance metrics and predictive analytics.",
      color: "from-cyan-500 to-teal-500"
    },
    {
      icon: Zap,
      title: "Automated A/B Testing",
      description: "Continuously test and optimize ad creatives, audiences, and bidding strategies.",
      color: "from-orange-400 to-red-400"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director, TechCorp",
      content: "PulseBridge.ai increased our ROAS by 340% while reducing manual work by 80%. Game-changer!",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "CEO, GrowthLab",
      content: "The AI optimization saved us $50K monthly in ad spend. ROI was immediate.",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Performance Manager, ScaleUp",
      content: "Best marketing platform we've used. The autonomous campaign management is incredible.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Navigation - Clean Version */}
      <nav 
        data-testid="main-navigation"
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-teal-200/30 dark:border-teal-700/30"
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-orbitron font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent brand-title">
              PulseBridge.ai
            </span>
          </div>
          
          {/* Right Side - Login Only */}
          <div className="flex items-center">
            <Link 
              href="/login" 
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-full hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        className="pt-24 pb-16 px-4"
        style={{ y, opacity }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-7xl font-orbitron font-black mb-6 landing-hero">
              <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-500 bg-clip-text text-transparent">
                Autonomous
              </span>
              <br />
              <span className="text-slate-900 dark:text-white">
                Marketing AI
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              PulseBridge.ai manages your campaigns across Google Ads, Meta, and LinkedIn 
              with complete autonomy. Watch your ROAS soar while you focus on strategy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <button className="px-8 py-4 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              AI That Actually Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Advanced automation that learns, adapts, and optimizes your campaigns continuously
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "340%", label: "Average ROAS Increase" },
              { value: "80%", label: "Time Saved" },
              { value: "$2M+", label: "Ad Spend Optimized" },
              { value: "99.9%", label: "Uptime Guaranteed" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 dark:text-slate-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Trusted by Growth Leaders
            </h2>
          </motion.div>

          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <div className="flex justify-center mb-4">
              {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-xl text-slate-700 dark:text-slate-300 mb-6 italic">
              "{testimonials[currentTestimonial].content}"
            </p>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {testimonials[currentTestimonial].name}
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                {testimonials[currentTestimonial].role}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-teal-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Marketing?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join 1,000+ companies using AI to scale their advertising ROI
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-white text-teal-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <button className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors">
                Schedule Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}