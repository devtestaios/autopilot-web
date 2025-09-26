'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
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
  Bot,
  Play,
  ChevronDown,
  Activity
} from 'lucide-react';

// Import advanced components (we'll add these gradually)
import { PulseWaveLogo } from './PulseWaveLogo';

// Advanced background component with theme support
const AnimatedBackground = () => {
  const { theme } = useTheme();
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl opacity-20"
        style={{ 
          background: theme === 'dark' 
            ? 'radial-gradient(circle, rgb(59, 130, 246) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgb(14, 165, 233) 0%, transparent 70%)'
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl opacity-15"
        style={{ 
          background: theme === 'dark' 
            ? 'radial-gradient(circle, rgb(168, 85, 247) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgb(139, 92, 246) 0%, transparent 70%)'
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

// Enhanced feature card with micro-interactions
const FeatureCard = ({ feature, index }: { feature: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
        animate={{ opacity: isHovered ? 0.1 : 0 }}
      />
      
      {/* Icon with animation */}
      <motion.div 
        className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors relative overflow-hidden"
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.5 }}
      >
        <feature.icon className="w-6 h-6 text-primary relative z-10" />
        <motion.div
          className="absolute inset-0 bg-primary/20 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300"
          initial={{ scale: 0 }}
          animate={{ scale: isHovered ? 1 : 0 }}
        />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
        {feature.title}
      </h3>
      <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
        {feature.description}
      </p>
    </motion.div>
  );
};

export default function HybridLandingPage() {
  const { theme } = useTheme();
  const { scrollY } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Smooth scroll transform for parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.6]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Navigation - Logo + Login Only */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Link href="/" className="flex items-center">
              <motion.div 
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <Bot className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <span className="text-2xl font-bold text-foreground">
                PulseBridge<span className="text-primary">.ai</span>
              </span>
            </Link>
          </motion.div>

          {/* Login Button Only */}
          <div className="flex items-center">
            <Link href="/dashboard">
              <motion.button
                className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-primary/25 font-medium relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                  animate={{ x: ["100%", "-100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                Login
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative pt-32 pb-20 px-6"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Main Headline with Typewriter Effect */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <motion.span 
                className="text-foreground block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                AI-Powered Marketing
              </motion.span>
              <motion.span 
                className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent block"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Automation
              </motion.span>
            </h1>
          </motion.div>

          {/* Subtitle with staggered animation */}
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Autonomous campaign optimization across{" "}
            <motion.span 
              className="text-primary font-semibold"
              whileHover={{ scale: 1.05 }}
            >
              Google Ads, Meta, and LinkedIn
            </motion.span>
            . Increase ROI by 300% with AI that never sleeps.
          </motion.p>

          {/* Enhanced CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <Link href="/dashboard">
              <motion.button
                className="group px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg hover:shadow-primary/25 transform transition-all duration-300 flex items-center gap-2 relative overflow-hidden"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"
                  initial={false}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">Start Free Trial</span>
                <motion.div
                  className="relative z-10"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </Link>
            
            <motion.button 
              className="group px-8 py-4 border-2 border-border text-foreground rounded-xl font-semibold hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5 group-hover:text-primary transition-colors" />
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="flex justify-center items-center gap-8 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              14-day free trial
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Setup in 5 minutes
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Why Leading Agencies Choose{" "}
              <span className="text-primary">PulseBridge</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Advanced AI algorithms that outperform human marketers in speed, accuracy, and results.
            </motion.p>
          </motion.div>

          {/* Enhanced Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Live Metrics Section */}
      <section className="py-20 px-6 bg-muted/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Real-Time Platform Performance
            </h2>
            <p className="text-muted-foreground">
              Live data from campaigns managed by PulseBridge AI
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {realTimeStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-card border border-border"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <motion.div 
                  className="text-4xl font-bold text-primary mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.2 + 0.3 }}
                >
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.2 + 0.5,
                      type: "spring",
                      stiffness: 200 
                    }}
                  >
                    {stat.value}
                  </motion.span>
                </motion.div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
                <div className="text-xs text-muted-foreground/60 mt-1">{stat.subtitle}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to Scale Your Marketing?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of agencies already using AI to dominate their markets.
            </p>
            <Link href="/dashboard">
              <motion.button
                className="px-12 py-4 bg-primary text-primary-foreground rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Free Trial Today
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Feature data
const features = [
  {
    icon: Brain,
    title: "AI-Driven Optimization",
    description: "Advanced machine learning algorithms continuously optimize your campaigns for maximum ROI across all platforms."
  },
  {
    icon: Zap,
    title: "Real-Time Automation",
    description: "Instant bid adjustments, budget reallocation, and audience targeting based on performance data."
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    description: "Forecast campaign performance and market trends with 95% accuracy using our proprietary AI models."
  },
  {
    icon: Target,
    title: "Cross-Platform Management",
    description: "Unified dashboard for Google Ads, Meta, LinkedIn, and Pinterest with seamless integration."
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Built-in safeguards prevent overspending and protect your brand with intelligent monitoring."
  },
  {
    icon: Globe,
    title: "Global Scalability",
    description: "Manage campaigns across multiple markets, languages, and currencies from a single platform."
  }
];

// Stats data
const stats = [
  { value: "300%", label: "Average ROI Increase" },
  { value: "10,000+", label: "Active Campaigns" },
  { value: "24/7", label: "Autonomous Operation" }
];

// Real-time stats for live metrics
const realTimeStats = [
  { 
    value: "$2.4M", 
    label: "Ad Spend Managed Today", 
    subtitle: "↑ 23% vs yesterday" 
  },
  { 
    value: "847", 
    label: "Active Campaigns", 
    subtitle: "Across all platforms" 
  },
  { 
    value: "4.2x", 
    label: "Average ROAS", 
    subtitle: "This month" 
  }
];