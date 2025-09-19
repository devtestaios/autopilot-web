'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Calendar,
  Target,
  Brain,
  Zap,
  Eye
} from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PremiumCard } from '@/components/ui/PremiumCard';

const predictionExamples = [
  {
    timeframe: "Next 7 Days",
    metric: "Search Volume",
    prediction: "+23% increase",
    confidence: "94%",
    action: "Increase budget by 18%",
    color: "from-green-500 to-emerald-600"
  },
  {
    timeframe: "Next 14 Days", 
    metric: "CPM Rates",
    prediction: "+15% increase",
    confidence: "87%",
    action: "Pre-book inventory",
    color: "from-blue-500 to-cyan-600"
  },
  {
    timeframe: "Next 30 Days",
    metric: "Conversion Rate",
    prediction: "-8% seasonal dip",
    confidence: "91%", 
    action: "Adjust targeting strategy",
    color: "from-orange-500 to-red-600"
  }
];

const analyticsFeatures = [
  {
    icon: Activity,
    title: "Market Trend Forecasting",
    description: "Predict market changes 7-30 days in advance using advanced ML algorithms and external data sources.",
    example: "Predicted 40% surge in 'remote work software' searches before major news announcements."
  },
  {
    icon: Target,
    title: "Audience Behavior Prediction",
    description: "Forecast how different audience segments will respond to campaigns based on historical patterns.",
    example: "Identified that tech professionals engage 60% more with video ads on Tuesday afternoons."
  },
  {
    icon: Brain,
    title: "Competitive Intelligence",
    description: "Analyze competitor moves and predict their impact on your campaign performance.",
    example: "Detected competitor budget increase and automatically adjusted bidding strategy to maintain position."
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Automatically implement changes based on predictions to maximize ROI before trends hit.",
    example: "Pre-scaled 'holiday shopping' campaigns 2 weeks early, capturing 35% more market share."
  }
];

export default function PredictiveAnalyticsPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });

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
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pulse-blue/10 to-bridge-purple/10 border border-pulse-blue/30 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <TrendingUp className="w-5 h-5 text-pulse-blue mr-2" />
            <span className="text-sm font-medium text-pulse-blue">Predictive Analytics</span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-orbitron font-bold mb-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-pulse-blue via-bridge-purple to-energy-magenta bg-clip-text text-transparent">
              See the Future
            </span>
            <br />
            <span className="text-foreground">Before It Happens</span>
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Advanced machine learning algorithms predict market trends and automatically adjust your campaigns 24/7 for maximum ROI and reduced cost per acquisition.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <PremiumButton size="lg" className="text-lg px-8 py-4">
              See Predictions
            </PremiumButton>
            <PremiumButton variant="outline" size="lg" className="text-lg px-8 py-4">
              Watch Demo
            </PremiumButton>
          </motion.div>
        </div>
      </motion.section>

      {/* Prediction Dashboard */}
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
                Live Predictions Dashboard
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Real-time forecasts for your campaigns with actionable recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {predictionExamples.map((prediction, index) => (
              <motion.div
                key={prediction.timeframe}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <PremiumCard className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-5 h-5 text-pulse-blue" />
                    <span className="font-medium text-pulse-blue">{prediction.timeframe}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{prediction.metric}</h3>
                  <div className="text-2xl font-bold mb-2">
                    <span className={`bg-gradient-to-r ${prediction.color} bg-clip-text text-transparent`}>
                      {prediction.prediction}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {prediction.confidence} confidence
                    </span>
                  </div>
                  
                  <div className="p-3 bg-pulse-blue/5 rounded-lg border-l-4 border-pulse-blue">
                    <p className="text-sm">
                      <strong>Recommended Action:</strong> {prediction.action}
                    </p>
                  </div>
                </PremiumCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Analytics Features */}
      <motion.section
        ref={featuresRef}
        className="py-20 px-6 bg-secondary"
        initial={{ opacity: 0 }}
        animate={featuresInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Advanced <span className="bg-gradient-to-r from-pulse-blue to-bridge-purple bg-clip-text text-transparent">Predictive Capabilities</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powered by machine learning algorithms that analyze millions of data points to forecast market changes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {analyticsFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
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
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                        <p className="text-sm"><strong>Success Story:</strong> {feature.example}</p>
                      </div>
                    </div>
                  </div>
                </PremiumCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Chart Visualization Section */}
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
                Trend Visualization
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Interactive charts showing predicted vs actual performance
            </p>
          </div>

          <PremiumCard className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Performance Forecast</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-3 h-3 bg-pulse-blue rounded-full"></div>
                <span>Predicted</span>
                <div className="w-3 h-3 bg-bridge-purple rounded-full ml-4"></div>
                <span>Actual</span>
              </div>
            </div>
            
            {/* Placeholder for chart - in real implementation, you'd use a chart library */}
            <div className="h-64 bg-gradient-to-br from-pulse-blue/5 to-bridge-purple/5 rounded-lg flex items-center justify-center border">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-pulse-blue mx-auto mb-4" />
                <p className="text-muted-foreground">Interactive Prediction Chart</p>
                <p className="text-sm text-muted-foreground">Real chart integration coming soon</p>
              </div>
            </div>
          </PremiumCard>
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
            Start <span className="bg-gradient-to-r from-pulse-blue to-bridge-purple bg-clip-text text-transparent">Predicting Success</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Get ahead of market trends and optimize your campaigns before your competitors even know what's coming
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PremiumButton size="lg" className="text-lg px-8 py-4">
              Access Predictions
            </PremiumButton>
            <PremiumButton variant="outline" size="lg" className="text-lg px-8 py-4">
              Book Analytics Demo
            </PremiumButton>
          </div>
        </div>
      </motion.section>
    </div>
  );
}