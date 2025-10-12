'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  User,
  Shield,
  Calendar,
  Check,
  AlertCircle,
  Loader2,
  UserPlus,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Suite definitions
const SUITES = [
  {
    id: 'social_media',
    name: 'Social Media Suite',
    description: 'Post scheduling, analytics, account management',
    icon: '📱',
    autoEnables: ['content_suite'], // Auto-enables Content Suite
    requiredFor: [],
  },
  {
    id: 'content_suite',
    name: 'Content Suite',
    description: 'Design studio, asset manager, AI content generation',
    icon: '🎨',
    autoEnables: [],
    requiredFor: ['social_media'],
  },
  {
    id: 'email_marketing',
    name: 'Email Marketing',
    description: 'Campaigns, automations, contact management',
    icon: '📧',
    autoEnables: [],
    requiredFor: [],
  },
  {
    id: 'analytics',
    name: 'Analytics Suite',
    description: 'Performance tracking, reports, insights',
    icon: '📊',
    autoEnables: [],
    requiredFor: [],
  },
  {
    id: 'campaigns',
    name: 'Campaign Management',
    description: 'Multi-channel campaigns, optimization',
    icon: '🎯',
    autoEnables: [],
    requiredFor: [],
  },
  {
    id: 'billing',
    name: 'Billing & Subscriptions',
    description: 'Payment management, invoices, usage',
    icon: '💳',
    autoEnables: [],
    requiredFor: [],
  },
  {
    id: 'integrations',
    name: 'Platform Integrations',
    description: 'Connect external platforms, OAuth, API management',
    icon: '🔌',
    autoEnables: [],
    requiredFor: [],
  },
  {
    id: 'performance',
    name: 'Performance Monitoring',
    description: 'System health, performance metrics, diagnostics',
    icon: '⚡',
    autoEnables: [],
    requiredFor: [],
  },
  {
    id: 'reports',
    name: 'Advanced Reports',
    description: 'Custom reports, data export, scheduled reporting',
    icon: '📈',
    autoEnables: [],
    requiredFor: [],
  },
  {
    id: 'scheduler',
    name: 'Content Scheduler',
    description: 'Schedule posts, manage calendar, queue management',
    icon: '📅',
    autoEnables: [],
    requiredFor: [],
  },
  {
    id: 'task_master',
    name: 'Task Master',
    description: 'Task management, workflows, automation rules',
    icon: '✅',
    autoEnables: [],
    requiredFor: [],
  },
  {
    id: 'settings',
    name: 'Advanced Settings',
    description: 'Platform configuration, team management, preferences',
    icon: '⚙️',
    autoEnables: [],
    requiredFor: [],
  },
];

const ROLES = [
  { value: 'campaign_manager', label: 'Campaign Manager', description: 'Full campaign & content management' },
  { value: 'content_creator', label: 'Content Creator', description: 'Create and edit content' },
  { value: 'social_media_manager', label: 'Social Media Manager', description: 'Manage social accounts & posts' },
  { value: 'analyst', label: 'Analyst', description: 'View analytics & reports' },
  { value: 'account_manager', label: 'Account Manager', description: 'Full account access' },
  { value: 'client_viewer', label: 'Client Viewer', description: 'Read-only access' },
];

const SUBSCRIPTION_TIERS = [
  { value: 'trial', label: 'Trial (15 days)' },
  { value: 'solo_professional', label: 'Solo Professional' },
  { value: 'growth_team', label: 'Growth Team' },
  { value: 'professional_agency', label: 'Professional Agency' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'enterprise_plus', label: 'Enterprise Plus' },
];

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function InviteUserModal({
  isOpen,
  onClose,
  onSuccess,
}: InviteUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('campaign_manager');
  const [subscriptionTier, setSubscriptionTier] = useState('professional_agency');
  const [isTestUser, setIsTestUser] = useState(false);
  const [testUserDuration, setTestUserDuration] = useState('90'); // days
  const [enabledSuites, setEnabledSuites] = useState<string[]>([
    'social_media',
    'content_suite',
    'analytics',
  ]);
  const [adminNotes, setAdminNotes] = useState('');

  // Handle suite toggle with auto-enable logic
  const handleSuiteToggle = (suiteId: string) => {
    setEnabledSuites((current) => {
      const suite = SUITES.find((s) => s.id === suiteId);
      if (!suite) return current;

      if (current.includes(suiteId)) {
        // Removing - check if other suites require this one
        const requiredBy = SUITES.filter(
          (s) => s.requiredFor.includes(suiteId) && current.includes(s.id)
        );

        if (requiredBy.length > 0) {
          setError(
            `Cannot disable ${suite.name} - required by: ${requiredBy
              .map((s) => s.name)
              .join(', ')}`
          );
          return current;
        }

        // Remove suite and any that auto-enabled with it
        return current.filter((id) => id !== suiteId);
      } else {
        // Adding - auto-enable dependencies
        const newSuites = new Set([...current, suiteId]);

        // Add auto-enabled suites
        suite.autoEnables.forEach((autoId) => {
          newSuites.add(autoId);
        });

        return Array.from(newSuites);
      }
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Build suite access object
      const suiteAccess: Record<string, any> = {};
      SUITES.forEach((suite) => {
        suiteAccess[suite.id] = {
          enabled: enabledSuites.includes(suite.id),
          access_level: 'full',
          granted_at: new Date().toISOString(),
        };
      });

      // Calculate expiration for test users
      let testUserExpiresAt = null;
      if (isTestUser && testUserDuration) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + parseInt(testUserDuration));
        testUserExpiresAt = expirationDate.toISOString();
      }

      const inviteData = {
        email,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`.trim() || email.split('@')[0],
        role,
        subscriptionTier,
        isTestUser,
        testUserExpiresAt,
        suiteAccess,
        adminNotes,
        accountStatus: 'active',
        emailVerified: true, // Auto-verify invited users
      };

      console.log('Inviting user with data:', inviteData);

      // Call API to create user
      const response = await fetch('/api/admin/invite-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'PulseBridge2025!',
        },
        body: JSON.stringify(inviteData),
      });

      // Check if response has content before parsing JSON
      let result;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        if (text.trim()) {
          result = JSON.parse(text);
        } else {
          result = {};
        }
      } else {
        result = { error: 'Server returned non-JSON response' };
      }

      if (!response.ok) {
        throw new Error(result.error || `Server error: ${response.status} ${response.statusText}`);
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);
    } catch (err) {
      console.error('Invite user error:', err);
      
      // Provide more specific error messages
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError('Network error: Could not connect to server. Please check your connection.');
      } else if (err instanceof SyntaxError && err.message.includes('JSON')) {
        setError('Server response error: Invalid JSON received. Please try again.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to invite user');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setFirstName('');
    setLastName('');
    setRole('campaign_manager');
    setSubscriptionTier('professional_agency');
    setIsTestUser(false);
    setTestUserDuration('90');
    setEnabledSuites(['social_media', 'content_suite', 'analytics']);
    setAdminNotes('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Invite New User
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Set up a new user with specific suite access
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-green-700 dark:text-green-300">
                  User invited successfully! Sending invitation email...
                </span>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700 dark:text-red-300">{error}</span>
              </motion.div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@company.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          <div>
                            <div className="font-medium">{r.label}</div>
                            <div className="text-xs text-gray-500">{r.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subscriptionTier">Subscription Tier</Label>
                  <Select value={subscriptionTier} onValueChange={setSubscriptionTier}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBSCRIPTION_TIERS.map((tier) => (
                        <SelectItem key={tier.value} value={tier.value}>
                          {tier.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Suite Access */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Suite Access
                </h3>
                <span className="text-sm text-gray-500">
                  {enabledSuites.length} of {SUITES.length} enabled
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SUITES.map((suite) => {
                  const isEnabled = enabledSuites.includes(suite.id);
                  const isAutoEnabled = enabledSuites.some((enabled) => {
                    const enabler = SUITES.find((s) => s.id === enabled);
                    return enabler?.autoEnables.includes(suite.id);
                  });

                  return (
                    <button
                      key={suite.id}
                      type="button"
                      onClick={() => handleSuiteToggle(suite.id)}
                      className={`
                        relative p-4 border-2 rounded-lg text-left transition-all
                        ${
                          isEnabled
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }
                        ${isAutoEnabled ? 'opacity-75' : ''}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{suite.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {suite.name}
                            </span>
                            {isAutoEnabled && (
                              <span className="text-xs text-blue-600 dark:text-blue-400">
                                (auto)
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {suite.description}
                          </p>
                        </div>
                        <div
                          className={`
                          w-5 h-5 rounded border-2 flex items-center justify-center
                          ${
                            isEnabled
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }
                        `}
                        >
                          {isEnabled && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Test User Options */}
            <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsTestUser(!isTestUser)}
                  className={`
                    relative w-11 h-6 rounded-full transition-colors
                    ${isTestUser ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}
                  `}
                >
                  <span
                    className={`
                      absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
                      ${isTestUser ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Mark as Test User
                  </span>
                </div>
              </div>

              {isTestUser && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-2"
                >
                  <div>
                    <Label htmlFor="testDuration">Test Access Duration</Label>
                    <Select value={testUserDuration} onValueChange={setTestUserDuration}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days (recommended)</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="0">No expiration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-sm text-purple-700 dark:text-purple-300 bg-white dark:bg-gray-800 p-3 rounded">
                    <strong>Test User Benefits:</strong>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>No payment required</li>
                      <li>Full feature access</li>
                      <li>Can populate their own data</li>
                      <li>Bypass subscription limits</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Admin Notes */}
            <div>
              <Label htmlFor="adminNotes">Admin Notes (Optional)</Label>
              <Textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Internal notes about this user..."
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || success}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Invitation...
                  </>
                ) : success ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Invited!
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
