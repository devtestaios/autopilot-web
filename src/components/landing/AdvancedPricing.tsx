'use client';

import { motion, useInView, AnimatePresence, Variants } from 'framer-motion';
import { useRef, useState } from 'react';
import { 
  Check, 
  Zap, 
  Crown, 
  Rocket, 
  Star,
  ArrowRight,
  TrendingUp,
  Shield,
  Users,
  Target,
  Sparkles,
  Calculator,
  DollarSign
} from 'lucide-react';

interface PricingTier {
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  highlight?: boolean;
  popular?: boolean;
  savings?: string;
  color: {
    primary: string;
    secondary: string;
    gradient: string;
  };
}

interface ROICalculatorData {
  monthlyAdSpend: number;
  currentROAS: number;
  projectedROAS: number;
  timeSavings: number;
}

export function AdvancedPricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorData, setCalculatorData] = useState<ROICalculatorData>({
    monthlyAdSpend: 10000,
    currentROAS: 3,
    projectedROAS: 8.5,
    timeSavings: 30
  });

  const pricingTiers: PricingTier[] = [
    {
      name: 'Starter',
      price: billingCycle === 'monthly' ? 299 : 249,
      originalPrice: billingCycle === 'monthly' ? undefined : 299,
      period: billingCycle === 'monthly' ? '/month' : '/month (billed yearly)',
      description: 'Perfect for small agencies and growing businesses',
      icon: Rocket,
      savings: billingCycle === 'yearly' ? 'Save $600/year' : undefined,
      features: [
        'AI Campaign Optimization',
        'Up to 5 active campaigns',
        'Google Ads + Meta integration',
        'Basic performance analytics',
        'Email support',
        '24/7 monitoring',
        'Budget protection',
        'Monthly strategy reports'
      ],
      color: {
        primary: 'blue',
        secondary: 'blue-100',
        gradient: 'from-blue-500 to-cyan-500'
      }
    },
    {
      name: 'Professional',
      price: billingCycle === 'monthly' ? 599 : 499,
      originalPrice: billingCycle === 'monthly' ? undefined : 599,
      period: billingCycle === 'monthly' ? '/month' : '/month (billed yearly)',
      description: 'Ideal for established agencies and enterprise teams',
      icon: Crown,
      highlight: true,
      popular: true,
      savings: billingCycle === 'yearly' ? 'Save $1,200/year' : undefined,
      features: [
        'Everything in Starter',
        'Unlimited campaigns',
        'LinkedIn Ads integration',
        'Advanced predictive analytics',
        'Priority support + dedicated manager',
        'Custom AI training',
        'White-label reporting',
        'API access',
        'Multi-user collaboration',
        'Advanced budget optimization'
      ],
      color: {
        primary: 'purple',
        secondary: 'purple-100',
        gradient: 'from-purple-500 to-pink-500'
      }
    },
    {
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 1499 : 1249,
      originalPrice: billingCycle === 'monthly' ? undefined : 1499,
      period: billingCycle === 'monthly' ? '/month' : '/month (billed yearly)',
      description: 'Complete solution for large enterprises and agencies',
      icon: Star,
      savings: billingCycle === 'yearly' ? 'Save $3,000/year' : undefined,
      features: [
        'Everything in Professional',
        'Custom platform integrations',
        'Dedicated infrastructure',
        'Advanced ML model training',
        '24/7 phone support',
        'On-site training & setup',
        'Custom feature development',
        'SLA guarantees',
        'Advanced security features',
        'Compliance reporting'
      ],
      color: {
        primary: 'orange',
        secondary: 'orange-100',
        gradient: 'from-orange-500 to-red-500'
      }
    }
  ];

  const calculateROI = () => {
    const { monthlyAdSpend, currentROAS, projectedROAS, timeSavings } = calculatorData;
    
    const currentRevenue = monthlyAdSpend * currentROAS;
    const projectedRevenue = monthlyAdSpend * projectedROAS;
    const additionalRevenue = projectedRevenue - currentRevenue;
    const annualAdditionalRevenue = additionalRevenue * 12;
    
    const timeSavingsValue = (timeSavings / 100) * 5000; // Assuming $5000/month time value
    const annualTimeSavings = timeSavingsValue * 12;
    
    return {
      monthlyAdditionalRevenue: additionalRevenue,
      annualAdditionalRevenue,
      annualTimeSavings,
      totalAnnualValue: annualAdditionalRevenue + annualTimeSavings,
      roiMultiplier: Math.round((annualAdditionalRevenue + annualTimeSavings) / (599 * 12))
    };
  };

  const roiResults = calculateROI();

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

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  } as const;

  return (
    <motion.section
      ref={ref}
      className="py-20 px-4 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
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
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">Transparent Pricing</span>
            <Sparkles className="w-5 h-5" />
          </motion.div>

          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-gray-900 dark:text-white">Choose Your</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Growth Plan
            </span>
          </motion.h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Start with any plan and scale as you grow. No setup fees, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <motion.div
            className="inline-flex items-center bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-gray-700"
            variants={itemVariants}
          >
            <motion.button
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => setBillingCycle('monthly')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Monthly
            </motion.button>
            <motion.button
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 relative ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => setBillingCycle('yearly')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Yearly
              <motion.span
                className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                20% OFF
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid lg:grid-cols-3 gap-8 mb-16"
          variants={itemVariants}
        >
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              className={`relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
                tier.highlight
                  ? 'border-purple-500 shadow-2xl scale-105'
                  : 'border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:scale-102'
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -10, scale: tier.highlight ? 1.05 : 1.02 }}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <motion.div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </motion.div>
              )}

              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tier.color.gradient} opacity-5`} />

              <div className="relative p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${tier.color.gradient} mb-4`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <tier.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {tier.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {tier.description}
                  </p>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-center justify-center">
                      <span className="text-5xl font-bold text-gray-900 dark:text-white">
                        ${tier.price}
                      </span>
                      <div className="ml-2">
                        {tier.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            ${tier.originalPrice}
                          </div>
                        )}
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {tier.period}
                        </div>
                      </div>
                    </div>
                    
                    {tier.savings && (
                      <motion.div
                        className="inline-block mt-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium"
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {tier.savings}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <motion.div
                      key={feature}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ delay: (index * 0.2) + (featureIndex * 0.1), duration: 0.4 }}
                    >
                      <motion.div
                        className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r ${tier.color.gradient} flex items-center justify-center mr-3 mt-0.5`}
                        whileHover={{ scale: 1.2, rotate: 180 }}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                    tier.highlight
                      ? `bg-gradient-to-r ${tier.color.gradient} text-white shadow-lg hover:shadow-xl`
                      : `border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-${tier.color.primary}-500 hover:text-${tier.color.primary}-500`
                  }`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tier.highlight ? 'Start Free Trial' : 'Get Started'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ROI Calculator */}
        <motion.div
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-gray-700 p-8"
          variants={itemVariants}
        >
          <div className="text-center mb-8">
            <motion.button
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setShowCalculator(!showCalculator)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Calculator className="w-6 h-6" />
              Calculate Your ROI
              <motion.div
                animate={{ rotate: showCalculator ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </div>

          <AnimatePresence>
            {showCalculator && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="grid lg:grid-cols-2 gap-8"
              >
                {/* Calculator Inputs */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Your Current Numbers
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Monthly Ad Spend
                    </label>
                    <input
                      type="number"
                      value={calculatorData.monthlyAdSpend}
                      onChange={(e) => setCalculatorData({ ...calculatorData, monthlyAdSpend: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current ROAS
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={calculatorData.currentROAS}
                      onChange={(e) => setCalculatorData({ ...calculatorData, currentROAS: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Expected ROAS with PulseBridge
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={calculatorData.projectedROAS}
                      onChange={(e) => setCalculatorData({ ...calculatorData, projectedROAS: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Results */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Your Potential Returns
                  </h3>
                  
                  <div className="space-y-4">
                    <motion.div
                      className="flex justify-between items-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl"
                      whileHover={{ scale: 1.02 }}
                    >
                      <span className="text-gray-700 dark:text-gray-300">Additional Monthly Revenue</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${roiResults.monthlyAdditionalRevenue.toLocaleString()}
                      </span>
                    </motion.div>
                    
                    <motion.div
                      className="flex justify-between items-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl"
                      whileHover={{ scale: 1.02 }}
                    >
                      <span className="text-gray-700 dark:text-gray-300">Annual Additional Revenue</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${roiResults.annualAdditionalRevenue.toLocaleString()}
                      </span>
                    </motion.div>
                    
                    <motion.div
                      className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl"
                      whileHover={{ scale: 1.02 }}
                      animate={{
                        boxShadow: [
                          '0 4px 20px rgba(59, 130, 246, 0.3)',
                          '0 8px 30px rgba(147, 51, 234, 0.4)',
                          '0 4px 20px rgba(59, 130, 246, 0.3)',
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <span className="font-semibold">ROI Multiplier</span>
                      <span className="text-3xl font-bold">
                        {roiResults.roiMultiplier}x
                      </span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

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
            <TrendingUp className="w-6 h-6 mr-3" />
            Start Your Free 14-Day Trial
            <motion.div
              className="ml-3"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowRight className="w-6 h-6" />
            </motion.div>
          </motion.button>
          
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            No credit card required • Cancel anytime • Full access to all features
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}