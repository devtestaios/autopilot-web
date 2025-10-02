/**
 * Theme Utilities for PulseBridge.ai
 * Simplified theming functions for consistent application
 * October 2, 2025
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function for merging classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Theme-aware class combinations
export const themeClasses = {
  // Application backgrounds
  appBackground: "bg-theme-app text-theme-primary min-h-screen",
  
  // Card components
  card: "theme-card",
  cardHover: "theme-card hover:bg-theme-surface-elevated",
  
  // Surface elements
  surface: "theme-surface",
  surfaceElevated: "theme-surface-elevated",
  
  // Navigation
  nav: "theme-nav",
  navItem: "theme-nav-item",
  navItemActive: "theme-nav-item active",
  
  // Buttons
  buttonPrimary: "theme-button-primary px-4 py-2 rounded-md font-medium",
  buttonSecondary: "theme-button-secondary px-4 py-2 rounded-md font-medium",
  buttonGhost: "theme-button-ghost px-4 py-2 rounded-md font-medium",
  
  // Form elements
  input: "theme-input px-3 py-2 w-full",
  
  // Text
  textPrimary: "text-theme-primary",
  textSecondary: "text-theme-secondary", 
  textMuted: "text-theme-muted",
  
  // Content creator area (always light)
  contentCreator: "content-creator-area",
} as const;

// Helper function to get theme-appropriate classes
export function getThemeClasses(componentType: keyof typeof themeClasses, additionalClasses?: string) {
  return cn(themeClasses[componentType], additionalClasses);
}

// Helper for conditional theme classes
export function getConditionalThemeClasses(
  condition: boolean,
  trueClasses: string,
  falseClasses: string,
  baseClasses?: string
) {
  return cn(baseClasses, condition ? trueClasses : falseClasses);
}

// Marketing platform specific classes
export const marketingThemeClasses = {
  platformCard: "marketing-platform-card p-6 rounded-lg transition-all duration-200",
  platformCardHover: "marketing-platform-card p-6 rounded-lg transition-all duration-200 hover:shadow-lg",
  dashboardContainer: "bg-theme-app min-h-screen p-6",
  metricsCard: "theme-card p-4 rounded-lg",
  campaignCard: "theme-card p-4 rounded-lg border hover:border-theme-secondary",
} as const;

// Special handling for content creation suite
export function getContentCreatorClasses(baseClasses?: string) {
  return cn("content-creator-area", baseClasses);
}

// Helper to determine if we're in content creator mode
export function isContentCreatorRoute(pathname: string): boolean {
  return pathname.includes('/content-suite') || 
         pathname.includes('/content-creation') ||
         pathname.includes('/design-studio') ||
         pathname.includes('/feed-planner');
}

export default themeClasses;