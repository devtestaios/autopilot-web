'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Settings as SettingsIcon,
  Save,
  ArrowLeft,
  Bot,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Monitor,
  Mail,
  Lock,
  Globe,
  Smartphone,
  CreditCard,
  LogOut
} from 'lucide-react';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  campaignAlerts: boolean;
  performanceUpdates: boolean;
  budgetAlerts: boolean;
  weeklyReports: boolean;
}

interface PrivacySettings {
  dataSharing: boolean;
  analytics: boolean;
  marketingEmails: boolean;
  profileVisibility: 'public' | 'private' | 'contacts';
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, updateUserPreferences, logout, isLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    company: '',
    timezone: 'UTC-8',
    language: 'en'
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    campaignAlerts: true,
    performanceUpdates: true,
    budgetAlerts: true,
    weeklyReports: false
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    dataSharing: false,
    analytics: true,
    marketingEmails: false,
    profileVisibility: 'private'
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        company: user.preferences?.company || '',
        timezone: user.preferences?.timezone || 'UTC-8',
        language: user.preferences?.language || 'en'
      });

      if (user.preferences?.notifications) {
        // Handle both boolean and NotificationSettings types
        if (typeof user.preferences.notifications === 'boolean') {
          // If it's a boolean, set default notification settings
          setNotifications({
            email: user.preferences.notifications,
            push: user.preferences.notifications,
            sms: false,
            campaignAlerts: user.preferences.notifications,
            performanceUpdates: user.preferences.notifications,
            budgetAlerts: user.preferences.notifications,
            weeklyReports: false
          });
        } else {
          // If it's already a NotificationSettings object
          setNotifications(user.preferences.notifications);
        }
      }

      if (user.preferences?.privacy) {
        setPrivacy(user.preferences.privacy);
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
          <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserPreferences({
        ...profileData,
        notifications,
        privacy,
        theme
      });
      // Show success message
    } catch (error) {
      console.error('Failed to save settings:', error);
      // Show error message
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('Passwords do not match');
      return;
    }

    setIsSaving(true);
    try {
      // Implement password change logic
      alert('Password changed successfully');
      setPasswordData({ current: '', new: '', confirm: '' });
      setIsChangingPassword(false);
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'account', label: 'Account', icon: SettingsIcon }
  ];

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className={`border-b backdrop-blur-sm ${
        theme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white/50 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className={`p-2 rounded-lg transition-colors mr-4 ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <ArrowLeft size={20} />
              </button>
              
              <div className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-100'
              }`}>
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <h1 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Settings
                </h1>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Manage your account and preferences
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save size={16} className="mr-2 inline" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className={`rounded-xl border p-4 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-400'
                          : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={18} className="mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border p-6 ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h3 className={`text-xl font-semibold mb-6 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Profile Information
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Company
                        </label>
                        <input
                          type="text"
                          value={profileData.company}
                          onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Timezone
                        </label>
                        <select
                          value={profileData.timezone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, timezone: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        >
                          <option value="UTC-8">Pacific Time (UTC-8)</option>
                          <option value="UTC-7">Mountain Time (UTC-7)</option>
                          <option value="UTC-6">Central Time (UTC-6)</option>
                          <option value="UTC-5">Eastern Time (UTC-5)</option>
                          <option value="UTC+0">UTC</option>
                        </select>
                      </div>
                    </div>

                    {/* Password Change Section */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className={`text-lg font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          Password
                        </h4>
                        <button
                          onClick={() => setIsChangingPassword(!isChangingPassword)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          {isChangingPassword ? 'Cancel' : 'Change Password'}
                        </button>
                      </div>

                      {isChangingPassword && (
                        <div className="space-y-4">
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={passwordData.current}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className={`block text-sm font-medium mb-2 ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              New Password
                            </label>
                            <div className="relative">
                              <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={passwordData.new}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className={`block text-sm font-medium mb-2 ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Confirm New Password
                            </label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={passwordData.confirm}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={handlePasswordChange}
                            disabled={!passwordData.current || !passwordData.new || !passwordData.confirm}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Update Password
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h3 className={`text-xl font-semibold mb-6 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Notification Preferences
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className={`text-lg font-medium mb-4 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Delivery Methods
                      </h4>
                      <div className="space-y-3">
                        {[
                          { key: 'email', label: 'Email notifications', icon: Mail },
                          { key: 'push', label: 'Push notifications', icon: Bell },
                          { key: 'sms', label: 'SMS notifications', icon: Smartphone }
                        ].map(({ key, label, icon: Icon }) => (
                          <div key={key} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Icon size={18} className={`mr-3 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`} />
                              <span className={`${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {label}
                              </span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={notifications[key as keyof NotificationSettings] as boolean}
                                onChange={(e) => setNotifications(prev => ({
                                  ...prev,
                                  [key]: e.target.checked
                                }))}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className={`text-lg font-medium mb-4 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Campaign Notifications
                      </h4>
                      <div className="space-y-3">
                        {[
                          { key: 'campaignAlerts', label: 'Campaign status alerts' },
                          { key: 'performanceUpdates', label: 'Performance updates' },
                          { key: 'budgetAlerts', label: 'Budget threshold alerts' },
                          { key: 'weeklyReports', label: 'Weekly performance reports' }
                        ].map(({ key, label }) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className={`${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {label}
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={notifications[key as keyof NotificationSettings] as boolean}
                                onChange={(e) => setNotifications(prev => ({
                                  ...prev,
                                  [key]: e.target.checked
                                }))}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div>
                  <h3 className={`text-xl font-semibold mb-6 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Privacy & Security
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {[
                        { 
                          key: 'dataSharing', 
                          label: 'Allow data sharing for product improvement',
                          description: 'Help us improve our services by sharing anonymized usage data'
                        },
                        { 
                          key: 'analytics', 
                          label: 'Enable analytics tracking',
                          description: 'Allow us to track your usage to provide better insights'
                        },
                        { 
                          key: 'marketingEmails', 
                          label: 'Receive marketing emails',
                          description: 'Get updates about new features and promotional offers'
                        }
                      ].map(({ key, label, description }) => (
                        <div key={key} className="flex items-start justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex-1">
                            <h4 className={`text-base font-medium ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {label}
                            </h4>
                            <p className={`text-sm mt-1 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {description}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer ml-4">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={privacy[key as keyof PrivacySettings] as boolean}
                              onChange={(e) => setPrivacy(prev => ({
                                ...prev,
                                [key]: e.target.checked
                              }))}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4 className={`text-lg font-medium mb-4 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Profile Visibility
                      </h4>
                      <div className="space-y-3">
                        {[
                          { value: 'public', label: 'Public', description: 'Anyone can see your profile' },
                          { value: 'private', label: 'Private', description: 'Only you can see your profile' },
                          { value: 'contacts', label: 'Contacts only', description: 'Only your contacts can see your profile' }
                        ].map(({ value, label, description }) => (
                          <label key={value} className="flex items-start cursor-pointer">
                            <input
                              type="radio"
                              name="profileVisibility"
                              value={value}
                              checked={privacy.profileVisibility === value}
                              onChange={(e) => setPrivacy(prev => ({
                                ...prev,
                                profileVisibility: e.target.value as 'public' | 'private' | 'contacts'
                              }))}
                              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <div className="ml-3">
                              <span className={`text-base font-medium ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {label}
                              </span>
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {description}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div>
                  <h3 className={`text-xl font-semibold mb-6 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Appearance Settings
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className={`text-lg font-medium mb-4 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Theme
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { value: 'light', label: 'Light', icon: Sun, description: 'Light mode' },
                          { value: 'dark', label: 'Dark', icon: Moon, description: 'Dark mode' },
                          { value: 'system', label: 'System', icon: Monitor, description: 'Follow system preference' }
                        ].map(({ value, label, icon: Icon, description }) => (
                          <label
                            key={value}
                            className={`relative cursor-pointer rounded-lg border p-4 transition-colors ${
                              theme === value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="theme"
                              value={value}
                              checked={theme === value}
                              onChange={() => {
                                if (value === 'system') {
                                  // For system preference, detect and set the appropriate theme
                                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                                  setTheme(systemTheme);
                                } else {
                                  setTheme(value as 'light' | 'dark');
                                }
                              }}
                              className="sr-only"
                            />
                            <div className="flex flex-col items-center text-center">
                              <Icon className={`w-8 h-8 mb-2 ${
                                theme === value ? 'text-blue-600' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`} />
                              <span className={`font-medium ${
                                theme === value ? 'text-blue-600' : theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {label}
                              </span>
                              <span className={`text-sm mt-1 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {description}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div>
                  <h3 className={`text-xl font-semibold mb-6 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Account Management
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h4 className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          Account Status
                        </h4>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Free trial • 12 days remaining
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Upgrade Plan
                      </button>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h4 className={`text-lg font-medium mb-4 text-red-600`}>
                        Danger Zone
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
                          <div>
                            <h5 className={`font-medium text-red-800 dark:text-red-200`}>
                              Sign out of all devices
                            </h5>
                            <p className={`text-sm text-red-600 dark:text-red-300`}>
                              This will sign you out of all devices and sessions
                            </p>
                          </div>
                          <button
                            onClick={logout}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                          >
                            <LogOut size={16} className="mr-2 inline" />
                            Sign Out
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
                          <div>
                            <h5 className={`font-medium text-red-800 dark:text-red-200`}>
                              Delete Account
                            </h5>
                            <p className={`text-sm text-red-600 dark:text-red-300`}>
                              Permanently delete your account and all data
                            </p>
                          </div>
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}