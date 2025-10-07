'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Enhanced Design System Imports - Phase 1 Visual Polish
import { designTokens } from '@/lib/designTokens';
import { animations } from '@/lib/animations';
import visualEffects from '@/lib/visualEffects';
import { Container, Grid, Flex, Section, Stack, Header, ContentArea, CardGrid } from '@/components/ui/LayoutSystem';
import { Button as EnhancedButton, Card as EnhancedCard, Badge, Spinner, Avatar, Progress } from '@/components/ui/EnhancedComponents';

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  LineChart,
  CreditCard,
  Wallet,
  Receipt,
  Target,
  Calendar,
  Filter,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Settings,
  Search,
  Bell,
  Calculator,
  Building,
  User,
  ShoppingCart,
  Zap
} from 'lucide-react';

// SSR-safe imports for universal sidebar system
const UnifiedSidebar = dynamic(() => import('@/components/UnifiedSidebar'), {
  ssr: false,
  loading: () => <div className="fixed left-0 top-0 h-screen w-56 bg-gray-900 animate-pulse" />
});

const AdvancedNavigation = dynamic(() => import('@/components/ui/AdvancedNavigation'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-900 border-b animate-pulse" />
});

const NavigationTabs = dynamic(() => import('@/components/NavigationTabs'), {
  ssr: false,
  loading: () => <div className="h-12 bg-white dark:bg-gray-900 border-b animate-pulse" />
});

// Financial Types
interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  account: string;
  tags: string[];
  recurring: boolean;
}

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'business';
  balance: number;
  currency: string;
  lastUpdate: string;
  status: 'active' | 'inactive' | 'frozen';
}

interface Budget {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  status: 'on-track' | 'warning' | 'exceeded';
}

interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'savings' | 'investment' | 'debt-payoff' | 'business';
  priority: 'high' | 'medium' | 'low';
}

export default function FinancialManagement() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'budgets' | 'goals' | 'reports'>('overview');
  const [hideBalances, setHideBalances] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock data - will be replaced with real API calls in Phase 3
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: 'acc-001',
      name: 'Business Checking',
      type: 'business',
      balance: 47293.56,
      currency: 'USD',
      lastUpdate: '2025-09-30T10:30:00Z',
      status: 'active'
    },
    {
      id: 'acc-002',
      name: 'Business Savings',
      type: 'savings',
      balance: 125000.00,
      currency: 'USD',
      lastUpdate: '2025-09-30T10:30:00Z',
      status: 'active'
    },
    {
      id: 'acc-003',
      name: 'Investment Portfolio',
      type: 'investment',
      balance: 78450.32,
      currency: 'USD',
      lastUpdate: '2025-09-30T10:25:00Z',
      status: 'active'
    },
    {
      id: 'acc-004',
      name: 'Business Credit Card',
      type: 'credit',
      balance: -3247.88,
      currency: 'USD',
      lastUpdate: '2025-09-30T10:30:00Z',
      status: 'active'
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'txn-001',
      type: 'income',
      category: 'Revenue',
      amount: 5420.00,
      description: 'Client payment - PulseBridge subscription',
      date: '2025-09-30',
      status: 'completed',
      account: 'Business Checking',
      tags: ['recurring', 'subscription'],
      recurring: true
    },
    {
      id: 'txn-002',
      type: 'expense',
      category: 'Software',
      amount: -299.00,
      description: 'AWS infrastructure costs',
      date: '2025-09-29',
      status: 'completed',
      account: 'Business Credit Card',
      tags: ['infrastructure', 'monthly'],
      recurring: true
    },
    {
      id: 'txn-003',
      type: 'expense',
      category: 'Marketing',
      amount: -1200.00,
      description: 'Google Ads campaign',
      date: '2025-09-28',
      status: 'completed',
      account: 'Business Checking',
      tags: ['advertising', 'google-ads'],
      recurring: false
    },
    {
      id: 'txn-004',
      type: 'income',
      category: 'Revenue',
      amount: 2850.00,
      description: 'Consultation services',
      date: '2025-09-27',
      status: 'completed',
      account: 'Business Checking',
      tags: ['consulting', 'one-time'],
      recurring: false
    }
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: 'bud-001',
      category: 'Marketing',
      allocated: 5000,
      spent: 3420,
      period: 'monthly',
      status: 'on-track'
    },
    {
      id: 'bud-002',
      category: 'Software & Tools',
      allocated: 1500,
      spent: 1680,
      period: 'monthly',
      status: 'exceeded'
    },
    {
      id: 'bud-003',
      category: 'Office Expenses',
      allocated: 800,
      spent: 245,
      period: 'monthly',
      status: 'on-track'
    },
    {
      id: 'bud-004',
      category: 'Travel',
      allocated: 2000,
      spent: 1850,
      period: 'monthly',
      status: 'warning'
    }
  ]);

  const [goals, setGoals] = useState<FinancialGoal[]>([
    {
      id: 'goal-001',
      title: 'Emergency Fund',
      targetAmount: 50000,
      currentAmount: 28500,
      deadline: '2025-12-31',
      category: 'savings',
      priority: 'high'
    },
    {
      id: 'goal-002',
      title: 'Equipment Upgrade',
      targetAmount: 15000,
      currentAmount: 8200,
      deadline: '2025-11-30',
      category: 'business',
      priority: 'medium'
    },
    {
      id: 'goal-003',
      title: 'Investment Growth',
      targetAmount: 100000,
      currentAmount: 78450,
      deadline: '2026-06-30',
      category: 'investment',
      priority: 'medium'
    }
  ]);

  // Financial Analytics
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const monthlyIncome = transactions
    .filter(t => t.type === 'income' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = Math.abs(transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0));
  const netIncome = monthlyIncome - monthlyExpenses;

  const formatCurrency = (amount: number, hideBalance: boolean = false) => {
    if (hideBalance) return '****';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getAccountTypeIcon = (type: string) => {
    const icons = {
      'checking': Wallet,
      'savings': Target,
      'credit': CreditCard,
      'investment': TrendingUp,
      'business': Building
    };
    const Icon = icons[type] || Wallet;
    return <Icon className="w-6 h-6" />;
  };

  const getBudgetStatus = (budget: Budget) => {
    const percentage = (budget.spent / budget.allocated) * 100;
    if (percentage > 100) return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', status: 'Over Budget' };
    if (percentage > 80) return { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', status: 'Warning' };
    return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', status: 'On Track' };
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalBalance, hideBalances)}
              </p>
              <p className="text-sm text-green-600">+5.2% this month</p>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-12 h-12 text-green-600" />
              <button 
                onClick={() => setHideBalances(!hideBalances)}
                className="text-gray-400 hover:text-gray-600"
              >
                {hideBalances ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Income</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(monthlyIncome, hideBalances)}
              </p>
              <p className="text-sm text-green-600">+12% vs last month</p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Expenses</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(monthlyExpenses, hideBalances)}
              </p>
              <p className="text-sm text-red-600">+8% vs last month</p>
            </div>
            <TrendingDown className="w-12 h-12 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Net Income</p>
              <p className={`text-3xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netIncome, hideBalances)}
              </p>
              <p className={`text-sm ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netIncome >= 0 ? 'Profit' : 'Loss'} this month
              </p>
            </div>
            {netIncome >= 0 ? (
              <ArrowUpRight className="w-12 h-12 text-green-600" />
            ) : (
              <ArrowDownRight className="w-12 h-12 text-red-600" />
            )}
          </div>
        </motion.div>
      </div>

      {/* Accounts Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Accounts</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    {getAccountTypeIcon(account.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{account.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{account.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${account.balance >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-600'}`}>
                    {formatCurrency(account.balance, hideBalances)}
                  </p>
                  <p className="text-sm text-gray-500">Updated: {new Date(account.lastUpdate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Status</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Manage</button>
          </div>
          <div className="space-y-4">
            {budgets.map((budget) => {
              const percentage = Math.min((budget.spent / budget.allocated) * 100, 100);
              const status = getBudgetStatus(budget);
              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">{budget.category}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${status.bg} ${status.color}`}>
                      {status.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{formatCurrency(budget.spent, hideBalances)} spent</span>
                    <span>{formatCurrency(budget.allocated, hideBalances)} budget</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        percentage > 100 ? 'bg-red-500' : 
                        percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions & Financial Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' :
                    transaction.type === 'expense' ? 'bg-red-100 dark:bg-red-900/30' :
                    'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : transaction.type === 'expense' ? (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    ) : (
                      <RefreshCw className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.category} • {transaction.account}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : ''}{formatCurrency(Math.abs(transaction.amount), hideBalances)}
                  </p>
                  <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Goals</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Add Goal</button>
          </div>
          <div className="space-y-4">
            {goals.map((goal) => {
              const percentage = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{goal.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Due: {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      goal.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                      goal.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    }`}>
                      {goal.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatCurrency(goal.currentAmount, hideBalances)} of {formatCurrency(goal.targetAmount, hideBalances)}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">{Math.round(percentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cash Flow Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cash Flow Trend</h3>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
        <div className="h-64 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-end justify-around p-4">
          {Array.from({ length: 12 }, (_, index) => {
            const income = Math.random() * 8000 + 2000;
            const expenses = Math.random() * 6000 + 1500;
            const maxHeight = 200;
            const incomeHeight = (income / 10000) * maxHeight;
            const expenseHeight = (expenses / 10000) * maxHeight;
            
            return (
              <div key={index} className="flex flex-col items-center space-y-1">
                <div className="flex items-end space-x-1">
                  <div
                    className="bg-green-500 rounded-t w-3"
                    style={{ height: `${incomeHeight}px` }}
                    title={`Income: ${formatCurrency(income, hideBalances)}`}
                  />
                  <div
                    className="bg-red-500 rounded-t w-3"
                    style={{ height: `${expenseHeight}px` }}
                    title={`Expenses: ${formatCurrency(expenses, hideBalances)}`}
                  />
                </div>
                <span className="text-xs text-gray-500">{index + 1}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Income</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Expenses</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Unified Sidebar */}
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-14' : 'ml-56'
      }`}>
        {/* Advanced Navigation */}
        <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
        
        {/* Navigation Tabs */}
        <NavigationTabs />
        
        {/* Financial Management Content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white">
                <DollarSign className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Financial Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Track income, expenses, budgets, and financial goals in one place
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { key: 'overview', label: 'Overview', icon: PieChart },
                { key: 'transactions', label: 'Transactions', icon: Receipt },
                { key: 'budgets', label: 'Budgets', icon: Target },
                { key: 'goals', label: 'Goals', icon: TrendingUp },
                { key: 'reports', label: 'Reports', icon: BarChart3 }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-white dark:bg-gray-700 text-green-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && renderOverviewTab()}
              {activeTab === 'transactions' && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Transaction management interface coming soon</p>
                </div>
              )}
              {activeTab === 'budgets' && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Budget management interface coming soon</p>
                </div>
              )}
              {activeTab === 'goals' && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Financial goals interface coming soon</p>
                </div>
              )}
              {activeTab === 'reports' && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Financial reports interface coming soon</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}