'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'secondary';
}

export function GlassButton({ 
  children, 
  className = '',
  onClick,
  disabled = false,
  variant = 'default'
}: GlassButtonProps) {
  const baseClasses = "relative overflow-hidden backdrop-blur-lg border transition-all duration-300";
  
  const variantClasses = {
    default: "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30",
    primary: "bg-blue-500/20 border-blue-400/30 text-blue-100 hover:bg-blue-500/30 hover:border-blue-400/50",
    secondary: "bg-purple-500/20 border-purple-400/30 text-purple-100 hover:bg-purple-500/30 hover:border-purple-400/50"
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      }`}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5" />
      
      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
        whileHover={{ translateX: '200%' }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Content */}
      <span className="relative z-10 font-medium">
        {children}
      </span>
    </motion.button>
  );
}