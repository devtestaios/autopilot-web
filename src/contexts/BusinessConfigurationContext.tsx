'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// ============================================================================
// BUSINESS CONFIGURATION TYPES
// ============================================================================

export interface BusinessProfile {
  id: string;
  name: string;
  type: BusinessType;
  size: BusinessSize;
  industry: string;
  goals: string[];
  selectedPlatforms: string[];
  customizations: BusinessCustomizations;
  createdAt: Date;
  updatedAt: Date;
}

export type BusinessType = 
  | 'solo_entrepreneur'
  | 'startup' 
  | 'small_business'
  | 'growing_business'
  | 'medium_business'
  | 'large_business'
  | 'enterprise'
  | 'agency'
  | 'freelancer'
  | 'consultant';

export type BusinessSize = 
  | 'solo' // 1 person
  | 'micro' // 2-9 people  
  | 'small' // 10-49 people
  | 'medium' // 50-249 people
  | 'large' // 250-999 people
  | 'enterprise'; // 1000+ people

export interface BusinessCustomizations {
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  dashboardLayout: 'simple' | 'standard' | 'advanced' | 'custom';
  navigationStyle: 'minimal' | 'standard' | 'detailed';
  enabledFeatures: string[];
  automationLevel: 'basic' | 'intermediate' | 'advanced' | 'full';
  reportingDepth: 'essential' | 'standard' | 'comprehensive' | 'enterprise';
}

export interface BusinessTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  targetSize: BusinessSize[];
  recommendedPlatforms: string[];
  essentialPlatforms: string[];
  optionalPlatforms: string[];
  setupTime: string;
  complexity: 'simple' | 'moderate' | 'advanced';
  monthlyValue: string;
}

// ============================================================================
// BUSINESS CONFIGURATION CONTEXT INTERFACE
// ============================================================================

interface BusinessConfigurationContextValue {
  // ========== CORE BUSINESS STATE ==========
  currentProfile: BusinessProfile | null;
  businessProfiles: BusinessProfile[];
  isSetupComplete: boolean;
  setupStep: number;
  
  // ========== BUSINESS TEMPLATES ==========
  businessTemplates: BusinessTemplate[];
  selectedTemplate: BusinessTemplate | null;
  getTemplatesBySize: (size: BusinessSize) => BusinessTemplate[];
  getTemplatesByType: (type: BusinessType) => BusinessTemplate[];
  
  // ========== PROFILE MANAGEMENT ==========
  createBusinessProfile: (profile: Omit<BusinessProfile, 'id' | 'createdAt' | 'updatedAt'>) => Promise<BusinessProfile>;
  updateBusinessProfile: (profileId: string, updates: Partial<BusinessProfile>) => Promise<void>;
  switchBusinessProfile: (profileId: string) => void;
  deleteBusinessProfile: (profileId: string) => Promise<void>;
  
  // ========== PLATFORM CONFIGURATION ==========
  getAvailablePlatforms: () => any[];
  getRecommendedPlatforms: (profile: BusinessProfile) => string[];
  togglePlatform: (platformId: string, enabled: boolean) => void;
  isPlatformEnabled: (platformId: string) => boolean;
  
  // ========== SETUP WIZARD ==========
  startSetupWizard: () => void;
  nextSetupStep: () => void;
  previousSetupStep: () => void;
  completeSetup: () => void;
  skipSetup: () => void;
  
  // ========== CUSTOMIZATION ==========
  updateCustomizations: (customizations: Partial<BusinessCustomizations>) => void;
  resetToDefaults: () => void;
  exportConfiguration: () => string;
  importConfiguration: (config: string) => Promise<void>;
  
  // ========== BUSINESS INTELLIGENCE ==========
  getBusinessInsights: () => any[];
  getGrowthRecommendations: () => string[];
  getOptimizationSuggestions: () => any[];
}

// ============================================================================
// BUSINESS TEMPLATES - Tailored for Different Business Needs
// ============================================================================

const businessTemplates: BusinessTemplate[] = [
  // SOLO ENTREPRENEUR TEMPLATES
  {
    id: 'solo_creator',
    name: 'Solo Content Creator',
    description: 'Perfect for individual creators, bloggers, and influencers',
    icon: '🎨',
    targetSize: ['solo'],
    essentialPlatforms: ['social-media-platform', 'content-creation-suite'],
    recommendedPlatforms: ['analytics-intelligence', 'email-marketing'],
    optionalPlatforms: ['unified-crm-suite', 'marketing-optimization'],
    setupTime: '15 minutes',
    complexity: 'simple',
    monthlyValue: '$47/month'
  },
  {
    id: 'freelancer_pro',
    name: 'Professional Freelancer',
    description: 'Comprehensive toolkit for freelancers and consultants',
    icon: '💼',
    targetSize: ['solo', 'micro'],
    essentialPlatforms: ['unified-crm-suite', 'business-suite'],
    recommendedPlatforms: ['analytics-intelligence', 'social-media-platform', 'email-marketing'],
    optionalPlatforms: ['marketing-optimization', 'content-creation-suite'],
    setupTime: '30 minutes',
    complexity: 'moderate',
    monthlyValue: '$97/month'
  },

  // SMALL BUSINESS TEMPLATES
  {
    id: 'local_business',
    name: 'Local Business Hub',
    description: 'Perfect for restaurants, retail stores, and service businesses',
    icon: '🏪',
    targetSize: ['micro', 'small'],
    essentialPlatforms: ['unified-crm-suite', 'social-media-platform', 'analytics-intelligence'],
    recommendedPlatforms: ['email-marketing', 'marketing-optimization', 'business-suite'],
    optionalPlatforms: ['content-creation-suite', 'e-commerce-platform'],
    setupTime: '45 minutes',
    complexity: 'moderate',
    monthlyValue: '$197/month'
  },
  {
    id: 'ecommerce_starter',
    name: 'E-Commerce Startup',
    description: 'Complete online store management system',
    icon: '🛒',
    targetSize: ['solo', 'micro', 'small'],
    essentialPlatforms: ['e-commerce-platform', 'marketing-optimization', 'analytics-intelligence'],
    recommendedPlatforms: ['social-media-platform', 'email-marketing', 'unified-crm-suite'],
    optionalPlatforms: ['content-creation-suite', 'business-suite'],
    setupTime: '60 minutes',
    complexity: 'moderate',
    monthlyValue: '$297/month'
  },
  {
    id: 'service_business',
    name: 'Service Business Pro',
    description: 'Ideal for consultancies, agencies, and professional services',
    icon: '🎯',
    targetSize: ['micro', 'small', 'medium'],
    essentialPlatforms: ['unified-crm-suite', 'business-suite', 'analytics-intelligence'],
    recommendedPlatforms: ['marketing-optimization', 'social-media-platform', 'email-marketing'],
    optionalPlatforms: ['content-creation-suite', 'project-management'],
    setupTime: '75 minutes',
    complexity: 'advanced',
    monthlyValue: '$497/month'
  },

  // GROWING & MEDIUM BUSINESS TEMPLATES
  {
    id: 'marketing_agency',
    name: 'Marketing Agency Command Center',
    description: 'Full-service marketing agency management platform',
    icon: '🚀',
    targetSize: ['small', 'medium', 'large'],
    essentialPlatforms: ['marketing-optimization', 'unified-crm-suite', 'analytics-intelligence', 'social-media-platform'],
    recommendedPlatforms: ['content-creation-suite', 'email-marketing', 'business-suite'],
    optionalPlatforms: ['project-management', 'customer-support'],
    setupTime: '90 minutes',
    complexity: 'advanced',
    monthlyValue: '$997/month'
  },
  {
    id: 'saas_startup',
    name: 'SaaS Startup Growth Engine',
    description: 'Everything needed to launch and scale a SaaS business',
    icon: '⚡',
    targetSize: ['micro', 'small', 'medium'],
    essentialPlatforms: ['unified-crm-suite', 'marketing-optimization', 'analytics-intelligence'],
    recommendedPlatforms: ['email-marketing', 'customer-support', 'business-suite'],
    optionalPlatforms: ['social-media-platform', 'content-creation-suite'],
    setupTime: '120 minutes',
    complexity: 'advanced',
    monthlyValue: '$797/month'
  },

  // ENTERPRISE TEMPLATES  
  {
    id: 'enterprise_suite',
    name: 'Enterprise Command Center',
    description: 'Complete business operations platform for large organizations',
    icon: '🏢',
    targetSize: ['large', 'enterprise'],
    essentialPlatforms: ['unified-crm-suite', 'business-suite', 'analytics-intelligence', 'marketing-optimization'],
    recommendedPlatforms: ['project-management', 'customer-support', 'hr-management', 'financial-management'],
    optionalPlatforms: ['social-media-platform', 'content-creation-suite', 'e-commerce-platform'],
    setupTime: '180 minutes',
    complexity: 'advanced',
    monthlyValue: '$1997/month'
  },
  
  // CUSTOM TEMPLATE
  {
    id: 'custom_build',
    name: 'Build Your Own',
    description: 'Create a completely custom configuration for your unique needs',
    icon: '🛠️',
    targetSize: ['solo', 'micro', 'small', 'medium', 'large', 'enterprise'],
    essentialPlatforms: [],
    recommendedPlatforms: [],
    optionalPlatforms: ['all_platforms'],
    setupTime: 'Variable',
    complexity: 'simple',
    monthlyValue: 'Pay as you need'
  }
];

// ============================================================================
// DEFAULT BUSINESS CUSTOMIZATIONS
// ============================================================================

const defaultCustomizations: BusinessCustomizations = {
  brandColors: {
    primary: '#00c9a7', // PulseBridge teal
    secondary: '#e07856', // PulseBridge coral  
    accent: '#0a2540' // PulseBridge navy
  },
  dashboardLayout: 'standard',
  navigationStyle: 'standard',
  enabledFeatures: [],
  automationLevel: 'intermediate',
  reportingDepth: 'standard'
};

// ============================================================================
// BUSINESS CONFIGURATION CONTEXT
// ============================================================================

const BusinessConfigurationContext = createContext<BusinessConfigurationContextValue | undefined>(undefined);

// ============================================================================
// BUSINESS CONFIGURATION PROVIDER
// ============================================================================

export function BusinessConfigurationProvider({ children }: { children: React.ReactNode }) {
  // ========== CORE STATE ==========
  const [currentProfile, setCurrentProfile] = useState<BusinessProfile | null>(null);
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([]);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [setupStep, setSetupStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<BusinessTemplate | null>(null);

  // ========== TEMPLATE FUNCTIONS ==========
  const getTemplatesBySize = useCallback((size: BusinessSize) => {
    return businessTemplates.filter(template => template.targetSize.includes(size));
  }, []);

  const getTemplatesByType = useCallback((type: BusinessType) => {
    // Map business types to appropriate templates
    const typeToTemplateMap: Record<BusinessType, string[]> = {
      'solo_entrepreneur': ['solo_creator', 'freelancer_pro', 'custom_build'],
      'freelancer': ['freelancer_pro', 'solo_creator', 'custom_build'],
      'consultant': ['freelancer_pro', 'service_business', 'custom_build'],
      'startup': ['ecommerce_starter', 'saas_startup', 'service_business'],
      'small_business': ['local_business', 'ecommerce_starter', 'service_business'],
      'growing_business': ['service_business', 'marketing_agency', 'saas_startup'],
      'medium_business': ['marketing_agency', 'saas_startup', 'enterprise_suite'],
      'large_business': ['enterprise_suite', 'marketing_agency'],
      'enterprise': ['enterprise_suite'],
      'agency': ['marketing_agency', 'service_business']
    };

    const templateIds = typeToTemplateMap[type] || ['custom_build'];
    return businessTemplates.filter(template => templateIds.includes(template.id));
  }, []);

  // ========== PROFILE MANAGEMENT ==========
  const createBusinessProfile = useCallback(async (profileData: Omit<BusinessProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProfile: BusinessProfile = {
      ...profileData,
      id: `profile_${Date.now()}`,
      customizations: { ...defaultCustomizations, ...profileData.customizations },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setBusinessProfiles(prev => [...prev, newProfile]);
    setCurrentProfile(newProfile);
    
    // Save to localStorage for persistence
    localStorage.setItem('business_profiles', JSON.stringify([...businessProfiles, newProfile]));
    localStorage.setItem('current_profile_id', newProfile.id);

    return newProfile;
  }, [businessProfiles]);

  const updateBusinessProfile = useCallback(async (profileId: string, updates: Partial<BusinessProfile>) => {
    const updatedProfiles = businessProfiles.map(profile => 
      profile.id === profileId 
        ? { ...profile, ...updates, updatedAt: new Date() }
        : profile
    );

    setBusinessProfiles(updatedProfiles);
    
    if (currentProfile?.id === profileId) {
      setCurrentProfile(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }

    localStorage.setItem('business_profiles', JSON.stringify(updatedProfiles));
  }, [businessProfiles, currentProfile]);

  const switchBusinessProfile = useCallback((profileId: string) => {
    const profile = businessProfiles.find(p => p.id === profileId);
    if (profile) {
      setCurrentProfile(profile);
      localStorage.setItem('current_profile_id', profileId);
    }
  }, [businessProfiles]);

  const deleteBusinessProfile = useCallback(async (profileId: string) => {
    const updatedProfiles = businessProfiles.filter(p => p.id !== profileId);
    setBusinessProfiles(updatedProfiles);

    if (currentProfile?.id === profileId) {
      setCurrentProfile(updatedProfiles[0] || null);
    }

    localStorage.setItem('business_profiles', JSON.stringify(updatedProfiles));
  }, [businessProfiles, currentProfile]);

  // ========== PLATFORM CONFIGURATION ==========
  const getAvailablePlatforms = useCallback(() => {
    // This will integrate with platformRegistry.ts
    return []; // TODO: Import from platformRegistry
  }, []);

  const getRecommendedPlatforms = useCallback((profile: BusinessProfile) => {
    const template = businessTemplates.find(t => 
      t.targetSize.includes(profile.size) || 
      t.name.toLowerCase().includes(profile.type.toLowerCase())
    );
    
    return template?.recommendedPlatforms || [];
  }, []);

  const togglePlatform = useCallback((platformId: string, enabled: boolean) => {
    if (!currentProfile) return;

    const updatedPlatforms = enabled 
      ? [...currentProfile.selectedPlatforms, platformId]
      : currentProfile.selectedPlatforms.filter(id => id !== platformId);

    updateBusinessProfile(currentProfile.id, {
      selectedPlatforms: updatedPlatforms
    });
  }, [currentProfile, updateBusinessProfile]);

  const isPlatformEnabled = useCallback((platformId: string) => {
    return currentProfile?.selectedPlatforms.includes(platformId) || false;
  }, [currentProfile]);

  // ========== SETUP WIZARD ==========
  const startSetupWizard = useCallback(() => {
    setSetupStep(0);
    setIsSetupComplete(false);
  }, []);

  const nextSetupStep = useCallback(() => {
    setSetupStep(prev => prev + 1);
  }, []);

  const previousSetupStep = useCallback(() => {
    setSetupStep(prev => Math.max(0, prev - 1));
  }, []);

  const completeSetup = useCallback(() => {
    setIsSetupComplete(true);
    setSetupStep(0);
  }, []);

  const skipSetup = useCallback(() => {
    setIsSetupComplete(true);
    setSetupStep(0);
  }, []);

  // ========== CUSTOMIZATION ==========
  const updateCustomizations = useCallback((customizations: Partial<BusinessCustomizations>) => {
    if (!currentProfile) return;

    const updatedCustomizations = {
      ...currentProfile.customizations,
      ...customizations
    };

    updateBusinessProfile(currentProfile.id, {
      customizations: updatedCustomizations
    });
  }, [currentProfile, updateBusinessProfile]);

  const resetToDefaults = useCallback(() => {
    updateCustomizations(defaultCustomizations);
  }, [updateCustomizations]);

  const exportConfiguration = useCallback(() => {
    if (!currentProfile) return '';
    return JSON.stringify(currentProfile, null, 2);
  }, [currentProfile]);

  const importConfiguration = useCallback(async (config: string) => {
    try {
      const profileData = JSON.parse(config);
      await createBusinessProfile(profileData);
    } catch (error) {
      console.error('Failed to import configuration:', error);
    }
  }, [createBusinessProfile]);

  // ========== BUSINESS INTELLIGENCE ==========
  const getBusinessInsights = useCallback(() => {
    // TODO: Implement business intelligence
    return [];
  }, []);

  const getGrowthRecommendations = useCallback(() => {
    if (!currentProfile) return [];
    
    // Basic recommendations based on profile
    const recommendations = [];
    
    if (currentProfile.selectedPlatforms.length < 3) {
      recommendations.push('Consider adding more platforms to increase business efficiency');
    }
    
    if (!currentProfile.selectedPlatforms.includes('analytics-intelligence')) {
      recommendations.push('Add Analytics Intelligence to track your business performance');
    }

    return recommendations;
  }, [currentProfile]);

  const getOptimizationSuggestions = useCallback(() => {
    // TODO: Implement optimization suggestions
    return [];
  }, []);

  // ========== INITIALIZATION ==========
  useEffect(() => {
    // Load saved profiles from localStorage
    const savedProfiles = localStorage.getItem('business_profiles');
    const currentProfileId = localStorage.getItem('current_profile_id');

    if (savedProfiles) {
      try {
        const profiles = JSON.parse(savedProfiles);
        setBusinessProfiles(profiles);

        if (currentProfileId) {
          const profile = profiles.find((p: BusinessProfile) => p.id === currentProfileId);
          if (profile) {
            setCurrentProfile(profile);
            setIsSetupComplete(true);
          }
        }
      } catch (error) {
        console.error('Failed to load business profiles:', error);
      }
    }
  }, []);

  // ========== CONTEXT VALUE ==========
  const contextValue: BusinessConfigurationContextValue = {
    // Core state
    currentProfile,
    businessProfiles,
    isSetupComplete,
    setupStep,
    
    // Business templates
    businessTemplates,
    selectedTemplate,
    getTemplatesBySize,
    getTemplatesByType,
    
    // Profile management
    createBusinessProfile,
    updateBusinessProfile,
    switchBusinessProfile,
    deleteBusinessProfile,
    
    // Platform configuration
    getAvailablePlatforms,
    getRecommendedPlatforms,
    togglePlatform,
    isPlatformEnabled,
    
    // Setup wizard
    startSetupWizard,
    nextSetupStep,
    previousSetupStep,
    completeSetup,
    skipSetup,
    
    // Customization
    updateCustomizations,
    resetToDefaults,
    exportConfiguration,
    importConfiguration,
    
    // Business intelligence
    getBusinessInsights,
    getGrowthRecommendations,
    getOptimizationSuggestions
  };

  return (
    <BusinessConfigurationContext.Provider value={contextValue}>
      {children}
    </BusinessConfigurationContext.Provider>
  );
}

// ============================================================================
// CUSTOM HOOK
// ============================================================================

export function useBusinessConfiguration() {
  const context = useContext(BusinessConfigurationContext);
  if (context === undefined) {
    throw new Error('useBusinessConfiguration must be used within a BusinessConfigurationProvider');
  }
  return context;
}