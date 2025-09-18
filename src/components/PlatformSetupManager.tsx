'use client';

import React, { useState, useEffect } from 'react';
import { multiPlatformManager } from '@/lib/platforms/manager';
import { PlatformAdapter, PlatformCredentials } from '@/lib/platforms/base';

interface PlatformStatus {
  adapter: PlatformAdapter;
  connected: boolean;
  lastTest?: Date;
  error?: string;
}

interface CredentialField {
  name: string;
  label: string;
  type: 'text' | 'password';
  placeholder: string;
  helpText?: string;
  helpLink?: string;
}

const PLATFORM_CREDENTIALS: Record<string, CredentialField[]> = {
  google_ads: [
    {
      name: 'developerToken',
      label: 'Developer Token',
      type: 'password',
      placeholder: 'Enter your Google Ads Developer Token',
      helpText: 'Required for API access. Get this from your Google Ads Manager account.',
      helpLink: 'https://developers.google.com/google-ads/api/docs/first-call/dev-token'
    },
    {
      name: 'clientId',
      label: 'OAuth Client ID',
      type: 'text',
      placeholder: 'Enter your OAuth Client ID',
      helpText: 'From Google Cloud Console OAuth credentials.'
    },
    {
      name: 'clientSecret',
      label: 'OAuth Client Secret',
      type: 'password',
      placeholder: 'Enter your OAuth Client Secret',
      helpText: 'From Google Cloud Console OAuth credentials.'
    },
    {
      name: 'refreshToken',
      label: 'Refresh Token',
      type: 'password',
      placeholder: 'Enter your Refresh Token',
      helpText: 'Generated during OAuth flow for your Google Ads account.'
    },
    {
      name: 'customerId',
      label: 'Customer ID',
      type: 'text',
      placeholder: '123-456-7890',
      helpText: 'Your Google Ads Customer ID (without dashes).'
    }
  ],
  meta_ads: [
    {
      name: 'accessToken',
      label: 'Access Token',
      type: 'password',
      placeholder: 'Enter your Meta Access Token',
      helpText: 'Long-lived access token from Meta Business Manager.',
      helpLink: 'https://developers.facebook.com/docs/marketing-api/overview'
    },
    {
      name: 'appId',
      label: 'App ID',
      type: 'text',
      placeholder: 'Enter your Meta App ID',
      helpText: 'From your Meta for Developers app dashboard.'
    },
    {
      name: 'appSecret',
      label: 'App Secret',
      type: 'password',
      placeholder: 'Enter your Meta App Secret',
      helpText: 'From your Meta for Developers app dashboard.'
    },
    {
      name: 'adAccountId',
      label: 'Ad Account ID',
      type: 'text',
      placeholder: '123456789',
      helpText: 'Your Meta Ad Account ID (numbers only, no "act_" prefix).'
    }
  ],
  linkedin_ads: [
    {
      name: 'accessToken',
      label: 'Access Token',
      type: 'password',
      placeholder: 'Enter your LinkedIn Access Token',
      helpText: 'OAuth 2.0 access token with advertising permissions.',
      helpLink: 'https://docs.microsoft.com/en-us/linkedin/marketing/getting-started'
    },
    {
      name: 'clientId',
      label: 'Client ID',
      type: 'text',
      placeholder: 'Enter your LinkedIn App Client ID',
      helpText: 'From your LinkedIn Developer app dashboard.'
    },
    {
      name: 'clientSecret',
      label: 'Client Secret',
      type: 'password',
      placeholder: 'Enter your LinkedIn App Client Secret',
      helpText: 'From your LinkedIn Developer app dashboard.'
    },
    {
      name: 'adAccountId',
      label: 'Ad Account ID',
      type: 'text',
      placeholder: '123456789',
      helpText: 'Your LinkedIn Ads Account ID (numbers only).'
    }
  ]
};

export function PlatformSetupManager() {
  const [platforms, setPlatforms] = useState<PlatformStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [testingConnection, setTestingConnection] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string>('');
  const [saveError, setSaveError] = useState<string>('');

  useEffect(() => {
    loadPlatformStatus();
  }, []);

  const loadPlatformStatus = async () => {
    try {
      const availablePlatforms = multiPlatformManager.getAvailablePlatforms();
      const platformStatuses: PlatformStatus[] = [];

      for (const adapter of availablePlatforms) {
        const connected = multiPlatformManager.isPlatformConnected(adapter.config.name);
        platformStatuses.push({
          adapter,
          connected,
          lastTest: connected ? new Date() : undefined
        });
      }

      setPlatforms(platformStatuses);
      
      // Set default selected platform
      if (platformStatuses.length > 0 && !selectedPlatform) {
        setSelectedPlatform(platformStatuses[0].adapter.config.name);
      }
    } catch (error) {
      console.error('Failed to load platform status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialChange = (field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const testConnection = async () => {
    if (!selectedPlatform) return;

    setTestingConnection(true);
    setSaveError('');
    setSaveSuccess('');

    try {
      const success = await multiPlatformManager.connectPlatform(selectedPlatform, credentials);
      
      if (success) {
        setSaveSuccess(`Successfully connected to ${getPlatformDisplayName(selectedPlatform)}!`);
        await loadPlatformStatus(); // Refresh status
        setCredentials({}); // Clear form
      } else {
        setSaveError('Connection test failed. Please check your credentials.');
      }
    } catch (error) {
      setSaveError(`Connection failed: ${error}`);
    } finally {
      setTestingConnection(false);
    }
  };

  const disconnectPlatform = (platformId: string) => {
    multiPlatformManager.disconnectPlatform(platformId);
    loadPlatformStatus();
    setSaveSuccess(`Disconnected from ${getPlatformDisplayName(platformId)}`);
  };

  const getPlatformDisplayName = (platformId: string): string => {
    const platform = platforms.find(p => p.adapter.config.name === platformId);
    return platform?.adapter.config.displayName || platformId;
  };

  const getSelectedPlatformAdapter = (): PlatformAdapter | null => {
    return platforms.find(p => p.adapter.config.name === selectedPlatform)?.adapter || null;
  };

  const getPlatformFields = (): CredentialField[] => {
    return PLATFORM_CREDENTIALS[selectedPlatform] || [];
  };

  const isFormValid = (): boolean => {
    const fields = getPlatformFields();
    return fields.every(field => credentials[field.name]?.trim());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading platform configurations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Integration Setup</h1>
        <p className="text-gray-600 mt-1">
          Connect your advertising platforms to enable cross-platform campaign management
        </p>
      </div>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <div key={platform.adapter.config.name} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{platform.adapter.config.displayName}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                platform.connected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                ✓ {platform.connected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              <p>Features: {platform.adapter.config.supportedFeatures.length}</p>
              {platform.lastTest && (
                <p>Last tested: {platform.lastTest.toLocaleDateString()}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPlatform(platform.adapter.config.name)}
                className={`flex-1 px-3 py-2 rounded text-sm font-medium ${
                  platform.connected 
                    ? 'border border-gray-300 text-gray-700 hover:bg-gray-50' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                ⚙️ {platform.connected ? 'Manage' : 'Setup'}
              </button>
              {platform.connected && (
                <button
                  onClick={() => disconnectPlatform(platform.adapter.config.name)}
                  className="px-3 py-2 rounded text-sm font-medium border border-red-300 text-red-600 hover:bg-red-50"
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Setup Form */}
      {selectedPlatform && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              ⚙️ Configure {getPlatformDisplayName(selectedPlatform)}
            </h2>
            <p className="text-gray-600 mt-1">
              Enter your API credentials to connect this platform
            </p>
          </div>

          {/* Platform Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <span className="text-blue-600">ℹ️</span>
              <p className="text-blue-800 text-sm">
                You'll need API credentials from your {getPlatformDisplayName(selectedPlatform)} account.
                Make sure you have the necessary permissions for campaign management and reporting.
              </p>
            </div>
          </div>

          {/* Credential Fields */}
          <div className="space-y-4 mb-6">
            {getPlatformFields().map((field) => (
              <div key={field.name} className="space-y-2">
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.helpLink && (
                    <a
                      href={field.helpLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      🔗
                    </a>
                  )}
                </label>
                <div className="relative">
                  <input
                    id={field.name}
                    type={field.type === 'password' && !showPasswords[field.name] ? 'password' : 'text'}
                    placeholder={field.placeholder}
                    value={credentials[field.name] || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCredentialChange(field.name, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {field.type === 'password' && (
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(field.name)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords[field.name] ? '🙈' : '👁️'}
                    </button>
                  )}
                </div>
                {field.helpText && (
                  <p className="text-xs text-gray-500">{field.helpText}</p>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={testConnection}
              disabled={!isFormValid() || testingConnection}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {testingConnection ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Testing Connection...
                </>
              ) : (
                <>
                  ➕ Connect Platform
                </>
              )}
            </button>
            <button
              onClick={() => {
                setCredentials({});
                setSaveError('');
                setSaveSuccess('');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Clear Form
            </button>
          </div>

          {/* Status Messages */}
          {saveSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <span className="text-green-600">✅</span>
                <p className="text-green-800 text-sm">{saveSuccess}</p>
              </div>
            </div>
          )}

          {saveError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <span className="text-red-600">⚠️</span>
                <p className="text-red-800 text-sm">{saveError}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Platform Features */}
      {selectedPlatform && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Platform Capabilities</h3>
          <p className="text-gray-600 mb-4">
            Features available on {getPlatformDisplayName(selectedPlatform)}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {getSelectedPlatformAdapter()?.config.supportedFeatures.map((feature) => (
              <span
                key={feature}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm text-center border"
              >
                {feature.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Getting Started Guide */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
        <p className="text-gray-600 mb-4">
          Steps to set up multi-platform advertising integration
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <div>
              <h4 className="font-medium">Create API Credentials</h4>
              <p className="text-sm text-gray-600">
                Set up API access in each platform's developer console or business manager.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <div>
              <h4 className="font-medium">Connect Platforms</h4>
              <p className="text-sm text-gray-600">
                Enter your credentials above to connect each advertising platform.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <div>
              <h4 className="font-medium">Manage Campaigns</h4>
              <p className="text-sm text-gray-600">
                Once connected, you can manage campaigns across all platforms from a single interface.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}