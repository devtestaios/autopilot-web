'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, Clock, Zap } from 'lucide-react';

interface PremiumBadgeProps {
  status: 'active' | 'paused' | 'ended' | 'pending' | 'error' | 'success' | 'warning';
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export function PremiumBadge({ 
  status, 
  text, 
  size = 'md', 
  animated = true, 
  className 
}: PremiumBadgeProps) {
  const statusConfig = {
    active: {
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200',
      darkColor: 'dark:text-green-400',
      darkBgColor: 'dark:bg-green-900/30',
      darkBorderColor: 'dark:border-green-700',
      icon: CheckCircle,
      pulse: 'shadow-green-500/50'
    },
    paused: {
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-200',
      darkColor: 'dark:text-yellow-400',
      darkBgColor: 'dark:bg-yellow-900/30',
      darkBorderColor: 'dark:border-yellow-700',
      icon: Clock,
      pulse: 'shadow-yellow-500/50'
    },
    ended: {
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-200',
      darkColor: 'dark:text-gray-400',
      darkBgColor: 'dark:bg-gray-900/30',
      darkBorderColor: 'dark:border-gray-700',
      icon: XCircle,
      pulse: 'shadow-gray-500/50'
    },
    pending: {
      color: 'text-pulse-blue',
      bgColor: 'bg-pulse-blue/10',
      borderColor: 'border-pulse-blue/20',
      darkColor: 'dark:text-pulse-blue',
      darkBgColor: 'dark:bg-pulse-blue/20',
      darkBorderColor: 'dark:border-pulse-blue/30',
      icon: Clock,
      pulse: 'shadow-pulse-blue/50'
    },
    error: {
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200',
      darkColor: 'dark:text-red-400',
      darkBgColor: 'dark:bg-red-900/30',
      darkBorderColor: 'dark:border-red-700',
      icon: XCircle,
      pulse: 'shadow-red-500/50'
    },
    success: {
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-100',
      borderColor: 'border-emerald-200',
      darkColor: 'dark:text-emerald-400',
      darkBgColor: 'dark:bg-emerald-900/30',
      darkBorderColor: 'dark:border-emerald-700',
      icon: CheckCircle,
      pulse: 'shadow-emerald-500/50'
    },
    warning: {
      color: 'text-orange-700',
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-200',
      darkColor: 'dark:text-orange-400',
      darkBgColor: 'dark:bg-orange-900/30',
      darkBorderColor: 'dark:border-orange-700',
      icon: AlertCircle,
      pulse: 'shadow-orange-500/50'
    }
  };

  const sizeConfig = {
    sm: {
      padding: 'px-2 py-1',
      text: 'text-xs',
      icon: 'w-3 h-3'
    },
    md: {
      padding: 'px-3 py-1.5',
      text: 'text-sm',
      icon: 'w-4 h-4'
    },
    lg: {
      padding: 'px-4 py-2',
      text: 'text-base',
      icon: 'w-5 h-5'
    }
  };

  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];
  const IconComponent = config.icon;

  const badgeContent = (
    <div className={cn(
      'inline-flex items-center space-x-2 rounded-full border font-medium font-exo-2',
      config.color,
      config.bgColor,
      config.borderColor,
      config.darkColor,
      config.darkBgColor,
      config.darkBorderColor,
      sizeStyles.padding,
      sizeStyles.text,
      className
    )}>
      <IconComponent className={cn(sizeStyles.icon)} />
      <span>{text || status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </div>
  );

  if (animated && (status === 'active' || status === 'pending')) {
    return (
      <motion.div
        animate={{
          boxShadow: [
            `0 0 0px rgba(var(--pulse-blue), 0)`,
            `0 0 8px rgba(var(--pulse-blue), 0.6)`,
            `0 0 0px rgba(var(--pulse-blue), 0)`
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="inline-block rounded-full"
      >
        {badgeContent}
      </motion.div>
    );
  }

  return badgeContent;
}