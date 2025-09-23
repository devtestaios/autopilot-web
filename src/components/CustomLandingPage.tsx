'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import { PulseWaveLogo } from './PulseWaveLogo';
import { PremiumButton } from './ui/PremiumButton';
import { PremiumCard } from './ui/PremiumCard';
import { TypewriterEffect } from './ui/TypewriterEffect';
import { MagneticButton } from './ui/MagneticButton';
import { GlassButton } from './ui/GlassButton';
import { FloatingParticles } from './ui/FloatingParticles';
import { EnhancedFeatureCard } from './landing/EnhancedFeatureCard';
import { LiveMetrics } from './landing/LiveMetrics';
import { EnhancedTestimonials } from './landing/EnhancedTestimonials';
import { EnhancedCTA } from './landing/EnhancedCTA';
import { AdvancedHero } from './landing/AdvancedHero';
import { AdvancedDataViz } from './landing/AdvancedDataViz';
import { ScrollTriggeredFeatures } from './landing/ScrollTriggeredFeatures';
import { InteractiveComparison } from './landing/InteractiveComparison';
import { AdvancedPricing } from './landing/AdvancedPricing';
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
    quote: "PulseBridge.ai transformed our entire marketing operation. The AI optimization increased our ROAS by 340% while reducing manual work by 85%. It's like having a team of expert marketers working 24/7.",
    author: "Sarah Chen",
    role: "Marketing Director",
    company: "TechFlow Inc",
    avatar: "SC",
    rating: 5,
    metrics: {
      roas: "+340% ROAS",
      time: "85% Time Saved",
      growth: "+200% Campaigns"
    }
  },
  {
    quote: "We scaled from 20 campaigns to 200+ with the same team size. The autonomous optimization and real-time adjustments are absolutely game-changing for performance marketing.",
    author: "Marcus Rodriguez",
    role: "CMO",
    company: "Growth Labs",
    avatar: "MR",
    rating: 5,
    metrics: {
      roas: "+280% ROAS",
      time: "40h Saved/Week",
      growth: "10x Scale"
    }
  },
  {
    quote: "The unified dashboard and predictive analytics gave us insights we never had before. ROI improvement was immediate and sustained quarter over quarter.",
    author: "Emily Zhang",
    role: "Performance Lead",
    company: "Scale Dynamics",
    avatar: "EZ",
    rating: 5,
    metrics: {
      roas: "+420% ROAS",
      time: "60% Efficiency",
      growth: "+150% Revenue"
    }
  },
  {
    quote: "From startup to $10M revenue with PulseBridge managing our entire ad ecosystem. The AI decision-making is more sophisticated than our previous agency.",
    author: "David Park",
    role: "Founder",
    company: "StartupX",
    avatar: "DP",
    rating: 5,
    metrics: {
      roas: "+500% ROAS",
      time: "95% Automation",
      growth: "$10M Revenue"
    }
  },
  {
    quote: "The cross-platform optimization and budget allocation AI saved us $2M in ad spend while increasing conversions by 240%. Absolutely revolutionary technology.",
    author: "Jennifer Torres",
    role: "VP Marketing",
    company: "Enterprise Solutions",
    avatar: "JT",
    rating: 5,
    metrics: {
      roas: "+380% ROAS",
      time: "$2M Saved",
      growth: "+240% Conv."
    }
  },
  {
    quote: "PulseBridge's autonomous campaign management allowed us to focus on strategy while AI handled execution. Results speak for themselves - best year in company history.",
    author: "Alex Kumar",
    role: "Growth Manager",
    company: "Digital First",
    avatar: "AK",
    rating: 5,
    metrics: {
      roas: "+310% ROAS",
      time: "100% Autonomous",
      growth: "Best Year Ever"
    }
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
        <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <LandingNavbar />
      
      {/* Phase 3: Advanced Hero Section */}
      <AdvancedHero />

      {/* Live Metrics Section */}
      <LiveMetrics className="bg-secondary" />

      {/* Phase 3: Advanced Data Visualization */}
      <section id="solutions">
        <AdvancedDataViz />
      </section>

      {/* Phase 3: Scroll-Triggered Features */}
      <ScrollTriggeredFeatures />

      {/* Revolutionary Features Section */}
      <motion.section
        id="features"
        ref={featuresRef}
        className="py-32 px-4 sm:px-6 lg:px-8 bg-background relative"
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
            <p className="text-2xl text-foreground max-w-4xl mx-auto leading-relaxed">
              Advanced AI features that give you an unfair advantage in the digital marketing battlefield
            </p>
          </motion.div>

          {/* Layout with vertical icons on left and content on right */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Left Side - Vertical Icon Navigation */}
            <div className="lg:w-1/4 flex flex-row lg:flex-col gap-6 justify-center lg:justify-start">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex flex-col items-center lg:items-start group cursor-pointer"
                  initial={{ x: -50, opacity: 0 }}
                  animate={featuresInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Icon Circle */}
                  <div className={`w-16 h-16 rounded-full ${feature.gradient} p-4 mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  
                  {/* Icon Label (hidden on mobile) */}
                  <div className="hidden lg:block text-center lg:text-left">
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-[120px]">
                      {feature.description.substring(0, 50)}...
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Side - Main Content */}
            <div className="lg:w-3/4">
              <motion.div
                className="text-center lg:text-left mb-12"
                initial={{ y: 50, opacity: 0 }}
                animate={featuresInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Superhuman
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Capabilities
                  </span>
                </h2>
                <p className="text-xl text-foreground max-w-3xl leading-relaxed">
                  Advanced AI features that give you an unfair advantage in the digital marketing battlefield
                </p>
              </motion.div>

              {/* Feature Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={`detail-${feature.title}`}
                    className="bg-muted rounded-2xl p-6 hover:bg-muted/80 transition-all duration-300"
                    initial={{ y: 30, opacity: 0 }}
                    animate={featuresInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${feature.gradient} p-3 flex-shrink-0`}>
                        <feature.icon className="w-full h-full text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Phase 3: Interactive Comparison */}
      <InteractiveComparison />

      {/* Enhanced Testimonials Section */}
      <EnhancedTestimonials 
        testimonials={testimonials}
        className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900/10"
      />

      {/* Phase 3: Advanced Pricing */}
      <div id="pricing">
        <AdvancedPricing />
      </div>
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
        {/* Enhanced gradient background with animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 animate-gradient-shift" />
        
        {/* Galaxy Background */}
        <GalaxyBackground />
        
        {/* Enhanced Floating Particles */}
        <FloatingParticles count={60} colors={['#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899', '#10b981']} />
        
        {/* Floating Orbs */}
        <FloatingOrbs />
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* PulseBridge Logo with enhanced glow */}
          <motion.div
            variants={itemVariants}
            className="mb-12 flex justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="animate-pulse-glow"
            >
              <PulseWaveLogo 
                size="large" 
                variant="dark" 
                animated={true} 
                showText={false}
                className="drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 dark:border-purple-500/50 mb-6 glassmorphism"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 font-exo-2">
                AI Bridge Technology
              </span>
            </motion.div>
          </motion.div>

          {/* Enhanced headline with typewriter effect */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-orbitron font-normal tracking-wide mb-8"
            style={{ letterSpacing: '0.1em' }}
          >
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent gradient-animate">
              Bridge the Gap to
            </span>
            <br />
            <span className="text-gray-900 dark:text-gray-100 font-bold">
              Perfect Marketing
            </span>
            <br />
            <motion.span
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold text-glow"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              with{' '}
              <TypewriterEffect 
                words={["PulseBridge.ai", "AI Automation", "Smart Campaigns", "Perfect ROI"]}
                className="text-white dark:text-white"
                speed={150}
                pauseTime={2000}
              />
            </motion.span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl lg:text-3xl text-gray-700 dark:text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed font-exo-2 font-light"
          >
            Connect your marketing potential with{' '}
            <span className="font-semibold text-blue-600 dark:text-blue-400">AI-powered precision</span>
            {' '}that bridges the gap between strategy and execution. Pulse-driven insights that{' '}
            <span className="font-semibold text-purple-600 dark:text-purple-400">transform campaigns</span>{' '}
            into unstoppable growth engines.
          </motion.p>

          {/* Enhanced CTA section with magnetic buttons */}
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
                className="w-full sm:w-80 px-6 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 glassmorphism"
              />
            </motion.div>
            
            <div className="flex gap-4">
              <MagneticButton
                className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl text-lg font-semibold text-white shadow-2xl shadow-purple-500/50 gradient-animate hover:shadow-purple-500/70 transition-all duration-300"
                strength={0.4}
              >
                <span className="flex items-center">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 animate-bounce-x" />
                </span>
              </MagneticButton>
              
              <GlassButton
                className="px-8 py-4 rounded-2xl text-lg font-semibold"
                variant="default"
              >
                <span className="flex items-center">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </span>
              </GlassButton>
            </div>
          </motion.div>

          {/* Enhanced benefits section */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center space-x-8 text-sm text-gray-700 dark:text-gray-400 mb-8"
          >
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              14-day free trial
            </motion.div>
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              No credit card required
            </motion.div>
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Cancel anytime
            </motion.div>
          </motion.div>

          {/* Enhanced scroll indicator */}
          <motion.div
            variants={itemVariants}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ 
                y: [0, 10, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="flex flex-col items-center cursor-pointer group"
            >
              <span className="text-sm text-gray-700 dark:text-gray-400 mb-2 group-hover:text-blue-500 transition-colors">
                Scroll to explore
              </span>
              <motion.div
                whileHover={{ scale: 1.2 }}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
              </motion.div>
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

      {/* Live Metrics Section */}
      <LiveMetrics className="bg-muted" />

      {/* Revolutionary Features Section */}
      <motion.section
        ref={featuresRef}
        className="py-32 px-4 sm:px-6 lg:px-8 bg-background relative"
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
            <p className="text-2xl text-foreground max-w-4xl mx-auto leading-relaxed">
              Advanced AI features that give you an unfair advantage in the digital marketing battlefield
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <EnhancedFeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
                delay={feature.delay}
                index={index}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Enhanced Testimonials Section */}
      <EnhancedTestimonials 
        testimonials={testimonials}
        className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900/10"
      />

      {/* Testimonials Section */}
      <section id="about" className="py-32 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
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
            className="text-xl text-gray-800 dark:text-gray-300 mb-16 max-w-3xl mx-auto"
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
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                
                <div className="flex items-center justify-center space-x-2 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900 dark:text-white text-lg">
                      {testimonials[currentTestimonial].author}
                    </div>
                    <div className="text-gray-800 dark:text-gray-300">
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

      {/* Enhanced Final CTA Section */}
      <section id="contact">
        <EnhancedCTA className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
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