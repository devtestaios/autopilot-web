'use client';

import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Zap, TrendingUp, Target, Brain, Sparkles, ArrowDown } from 'lucide-react';

interface AdvancedHeroProps {
  className?: string;
}

export function AdvancedHero({ className = '' }: AdvancedHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const { scrollY } = useScroll();
  const isInView = useInView(containerRef, { once: true });

  // Parallax transforms
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const textY = useTransform(scrollY, [0, 500], [0, -100]);
  const particlesY = useTransform(scrollY, [0, 500], [0, -200]);
  
  // Smooth spring animations
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = (e.clientX - centerX) / rect.width;
      const mouseY = (e.clientY - centerY) / rect.height;
      
      setMousePosition({ x: mouseX, y: mouseY });
      x.set(mouseX * 20);
      y.set(mouseY * 20);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  useEffect(() => {
    if (isInView) {
      setTimeout(() => setIsVisible(true), 500);
    }
  }, [isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.2,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  return (
    <motion.section
      ref={containerRef}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Dynamic Background Layers */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
        
        {/* Animated Mesh Grid */}
        <motion.div
          className="absolute inset-0 opacity-20"
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
            backgroundImage: `radial-gradient(circle at 25% 25%, #3B82F6 2px, transparent 2px),
                            radial-gradient(circle at 75% 75%, #8B5CF6 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </motion.div>

      {/* Floating Geometric Shapes */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{ y: particlesY }}
      >
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + (i * 8)}%`,
              top: `${20 + (i * 6)}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5
            }}
          >
            <div 
              className={`w-8 h-8 ${
                i % 3 === 0 ? 'bg-blue-400' : 
                i % 3 === 1 ? 'bg-purple-400' : 'bg-pink-400'
              } rounded-lg rotate-45 opacity-20`}
              style={{
                transform: `translate(${mousePosition.x * (10 + i * 2)}px, ${mousePosition.y * (10 + i * 2)}px)`
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        style={{ y: textY, x }}
      >
        {/* Animated Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-blue-600 dark:text-blue-400 mb-8"
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium">Phase 3: Advanced Elements</span>
          <motion.div
            className="w-2 h-2 bg-green-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Main Headline with Stagger Effect */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight">
            {['AI-Powered', 'Marketing', 'Revolution'].map((word, index) => (
              <motion.span
                key={word}
                className={`block ${
                  index === 0 ? 'text-gray-900 dark:text-white' :
                  index === 1 ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent' :
                  'text-gray-700 dark:text-gray-300'
                }`}
                initial={{ opacity: 0, rotateX: -90 }}
                animate={isVisible ? { 
                  opacity: 1, 
                  rotateX: 0,
                  transition: { 
                    delay: index * 0.3,
                    duration: 0.8,
                    ease: [0.21, 0.47, 0.32, 0.98]
                  }
                } : {}}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
        </motion.div>

        {/* Animated Subheadline */}
        <motion.p
          className="text-xl sm:text-2xl lg:text-3xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto mb-12 leading-relaxed"
          variants={itemVariants}
        >
          Transform your campaigns with{' '}
          <motion.span
            className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            autonomous AI optimization
          </motion.span>
          {' '}that never sleeps
        </motion.p>

        {/* Interactive Metrics Row */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-16"
          variants={itemVariants}
        >
          {[
            { icon: TrendingUp, value: '340%', label: 'ROAS Increase', color: 'from-green-500 to-emerald-500' },
            { icon: Zap, value: '85%', label: 'Time Saved', color: 'from-blue-500 to-cyan-500' },
            { icon: Target, value: '99.9%', label: 'Uptime SLA', color: 'from-purple-500 to-pink-500' },
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              className="group relative"
              whileHover={{ scale: 1.1, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Glow Effect */}
              <motion.div
                className={`absolute -inset-4 bg-gradient-to-r ${metric.color} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
              />
              
              <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <motion.div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${metric.color} mb-3`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <metric.icon className="w-6 h-6 text-white" />
                </motion.div>
                
                <motion.div
                  className="text-3xl font-bold text-gray-900 dark:text-white mb-1"
                  initial={{ scale: 0 }}
                  animate={isVisible ? { scale: 1 } : {}}
                  transition={{ delay: 1 + index * 0.2, duration: 0.5, type: 'spring' }}
                >
                  {metric.value}
                </motion.div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {metric.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons with Advanced Interactions */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
          variants={itemVariants}
        >
          <motion.button
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-2xl overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsVisible(true)}
          >
            {/* Ripple Effect */}
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700"
              style={{ transformOrigin: 'center' }}
            />
            
            {/* Shine Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            
            <span className="relative z-10 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Start AI Revolution
              <motion.div
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </span>
          </motion.button>

          <motion.button
            className="group px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold text-lg rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            whileHover={{ scale: 1.05, borderColor: '#8B5CF6' }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center">
              <motion.div
                className="w-3 h-3 rounded-full bg-red-500 mr-3"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Watch Live Demo
            </span>
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="flex flex-col items-center"
          variants={itemVariants}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Scroll to explore advanced features
          </p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="cursor-pointer"
          >
            <ArrowDown className="w-6 h-6 text-gray-400" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Interactive Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [0, -100, -200],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeOut'
            }}
          />
        ))}
      </div>
    </motion.section>
  );
}