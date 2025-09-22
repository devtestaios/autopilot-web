'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface BlurBackgroundProps {
  children?: React.ReactNode;
  intensity?: 'light' | 'medium' | 'strong' | 'dynamic';
  overlay?: 'none' | 'subtle' | 'medium' | 'strong';
  gradient?: 'none' | 'radial' | 'linear' | 'mesh' | 'animated';
  className?: string;
  animate?: boolean;
}

export function BlurBackground({
  children,
  intensity = 'medium',
  overlay = 'subtle',
  gradient = 'radial',
  className = '',
  animate = true
}: BlurBackgroundProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Backdrop filter intensity classes
  const intensityClasses = {
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    strong: 'backdrop-blur-lg',
    dynamic: 'backdrop-blur-xl backdrop-saturate-150'
  };

  // Overlay classes based on theme
  const overlayClasses = {
    none: '',
    subtle: isDark ? 'bg-black/10' : 'bg-white/20',
    medium: isDark ? 'bg-black/20' : 'bg-white/40',
    strong: isDark ? 'bg-black/40' : 'bg-white/60'
  };

  // Gradient patterns
  const gradientClasses = {
    none: '',
    radial: isDark 
      ? 'bg-gradient-radial from-blue-900/20 via-purple-900/10 to-transparent'
      : 'bg-gradient-radial from-blue-100/30 via-purple-100/20 to-transparent',
    linear: isDark
      ? 'bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-cyan-900/10'
      : 'bg-gradient-to-br from-blue-100/30 via-purple-100/20 to-cyan-100/20',
    mesh: isDark
      ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-purple-900/10 to-transparent'
      : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/30 via-purple-100/20 to-transparent',
    animated: ''
  };

  const baseClasses = `
    ${intensityClasses[intensity]}
    ${overlayClasses[overlay]}
    ${gradient !== 'animated' ? gradientClasses[gradient] : ''}
    ${className}
  pointer-events-none
  `;

  if (gradient === 'animated') {
    return (
      <motion.div
        className={`relative ${baseClasses}`}
        animate={animate ? {
          background: isDark ? [
            'radial-gradient(ellipse at 0% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
            'radial-gradient(ellipse at 100% 0%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
            'radial-gradient(ellipse at 100% 100%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
            'radial-gradient(ellipse at 0% 100%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
          ] : [
            'radial-gradient(ellipse at 0% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(ellipse at 100% 0%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
            'radial-gradient(ellipse at 100% 100%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
            'radial-gradient(ellipse at 0% 100%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
          ]
        } : {}}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
}

// Specialized blur backgrounds for different contexts
export function HeroBlurBackground({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Animated gradient orbs */}
      <motion.div
        className={`absolute inset-0 ${isDark ? 'opacity-40' : 'opacity-60'} pointer-events-none`}
        animate={{
          background: isDark ? [
            'radial-gradient(600px circle at 0% 0%, rgba(59, 130, 246, 0.15), transparent 50%)',
            'radial-gradient(600px circle at 100% 0%, rgba(168, 85, 247, 0.15), transparent 50%)',
            'radial-gradient(600px circle at 100% 100%, rgba(6, 182, 212, 0.15), transparent 50%)',
            'radial-gradient(600px circle at 0% 100%, rgba(236, 72, 153, 0.15), transparent 50%)',
          ] : [
            'radial-gradient(600px circle at 0% 0%, rgba(59, 130, 246, 0.1), transparent 50%)',
            'radial-gradient(600px circle at 100% 0%, rgba(168, 85, 247, 0.1), transparent 50%)',
            'radial-gradient(600px circle at 100% 100%, rgba(6, 182, 212, 0.1), transparent 50%)',
            'radial-gradient(600px circle at 0% 100%, rgba(236, 72, 153, 0.1), transparent 50%)',
          ]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Blur overlay */}
      <BlurBackground intensity="medium" overlay="subtle" gradient="none">
        {children}
      </BlurBackground>
    </div>
  );
}

export function CardBlurBackground({ children, hover = false, className = '' }: { 
  children?: React.ReactNode; 
  hover?: boolean;
  className?: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={hover ? { scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
    >
      {/* Static background */}
      <div className={`absolute inset-0 rounded-xl ${
        isDark 
          ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80' 
          : 'bg-gradient-to-br from-white/80 to-gray-50/80'
      } backdrop-blur-md pointer-events-none`} />
      
      {/* Hover effect */}
      {hover && (
        <motion.div
          className={`absolute inset-0 rounded-xl ${
            isDark
              ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20'
              : 'bg-gradient-to-br from-blue-100/30 to-purple-100/30'
          } backdrop-blur-lg opacity-0 pointer-events-none`}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

export function ModalBlurBackground({ 
  children, 
  isOpen, 
  onClose,
  className = '' 
}: { 
  children?: React.ReactNode; 
  isOpen: boolean;
  onClose?: () => void;
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
      className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className={`absolute inset-0 ${
        isDark ? 'bg-black/60' : 'bg-white/60'
      } backdrop-blur-md pointer-events-none`} />
      
      {/* Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function SidebarBlurBackground({ children, className = '' }: { 
  children?: React.ReactNode; 
  className?: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`relative ${className}`}>
      {/* Base background */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gray-900/95' 
          : 'bg-white/95'
      } backdrop-blur-xl pointer-events-none`} />
      
      {/* Gradient overlay */}
      <div className={`absolute inset-0 ${
        isDark
          ? 'bg-gradient-to-r from-blue-900/10 to-transparent'
          : 'bg-gradient-to-r from-blue-100/20 to-transparent'
      } pointer-events-none`} />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export function FloatingBlurBackground({ 
  children, 
  float = true,
  className = '' 
}: { 
  children?: React.ReactNode; 
  float?: boolean;
  className?: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      className={`relative ${className}`}
      animate={float ? {
        y: [0, -10, 0],
        rotate: [0, 1, 0, -1, 0]
      } : {}}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {/* Floating shadow */}
      <motion.div
        className={`absolute inset-0 rounded-xl ${
          isDark
            ? 'bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20'
            : 'bg-gradient-to-br from-blue-100/40 via-purple-100/40 to-cyan-100/40'
        } backdrop-blur-lg border border-white/20 pointer-events-none`}
        animate={float ? {
          boxShadow: [
            '0 10px 40px rgba(0, 0, 0, 0.1)',
            '0 20px 60px rgba(0, 0, 0, 0.15)',
            '0 10px 40px rgba(0, 0, 0, 0.1)'
          ]
        } : {}}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

export default BlurBackground;