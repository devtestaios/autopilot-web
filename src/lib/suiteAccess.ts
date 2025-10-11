/**
 * Suite Access Control Library
 * Helper functions for checking and managing suite-level permissions
 */

export type SuiteId =
  | 'social_media'
  | 'content_suite'
  | 'email_marketing'
  | 'analytics'
  | 'campaigns'
  | 'billing';

export type AccessLevel = 'none' | 'read_only' | 'full';

export interface SuiteAccess {
  enabled: boolean;
  access_level: AccessLevel;
  granted_at?: string | null;
  granted_by?: string | null;
  [key: string]: any; // Allow additional suite-specific permissions
}

export interface SuiteAccessMap {
  [key: string]: SuiteAccess;
}

/**
 * Check if user has access to a specific suite
 */
export function hasSuiteAccess(
  suiteAccess: SuiteAccessMap | null | undefined,
  suiteId: SuiteId
): boolean {
  if (!suiteAccess) return false;
  return suiteAccess[suiteId]?.enabled === true;
}

/**
 * Check if user has specific permission within a suite
 */
export function hasSuitePermission(
  suiteAccess: SuiteAccessMap | null | undefined,
  suiteId: SuiteId,
  permission: string
): boolean {
  if (!hasSuiteAccess(suiteAccess, suiteId)) return false;

  const suite = suiteAccess![suiteId];

  // Check access level
  if (suite.access_level === 'full') return true;
  if (suite.access_level === 'none') return false;

  // Check specific permission
  if (permission in suite) {
    return suite[permission] === true;
  }

  // For read_only, allow read operations by default
  if (suite.access_level === 'read_only') {
    return ['read', 'view', 'can_view'].some((p) => permission.includes(p));
  }

  return false;
}

/**
 * Get list of enabled suites for a user
 */
export function getEnabledSuites(
  suiteAccess: SuiteAccessMap | null | undefined
): SuiteId[] {
  if (!suiteAccess) return [];

  return Object.entries(suiteAccess)
    .filter(([_, access]) => access.enabled === true)
    .map(([suiteId]) => suiteId as SuiteId);
}

/**
 * Check if user is a test user and if their access is still valid
 */
export function isValidTestUser(
  isTestUser: boolean | null | undefined,
  testUserExpiresAt: string | null | undefined
): boolean {
  if (!isTestUser) return false;

  // No expiration set - valid forever
  if (!testUserExpiresAt) return true;

  // Check if expired
  const expirationDate = new Date(testUserExpiresAt);
  const now = new Date();

  return expirationDate > now;
}

/**
 * Auto-enable dependent suites
 * E.g., enabling Social Media should auto-enable Content Suite
 */
export function getAutoEnabledSuites(suiteId: SuiteId): SuiteId[] {
  const dependencies: Record<SuiteId, SuiteId[]> = {
    social_media: ['content_suite'], // Social Media needs Content Suite
    content_suite: [],
    email_marketing: [],
    analytics: [],
    campaigns: [],
    billing: [],
  };

  return dependencies[suiteId] || [];
}

/**
 * Check if a suite is required by other enabled suites
 */
export function isRequiredBySuite(
  suiteId: SuiteId,
  enabledSuites: SuiteId[]
): boolean {
  const requiredBy: Record<SuiteId, SuiteId[]> = {
    content_suite: ['social_media'], // Content Suite is required by Social Media
    social_media: [],
    email_marketing: [],
    analytics: [],
    campaigns: [],
    billing: [],
  };

  const requiringThis = requiredBy[suiteId] || [];
  return requiringThis.some((suite) => enabledSuites.includes(suite));
}

/**
 * Build default suite access for a given role
 */
export function getDefaultSuiteAccessForRole(role: string): SuiteAccessMap {
  const templates: Record<string, SuiteAccessMap> = {
    super_admin: {
      social_media: { enabled: true, access_level: 'full', can_publish: true, can_view_analytics: true },
      content_suite: { enabled: true, access_level: 'full', can_create: true, can_edit: true },
      email_marketing: { enabled: true, access_level: 'full', can_send: true, can_view_analytics: true },
      analytics: { enabled: true, access_level: 'full', can_export: true },
      campaigns: { enabled: true, access_level: 'full', can_create: true, can_manage_budget: true },
      billing: { enabled: true, access_level: 'full', can_view: true, can_edit: true },
    },
    agency_owner: {
      social_media: { enabled: true, access_level: 'full', can_publish: true, can_view_analytics: true },
      content_suite: { enabled: true, access_level: 'full', can_create: true, can_edit: true },
      email_marketing: { enabled: true, access_level: 'full', can_send: true, can_view_analytics: true },
      analytics: { enabled: true, access_level: 'full', can_export: true },
      campaigns: { enabled: true, access_level: 'full', can_create: true, can_manage_budget: true },
      billing: { enabled: true, access_level: 'full', can_view: true, can_edit: true },
    },
    campaign_manager: {
      social_media: { enabled: true, access_level: 'full', can_publish: true, can_view_analytics: true },
      content_suite: { enabled: true, access_level: 'full', can_create: true, can_edit: true },
      email_marketing: { enabled: true, access_level: 'full', can_send: true, can_view_analytics: true },
      analytics: { enabled: true, access_level: 'read_only', can_export: true },
      campaigns: { enabled: true, access_level: 'full', can_create: true, can_manage_budget: false },
      billing: { enabled: false, access_level: 'none' },
    },
    social_media_manager: {
      social_media: { enabled: true, access_level: 'full', can_publish: true, can_view_analytics: true },
      content_suite: { enabled: true, access_level: 'full', can_create: true, can_edit: true },
      email_marketing: { enabled: false, access_level: 'none' },
      analytics: { enabled: true, access_level: 'read_only', can_export: false },
      campaigns: { enabled: false, access_level: 'none' },
      billing: { enabled: false, access_level: 'none' },
    },
    content_creator: {
      social_media: { enabled: false, access_level: 'none' },
      content_suite: { enabled: true, access_level: 'full', can_create: true, can_edit: true },
      email_marketing: { enabled: false, access_level: 'none' },
      analytics: { enabled: true, access_level: 'read_only', can_export: false },
      campaigns: { enabled: false, access_level: 'none' },
      billing: { enabled: false, access_level: 'none' },
    },
    analyst: {
      social_media: { enabled: false, access_level: 'none' },
      content_suite: { enabled: false, access_level: 'none' },
      email_marketing: { enabled: false, access_level: 'none' },
      analytics: { enabled: true, access_level: 'full', can_export: true },
      campaigns: { enabled: true, access_level: 'read_only' },
      billing: { enabled: false, access_level: 'none' },
    },
    client_viewer: {
      social_media: { enabled: true, access_level: 'read_only' },
      content_suite: { enabled: false, access_level: 'none' },
      email_marketing: { enabled: true, access_level: 'read_only' },
      analytics: { enabled: true, access_level: 'read_only', can_export: false },
      campaigns: { enabled: true, access_level: 'read_only' },
      billing: { enabled: false, access_level: 'none' },
    },
  };

  return templates[role] || templates.campaign_manager;
}

/**
 * Suite metadata for display purposes
 */
export const SUITE_METADATA = {
  social_media: {
    name: 'Social Media Suite',
    description: 'Post scheduling, analytics, account management',
    icon: '📱',
    route: '/social-media',
  },
  content_suite: {
    name: 'Content Suite',
    description: 'Design studio, asset manager, AI content generation',
    icon: '🎨',
    route: '/content-suite',
  },
  email_marketing: {
    name: 'Email Marketing',
    description: 'Campaigns, automations, contact management',
    icon: '📧',
    route: '/email-marketing',
  },
  analytics: {
    name: 'Analytics Suite',
    description: 'Performance tracking, reports, insights',
    icon: '📊',
    route: '/analytics',
  },
  campaigns: {
    name: 'Campaign Management',
    description: 'Multi-channel campaigns, optimization',
    icon: '🎯',
    route: '/campaigns',
  },
  billing: {
    name: 'Billing & Subscriptions',
    description: 'Payment management, invoices, usage',
    icon: '💳',
    route: '/billing',
  },
} as const;
