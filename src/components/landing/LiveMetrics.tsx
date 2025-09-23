'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import CountUp from 'react-countup';

interface MetricCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  color: string;
  index: number;
  isLive?: boolean;
}

interface LiveMetricsProps {
  className?: string;
}

export function LiveMetrics({ className = '' }: LiveMetricsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [metrics, setMetrics] = useState({
    campaigns: 1247,
    roas: 340,
    spend: 2847392,
    conversions: 48392
  });
  
  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        campaigns: prev.campaigns + Math.floor(Math.random() * 3),
        roas: prev.roas + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5),
        spend: prev.spend + Math.floor(Math.random() * 2000),
        conversions: prev.conversions + Math.floor(Math.random() * 10)
      }));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const metricsData = [
    {
      label: "Active Campaigns",
      value: metrics.campaigns,
      prefix: "",
      suffix: "",
      color: "blue",
      isLive: true
    },
    {
      label: "Average ROAS",
      value: metrics.roas,
      prefix: "",
      suffix: "%",
      color: "green",
      isLive: true
    },
    {
      label: "Ad Spend Managed",
      value: metrics.spend,
      prefix: "$",
      suffix: "",
      color: "purple",
      isLive: true
    },
    {
      label: "Conversions Today",
      value: metrics.conversions,
      prefix: "",
      suffix: "",
      color: "cyan",
      isLive: true
    }
  ];

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

  return (
    <motion.section
      ref={ref}
      className={`py-20 px-4 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 dark:from-gray-900 dark:via-blue-900/40 dark:to-purple-900/40 relative overflow-hidden ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            animate={{
              x: [0, Math.random() * 100],
              y: [0, Math.random() * 100],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-white">Delivering Results</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent gradient-animate">
              Right Now
            </span>
          </motion.h2>
          
          <motion.p
            className="text-xl text-blue-100 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Live metrics from campaigns running on our platform this very moment
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {metricsData.map((metric, index) => (
            <MetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              prefix={metric.prefix}
              suffix={metric.suffix}
              color={metric.color}
              index={index}
              isLive={metric.isLive}
            />
          ))}
        </motion.div>

        {/* Live indicator */}
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20">
            <motion.div
              className="w-3 h-3 bg-green-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <span className="text-white text-sm font-medium">Live Data • Updates Every 3 Seconds</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function MetricCard({ label, value, prefix = "", suffix = "", color, index, isLive = false }: MetricCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const colorMap = {
    blue: {
      gradient: "from-blue-400 to-blue-600",
      glow: "shadow-blue-500/50",
      bg: "bg-blue-500/20",
      border: "border-blue-400/30"
    },
    green: {
      gradient: "from-green-400 to-green-600",
      glow: "shadow-green-500/50",
      bg: "bg-green-500/20",
      border: "border-green-400/30"
    },
    purple: {
      gradient: "from-purple-400 to-purple-600",
      glow: "shadow-purple-500/50",
      bg: "bg-purple-500/20",
      border: "border-purple-400/30"
    },
    cyan: {
      gradient: "from-cyan-400 to-cyan-600",
      glow: "shadow-cyan-500/50",
      bg: "bg-cyan-500/20",
      border: "border-cyan-400/30"
    }
  };

  const colorScheme = colorMap[color as keyof typeof colorMap] || colorMap.blue;

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.9,
      rotateY: -15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ 
        y: -8,
        scale: 1.05,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      className="perspective-1000"
    >
      <div className={`p-6 rounded-xl bg-white/5 backdrop-blur-lg border ${colorScheme.border} hover:bg-white/10 transition-all duration-300 group ${colorScheme.glow} hover:shadow-xl relative overflow-hidden`}>
        
        {/* Background glow effect */}
        <motion.div
          className={`absolute inset-0 ${colorScheme.bg} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
          whileHover={{ scale: 1.1 }}
        />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 bg-gradient-to-r ${colorScheme.gradient} rounded-full`}
              animate={{
                x: [0, Math.random() * 50],
                y: [0, Math.random() * 50],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <p className="text-sm text-gray-400 mb-2 font-medium">{label}</p>
          
          <div className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${colorScheme.gradient} bg-clip-text text-transparent mb-4`}>
            {prefix}
            {isInView && (
              <CountUp
                end={value}
                duration={2.5}
                separator=","
                preserveValue
              />
            )}
            {suffix}
          </div>
          
          {/* Live indicator */}
          {isLive && (
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className={`w-2 h-2 rounded-full bg-gradient-to-r ${colorScheme.gradient}`}
                animate={{ 
                  scale: [1, 1.3, 1], 
                  opacity: [0.6, 1, 0.6] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span className="text-xs text-gray-500 font-medium">Live</span>
            </motion.div>
          )}
        </div>

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full opacity-0 group-hover:opacity-100"
          whileHover={{ 
            translateX: '200%',
            transition: { duration: 0.8 }
          }}
        />
      </div>
    </motion.div>
  );
}