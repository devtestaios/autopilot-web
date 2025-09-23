'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  delay: number;
  index: number;
  metrics?: {
    value: string;
    label: string;
  };
  className?: string;
}

export function EnhancedFeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  gradient, 
  delay, 
  index, 
  metrics,
  className = '' 
}: FeatureCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      rotateX: -15,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.2,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`group relative perspective-1000 ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ y: -10, rotateY: 5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Card Background */}
      <div className="relative p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100/50 dark:border-gray-700/50">
        
        {/* Gradient Overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        />
        
        {/* Animated Orb */}
        <motion.div
          className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${gradient} rounded-full opacity-10 blur-xl`}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </div>
        
        {/* Icon with 3D Effect */}
        <motion.div
          className="relative z-10 mb-6"
          whileHover={{
            rotate: [0, -10, 10, -5, 0],
            scale: [1, 1.1, 1.05, 1.1, 1],
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut"
          }}
        >
          <div 
            className={`inline-block p-4 rounded-xl bg-gradient-to-br ${gradient} shadow-lg relative z-10`}
          >
            <Icon className="w-8 h-8 text-white" />
            
            {/* Icon Glow */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl blur-lg opacity-50`}
            />
          </div>
        </motion.div>
        
        {/* Content */}
        <div className="relative z-10">
          <motion.h3 
            className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            {title}
          </motion.h3>
          
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {description}
          </p>
          
          {/* Metrics Display */}
          {metrics && (
            <motion.div 
              className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {metrics.label}
              </div>
              <div className={`text-lg font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                {metrics.value}
              </div>
            </motion.div>
          )}
          
          {/* Hover Link */}
          <motion.div 
            className="group/link mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ x: 5 }}
          >
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover/link:text-gray-900 dark:group-hover/link:text-white transition-colors duration-200">
              Learn more 
              <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover/link:opacity-80`}>
                →
              </span>
            </span>
          </motion.div>
        </div>
        
        {/* Bottom Gradient Line */}
        <motion.div
          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${gradient}`}
          initial={{ width: "0%" }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Floating Particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 bg-gradient-to-r ${gradient} rounded-full opacity-0 group-hover:opacity-60`}
          style={{
            left: `${20 + i * 25}%`,
            top: `${10 + i * 15}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </motion.div>
  );
}