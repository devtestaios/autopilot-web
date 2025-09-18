import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export function Progress({ value, max = 100, className = '' }: ProgressProps) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));
  
  return (
    <div className={`w-full bg-gray-200 rounded-full ${className}`}>
      <div 
        className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}