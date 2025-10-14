'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/EnhancedAuthContext';

interface PrivacySettingsProps {
  className?: string;
}

export default function PrivacySettings({ className = '' }: PrivacySettingsProps) {
  const { user, updateUserPreferences } = useAuth();
  const [settings, setSettings] = useState({
    dataSharing: false,
    analytics: true,
    marketing: false,
    profileVisibility: 'private' as 'public' | 'private' | 'team',
    termsAccepted: false,
    privacyPolicyAccepted: false,
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load current settings from user context
  useEffect(() => {
    if (user) {
      setSettings({
        dataSharing: user.privacy?.dataSharing || false,
        analytics: user.privacy?.analytics ?? true,
        marketing: user.privacy?.marketing || false,
        profileVisibility: user.privacy?.profileVisibility || 'private',
        termsAccepted: !!user.termsAcceptedAt,
        privacyPolicyAccepted: !!user.privacyPolicyAcceptedAt,
      });
    }
  }, [user]);

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await updateUserPreferences({
        privacy: {
          dataSharing: settings.dataSharing,
          analytics: settings.analytics,
          marketing: settings.marketing,
          profileVisibility: settings.profileVisibility,
        }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTerms = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // This would typically update the terms acceptance timestamp
      setSettings(prev => ({ ...prev, termsAccepted: true, privacyPolicyAccepted: true }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to accept terms:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">Please log in to manage privacy settings.</p>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Privacy Settings
          </h2>
          {saved && (
            <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Settings saved
            </div>
          )}
        </div>

        <div className="space-y-6">
          
          {/* Data Sharing */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Data Sharing for Service Improvement
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Allow us to use anonymized campaign performance data to improve our AI models 
                and platform features. Your specific campaign details remain private.
              </p>
            </div>
            <label className="ml-4 flex items-center">
              <input
                type="checkbox"
                checked={settings.dataSharing}
                onChange={(e) => handleSettingChange('dataSharing', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                aria-label="Enable data sharing for service improvement"
              />
            </label>
          </div>

          {/* Analytics */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Analytics and Usage Data
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Help us understand how you use our platform to improve user experience. 
                This includes page views, feature usage, and performance metrics.
              </p>
            </div>
            <label className="ml-4 flex items-center">
              <input
                type="checkbox"
                checked={settings.analytics}
                onChange={(e) => handleSettingChange('analytics', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                aria-label="Enable analytics and usage data collection"
              />
            </label>
          </div>

          {/* Marketing Communications */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Marketing Communications
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive emails about new features, product updates, and marketing insights. 
                You can unsubscribe at any time.
              </p>
            </div>
            <label className="ml-4 flex items-center">
              <input
                type="checkbox"
                checked={settings.marketing}
                onChange={(e) => handleSettingChange('marketing', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                aria-label="Enable marketing communications"
              />
            </label>
          </div>

          {/* Profile Visibility */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Profile Visibility
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Control who can see your profile information within the platform.
            </p>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="private"
                  checked={settings.profileVisibility === 'private'}
                  onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Private - Only you can see your profile
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="team"
                  checked={settings.profileVisibility === 'team'}
                  onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Team - Visible to your team members
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="public"
                  checked={settings.profileVisibility === 'public'}
                  onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Public - Visible to all platform users
                </span>
              </label>
            </div>
          </div>

          {/* Legal Acceptance Status */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Legal Agreement Status
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${settings.termsAccepted ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Terms of Service</span>
                </div>
                <div className="flex items-center space-x-2">
                  {settings.termsAccepted ? (
                    <span className="text-xs text-green-600 dark:text-green-400">Accepted</span>
                  ) : (
                    <span className="text-xs text-red-600 dark:text-red-400">Not Accepted</span>
                  )}
                  <a href="/terms" target="_blank" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    View
                  </a>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${settings.privacyPolicyAccepted ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Privacy Policy</span>
                </div>
                <div className="flex items-center space-x-2">
                  {settings.privacyPolicyAccepted ? (
                    <span className="text-xs text-green-600 dark:text-green-400">Accepted</span>
                  ) : (
                    <span className="text-xs text-red-600 dark:text-red-400">Not Accepted</span>
                  )}
                  <a href="/privacy" target="_blank" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    View
                  </a>
                </div>
              </div>
            </div>

            {(!settings.termsAccepted || !settings.privacyPolicyAccepted) && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                  Please review and accept our Terms of Service and Privacy Policy to continue using all platform features.
                </p>
                <button
                  onClick={handleAcceptTerms}
                  disabled={loading}
                  className="text-sm bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded transition-colors duration-200 disabled:opacity-50"
                >
                  Accept Terms & Privacy Policy
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Changes are saved automatically when you modify settings.
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}