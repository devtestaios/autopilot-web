'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  intensity?: 'light' | 'medium' | 'strong';
  animated?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  hover = true,
  intensity = 'medium',
  animated = true,
  onClick
}: GlassCardProps) {
  const { theme } = useTheme();
  
  const getGlassClass = () => {
    const isDark = theme === 'dark';
    
    switch (intensity) {
      case 'light':
        return isDark ? 'glass-dark opacity-80' : 'glass opacity-80';
      case 'strong':
        return isDark ? 'glass-card-dark' : 'glass-card';
      default:
        return isDark ? 'glass-dark' : 'glass';
    }
  };

  const animationProps = animated ? {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { 
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
      opacity: { duration: 0.2 }
    },
    whileHover: hover ? { 
      scale: 1.02,
      y: -2,
      transition: { type: 'spring' as const, stiffness: 400, damping: 25 }
    } : undefined
  } : {};

  return (
    <motion.div
      className={`
        ${getGlassClass()}
        rounded-xl
        ${hover ? 'cursor-pointer spring-smooth' : ''}
        ${className}
      `}
      onClick={onClick}
      {...animationProps}
    >
      {children}
    </motion.div>
  );
}

// Specialized glassmorphism components for common use cases
export function GlassButton({
  children,
  onClick,
  className = '',
  variant = 'primary'
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      className={`
        ${isDark ? 'glass-dark' : 'glass'}
        px-4 py-2 rounded-lg
        ${variant === 'primary' 
          ? 'text-blue-600 dark:text-blue-400 font-medium' 
          : 'text-gray-700 dark:text-gray-300'
        }
        spring-smooth
        hover:scale-105
        active:scale-95
        ${className}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.button>
  );
}

export function GlassModal({
  children,
  isOpen,
  onClose,
  className = ''
}: {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      {/* Modal content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
        className={`
          relative z-10
          ${isDark ? 'glass-card-dark' : 'glass-card'}
          rounded-2xl
          max-w-lg w-full
          max-h-[90vh]
          overflow-y-auto
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}