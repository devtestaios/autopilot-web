'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// ============================================================================
// USER TIER MANAGEMENT
// ============================================================================

export type UserTier = 'taskmaster' | 'projectsuite';

interface UserTierContextValue {
  tier: UserTier;
  features: {
    budgetTracking: boolean;
    teamManagement: boolean;
    advancedAnalytics: boolean;
    milestoneManagement: boolean;
    multipleProjects: boolean;
    customWorkflows: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
  };
  setTier: (tier: UserTier) => void;
  canAccess: (feature: keyof UserTierContextValue['features']) => boolean;
}

const UserTierContext = createContext<UserTierContextValue | undefined>(undefined);

// ============================================================================
// FEATURE DEFINITIONS
// ============================================================================

const getFeaturesByTier = (tier: UserTier) => {
  const baseFeatures = {
    budgetTracking: false,
    teamManagement: false,
    advancedAnalytics: false,
    milestoneManagement: false,
    multipleProjects: false,
    customWorkflows: false,
    apiAccess: false,
    prioritySupport: false
  };

  switch (tier) {
    case 'taskmaster':
      return {
        ...baseFeatures,
        // TaskMaster gets basic features only
        // All advanced features remain false
      };
    
    case 'projectsuite':
      return {
        budgetTracking: true,
        teamManagement: true,
        advancedAnalytics: true,
        milestoneManagement: true,
        multipleProjects: true,
        customWorkflows: true,
        apiAccess: true,
        prioritySupport: true
      };
    
    default:
      return baseFeatures;
  }
};

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export function UserTierProvider({ children }: { children: React.ReactNode }) {
  // TODO: In production, this will come from user subscription/database
  const [tier, setTier] = useState<UserTier>('taskmaster');
  
  const features = getFeaturesByTier(tier);
  
  const canAccess = (feature: keyof UserTierContextValue['features']) => {
    return features[feature];
  };

  // Persist tier selection in localStorage for demo purposes
  useEffect(() => {
    const savedTier = localStorage.getItem('pulsebridge_user_tier') as UserTier;
    if (savedTier && (savedTier === 'taskmaster' || savedTier === 'projectsuite')) {
      setTier(savedTier);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pulsebridge_user_tier', tier);
  }, [tier]);

  const contextValue: UserTierContextValue = {
    tier,
    features,
    setTier,
    canAccess
  };

  return (
    <UserTierContext.Provider value={contextValue}>
      {children}
    </UserTierContext.Provider>
  );
}

// ============================================================================
// CUSTOM HOOK
// ============================================================================

export function useUserTier() {
  const context = useContext(UserTierContext);
  if (context === undefined) {
    throw new Error('useUserTier must be used within a UserTierProvider');
  }
  return context;
}

// ============================================================================
// TIER INFORMATION
// ============================================================================

export const TIER_INFO = {
  taskmaster: {
    name: 'TaskMaster',
    description: 'Simple workflow management for solo entrepreneurs',
    price: '$19/month',
    target: '1-3 person teams',
    color: 'blue'
  },
  projectsuite: {
    name: 'ProjectSuite',
    description: 'Complete enterprise project management ecosystem',
    price: '$49/month', 
    target: '10+ person teams',
    color: 'purple'
  }
} as const;