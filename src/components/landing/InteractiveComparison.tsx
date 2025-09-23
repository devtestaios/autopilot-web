'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Crown, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  Clock,
  Star,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ComparisonFeature {
  category: string;
  features: {
    name: string;
    description: string;
    manual: boolean | string;
    competitor: boolean | string;
    pulsebridge: boolean | string;
    highlight?: boolean;
  }[];
}

interface InteractiveComparisonProps {
  className?: string;
}

export function InteractiveComparison({ className = '' }: InteractiveComparisonProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);

  const comparisonData: ComparisonFeature[] = [
    {
      category: 'AI & Automation',
      features: [
        {
          name: 'Real-time Optimization',
          description: 'Continuous campaign adjustments based on performance data',
          manual: false,
          competitor: 'Basic',
          pulsebridge: 'Advanced AI',
          highlight: true
        },
        {
          name: 'Predictive Analytics',
          description: 'Forecast campaign performance with 95% accuracy',
          manual: false,
          competitor: false,
          pulsebridge: true,
          highlight: true
        },
        {
          name: 'Cross-platform Sync',
          description: 'Unified optimization across all advertising platforms',
          manual: false,
          competitor: 'Limited',
          pulsebridge: 'Full Integration'
        },
        {
          name: 'Autonomous Decision Making',
          description: 'AI makes campaign decisions without human intervention',
          manual: false,
          competitor: false,
          pulsebridge: true,
          highlight: true
        }
      ]
    },
    {
      category: 'Performance & Speed',
      features: [
        {
          name: 'Campaign Setup Time',
          description: 'Time required to launch new campaigns',
          manual: '2-4 hours',
          competitor: '30-60 min',
          pulsebridge: '< 5 minutes',
          highlight: true
        },
        {
          name: 'Optimization Response',
          description: 'How quickly the system responds to performance changes',
          manual: '24+ hours',
          competitor: '2-6 hours',
          pulsebridge: '< 1 minute',
          highlight: true
        },
        {
          name: 'Data Processing',
          description: 'Real-time data analysis and insights generation',
          manual: 'Manual reports',
          competitor: 'Hourly updates',
          pulsebridge: 'Real-time',
          highlight: true
        },
        {
          name: 'A/B Testing Speed',
          description: 'Time to statistical significance in tests',
          manual: '2-4 weeks',
          competitor: '1-2 weeks',
          pulsebridge: '2-3 days'
        }
      ]
    },
    {
      category: 'ROI & Results',
      features: [
        {
          name: 'Average ROAS Improvement',
          description: 'Typical return on ad spend enhancement',
          manual: 'Baseline',
          competitor: '+80-120%',
          pulsebridge: '+340%',
          highlight: true
        },
        {
          name: 'Cost Reduction',
          description: 'Decrease in cost per acquisition',
          manual: 'N/A',
          competitor: '20-40%',
          pulsebridge: '65%',
          highlight: true
        },
        {
          name: 'Time Savings',
          description: 'Reduction in manual campaign management time',
          manual: 'N/A',
          competitor: '30-50%',
          pulsebridge: '85%'
        },
        {
          name: 'Revenue Growth',
          description: 'Overall revenue increase from optimized campaigns',
          manual: 'Variable',
          competitor: '50-100%',
          pulsebridge: '200-400%',
          highlight: true
        }
      ]
    },
    {
      category: 'Support & Reliability',
      features: [
        {
          name: 'Uptime Guarantee',
          description: 'System availability and reliability commitment',
          manual: 'N/A',
          competitor: '99%',
          pulsebridge: '99.9%'
        },
        {
          name: '24/7 Monitoring',
          description: 'Continuous system and campaign monitoring',
          manual: false,
          competitor: 'Business hours',
          pulsebridge: true,
          highlight: true
        },
        {
          name: 'Dedicated Support',
          description: 'Access to specialized support team',
          manual: false,
          competitor: 'Email only',
          pulsebridge: 'Priority Support'
        },
        {
          name: 'Risk Protection',
          description: 'Budget protection and fraud prevention',
          manual: false,
          competitor: 'Basic',
          pulsebridge: 'Enterprise-grade',
          highlight: true
        }
      ]
    }
  ];

  useEffect(() => {
    if (isInView) {
      setTimeout(() => setShowAnimation(true), 500);
    }
  }, [isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const renderCellContent = (value: boolean | string, type: 'manual' | 'competitor' | 'pulsebridge') => {
    if (typeof value === 'boolean') {
      return value ? (
        <motion.div
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
            type === 'pulsebridge' ? 'bg-green-500' : 'bg-blue-500'
          }`}
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ duration: 0.3 }}
        >
          <Check className="w-5 h-5 text-white" />
        </motion.div>
      ) : (
        <motion.div
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500"
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 0.3 }}
        >
          <X className="w-5 h-5 text-white" />
        </motion.div>
      );
    }

    return (
      <motion.span
        className={`font-medium ${
          type === 'pulsebridge' 
            ? 'text-blue-600 dark:text-blue-400' 
            : type === 'competitor'
            ? 'text-gray-700 dark:text-gray-300'
            : 'text-gray-600 dark:text-gray-400'
        }`}
        whileHover={{ scale: 1.05 }}
      >
        {value}
      </motion.span>
    );
  };

  return (
    <motion.section
      ref={ref}
      className={`py-20 px-4 relative overflow-hidden ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20" />
        
        {/* Animated Grid */}
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear'
          }}
          style={{
            backgroundImage: `linear-gradient(90deg, #3B82F6 1px, transparent 1px),
                            linear-gradient(180deg, #3B82F6 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={itemVariants}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-6"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
          >
            <Crown className="w-5 h-5" />
            <span className="text-sm font-medium">Industry Comparison</span>
            <Sparkles className="w-5 h-5" />
          </motion.div>

          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-gray-900 dark:text-white">Why Choose</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              PulseBridge.ai?
            </span>
          </motion.h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            See how our AI-powered platform outperforms traditional methods and competitors
          </p>
        </motion.div>

        {/* Category Navigation */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          variants={itemVariants}
        >
          {comparisonData.map((category, index) => (
            <motion.button
              key={category.category}
              className={`flex items-center px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                activeCategory === index
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
              onClick={() => setActiveCategory(index)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {index === 0 && <Zap className="w-5 h-5 mr-2" />}
              {index === 1 && <TrendingUp className="w-5 h-5 mr-2" />}
              {index === 2 && <Star className="w-5 h-5 mr-2" />}
              {index === 3 && <Shield className="w-5 h-5 mr-2" />}
              {category.category}
            </motion.button>
          ))}
        </motion.div>

        {/* Comparison Table */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 p-6 bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Feature
                </h3>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <Users className="w-5 h-5 mr-2 text-gray-600" />
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Manual
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <Clock className="w-5 h-5 mr-2 text-orange-500" />
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Competitors
                  </span>
                </div>
              </div>
              <div className="text-center">
                <motion.div
                  className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl py-2 px-4"
                  whileHover={{ scale: 1.05 }}
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(59, 130, 246, 0.4)',
                      '0 0 20px 10px rgba(59, 130, 246, 0)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Crown className="w-5 h-5 mr-2" />
                  <span className="text-lg font-semibold">PulseBridge.ai</span>
                </motion.div>
              </div>
            </div>

            {/* Table Content */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {comparisonData[activeCategory].features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  className={`grid grid-cols-4 gap-4 p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200 ${
                    feature.highlight ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={showAnimation ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.01, x: 5 }}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      {feature.highlight && (
                        <motion.div
                          className="w-2 h-2 bg-blue-500 rounded-full mr-3"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.8, 1, 0.8]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {feature.name}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {feature.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    {renderCellContent(feature.manual, 'manual')}
                  </div>
                  
                  <div className="flex items-center justify-center">
                    {renderCellContent(feature.competitor, 'competitor')}
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <motion.div
                      className={feature.highlight ? 'relative' : ''}
                      whileHover={feature.highlight ? { scale: 1.1 } : {}}
                    >
                      {feature.highlight && (
                        <motion.div
                          className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-lg"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.4, 0.2]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      {renderCellContent(feature.pulsebridge, 'pulsebridge')}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          variants={itemVariants}
        >
          <motion.button
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Zap className="w-6 h-6 mr-3" />
            Experience the Difference
            <motion.div
              className="ml-3"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowRight className="w-6 h-6" />
            </motion.div>
          </motion.button>
          
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Join 10,000+ marketers who've switched to AI-powered optimization
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}