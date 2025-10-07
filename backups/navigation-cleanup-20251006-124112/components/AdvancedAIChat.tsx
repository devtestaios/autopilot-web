'use client';

import React from 'react';
import UnifiedAIChat from './UnifiedAIChat';

interface AdvancedAIChatProps {
  className?: string;
  defaultMinimized?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export default function AdvancedAIChat({ 
  className, 
  defaultMinimized = false,
  onToggle 
}: AdvancedAIChatProps = {}) {
  return (
    <UnifiedAIChat
      mode="advanced"
      position="bottom-right"
      features={['actions', 'insights', 'suggestions', 'quickActions', 'autonomousMode', 'platformControl', 'analytics', 'approvals']}
      defaultMinimized={defaultMinimized}
      onToggle={onToggle}
      className={className}
      specializations={['platformControl', 'campaignManagement', 'optimization', 'analytics', 'navigation', 'budget']}
    />
  );
}
