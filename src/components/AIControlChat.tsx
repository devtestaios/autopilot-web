'use client';

import React from 'react';
import VSCodeAIChat from '@/components/VSCodeAIChat';

interface AIControlChatProps {
  className?: string;
  defaultMinimized?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export default function AIControlChat({ 
  className,
  defaultMinimized = true,
  onToggle
}: AIControlChatProps) {
  return (
    <VSCodeAIChat
      className={className}
      defaultMinimized={defaultMinimized}
      onToggle={onToggle}
    />
  );
}
