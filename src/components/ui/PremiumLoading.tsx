'use client';

import { motion } from 'framer-motion';
import { PulseWaveIcon } from '../PulseWaveLogo';
import { cn } from '@/lib/utils';

interface PremiumLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'pulse' | 'spinner' | 'dots' | 'wave';
  text?: string;
  className?: string;
}

export function PremiumLoading({ 
  size = 'md', 
  variant = 'pulse', 
  text, 
  className 
}: PremiumLoadingProps) {
  const sizes = {
    sm: { icon: 24, text: 'text-sm' },
    md: { icon: 32, text: 'text-base' },
    lg: { icon: 48, text: 'text-lg' }
  };

  const currentSize = sizes[size];

  if (variant === 'pulse') {
    return (
      <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
        <PulseWaveIcon 
          size={currentSize.icon} 
          animated={true} 
          className="animate-glow-pulse" 
        />
        {text && (
          <motion.p 
            className={cn('text-muted-foreground font-exo-2', currentSize.text)}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'spinner') {
    return (
      <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
        <motion.div
          className={cn(
            'rounded-full border-2 border-pulse-blue/30 border-t-pulse-blue',
            size === 'sm' && 'w-6 h-6',
            size === 'md' && 'w-8 h-8',
            size === 'lg' && 'w-12 h-12'
          )}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        {text && (
          <p className={cn('text-muted-foreground font-exo-2', currentSize.text)}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn(
                'rounded-full bg-pulse-blue',
                size === 'sm' && 'w-2 h-2',
                size === 'md' && 'w-3 h-3',
                size === 'lg' && 'w-4 h-4'
              )}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
        {text && (
          <p className={cn('text-muted-foreground font-exo-2', currentSize.text)}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'wave') {
    return (
      <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
        <div className="flex items-end space-x-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className={cn(
                'bg-gradient-to-t from-pulse-blue to-energy-magenta rounded-sm',
                size === 'sm' && 'w-1 h-6',
                size === 'md' && 'w-1.5 h-8',
                size === 'lg' && 'w-2 h-12'
              )}
              animate={{
                scaleY: [1, 0.5, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </div>
        {text && (
          <motion.p 
            className={cn('text-muted-foreground font-exo-2', currentSize.text)}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  return null;
}