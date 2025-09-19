'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Brain, 
  Zap, 
  TrendingUp, 
  BarChart3, 
  Play, 
  Pause,
  RotateCcw,
  Target,
  Clock,
  DollarSign,
  Users
} from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PremiumCard } from '@/components/ui/PremiumCard';

// Animation variants
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
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

// Mock data for AI optimization examples
const optimizationExamples = [
  {
    metric: "Click-Through Rate",
    before: "2.1%",
    after: "5.8%",
    improvement: "+176%",
    color: "from-green-500 to-emerald-600"
  },
  {
    metric: "Cost Per Acquisition", 
    before: "$45.20",
    after: "$18.90",
    improvement: "-58%",
    color: "from-blue-500 to-cyan-600"
  },
  {
    metric: "Return on Ad Spend",
    before: "3.2x",
    after: "8.7x",
    improvement: "+172%",
    color: "from-purple-500 to-pink-600"
  },
  {
    metric: "Conversion Rate",
    before: "1.4%",
    after: "4.1%",
    improvement: "+193%",
    color: "from-orange-500 to-red-600"
  }
];

const aiFeatures = [
  {
    icon: Brain,
    title: "Neural Network Optimization",
    description: "Deep learning algorithms continuously analyze campaign performance and adjust bidding strategies in real-time.",
    example: "Automatically identifies the best performing keywords and increases bids by 15-40% while reducing spend on underperformers."
  },
  {
    icon: Target,
    title: "Predictive Audience Targeting",
    description: "AI predicts which audiences are most likely to convert based on historical data and behavioral patterns.",
    example: "Discovered that 25-34 year old professionals in tech convert 3x better on weekday mornings, automatically adjusting targeting."
  },
  {
    icon: Clock,
    title: "Real-Time Bid Adjustments",
    description: "Micro-adjustments every few minutes based on performance data, competitor activity, and market conditions.",
    example: "Made 1,247 bid adjustments in 24 hours, resulting in 34% improvement in ad position while reducing costs."
  },
  {
    icon: BarChart3,
    title: "Performance Forecasting",
    description: "Predicts campaign performance 7-14 days in advance and proactively optimizes for expected conditions.",
    example: "Forecasted 28% increase in search volume for 'holiday marketing' and pre-scaled budgets, capturing 45% more conversions."
  }
];

export default function AIBridgePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const examplesRef = useRef<HTMLDivElement>(null);
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const examplesInView = useInView(examplesRef, { once: true, amount: 0.2 });

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
        variants={containerVariants}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pulse-blue/10 to-bridge-purple/10 border border-pulse-blue/30 mb-6"
          >
            <Brain className="w-5 h-5 text-pulse-blue mr-2" />
            <span className="text-sm font-medium text-pulse-blue">AI-Powered Marketing Bridge</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-7xl font-orbitron font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-pulse-blue via-bridge-purple to-energy-magenta bg-clip-text text-transparent">
              Superhuman AI
            </span>
            <br />
            <span className="text-foreground">Optimization</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Watch our AI make thousands of micro-optimizations every hour, continuously learning and adapting to maximize your campaign performance across all platforms with surgical precision.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <PremiumButton size="lg" className="text-lg px-8 py-4">
              Start Free Trial
            </PremiumButton>
            <PremiumButton variant="outline" size="lg" className="text-lg px-8 py-4">
              Book Demo
            </PremiumButton>
          </motion.div>
        </div>
      </motion.section>

      {/* Interactive AI Demo Section */}
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
                See AI in Action
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Real-time optimization simulation showing how our AI improves your campaigns
            </p>
          </div>

          <PremiumCard className="p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Live Optimization Dashboard</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-2 px-4 py-2 bg-pulse-blue text-white rounded-lg hover:bg-pulse-blue/80 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Pause' : 'Play'} Simulation
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            {/* Optimization metrics grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {optimizationExamples.map((metric, index) => (
                <motion.div
                  key={metric.metric}
                  className="bg-secondary rounded-xl p-6 text-center"
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h4 className="font-medium text-muted-foreground mb-3">{metric.metric}</h4>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Before: {metric.before}</div>
                    <div className="text-xl font-bold text-foreground">After: {metric.after}</div>
                    <div className={`text-sm font-medium bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                      {metric.improvement}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </PremiumCard>
        </div>
      </motion.section>

      {/* AI Features Deep Dive */}
      <motion.section
        ref={featuresRef}
        className="py-20 px-6 bg-secondary"
        variants={containerVariants}
        initial="hidden"
        animate={featuresInView ? "visible" : "hidden"}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              How Our <span className="bg-gradient-to-r from-pulse-blue to-bridge-purple bg-clip-text text-transparent">AI Bridge</span> Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced machine learning algorithms working 24/7 to optimize every aspect of your marketing campaigns
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {aiFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
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
                      <div className="p-4 bg-pulse-blue/5 rounded-lg border-l-4 border-pulse-blue">
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

      {/* Call to Action */}
      <motion.section
        className="py-20 px-6 bg-gradient-to-br from-pulse-blue/10 to-bridge-purple/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Unleash <span className="bg-gradient-to-r from-pulse-blue to-bridge-purple bg-clip-text text-transparent">AI Power</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of marketers who have transformed their campaigns with our AI-powered optimization
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PremiumButton size="lg" className="text-lg px-8 py-4">
              Start Your AI Journey
            </PremiumButton>
            <PremiumButton variant="outline" size="lg" className="text-lg px-8 py-4">
              Schedule Consultation
            </PremiumButton>
          </div>
        </div>
      </motion.section>
    </div>
  );
}