/**
 * Feature flags for controlling platform rollout
 * Use to safely enable/disable features in production
 */
export const FEATURE_FLAGS = {
  // Core Master Terminal System - ENABLED for demonstration
  masterTerminal: true,
  
  // Marketing Optimization Platform - Consolidated PulseBridge.ai functionality
  marketingOptimization: true, // Marketing Optimization Platform - ENABLED FOR PRODUCTION
  
  // Existing platforms (always enabled)
  marketing: true,       // Marketing Campaign Dashboard (existing)
  analytics: true,       // Advanced Analytics (existing)
  leads: true,          // Lead Management (existing)
  alerts: true,         // Smart Alerts (existing)
  status: true,         // System Status (existing)
  
  // Platform-specific flags (Phase 1 - Social Media Platforms)
  socialmedia: true,     // Social Media Dashboard - ENABLED FOR DEVELOPMENT
  emailmarketing: true,  // Email Marketing Platform - ENABLED FOR DEVELOPMENT
  contentcreation: false, // Content Creation Suite  
  influencer: false,     // Influencer Management
  sociallistening: false, // Social Listening
  
  // Platform-specific flags (Phase 2 - E-commerce)
  ecommerce: false,      // E-commerce Platform
  inventory: false,      // Inventory Management  
  payments: false,       // Payment Processing
  shipping: false,       // Shipping & Logistics
  
  // Platform-specific flags (Phase 3 - Advanced Analytics)
  advancedanalytics: false, // Advanced Analytics Suite
  aiinsights: false,     // AI-Powered Insights
  predictive: false,     // Predictive Analytics
  reporting: false,      // Advanced Reporting
  
  // Platform-specific flags (Phase 4 - Operations)
  operations: false,     // Operations Management
  hr: false,             // HR Management
  finance: false,        // Finance Dashboard
  project: false,        // Project Management
  
  // Development and testing flags
  debugMode: false,      // Debug mode for development
} as const;

export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;

/**
 * Check if a feature flag is enabled
 */
export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
  return FEATURE_FLAGS[flag] ?? false;
}

/**
 * Get all enabled feature flags
 */
export function getEnabledFeatures(): FeatureFlagKey[] {
  return Object.entries(FEATURE_FLAGS)
    .filter(([_, enabled]) => enabled)
    .map(([flag, _]) => flag as FeatureFlagKey);
}

/**
 * Development mode logger - only logs if debug mode is enabled
 */
export function debugLog(message: string, data?: any) {
  if (!isFeatureEnabled('debugMode')) return;
  
  console.log(`[Feature Flag Debug] ${message}`, data);
}

/**
 * Get development status summary
 */
export function getDevStatus() {
  return {
    totalFlags: Object.keys(FEATURE_FLAGS).length,
    enabledFlags: getEnabledFeatures().length,
    masterTerminalEnabled: isFeatureEnabled('masterTerminal'),
    debugModeEnabled: isFeatureEnabled('debugMode')
  };
}