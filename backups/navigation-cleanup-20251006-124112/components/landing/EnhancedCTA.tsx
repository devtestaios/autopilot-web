'use client';

import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Sparkles, Zap, TrendingUp, ArrowRight, Play } from 'lucide-react';

interface EnhancedCTAProps {
  className?: string;
}

export function EnhancedCTA({ className = '' }: EnhancedCTAProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  return (
    <motion.section
      ref={ref}
      className={`py-20 px-4 relative overflow-hidden ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Dynamic background */}
      <div className="absolute inset-0">
        {/* Gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        
        {/* Floating orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full opacity-10"
            style={{
              background: `radial-gradient(circle, ${
                ['#3B82F6', '#8B5CF6', '#EC4899'][i % 3]
              }, transparent 70%)`,
              left: `${20 + (i * 15)}%`,
              top: `${10 + (i * 10)}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Particle field */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.8, 0.1],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main CTA content */}
        <motion.div
          className="text-center mb-12"
          variants={itemVariants}
        >
          {/* Icon with pulse effect */}
          <motion.div
            className="inline-flex items-center justify-center mb-6"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6"
            variants={itemVariants}
          >
            <span className="text-gray-900 dark:text-white">Ready to</span>
            <br />
            <motion.span
              className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent gradient-animate"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Transform
            </motion.span>
            <br />
            <span className="text-gray-900 dark:text-white">Your Marketing?</span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12"
            variants={itemVariants}
          >
            Join thousands of marketers who've revolutionized their campaigns with AI-powered automation
          </motion.p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
          variants={itemVariants}
        >
          {/* Primary CTA */}
          <MagneticCTAButton 
            primary 
            onClick={() => console.log('Start Free Trial clicked')}
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </MagneticCTAButton>

          {/* Secondary CTA */}
          <MagneticCTAButton onClick={() => console.log('Watch Demo clicked')}>
            <Play className="w-5 h-5 mr-2" />
            Watch Demo
          </MagneticCTAButton>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-8 text-center"
          variants={itemVariants}
        >
          {[
            { icon: TrendingUp, value: "300%", label: "Avg ROAS Increase" },
            { icon: Zap, value: "85%", label: "Time Saved" },
            { icon: Sparkles, value: "99.9%", label: "Uptime SLA" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-blue-400/30">
                <stat.icon className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Risk-free guarantee */}
        <motion.div
          className="text-center mt-12"
          variants={itemVariants}
        >
          <motion.p
            className="text-sm text-gray-500 dark:text-gray-400"
            whileHover={{ scale: 1.02 }}
          >
            🔒 Risk-free 14-day trial • No credit card required • Cancel anytime
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
}

interface MagneticCTAButtonProps {
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
  className?: string;
}

function MagneticCTAButton({ 
  children, 
  primary = false, 
  onClick, 
  className = '' 
}: MagneticCTAButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseX = useSpring(x);
  const mouseY = useSpring(y);
  
  const rotateX = useTransform(mouseY, [-100, 100], [30, -30]);
  const rotateY = useTransform(mouseX, [-100, 100], [-30, 30]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseXPos = e.clientX - centerX;
    const mouseYPos = e.clientY - centerY;
    
    x.set(mouseXPos * 0.1);
    y.set(mouseYPos * 0.1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const baseClasses = `
    relative px-8 py-4 rounded-2xl font-medium text-lg
    transition-all duration-300 flex items-center
    transform-gpu perspective-1000
    ${className}
  `;

  const primaryClasses = `
    bg-gradient-to-r from-blue-600 to-purple-600 text-white
    shadow-2xl shadow-blue-500/25
    hover:shadow-blue-500/40 hover:scale-105
    border border-blue-400/30
  `;

  const secondaryClasses = `
    bg-white/10 backdrop-blur-lg text-white
    border border-white/20 hover:bg-white/20
    hover:scale-105 shadow-xl
  `;

  return (
    <motion.button
      ref={ref}
      className={`${baseClasses} ${primary ? primaryClasses : secondaryClasses}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
        initial={{ x: "-100%" }}
        animate={isHovered ? { x: "100%" } : { x: "-100%" }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Glow effect for primary button */}
      {primary && (
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0"
          animate={isHovered ? { opacity: 0.3 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Content */}
      <span className="relative z-10 flex items-center">
        {children}
      </span>
      
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        whileTap={{
          boxShadow: [
            "0 0 0 0 rgba(59, 130, 246, 0.5)",
            "0 0 0 20px rgba(59, 130, 246, 0)",
          ],
        }}
        transition={{ duration: 0.4 }}
      />
    </motion.button>
  );
}