'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import UnifiedAIChat from './UnifiedAIChat';

interface AIFloatingAssistantProps {
  className?: string;
}

type AIFeature = 'actions' | 'insights' | 'controls' | 'quickActions' | 'suggestions' | 'autonomousMode' | 'platformControl' | 'analytics' | 'approvals';
type AISpecialization = 'platformControl' | 'campaignManagement' | 'optimization' | 'analytics' | 'navigation' | 'budget' | 'targeting';

export default function AIFloatingAssistant({ className }: AIFloatingAssistantProps) {
  const pathname = usePathname();
  const [contextFeatures, setContextFeatures] = useState<AIFeature[]>(['actions', 'insights', 'suggestions', 'quickActions']);
  const [specializations, setSpecializations] = useState<AISpecialization[]>(['navigation']);

  // Context-aware feature adaptation based on current page
  useEffect(() => {
    const getContextualFeatures = () => {
      // Base features available everywhere
      let features: AIFeature[] = ['actions', 'insights', 'suggestions', 'quickActions'];
      let specs: AISpecialization[] = ['navigation'];

      // Page-specific enhancements
      if (pathname.includes('/dashboard')) {
        features.push('autonomousMode', 'platformControl');
        specs.push('platformControl', 'campaignManagement');
      } else if (pathname.includes('/campaigns')) {
        features.push('platformControl');
        specs.push('campaignManagement', 'optimization');
      } else if (pathname.includes('/analytics')) {
        features.push('analytics');
        specs.push('optimization', 'analytics');
      } else if (pathname.includes('/ai')) {
        features.push('autonomousMode', 'platformControl', 'analytics');
        specs.push('platformControl', 'campaignManagement', 'optimization', 'analytics');
      }

      setContextFeatures(features);
      setSpecializations(specs);
    };

    getContextualFeatures();
  }, [pathname]);

  return (
    <UnifiedAIChat
      mode="floating"
      position="bottom-right"
      features={contextFeatures}
      specializations={specializations}
      defaultMinimized={true}
      className={className}
      pageContext={pathname}
    />
  );
}
