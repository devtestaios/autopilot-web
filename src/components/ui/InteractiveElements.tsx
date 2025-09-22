'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface InteractiveCardProps {
  children: ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  glowing?: boolean;
  className?: string;
  delay?: number;
}

export function InteractiveCard({
  children,
  onClick,
  hoverable = true,
  glowing = false,
  className = '',
  delay = 0
}: InteractiveCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-xl
        ${isDark 
          ? 'bg-gray-800/80 border-gray-700' 
          : 'bg-white/80 border-gray-200'
        }
        border backdrop-blur-sm
        ${onClick ? 'cursor-pointer' : ''}
        ${glowing ? 'shadow-xl shadow-pulse-cyan/10' : 'shadow-lg'}
        spring-smooth
        ${className}
      `}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        delay
      }}
      whileHover={hoverable ? {
        y: -4,
        scale: 1.02,
        transition: { type: 'spring', stiffness: 400, damping: 25 }
      } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      {/* Animated border gradient */}
      <AnimatePresence>
        {isHovered && glowing && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pulse-cyan/20 via-pulse-purple/20 to-pulse-cyan/20 rounded-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            style={{
              background: `linear-gradient(45deg, 
                rgba(0, 212, 255, 0.1), 
                rgba(124, 58, 237, 0.1), 
                rgba(0, 212, 255, 0.1)
              )`
            }}
          />
        )}
      </AnimatePresence>

      {/* Hover shimmer effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 1,
  prefix = '',
  suffix = '',
  className = ''
}: AnimatedCounterProps) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration
      }}
    >
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {value.toLocaleString()}
      </motion.span>
      {suffix}
    </motion.span>
  );
}

interface PulseIndicatorProps {
  active?: boolean;
  color?: 'green' | 'blue' | 'purple' | 'red' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PulseIndicator({
  active = true,
  color = 'green',
  size = 'md',
  className = ''
}: PulseIndicatorProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500 shadow-blue-500/50';
      case 'purple':
        return 'bg-purple-500 shadow-purple-500/50';
      case 'red':
        return 'bg-red-500 shadow-red-500/50';
      case 'yellow':
        return 'bg-yellow-500 shadow-yellow-500/50';
      default:
        return 'bg-green-500 shadow-green-500/50';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-2 h-2';
      case 'lg':
        return 'w-4 h-4';
      default:
        return 'w-3 h-3';
    }
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      <motion.div
        className={`
          ${getSizeClasses()}
          ${getColorClasses()}
          rounded-full
        `}
        animate={active ? {
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      {active && (
        <motion.div
          className={`
            absolute inset-0
            ${getSizeClasses()}
            ${getColorClasses()}
            rounded-full opacity-30
          `}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </div>
  );
}

interface HoverRevealProps {
  children: ReactNode;
  hoverContent: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function HoverReveal({
  children,
  hoverContent,
  className = '',
  direction = 'up'
}: HoverRevealProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getDirection = () => {
    switch (direction) {
      case 'down':
        return { y: -20 };
      case 'left':
        return { x: 20 };
      case 'right':
        return { x: -20 };
      default:
        return { y: 20 };
    }
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{ opacity: isHovered ? 0.3 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, ...getDirection() }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, ...getDirection() }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
          >
            {hoverContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default InteractiveCard;