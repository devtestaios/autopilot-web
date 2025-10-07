'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { 
  Brain, 
  Zap, 
  Target, 
  Shield, 
  Globe, 
  TrendingUp,
  Eye,
  Sparkles,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface AdvancedFeature {
  id: string;
  icon: any;
  title: string;
  description: string;
  details: string[];
  gradient: string;
  benefits: string[];
}

interface ScrollTriggeredFeaturesProps {
  className?: string;
}

export function ScrollTriggeredFeatures({ className = '' }: ScrollTriggeredFeaturesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const features: AdvancedFeature[] = [
    {
      id: 'ai-brain',
      icon: Brain,
      title: 'Neural Marketing Intelligence',
      description: 'Advanced AI that learns from 10M+ data points to optimize your campaigns in real-time.',
      details: [
        'Deep learning algorithms analyze audience behavior patterns',
        'Predictive modeling for campaign performance forecasting',
        'Automated A/B testing with statistical significance detection',
        'Cross-platform optimization using unified data insights'
      ],
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      benefits: ['340% ROAS improvement', '85% time savings', '99.9% accuracy']
    },
    {
      id: 'lightning-execution',
      icon: Zap,
      title: 'Lightning-Fast Execution',
      description: 'Millisecond-level bid adjustments and real-time campaign optimization across all platforms.',
      details: [
        'Sub-second bid optimization based on market conditions',
        'Real-time budget reallocation across platforms',
        'Instant pause/resume for underperforming campaigns',
        'Dynamic creative optimization with performance tracking'
      ],
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      benefits: ['10x faster execution', '24/7 optimization', '0.1s response time']
    },
    {
      id: 'precision-targeting',
      icon: Target,
      title: 'Precision Targeting Matrix',
      description: 'Multi-dimensional audience segmentation using advanced behavioral and demographic analysis.',
      details: [
        'AI-powered lookalike audience generation',
        'Real-time audience quality scoring and optimization',
        'Cross-platform audience synchronization',
        'Predictive lifetime value modeling for better targeting'
      ],
      gradient: 'from-green-500 via-teal-500 to-blue-500',
      benefits: ['92% audience match rate', '45% better CTR', '67% lower CPA']
    },
    {
      id: 'risk-shield',
      icon: Shield,
      title: 'Advanced Risk Protection',
      description: 'Enterprise-grade safeguards that protect your budget and prevent campaign disasters.',
      details: [
        'Anomaly detection with instant alert systems',
        'Budget protection with intelligent spending limits',
        'Fraud detection using machine learning patterns',
        'Performance degradation early warning system'
      ],
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      benefits: ['$2M+ protected', '100% fraud prevention', '0 budget overruns']
    },
    {
      id: 'global-reach',
      icon: Globe,
      title: 'Global Market Intelligence',
      description: 'Expand worldwide with AI-powered localization and international market optimization.',
      details: [
        'Cultural sentiment analysis for global campaigns',
        'Currency and economic factor optimization',
        'Time zone and seasonality adjustments',
        'Local compliance and regulation management'
      ],
      gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
      benefits: ['195 countries supported', '40+ languages', '99% compliance rate']
    },
    {
      id: 'performance-insights',
      icon: TrendingUp,
      title: 'Predictive Performance Insights',
      description: 'Future-focused analytics that predict trends and optimize for tomorrow\'s opportunities.',
      details: [
        'Trend forecasting with 95% accuracy rates',
        'Seasonal performance prediction modeling',
        'Competitive intelligence and market analysis',
        'Revenue projection with confidence intervals'
      ],
      gradient: 'from-emerald-500 via-green-500 to-teal-500',
      benefits: ['95% forecast accuracy', '6-month predictions', '2x revenue growth']
    }
  ];

  useEffect(() => {
    setViewportHeight(window.innerHeight);
  }, []);

  // Parallax transforms
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <motion.section
      ref={containerRef}
      className={`relative py-32 px-4 overflow-hidden ${className}`}
      style={{ minHeight: `${features.length * 100}vh` }}
    >
      {/* Dynamic Background */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{
          background: `linear-gradient(135deg, 
            hsl(${activeFeature * 60}, 70%, 95%) 0%, 
            hsl(${(activeFeature * 60 + 60) % 360}, 70%, 98%) 100%)`
        }}
      />

      {/* Floating Geometric Elements */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + (i * 6)}%`,
              top: `${5 + (i * 7)}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5
            }}
          >
            <div 
              className={`w-4 h-4 bg-gradient-to-r ${features[activeFeature]?.gradient} rounded-full blur-sm`}
            />
          </motion.div>
        ))}
      </div>

      {/* Fixed Header */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-30 pt-16 pb-4 bg-gradient-to-b from-white/80 to-transparent dark:from-gray-900/80 backdrop-blur-xl"
        style={{ y: headerY }}
      >
        <div className="max-w-3xl mx-auto text-center px-4">
          <motion.h2
            className="text-lg sm:text-xl lg:text-2xl font-bold mb-2"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <span className="text-foreground">Advanced </span>
            <span 
              className={`bg-gradient-to-r ${features[activeFeature]?.gradient} bg-clip-text text-transparent`}
            >
              AI Capabilities
            </span>
          </motion.h2>
          
          <motion.p
            className="text-sm text-muted-foreground max-w-2xl mx-auto leading-tight"
            key={activeFeature}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {features[activeFeature]?.description}
          </motion.p>
        </div>
      </motion.div>

      {/* Sticky Feature Navigation */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
        <div className="space-y-4">
          {features.map((feature, index) => (
            <motion.button
              key={feature.id}
              className={`group relative w-12 h-12 rounded-full transition-all duration-300 ${
                activeFeature === index 
                  ? `bg-gradient-to-r ${feature.gradient} shadow-lg` 
                  : 'bg-white/20 backdrop-blur-lg border border-white/30'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveFeature(index)}
            >
              <feature.icon 
                className={`w-6 h-6 m-auto ${
                  activeFeature === index ? 'text-white' : 'text-muted-foreground'
                }`} 
              />
              
              {/* Tooltip */}
              <motion.div
                className="absolute left-16 top-1/2 -translate-y-1/2 bg-muted text-foreground px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                {feature.title}
              </motion.div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 pt-64">
        {features.map((feature, index) => (
          <FeatureSection
            key={feature.id}
            feature={feature}
            index={index}
            isActive={activeFeature === index}
            onEnterView={() => setActiveFeature(index)}
          />
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center space-x-2 bg-muted/20 backdrop-blur-lg rounded-full px-6 py-3 border border-border/30">
          <span className="text-sm text-muted-foreground">
            {activeFeature + 1} / {features.length}
          </span>
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${features[activeFeature]?.gradient}`}
              initial={{ width: '0%' }}
              animate={{ width: `${((activeFeature + 1) / features.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

interface FeatureSectionProps {
  feature: AdvancedFeature;
  index: number;
  isActive: boolean;
  onEnterView: () => void;
}

function FeatureSection({ feature, index, isActive, onEnterView }: FeatureSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-40%" });

  useEffect(() => {
    if (isInView) {
      onEnterView();
    }
  }, [isInView, onEnterView]);

  return (
    <motion.div
      ref={ref}
      className="min-h-screen flex items-center justify-center py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Feature Visualization */}
        <motion.div
          className="relative"
          initial={{ x: -100, opacity: 0 }}
          animate={isActive ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Main Icon with Orbit Animation */}
          <div className="relative w-80 h-80 mx-auto">
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-full opacity-20 blur-3xl`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            <motion.div
              className={`absolute inset-8 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center`}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <feature.icon className="w-32 h-32 text-white" />
            </motion.div>

            {/* Orbiting Elements */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-white rounded-full shadow-lg"
                style={{
                  left: '50%',
                  top: '50%',
                  transformOrigin: `${120 + i * 10}px 0px`,
                }}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 0.5
                }}
              />
            ))}
          </div>

          {/* Floating Stats */}
          <div className="absolute -top-8 -right-8 space-y-4">
            {feature.benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                className="bg-card/90 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-lg border border-border/50"
                initial={{ x: 50, opacity: 0 }}
                animate={isActive ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
                transition={{ delay: 0.5 + i * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05, x: -5 }}
              >
                <div className="text-sm font-semibold text-card-foreground">
                  {benefit}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feature Content */}
        <motion.div
          className="space-y-8"
          initial={{ x: 100, opacity: 0 }}
          animate={isActive ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div>
            <motion.h3
              className="text-4xl sm:text-5xl font-bold mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <span className={`bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                {feature.title}
              </span>
            </motion.h3>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>

          {/* Feature Details */}
          <div className="space-y-4">
            {feature.details.map((detail, i) => (
              <motion.div
                key={detail}
                className="flex items-start space-x-4"
                initial={{ x: 30, opacity: 0 }}
                animate={isActive ? { x: 0, opacity: 1 } : { x: 30, opacity: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                whileHover={{ x: 10 }}
              >
                <motion.div
                  className={`w-6 h-6 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle className="w-4 h-4 text-white" />
                </motion.div>
                <span className="text-foreground/80 leading-relaxed">
                  {detail}
                </span>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            className={`group flex items-center px-8 py-4 bg-gradient-to-r ${feature.gradient} text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 30, opacity: 0 }}
            animate={isActive ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Eye className="w-5 h-5 mr-3" />
            Explore {feature.title}
            <motion.div
              className="ml-3"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}