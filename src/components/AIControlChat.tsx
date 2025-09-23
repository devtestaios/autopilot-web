'use client';

import React from 'react';
import UnifiedAIChat from './UnifiedAIChat';

interface AIControlChatProps {
  className?: string;
  defaultMinimized?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export default function AIControlChat({ 
  className, 
  defaultMinimized = false,
  onToggle
}: AIControlChatProps) {
  return (
    <UnifiedAIChat
      mode="control"
      position="bottom-right"
      features={['actions', 'insights', 'suggestions', 'quickActions', 'autonomousMode', 'platformControl']}
      defaultMinimized={defaultMinimized}
      onToggle={onToggle}
      className={className}
      specializations={['platformControl', 'campaignManagement', 'navigation']}
    />
  );
}
