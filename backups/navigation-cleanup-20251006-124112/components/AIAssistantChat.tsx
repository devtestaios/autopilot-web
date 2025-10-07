'use client';

import React from 'react';
import UnifiedAIChat from './UnifiedAIChat';

interface AIAssistantChatProps {
  className?: string;
  defaultMinimized?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export default function AIAssistantChat({ 
  className, 
  defaultMinimized = false,
  onToggle 
}: AIAssistantChatProps) {
  return (
    <UnifiedAIChat
      mode="assistant"
      position="bottom-right"
      features={['insights', 'suggestions', 'quickActions', 'analytics']}
      defaultMinimized={defaultMinimized}
      onToggle={onToggle}
      className={className}
      specializations={['optimization', 'budget', 'targeting', 'analytics']}
    />
  );
}
