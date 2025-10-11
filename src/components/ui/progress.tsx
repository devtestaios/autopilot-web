import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  'data-testid'?: string;
  'aria-label'?: string;
}

export function Progress({ 
  value, 
  max = 100, 
  className = '', 
  'data-testid': testId,
  'aria-label': ariaLabel = 'Loading progress'
}: ProgressProps) {
  // Handle edge case where max is 0
  const percentage = max === 0 ? 100 : Math.max(0, Math.min(100, (value / max) * 100));
  
  return (
    <div 
      className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}
      data-testid={testId}
      aria-label={ariaLabel}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div 
        className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${percentage}%` }}
        role="progressbar"
        data-testid={testId ? `${testId}-bar` : undefined}
      />
    </div>
  );
}