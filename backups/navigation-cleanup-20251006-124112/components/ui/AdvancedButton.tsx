'use client';

import React, { useState, useRef, useEffect } from 'react';
// Phase 2C.1: Optimized Framer Motion imports for tree shaking
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { useAnimation } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { Loader2, Plus, Check, X, Zap, Heart, Star } from 'lucide-react';

interface RippleProps {
  x: number;
  y: number;
  id: string;
}

interface AdvancedButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  ripple?: boolean;
  press?: boolean;
  glow?: boolean;
  float?: boolean;
  className?: string;
}

export function AdvancedButton({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  icon,
  iconPosition = 'left',
  ripple = true,
  press = true,
  glow = false,
  float = false,
  className = '',
  onClick,
  disabled,
  ...props
}: AdvancedButtonProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [ripples, setRipples] = useState<RippleProps[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const controls = useAnimation();

  // Variant styles
  const variants = {
    primary: `
      bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
      text-white border-transparent
      ${glow ? 'shadow-blue-500/25 shadow-lg hover:shadow-blue-500/40 hover:shadow-xl' : ''}
    `,
    secondary: `
      ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}
      border-transparent
      ${glow ? (isDark ? 'shadow-gray-500/25 shadow-lg hover:shadow-gray-500/40 hover:shadow-xl' : 'shadow-gray-300/25 shadow-lg hover:shadow-gray-300/40 hover:shadow-xl') : ''}
    `,
    outline: `
      ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
      bg-transparent border
      ${glow ? (isDark ? 'hover:shadow-gray-500/25 hover:shadow-lg' : 'hover:shadow-gray-300/25 hover:shadow-lg') : ''}
    `,
    ghost: `
      ${isDark ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
      bg-transparent border-transparent
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
      text-white border-transparent
      ${glow ? 'shadow-red-500/25 shadow-lg hover:shadow-red-500/40 hover:shadow-xl' : ''}
    `,
    success: `
      bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
      text-white border-transparent
      ${glow ? 'shadow-green-500/25 shadow-lg hover:shadow-green-500/40 hover:shadow-xl' : ''}
    `,
    gradient: `
      bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 
      hover:from-purple-600 hover:via-pink-600 hover:to-red-600
      text-white border-transparent
      ${glow ? 'shadow-purple-500/25 shadow-lg hover:shadow-purple-500/40 hover:shadow-xl' : ''}
    `
  };

  // Size styles
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-8 text-base',
    xl: 'h-12 px-10 text-lg'
  };

  // Handle ripple effect
  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!ripple || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now().toString();

    setRipples(prev => [...prev, { x, y, id }]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    createRipple(event);
    
    if (press) {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 150);
    }

    onClick?.(event);
  };

  const handleMouseDown = () => {
    if (press && !disabled && !loading) {
      controls.start({ scale: 0.98 });
    }
  };

  const handleMouseUp = () => {
    if (press && !disabled && !loading) {
      controls.start({ scale: 1 });
    }
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      ref={buttonRef}
      className={`
        relative inline-flex items-center justify-center
        rounded-lg font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isDark ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}
        overflow-hidden select-none
        ${variants[variant]}
        ${sizes[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${float ? 'hover:translate-y-[-2px] transition-transform duration-200' : ''}
        ${className}
      `}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      disabled={isDisabled}
      animate={controls}
      whileHover={!isDisabled && !float ? { scale: 1.02 } : {}}
      whileTap={!isDisabled && press ? { scale: 0.98 } : {}}
      {...props}
    >
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* Content */}
      <span className="relative flex items-center gap-2">
        {loading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        <span className={loading ? 'opacity-0' : ''}>{children}</span>
        {!loading && icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </span>

      {/* Glow effect overlay */}
      {glow && !isDisabled && (
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 bg-gradient-to-r from-white/10 to-transparent"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
}

// Floating Action Button
export function FloatingActionButton({
  children,
  className = '',
  size = 'md',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'>) {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14'
  };

  return (
    <motion.button
      className={`
        ${sizes[size]} rounded-full
        bg-gradient-to-r from-teal-600 to-cyan-600
        text-white shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-300
        ${className}
      `}
      whileHover={{ scale: 1.1, rotate: 180 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Pulsing Button for urgent actions
export function PulsingButton({
  children,
  pulseColor = 'blue',
  className = '',
  ...props
}: {
  children: React.ReactNode;
  pulseColor?: 'blue' | 'red' | 'green' | 'purple';
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'>) {
  const pulseColors = {
    blue: 'shadow-blue-500/50',
    red: 'shadow-red-500/50',
    green: 'shadow-green-500/50',
    purple: 'shadow-purple-500/50'
  };

  return (
    <motion.button
      className={`
        relative px-6 py-3 rounded-lg font-medium
        bg-gradient-to-r from-${pulseColor}-500 to-${pulseColor}-600
        text-white border-transparent
        ${className}
      `}
      animate={{
        boxShadow: [
          `0 0 0 0 var(--tw-shadow-color)`,
          `0 0 0 10px transparent`,
        ]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      style={{
        '--tw-shadow-color': `var(--${pulseColor}-500)`
      } as React.CSSProperties}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Magnetic Button - follows cursor
export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'>) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`
        px-6 py-3 rounded-lg font-medium
        bg-gradient-to-r from-purple-500 to-pink-500
        text-white transition-all duration-300
        ${className}
      `}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Button with morphing states
export function MorphingButton({
  states,
  currentState = 0,
  onStateChange,
  className = '',
  ...props
}: {
  states: Array<{
    icon: React.ReactNode;
    text: string;
    color: string;
  }>;
  currentState?: number;
  onStateChange?: (index: number) => void;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'>) {
  const [stateIndex, setStateIndex] = useState(currentState);
  const currentStateData = states[stateIndex];

  const handleClick = () => {
    const nextIndex = (stateIndex + 1) % states.length;
    setStateIndex(nextIndex);
    onStateChange?.(nextIndex);
  };

  return (
    <motion.button
      className={`
        relative px-6 py-3 rounded-lg font-medium
        text-white transition-all duration-300
        ${currentStateData.color}
        ${className}
      `}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      layout
      {...props}
    >
      <motion.div
        className="flex items-center gap-2"
        key={stateIndex}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.span
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {currentStateData.icon}
        </motion.span>
        <motion.span
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {currentStateData.text}
        </motion.span>
      </motion.div>
    </motion.button>
  );
}

export default AdvancedButton;