/**
 * Environment Configuration & Validation System
 * Ensures all required credentials are properly configured before API integration
 */

import React from 'react';

export interface PlatformCredentials {
  // Google Ads API
  GOOGLE_ADS_DEVELOPER_TOKEN?: string;
  GOOGLE_ADS_CLIENT_ID?: string;
  GOOGLE_ADS_CLIENT_SECRET?: string;
  GOOGLE_ADS_REFRESH_TOKEN?: string;
  GOOGLE_ADS_CUSTOMER_ID?: string;

  // Meta Ads API
  META_ACCESS_TOKEN?: string;
  META_APP_ID?: string;
  META_APP_SECRET?: string;
  META_AD_ACCOUNT_ID?: string;

  // LinkedIn Ads API
  LINKEDIN_ACCESS_TOKEN?: string;
  LINKEDIN_CLIENT_ID?: string;
  LINKEDIN_CLIENT_SECRET?: string;
  LINKEDIN_AD_ACCOUNT_ID?: string;

  // Pinterest Ads API
  PINTEREST_ACCESS_TOKEN?: string;
  PINTEREST_APP_ID?: string;
  PINTEREST_APP_SECRET?: string;
  PINTEREST_AD_ACCOUNT_ID?: string;

  // Core Platform
  NEXT_PUBLIC_API_URL?: string;
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  OPENAI_API_KEY?: string;
}

export interface EnvironmentStatus {
  isProduction: boolean;
  hasRequiredCore: boolean;
  platformsReady: {
    googleAds: boolean;
    metaAds: boolean;
    linkedInAds: boolean;
    pinterestAds: boolean;
  };
  missingCredentials: string[];
  warnings: string[];
}

class EnvironmentManager {
  private credentials: PlatformCredentials;

  constructor() {
    this.credentials = this.loadCredentials();
  }

  private loadCredentials(): PlatformCredentials {
    // Load from process.env (server) or runtime config (client)
    const isBrowser = typeof window !== 'undefined';
    
    if (isBrowser) {
      // Client-side: only public variables
      return {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      };
    }

    // Server-side: all variables
    return {
      // Google Ads
      GOOGLE_ADS_DEVELOPER_TOKEN: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
      GOOGLE_ADS_CLIENT_ID: process.env.GOOGLE_ADS_CLIENT_ID,
      GOOGLE_ADS_CLIENT_SECRET: process.env.GOOGLE_ADS_CLIENT_SECRET,
      GOOGLE_ADS_REFRESH_TOKEN: process.env.GOOGLE_ADS_REFRESH_TOKEN,
      GOOGLE_ADS_CUSTOMER_ID: process.env.GOOGLE_ADS_CUSTOMER_ID,

      // Meta Ads
      META_ACCESS_TOKEN: process.env.META_ACCESS_TOKEN,
      META_APP_ID: process.env.META_APP_ID,
      META_APP_SECRET: process.env.META_APP_SECRET,
      META_AD_ACCOUNT_ID: process.env.META_AD_ACCOUNT_ID,

      // LinkedIn Ads
      LINKEDIN_ACCESS_TOKEN: process.env.LINKEDIN_ACCESS_TOKEN,
      LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
      LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
      LINKEDIN_AD_ACCOUNT_ID: process.env.LINKEDIN_AD_ACCOUNT_ID,

      // Pinterest Ads
      PINTEREST_ACCESS_TOKEN: process.env.PINTEREST_ACCESS_TOKEN,
      PINTEREST_APP_ID: process.env.PINTEREST_APP_ID,
      PINTEREST_APP_SECRET: process.env.PINTEREST_APP_SECRET,
      PINTEREST_AD_ACCOUNT_ID: process.env.PINTEREST_AD_ACCOUNT_ID,

      // Core Platform
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    };
  }

  public validateEnvironment(): EnvironmentStatus {
    const missingCredentials: string[] = [];
    const warnings: string[] = [];

    // Check core requirements
    const coreRequirements = [
      'NEXT_PUBLIC_API_URL',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];

    const missingCore = coreRequirements.filter(key => 
      !this.credentials[key as keyof PlatformCredentials]
    );
    missingCredentials.push(...missingCore);

    // Check AI requirements
    if (!this.credentials.ANTHROPIC_API_KEY && !this.credentials.OPENAI_API_KEY) {
      warnings.push('No AI provider configured (ANTHROPIC_API_KEY or OPENAI_API_KEY)');
    }

    // Check platform-specific requirements
    const platformsReady = {
      googleAds: this.validateGoogleAds(),
      metaAds: this.validateMetaAds(),
      linkedInAds: this.validateLinkedInAds(),
      pinterestAds: this.validatePinterestAds()
    };

    return {
      isProduction: process.env.NODE_ENV === 'production',
      hasRequiredCore: missingCore.length === 0,
      platformsReady,
      missingCredentials,
      warnings
    };
  }

  private validateGoogleAds(): boolean {
    const required = [
      'GOOGLE_ADS_DEVELOPER_TOKEN',
      'GOOGLE_ADS_CLIENT_ID',
      'GOOGLE_ADS_CLIENT_SECRET',
      'GOOGLE_ADS_REFRESH_TOKEN',
      'GOOGLE_ADS_CUSTOMER_ID'
    ];
    return required.every(key => this.credentials[key as keyof PlatformCredentials]);
  }

  private validateMetaAds(): boolean {
    const required = [
      'META_ACCESS_TOKEN',
      'META_APP_ID',
      'META_APP_SECRET',
      'META_AD_ACCOUNT_ID'
    ];
    return required.every(key => this.credentials[key as keyof PlatformCredentials]);
  }

  private validateLinkedInAds(): boolean {
    const required = [
      'LINKEDIN_ACCESS_TOKEN',
      'LINKEDIN_CLIENT_ID',
      'LINKEDIN_CLIENT_SECRET',
      'LINKEDIN_AD_ACCOUNT_ID'
    ];
    return required.every(key => this.credentials[key as keyof PlatformCredentials]);
  }

  private validatePinterestAds(): boolean {
    const required = [
      'PINTEREST_ACCESS_TOKEN',
      'PINTEREST_APP_ID',
      'PINTEREST_APP_SECRET',
      'PINTEREST_AD_ACCOUNT_ID'
    ];
    return required.every(key => this.credentials[key as keyof PlatformCredentials]);
  }

  public getCredential(key: keyof PlatformCredentials): string | undefined {
    return this.credentials[key];
  }

  public hasCredential(key: keyof PlatformCredentials): boolean {
    return Boolean(this.credentials[key]);
  }

  public getPlatformStatus(platform: 'google' | 'meta' | 'linkedin' | 'pinterest') {
    const status = this.validateEnvironment();
    switch (platform) {
      case 'google':
        return status.platformsReady.googleAds;
      case 'meta':
        return status.platformsReady.metaAds;
      case 'linkedin':
        return status.platformsReady.linkedInAds;
      case 'pinterest':
        return status.platformsReady.pinterestAds;
      default:
        return false;
    }
  }

  public generateSetupGuide(): string {
    const status = this.validateEnvironment();
    let guide = '# Environment Setup Guide\n\n';

    if (!status.hasRequiredCore) {
      guide += '## ⚠️ Critical: Core Environment Variables Missing\n\n';
      guide += '```bash\n';
      guide += 'NEXT_PUBLIC_API_URL=https://autopilot-api-1.onrender.com\n';
      guide += 'NEXT_PUBLIC_SUPABASE_URL=your_supabase_url\n';
      guide += 'NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key\n';
      guide += '```\n\n';
    }

    // Add platform-specific setup instructions
    if (!status.platformsReady.googleAds) {
      guide += '## Google Ads API Setup\n\n';
      guide += 'See GOOGLE_ADS_SETUP.md for detailed instructions.\n\n';
    }

    if (!status.platformsReady.metaAds) {
      guide += '## Meta Ads API Setup\n\n';
      guide += 'Configure Meta Business App credentials.\n\n';
    }

    if (!status.platformsReady.linkedInAds) {
      guide += '## LinkedIn Ads API Setup\n\n';
      guide += 'Set up LinkedIn Marketing Developer Platform access.\n\n';
    }

    return guide;
  }
}

// Singleton instance
export const environmentManager = new EnvironmentManager();

// Utility functions
export const validateEnvironment = () => environmentManager.validateEnvironment();
export const getPlatformStatus = (platform: 'google' | 'meta' | 'linkedin' | 'pinterest') => 
  environmentManager.getPlatformStatus(platform);
export const generateSetupGuide = () => environmentManager.generateSetupGuide();

// React hook for environment status
export const useEnvironmentStatus = () => {
  const [status, setStatus] = React.useState<EnvironmentStatus | null>(null);

  React.useEffect(() => {
    setStatus(environmentManager.validateEnvironment());
  }, []);

  return status;
};

export default environmentManager;