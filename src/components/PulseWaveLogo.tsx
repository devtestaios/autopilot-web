'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface PulseWaveLogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'light' | 'dark';
  animated?: boolean;
  showText?: boolean;
  className?: string;
}

export const PulseWaveLogo = ({ 
  size = 'medium', 
  variant = 'dark', 
  animated = true, 
  showText = true,
  className = '' 
}: PulseWaveLogoProps) => {
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setIsScanning(true);
        setTimeout(() => setIsScanning(false), 1500);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [animated]);

  const sizeConfig = {
    small: {
      container: 'h-8 gap-2',
      wave: 'gap-1',
      barWidth: 'w-1',
      heights: ['h-3', 'h-4', 'h-5', 'h-3', 'h-3'],
      bridge: 'w-8 h-1',
      text: 'text-sm font-normal tracking-wider',
      dotSize: 'w-2 h-2'
    },
    medium: {
      container: 'h-12 gap-3',
      wave: 'gap-1',
      barWidth: 'w-1.5',
      heights: ['h-4', 'h-6', 'h-8', 'h-5', 'h-4'],
      bridge: 'w-12 h-1.5',
      text: 'text-lg font-normal tracking-widest',
      dotSize: 'w-2.5 h-2.5'
    },
    large: {
      container: 'h-16 gap-4',
      wave: 'gap-1.5',
      barWidth: 'w-2',
      heights: ['h-6', 'h-10', 'h-12', 'h-8', 'h-6'],
      bridge: 'w-16 h-2',
      text: 'text-2xl font-normal tracking-widest',
      dotSize: 'w-3 h-3'
    }
  };

  const config = sizeConfig[size];
  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center ${config.container} ${className}`}>
      {/* Pulse Wave */}
      <div className={`flex items-end ${config.wave} relative`}>
        {/* Scanning Line Effect */}
        {animated && isScanning && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pulse-blue to-transparent"
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: [0, 1, 0], x: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        )}
        
        {config.heights.map((height, index) => (
          <motion.div
            key={index}
            className={`${config.barWidth} ${height} rounded-sm bg-gradient-to-t from-pulse-blue to-energy-magenta`}
            animate={animated ? {
              scaleY: [1, 0.6, 1],
              opacity: [0.8, 1, 0.8],
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.1,
            }}
          />
        ))}
      </div>

      {/* Bridge Connector */}
      <div className="relative">
        <div className={`${config.bridge} bg-gradient-to-r from-bridge-purple to-energy-magenta rounded-sm relative`}>
          {/* Bridge End Points */}
          <div className={`absolute -left-1 top-1/2 transform -translate-y-1/2 ${config.dotSize} rounded-full bg-energy-magenta shadow-lg shadow-energy-magenta/50`} />
          <div className={`absolute -right-1 top-1/2 transform -translate-y-1/2 ${config.dotSize} rounded-full bg-energy-magenta shadow-lg shadow-energy-magenta/50`} />
        </div>
      </div>

      {/* Brand Text */}
      {showText && (
        <span 
          className={`font-orbitron ${config.text} uppercase ${
            isDark 
              ? 'text-interface-gray drop-shadow-sm' 
              : 'text-deep-space drop-shadow-sm'
          }`}
          style={{ 
            textShadow: isDark 
              ? '0 0 10px rgba(0, 212, 255, 0.5)' 
              : '0 0 10px rgba(0, 212, 255, 0.3)' 
          }}
        >
          Pulse Bridge
        </span>
      )}
    </div>
  );
};

// Icon-only version for favicons and small spaces
export const PulseWaveIcon = ({ 
  size = 32, 
  animated = true, 
  className = '' 
}: { 
  size?: number; 
  animated?: boolean; 
  className?: string; 
}) => {
  const barHeights = [
    size * 0.3,  // 30% of size
    size * 0.5,  // 50% of size  
    size * 0.7,  // 70% of size
    size * 0.45, // 45% of size
    size * 0.35  // 35% of size
  ];

  return (
    <div 
      className={`flex items-end justify-center gap-0.5 rounded-lg ${className}`}
      style={{ 
        width: size, 
        height: size,
        background: 'linear-gradient(135deg, #1a1a2e, #7c3aed)',
        padding: `${size * 0.15}px`
      }}
    >
      {barHeights.map((height, index) => (
        <motion.div
          key={index}
          className="bg-gradient-to-t from-pulse-blue to-energy-magenta rounded-sm"
          style={{ 
            width: Math.max(2, size * 0.08), 
            height: height 
          }}
          animate={animated ? {
            scaleY: [1, 0.6, 1],
            opacity: [0.8, 1, 0.8],
          } : {}}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  );
};

export default PulseWaveLogo;