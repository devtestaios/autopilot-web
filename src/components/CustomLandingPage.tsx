'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import { PulseWaveLogo } from './PulseWaveLogo';
import { PremiumButton } from './ui/PremiumButton';
import { PremiumCard } from './ui/PremiumCard';
import LandingNavbar from './LandingNavbar';
import { 
  Zap, 
  Brain, 
  TrendingUp, 
  Target, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  Play,
  Users,
  Globe,
  BarChart3,
  Clock,
  Shield,
  Rocket,
  Bot,
  ChevronDown,
  Quote
} from 'lucide-react';

// Custom SVG Components for Advanced Animations
const GalaxyBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Twinkling Stars */}
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={`star-${i}`}
        className="absolute w-1 h-1 bg-white rounded-full"
        animate={{
          opacity: [0.3, 1, 0.3],
          scale: [0.5, 1.2, 0.5],
        }}
        transition={{
          duration: 2 + Math.random() * 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 5,
        }}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
      />
    ))}
    
    {/* Floating Nebula Clouds */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={`nebula-${i}`}
        className="absolute rounded-full opacity-5"
        style={{
          width: `${100 + Math.random() * 200}px`,
          height: `${100 + Math.random() * 200}px`,
          background: `radial-gradient(circle, ${
            ['#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899', '#10b981'][Math.floor(Math.random() * 5)]
          } 0%, transparent 70%)`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.2, 0.9, 1],
          rotate: [0, 90, 180, 360],
        }}
        transition={{
          duration: 15 + Math.random() * 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 10,
        }}
      />
    ))}
    
    {/* Cosmic Particles */}
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={`particle-${i}`}
        className="absolute w-0.5 h-0.5 rounded-full"
        style={{
          background: `linear-gradient(45deg, ${
            ['#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899'][Math.floor(Math.random() * 4)]
          }, transparent)`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          x: [0, Math.random() * 200 - 100],
          y: [0, Math.random() * 200 - 100],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 8 + Math.random() * 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 8,
        }}
      />
    ))}
  </div>
);

const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full opacity-20"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 4 + i,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.5,
        }}
        style={{
          left: `${10 + i * 15}%`,
          top: `${20 + i * 10}%`,
        }}
      />
    ))}
  </div>
);

const AnimatedCounter = ({ target, suffix = "", duration = 2 }: { target: number, suffix?: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = target / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);

      return () => clearInterval(timer);
    }
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

interface FeatureCard {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}

const features: FeatureCard[] = [
  {
    icon: Brain,
    title: "AI-Powered Marketing Bridge",
    description: "Our AI makes thousands of micro-optimizations every hour, continuously learning and adapting to maximize your campaign performance across all platforms.",
    gradient: "from-blue-500 via-purple-500 to-pink-500",
    delay: 0.2
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    description: "Advanced machine learning algorithms predict market trends and automatically adjust your campaigns 24/7 for maximum ROI and reduced cost per acquisition.",
    gradient: "from-green-500 via-teal-500 to-blue-500",
    delay: 0.4
  },
  {
    icon: Target,
    title: "Multi-Platform Mastery",
    description: "Unified control across Google Ads, Meta, LinkedIn, TikTok, and more. One dashboard to rule them all with seamless cross-platform optimization.",
    gradient: "from-orange-500 via-red-500 to-pink-500",
    delay: 0.6
  },
  {
    icon: Zap,
    title: "Lightning-Fast Execution",
    description: "Instant campaign deployment and real-time bid adjustments. Our system reacts to market changes faster than humanly possible.",
    gradient: "from-yellow-500 via-orange-500 to-red-500",
    delay: 0.8
  },
  {
    icon: Shield,
    title: "Risk Protection",
    description: "Built-in safeguards prevent overspending and automatically pause underperforming campaigns. Your budget is protected 24/7.",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    delay: 1.0
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Expand to new markets with AI-powered localization and currency optimization. Scale globally with local precision.",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    delay: 1.2
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marketing Director",
    company: "TechFlow Inc",
    content: "PulseBridge.ai increased our ROAS by 340% in just 3 months. The AI optimization is absolutely mind-blowing.",
    rating: 5,
    image: "SC"
  },
  {
    name: "Marcus Rodriguez",
    role: "CMO",
    company: "Growth Labs",
    content: "We went from managing 20 campaigns manually to 200+ with PulseBridge. Game-changing technology.",
    rating: 5,
    image: "MR"
  },
  {
    name: "Emily Zhang",
    role: "Performance Lead",
    company: "Scale Dynamics",
    content: "The unified dashboard saved us 40+ hours per week. ROI improvement was immediate and sustained.",
    rating: 5,
    image: "EZ"
  },
  {
    name: "David Park",
    role: "Founder",
    company: "StartupX",
    content: "From startup to $10M revenue with PulseBridge managing our entire ad ecosystem. Incredible results.",
    rating: 5,
    image: "DP"
  }
];

const stats = [
  { label: "Active Campaigns", value: 50000, suffix: "+" },
  { label: "ROAS Improvement", value: 340, suffix: "%" },
  { label: "Cost Reduction", value: 65, suffix: "%" },
  { label: "Client Success Rate", value: 99, suffix: "%" }
];

export default function AwardWinningLandingPage() {
  const { theme } = useTheme();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [email, setEmail] = useState('');
  const { scrollYProgress } = useScroll();
  
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  const heroInView = useInView(heroRef, { once: false, amount: 0.3 });
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.1 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} overflow-hidden`}>
      <LandingNavbar />
      <FloatingOrbs />
      
      {/* Revolutionary Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
        style={{ y, opacity }}
        variants={containerVariants}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
        
        {/* Galaxy Background */}
        <GalaxyBackground />
        
        {/* Floating Orbs */}
        <FloatingOrbs />
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* PulseBridge Logo */}
          <motion.div
            variants={itemVariants}
            className="mb-12 flex justify-center"
          >
            <PulseWaveLogo 
              size="large" 
              variant="dark" 
              animated={true} 
              showText={true}
              className="drop-shadow-2xl"
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pulse-blue/10 to-bridge-purple/10 border border-pulse-blue/30 dark:border-bridge-purple/50 mb-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-4 h-4 text-pulse-blue mr-2" />
              <span className="text-sm font-medium text-pulse-blue dark:text-pulse-blue font-exo-2">
                AI Bridge Technology
              </span>
            </motion.div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-orbitron font-normal tracking-wide mb-8"
            style={{ letterSpacing: '0.1em' }}
          >
            <span className="bg-gradient-to-r from-pulse-blue via-bridge-purple to-energy-magenta bg-clip-text text-transparent">
              Bridge the Gap to
            </span>
            <br />
            <span className="bg-gradient-to-r from-deep-space to-interface-gray dark:from-interface-gray dark:to-gray-300 bg-clip-text text-transparent">
              Perfect Marketing
            </span>
            <br />
            <motion.span
              className="bg-gradient-to-r from-pulse-blue via-bridge-purple to-energy-magenta bg-clip-text text-transparent font-bold"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ 
                textShadow: '0 0 30px rgba(0, 212, 255, 0.5)' 
              }}
            >
              with PulseBridge.ai
            </motion.span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl lg:text-3xl text-slate-700 dark:text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed font-exo-2 font-light"
          >
            Connect your marketing potential with{' '}
            <span className="font-semibold text-pulse-blue dark:text-pulse-blue">AI-powered precision</span>
            {' '}that bridges the gap between strategy and execution. Pulse-driven insights that{' '}
            <span className="font-semibold text-energy-magenta dark:text-energy-magenta">transform campaigns</span>{' '}
            into unstoppable growth engines.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="email"
                placeholder="Enter your email for exclusive access"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:w-80 px-6 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-pulse-cyan focus:outline-none transition-all duration-300"
              />
            </motion.div>
            
            <PremiumButton
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
              glow
              className="px-8 py-4"
            >
              Start Free Trial
            </PremiumButton>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400"
          >
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              14-day free trial
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Cancel anytime
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center cursor-pointer"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Scroll to explore</span>
              <ChevronDown className="w-6 h-6 text-gray-400" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Live Stats Section */}
      <motion.section
        ref={statsRef}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={statsInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
            initial={{ y: 50, opacity: 0 }}
            animate={statsInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Delivering Results
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Right Now
            </span>
          </motion.h2>
          
          <motion.p
            className="text-xl text-blue-100 mb-16 max-w-3xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={statsInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Live metrics from campaigns running on our platform this very moment
          </motion.p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ y: 50, opacity: 0 }}
                animate={statsInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
              >
                <div className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-2 text-yellow-300">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-lg text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Revolutionary Features Section */}
      <motion.section
        ref={featuresRef}
        className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800 relative"
        initial={{ opacity: 0 }}
        animate={featuresInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ y: 50, opacity: 0 }}
            animate={featuresInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Superhuman
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Capabilities
              </span>
            </h2>
            <p className="text-2xl text-slate-700 dark:text-gray-200 max-w-4xl mx-auto leading-relaxed">
              Advanced AI features that give you an unfair advantage in the digital marketing battlefield
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative"
                initial={{ y: 100, opacity: 0 }}
                animate={featuresInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
                transition={{ duration: 0.8, delay: feature.delay }}
                whileHover={{ y: -10 }}
              >
                <div className="relative p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  <motion.div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-700 dark:text-gray-200 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: "0%" }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900/10" />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.h2
            className="text-5xl sm:text-6xl font-bold mb-6"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Loved by
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Growth Leaders
            </span>
          </motion.h2>
          
          <motion.p
            className="text-xl text-slate-700 dark:text-gray-200 mb-16 max-w-3xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join thousands of marketers who've transformed their businesses with PulseBridge
          </motion.p>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl max-w-4xl mx-auto border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
              >
                <Quote className="w-16 h-16 text-blue-500 mx-auto mb-8" />
                
                <blockquote className="text-2xl sm:text-3xl font-medium text-gray-900 dark:text-white mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                
                <div className="flex items-center justify-center space-x-2 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonials[currentTestimonial].image}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900 dark:text-white text-lg">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-slate-700 dark:text-gray-200">
                      {testimonials[currentTestimonial].role} • {testimonials[currentTestimonial].company}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-blue-500 w-8'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <FloatingOrbs />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Ready to Go
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Ready for PulseBridge?
            </span>
          </motion.h2>
          
          <motion.p
            className="text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join the marketing revolution. Start your free trial today and watch your campaigns optimize themselves.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/signup">
              <motion.button
                className="px-12 py-6 bg-white text-blue-600 font-bold text-xl rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300 group"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255, 255, 255, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center">
                  Start Free Trial
                  <Rocket className="w-6 h-6 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </span>
              </motion.button>
            </Link>
            
            <motion.button
              className="px-8 py-6 border-2 border-white/30 text-white font-semibold text-lg rounded-2xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center">
                <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </span>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}