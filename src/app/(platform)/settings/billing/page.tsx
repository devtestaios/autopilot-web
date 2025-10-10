'use client';

import { useState } from 'react';
import UniversalPageWrapper from '@/components/ui/UniversalPageWrapper';
import {
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Check,
  X,
  ExternalLink,
  Trash2,
  Plus,
  Crown,
  Zap,
  Building2,
  Star
} from 'lucide-react';

// Types
interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  email?: string;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoiceNumber: string;
  downloadUrl: string;
}

interface UsageMetric {
  label: string;
  current: number;
  limit: number;
  unit: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    apiCalls: number;
    storage: number;
    teamMembers: number;
    campaigns: number;
  };
  icon: typeof Crown;
  popular?: boolean;
}

export default function BillingPage() {
  // Mock current subscription
  const [currentPlan] = useState<Plan>({
    id: 'pro',
    name: 'Pro',
    price: 99,
    interval: 'month',
    features: [
      'Unlimited campaigns',
      '50,000 API calls/month',
      '100GB storage',
      'Up to 5 team members',
      'Advanced analytics',
      'Priority support',
      'Custom integrations'
    ],
    limits: {
      apiCalls: 50000,
      storage: 100,
      teamMembers: 5,
      campaigns: -1 // unlimited
    },
    icon: Crown
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: '2',
      type: 'card',
      last4: '5555',
      brand: 'Mastercard',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false
    }
  ]);

  const [invoices] = useState<Invoice[]>([
    {
      id: '1',
      date: '2025-10-01',
      amount: 99,
      status: 'paid',
      invoiceNumber: 'INV-2025-10-001',
      downloadUrl: '#'
    },
    {
      id: '2',
      date: '2025-09-01',
      amount: 99,
      status: 'paid',
      invoiceNumber: 'INV-2025-09-001',
      downloadUrl: '#'
    },
    {
      id: '3',
      date: '2025-08-01',
      amount: 99,
      status: 'paid',
      invoiceNumber: 'INV-2025-08-001',
      downloadUrl: '#'
    }
  ]);

  const [usage] = useState<UsageMetric[]>([
    { label: 'API Calls', current: 32847, limit: 50000, unit: 'calls' },
    { label: 'Storage', current: 67, limit: 100, unit: 'GB' },
    { label: 'Team Members', current: 3, limit: 5, unit: 'members' },
    { label: 'Active Campaigns', current: 12, limit: -1, unit: 'campaigns' }
  ]);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'month',
      features: [
        '1 active campaign',
        '1,000 API calls/month',
        '1GB storage',
        '1 team member',
        'Basic analytics',
        'Email support'
      ],
      limits: {
        apiCalls: 1000,
        storage: 1,
        teamMembers: 1,
        campaigns: 1
      },
      icon: Star
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 99,
      interval: 'month',
      features: [
        'Unlimited campaigns',
        '50,000 API calls/month',
        '100GB storage',
        'Up to 5 team members',
        'Advanced analytics',
        'Priority support',
        'Custom integrations'
      ],
      limits: {
        apiCalls: 50000,
        storage: 100,
        teamMembers: 5,
        campaigns: -1
      },
      icon: Crown,
      popular: true
    },
    {
      id: 'business',
      name: 'Business',
      price: 299,
      interval: 'month',
      features: [
        'Unlimited campaigns',
        '200,000 API calls/month',
        '500GB storage',
        'Up to 20 team members',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee'
      ],
      limits: {
        apiCalls: 200000,
        storage: 500,
        teamMembers: 20,
        campaigns: -1
      },
      icon: Building2
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 0,
      interval: 'month',
      features: [
        'Unlimited everything',
        'Custom API limits',
        'Unlimited storage',
        'Unlimited team members',
        'White-label options',
        '24/7 support',
        'Custom integrations',
        'Dedicated infrastructure',
        'Custom SLA'
      ],
      limits: {
        apiCalls: -1,
        storage: -1,
        teamMembers: -1,
        campaigns: -1
      },
      icon: Zap
    }
  ];

  const [showAddCard, setShowAddCard] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleRemovePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(
      paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm.id === id
      }))
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0; // unlimited
    return Math.round((current / limit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 dark:text-red-400';
    if (percentage >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <UniversalPageWrapper
      title="Billing & Subscription"
      subtitle="Manage your subscription, payment methods, and billing history"
      visualMode="standard"
      showBreadcrumb={false}
    >
      <div className="space-y-8">
        {/* Current Plan */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <currentPlan.icon className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">
                    {currentPlan.name} Plan
                  </h2>
                </div>
                <p className="text-blue-100 text-lg">
                  ${currentPlan.price}/{currentPlan.interval}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100 mb-1">Next billing date</p>
                <p className="text-xl font-semibold">Nov 1, 2025</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Plan Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Upgrade Plan
              </button>
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>

        {/* Usage Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Current Usage
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Billing period: Oct 1 - Oct 31, 2025
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {usage.map((metric, index) => {
              const percentage = getUsagePercentage(metric.current, metric.limit);
              const colorClass = getUsageColor(percentage);

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {metric.label}
                    </span>
                    {percentage >= 75 && metric.limit !== -1 && (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-bold ${colorClass}`}>
                      {metric.current.toLocaleString()}
                    </span>
                    {metric.limit !== -1 && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        / {metric.limit.toLocaleString()} {metric.unit}
                      </span>
                    )}
                    {metric.limit === -1 && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {metric.unit}
                      </span>
                    )}
                  </div>
                  {metric.limit !== -1 && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          percentage >= 90
                            ? 'bg-red-600'
                            : percentage >= 75
                            ? 'bg-yellow-500'
                            : 'bg-green-600'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Methods */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Payment Methods
              </h2>
              <button
                onClick={() => setShowAddCard(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Card
              </button>
            </div>

            <div className="space-y-3">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {method.brand} •••• {method.last4}
                        </span>
                        {method.isDefault && (
                          <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefaultPaymentMethod(method.id)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleRemovePaymentMethod(method.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      disabled={method.isDefault}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {showAddCard && (
              <div className="mt-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Add a new payment method
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Card number"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Add Card
                    </button>
                    <button
                      onClick={() => setShowAddCard(false)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Billing History */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Billing History
            </h2>

            <div className="space-y-3">
              {invoices.map(invoice => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {invoice.invoiceNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : invoice.status === 'pending'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(invoice.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${invoice.amount}
                    </span>
                    <a
                      href={invoice.downloadUrl}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              View All Invoices
            </button>
          </div>
        </div>

        {/* Available Plans */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Available Plans
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`relative p-6 rounded-xl border-2 ${
                  plan.id === currentPlan.id
                    ? 'border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
                    : plan.popular
                    ? 'border-purple-600 dark:border-purple-400'
                    : 'border-gray-200 dark:border-gray-700'
                } hover:border-blue-500 dark:hover:border-blue-400 transition-colors`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full">
                      Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <plan.icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                </div>

                <div className="mb-6">
                  {plan.price === 0 && plan.id === 'free' ? (
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      Free
                    </p>
                  ) : plan.price === 0 && plan.id === 'enterprise' ? (
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      Custom
                    </p>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${plan.price}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        /{plan.interval}
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.id === currentPlan.id ? (
                  <button
                    disabled
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : plan.id === 'enterprise' ? (
                  <button className="w-full px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                    Contact Sales
                  </button>
                ) : (
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    {plan.price > currentPlan.price ? 'Upgrade' : 'Downgrade'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cancel Subscription Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Cancel Subscription
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to cancel your subscription? You'll lose access to all Pro features at the end of your billing period.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Keep Subscription
                </button>
                <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Cancel Anyway
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UniversalPageWrapper>
  );
}
