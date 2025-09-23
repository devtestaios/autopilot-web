'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAnalytics } from './AnalyticsContext';

interface ABTestVariant {
  id: string;
  name: string;
  weight: number; // 0-100, percentage of traffic
  config: Record<string, any>;
  description?: string;
}

interface ABTest {
  id: string;
  name: string;
  description?: string;
  variants: ABTestVariant[];
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  targetPage?: string;
  targetAudience?: {
    device?: 'desktop' | 'tablet' | 'mobile';
    referrer?: string;
    utm?: Record<string, string>;
  };
}

interface ABTestAssignment {
  testId: string;
  variantId: string;
  assignedAt: number;
  sessionId: string;
}

interface ABTestContextType {
  getVariant: (testId: string) => ABTestVariant | null;
  trackExperiment: (testId: string, event: string, properties?: Record<string, any>) => void;
  getActiveTests: () => ABTest[];
  isTestActive: (testId: string) => boolean;
  getUserAssignments: () => ABTestAssignment[];
  forceVariant: (testId: string, variantId: string) => void; // For testing purposes
  getExperimentResults: () => Record<string, any>; // For analytics dashboard
}

const ABTestContext = createContext<ABTestContextType | undefined>(undefined);

export function useABTest() {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest must be used within an ABTestProvider');
  }
  return context;
}

interface ABTestProviderProps {
  children: ReactNode;
  tests: ABTest[];
  enableLocalStorage?: boolean;
}

export function ABTestProvider({ 
  children, 
  tests,
  enableLocalStorage = true 
}: ABTestProviderProps) {
  const { trackEvent, getCurrentSessionId, getSession } = useAnalytics();
  const [assignments, setAssignments] = useState<ABTestAssignment[]>([]);
  const [forceAssignments, setForceAssignments] = useState<Record<string, string>>({});

  // Load assignments from localStorage on mount
  useEffect(() => {
    if (enableLocalStorage) {
      const stored = localStorage.getItem('pulsebridge_ab_assignments');
      if (stored) {
        try {
          const parsedAssignments = JSON.parse(stored);
          setAssignments(parsedAssignments);
        } catch (error) {
          console.warn('Failed to restore A/B test assignments:', error);
        }
      }
    }
  }, [enableLocalStorage]);

  // Save assignments to localStorage when they change
  useEffect(() => {
    if (enableLocalStorage && assignments.length > 0) {
      localStorage.setItem('pulsebridge_ab_assignments', JSON.stringify(assignments));
    }
  }, [assignments, enableLocalStorage]);

  const isUserEligible = (test: ABTest): boolean => {
    const session = getSession();
    if (!session) return false;

    // Check device targeting
    if (test.targetAudience?.device && test.targetAudience.device !== session.device.type) {
      return false;
    }

    // Check referrer targeting
    if (test.targetAudience?.referrer && session.referrer && 
        !session.referrer.includes(test.targetAudience.referrer)) {
      return false;
    }

    // Check UTM parameter targeting
    if (test.targetAudience?.utm && session.utmParams) {
      for (const [key, value] of Object.entries(test.targetAudience.utm)) {
        if (!session.utmParams[key] || session.utmParams[key] !== value) {
          return false;
        }
      }
    }

    // Check page targeting
    if (test.targetPage && !window.location.pathname.includes(test.targetPage)) {
      return false;
    }

    return true;
  };

  const assignUserToVariant = (test: ABTest): ABTestVariant | null => {
    // Check if user is eligible
    if (!isUserEligible(test)) {
      return null;
    }

    // Check for force assignment (for testing)
    const forceVariantId = forceAssignments[test.id];
    if (forceVariantId) {
      const variant = test.variants.find(v => v.id === forceVariantId);
      if (variant) return variant;
    }

    // Generate deterministic assignment based on session ID and test ID
    const sessionId = getCurrentSessionId();
    const seed = hashString(sessionId + test.id);
    const random = (seed % 10000) / 10000; // 0-1

    // Find variant based on cumulative weights
    let cumulativeWeight = 0;
    for (const variant of test.variants) {
      cumulativeWeight += variant.weight / 100;
      if (random <= cumulativeWeight) {
        return variant;
      }
    }

    // Fallback to first variant
    return test.variants[0] || null;
  };

  const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  const getVariant = (testId: string): ABTestVariant | null => {
    const test = tests.find(t => t.id === testId);
    if (!test || !test.isActive) {
      return null;
    }

    // Check if user already has an assignment
    const existingAssignment = assignments.find(a => a.testId === testId);
    if (existingAssignment) {
      const variant = test.variants.find(v => v.id === existingAssignment.variantId);
      return variant || null;
    }

    // Assign user to a variant
    const variant = assignUserToVariant(test);
    if (variant) {
      const newAssignment: ABTestAssignment = {
        testId,
        variantId: variant.id,
        assignedAt: Date.now(),
        sessionId: getCurrentSessionId()
      };

      setAssignments(prev => [...prev, newAssignment]);

      // Track assignment
      trackEvent({
        event: 'ab_test_assignment',
        category: 'experiment',
        action: 'assigned',
        label: testId,
        properties: {
          test_id: testId,
          test_name: test.name,
          variant_id: variant.id,
          variant_name: variant.name,
          assignment_time: Date.now()
        }
      });
    }

    return variant;
  };

  const trackExperiment = (testId: string, event: string, properties?: Record<string, any>) => {
    const assignment = assignments.find(a => a.testId === testId);
    const test = tests.find(t => t.id === testId);

    if (assignment && test) {
      const variant = test.variants.find(v => v.id === assignment.variantId);
      
      trackEvent({
        event: 'ab_test_event',
        category: 'experiment',
        action: event,
        label: testId,
        properties: {
          test_id: testId,
          test_name: test.name,
          variant_id: assignment.variantId,
          variant_name: variant?.name,
          event_type: event,
          assignment_time: assignment.assignedAt,
          ...properties
        }
      });
    }
  };

  const getActiveTests = (): ABTest[] => {
    return tests.filter(test => test.isActive);
  };

  const isTestActive = (testId: string): boolean => {
    const test = tests.find(t => t.id === testId);
    return test?.isActive || false;
  };

  const getUserAssignments = (): ABTestAssignment[] => {
    return assignments;
  };

  const forceVariant = (testId: string, variantId: string) => {
    setForceAssignments(prev => ({
      ...prev,
      [testId]: variantId
    }));

    // Remove existing assignment to force reassignment
    setAssignments(prev => prev.filter(a => a.testId !== testId));
  };

  const getExperimentResults = () => {
    // Return experiment results for analytics dashboard
    const results: Record<string, any> = {};
    
    tests.filter(test => test.isActive).forEach(test => {
      const testAssignments = assignments.filter(a => a.testId === test.id);
      const variantCounts = test.variants.reduce((acc, variant) => {
        acc[variant.id] = testAssignments.filter(a => a.variantId === variant.id).length;
        return acc;
      }, {} as Record<string, number>);

      results[test.id] = {
        name: test.name,
        assignments: variantCounts,
        events: {
          // Placeholder for event tracking results
          // This would normally come from analytics data
        },
        participants: testAssignments.length
      };
    });

    return results;
  };

  const value: ABTestContextType = {
    getVariant,
    trackExperiment,
    getActiveTests,
    isTestActive,
    getUserAssignments,
    forceVariant,
    getExperimentResults
  };

  return (
    <ABTestContext.Provider value={value}>
      {children}
    </ABTestContext.Provider>
  );
}

// Utility hook for easy A/B testing
export function useExperiment(testId: string) {
  const { getVariant, trackExperiment } = useABTest();
  const variant = getVariant(testId);

  return {
    variant,
    isVariant: (variantId: string) => variant?.id === variantId,
    getConfig: (key: string, defaultValue?: any) => variant?.config[key] ?? defaultValue,
    track: (event: string, properties?: Record<string, any>) => 
      trackExperiment(testId, event, properties)
  };
}