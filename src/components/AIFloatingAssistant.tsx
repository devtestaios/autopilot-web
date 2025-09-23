'use client';

import React from 'react';
import UnifiedAIChat from './UnifiedAIChat';

interface AIFloatingAssistantProps {
  className?: string;
}

export default function AIFloatingAssistant({ className }: AIFloatingAssistantProps) {
  return (
    <UnifiedAIChat
      mode="floating"
      position="bottom-right"
      features={['actions', 'insights', 'suggestions', 'quickActions']}
      defaultMinimized={true}
      className={className}
    />
  );
}
