'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface EnhancedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export default function EnhancedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  icon,
  iconPosition = 'left'
}: EnhancedButtonProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return `
          bg-gradient-to-r from-pulse-cyan to-pulse-purple
          text-white border border-transparent
          hover:shadow-lg hover:shadow-pulse-cyan/25
          focus:ring-2 focus:ring-pulse-cyan/50
          active:scale-95
        `;
      case 'secondary':
        return `
          ${isDark 
            ? 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
          }
          border focus:ring-2 focus:ring-gray-500/50
          active:scale-95
        `;
      case 'outline':
        return `
          border-2 border-pulse-cyan text-pulse-cyan
          hover:bg-pulse-cyan hover:text-white
          focus:ring-2 focus:ring-pulse-cyan/50
          active:scale-95
        `;
      case 'ghost':
        return `
          ${isDark 
            ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }
          border border-transparent
          focus:ring-2 focus:ring-gray-500/50
          active:scale-95
        `;
      case 'danger':
        return `
          bg-gradient-to-r from-red-500 to-red-600
          text-white border border-transparent
          hover:shadow-lg hover:shadow-red-500/25
          focus:ring-2 focus:ring-red-500/50
          active:scale-95
        `;
      default:
        return '';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-2.5 text-base';
    }
  };

  const springTransition = {
    type: 'spring',
    stiffness: 400,
    damping: 25
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center
        font-medium rounded-xl
        transition-all duration-200
        focus:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        spring-smooth
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
      whileHover={!disabled && !loading ? { 
        scale: 1.02,
        y: -1,
        transition: springTransition
      } : {}}
      whileTap={!disabled && !loading ? { 
        scale: 0.98,
        transition: springTransition
      } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springTransition}
    >
      {loading && (
        <div className="mr-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <motion.div 
          className="mr-2"
          initial={{ x: -5, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, ...springTransition }}
        >
          {icon}
        </motion.div>
      )}
      
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {children}
      </motion.span>
      
      {icon && iconPosition === 'right' && !loading && (
        <motion.div 
          className="ml-2"
          initial={{ x: 5, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, ...springTransition }}
        >
          {icon}
        </motion.div>
      )}
    </motion.button>
  );
}

// Specialized button variants for common use cases
export function FloatingActionButton({
  children,
  onClick,
  className = '',
  ...props
}: Omit<EnhancedButtonProps, 'variant' | 'size'>) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        bg-gradient-to-r from-pulse-cyan to-pulse-purple
        text-white shadow-xl
        flex items-center justify-center
        transition-all duration-300
        hover:shadow-2xl hover:shadow-pulse-cyan/25
        spring-smooth
        ${className}
      `}
      whileHover={{
        scale: 1.1,
        rotate: 5,
        transition: { type: 'spring', stiffness: 400, damping: 25 }
      }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function PulsingButton({
  children,
  onClick,
  className = '',
  ...props
}: Omit<EnhancedButtonProps, 'variant'>) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-gradient-to-r from-pulse-cyan to-pulse-purple
        text-white px-6 py-3 rounded-xl
        font-medium shadow-lg
        spring-smooth
        ${className}
      `}
      whileHover={{
        scale: 1.05,
        boxShadow: '0 20px 40px rgba(0, 212, 255, 0.3)',
        transition: { type: 'spring', stiffness: 400, damping: 25 }
      }}
      whileTap={{ scale: 0.95 }}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        backgroundPosition: {
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }
      }}
      style={{
        backgroundSize: '200% 200%'
      }}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-xl"
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}