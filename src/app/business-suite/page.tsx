'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import NavigationTabs from '@/components/NavigationTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2,
  Users,
  Handshake,
  DollarSign,
  BarChart3,
  UserPlus,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  TrendingDown,
  PieChart,
  CreditCard,
  Receipt,
  Banknote,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Settings,
  Eye,
  Star,
  Award
} from 'lucide-react';

// Mock data
const mockContacts = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Tech Solutions Inc',
    email: 'john@techsolutions.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
    lastContact: '2024-09-25',
    value: 15000
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'Digital Marketing Co',
    email: 'sarah@digitalmarketing.com',
    phone: '+1 (555) 987-6543',
    status: 'prospect',
    lastContact: '2024-09-24',
    value: 8500
  }
];

const mockDeals = [
  {
    id: '1',
    title: 'Website Redesign Project',
    company: 'Tech Solutions Inc',
    value: 15000,
    stage: 'proposal',
    probability: 75,
    closeDate: '2024-10-15',
    contact: 'John Smith'
  },
  {
    id: '2',
    title: 'Marketing Automation Setup',
    company: 'Digital Marketing Co',
    value: 8500,
    stage: 'negotiation',
    probability: 60,
    closeDate: '2024-10-30',
    contact: 'Sarah Johnson'
  }
];

const mockFinancials = {
  revenue: 125000,
  expenses: 78000,
  profit: 47000,
  invoicesPending: 12500,
  invoicesOverdue: 3200
};

export default function BusinessSuite() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabConfig = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Building2 className="w-4 h-4" />,
      component: BusinessOverview
    },
    {
      id: 'crm',
      label: 'CRM',
      icon: <Users className="w-4 h-4" />,
      component: AdvancedCRM
    },
    {
      id: 'sales',
      label: 'Sales',
      icon: <Handshake className="w-4 h-4" />,
      component: SalesAutomation
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: <DollarSign className="w-4 h-4" />,
      component: FinancialManagement
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <BarChart3 className="w-4 h-4" />,
      component: BusinessReports
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Business Suite
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete business management with Advanced CRM, Sales Automation, and Financial Management
          </p>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            {tabConfig.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2"
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          {tabConfig.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-6">
              <tab.component />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

// Business Overview Component
function BusinessOverview() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1,247</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5% from last month
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Deals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">28</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5 new this week
                </p>
              </div>
              <Handshake className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${mockFinancials.revenue.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18.2% from last month
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Profit</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${mockFinancials.profit.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +22.1% from last month
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <UserPlus className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-medium">Add Contact</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Add new customer or lead</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Handshake className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-medium">Create Deal</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Start new sales opportunity</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <h3 className="font-medium">Generate Invoice</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Create and send invoice</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <h3 className="font-medium">View Reports</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Analyze business performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'New contact added', contact: 'John Smith', time: '2 hours ago', type: 'contact' },
              { action: 'Deal moved to proposal', contact: 'Website Redesign Project', time: '4 hours ago', type: 'deal' },
              { action: 'Invoice sent', contact: 'Tech Solutions Inc', time: '1 day ago', type: 'invoice' },
              { action: 'Payment received', contact: '$5,000', time: '2 days ago', type: 'payment' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'contact' ? 'bg-blue-500' :
                  activity.type === 'deal' ? 'bg-green-500' :
                  activity.type === 'invoice' ? 'bg-purple-500' : 'bg-emerald-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{activity.contact}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Advanced CRM Component
function AdvancedCRM() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* CRM Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Customer Relationship Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage contacts, leads, and customer relationships</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">1,247</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Contacts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">324</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Hot Leads</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">892</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Customers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">31</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Follow-ups Due</div>
          </CardContent>
        </Card>
      </div>

      {/* Contacts List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="font-medium text-blue-600 dark:text-blue-300">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium">{contact.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{contact.company}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {contact.email}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {contact.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={contact.status === 'active' ? 'default' : 'secondary'}>
                    {contact.status}
                  </Badge>
                  <div className="text-right">
                    <div className="font-medium">${contact.value.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Last contact: {contact.lastContact}</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Sales Automation Component
function SalesAutomation() {
  return (
    <div className="space-y-6">
      {/* Sales Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sales Automation</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage sales pipeline and automate processes</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Deal
        </Button>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { stage: 'Lead', count: 45, color: 'blue' },
          { stage: 'Qualified', count: 32, color: 'yellow' },
          { stage: 'Proposal', count: 18, color: 'orange' },
          { stage: 'Negotiation', count: 12, color: 'purple' },
          { stage: 'Closed Won', count: 8, color: 'green' }
        ].map((stage) => (
          <Card key={stage.stage}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold text-${stage.color}-600`}>{stage.count}</div>
              <div className="text-sm font-medium">{stage.stage}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sales Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pipeline Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">$485,000</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15.3% from last month
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Win Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">68%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5% from last month
                </p>
              </div>
              <Award className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Deal Size</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">$12,500</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8.2% from last month
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Deals */}
      <Card>
        <CardHeader>
          <CardTitle>Active Deals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDeals.map((deal) => (
              <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex-1">
                  <h3 className="font-medium">{deal.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{deal.company} • {deal.contact}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="outline">{deal.stage}</Badge>
                    <span className="text-sm text-gray-500">Close: {deal.closeDate}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-bold">${deal.value.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{deal.probability}%</div>
                    <div className="text-xs text-gray-500">Probability</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Financial Management Component
function FinancialManagement() {
  return (
    <div className="space-y-6">
      {/* Finance Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Financial Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Track revenue, expenses, and financial performance</p>
        </div>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${mockFinancials.revenue.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5% from last month
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${mockFinancials.expenses.toLocaleString()}</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8.2% from last month
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Profit</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${mockFinancials.profit.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18.7% from last month
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Profit Margin</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">37.6%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2.1% from last month
                </p>
              </div>
              <PieChart className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Invoice Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pending Payment</span>
                <span className="text-lg font-bold text-yellow-600">${mockFinancials.invoicesPending.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overdue</span>
                <span className="text-lg font-bold text-red-600">${mockFinancials.invoicesOverdue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Paid This Month</span>
                <span className="text-lg font-bold text-green-600">$89,300</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Create New Invoice
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Upload className="w-4 h-4 mr-2" />
                Record Expense
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export Financial Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: 'income', description: 'Payment from Tech Solutions Inc', amount: 15000, date: '2024-09-25' },
              { type: 'expense', description: 'Office rent', amount: -2500, date: '2024-09-24' },
              { type: 'income', description: 'Consulting services payment', amount: 3500, date: '2024-09-23' },
              { type: 'expense', description: 'Software subscriptions', amount: -450, date: '2024-09-22' }
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{transaction.date}</p>
                  </div>
                </div>
                <span className={`font-bold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Business Reports Component
function BusinessReports() {
  return (
    <div className="space-y-6">
      {/* Reports Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Business Reports</h2>
          <p className="text-gray-600 dark:text-gray-400">Analyze performance and generate insights</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h3 className="font-semibold mb-2">Sales Reports</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Analyze sales performance, pipeline, and conversion rates
            </p>
            <Button size="sm">View Reports</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <h3 className="font-semibold mb-2">Financial Reports</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Track revenue, expenses, profit margins, and financial health
            </p>
            <Button size="sm">View Reports</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-purple-500" />
            <h3 className="font-semibold mb-2">Customer Reports</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Understand customer behavior, retention, and lifetime value
            </p>
            <Button size="sm">View Reports</Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Top Performing Metrics</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Customer Acquisition</span>
                  <Badge className="bg-green-100 text-green-800">+25%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Revenue Growth</span>
                  <Badge className="bg-green-100 text-green-800">+18%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Profit Margin</span>
                  <Badge className="bg-green-100 text-green-800">+12%</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Areas for Improvement</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lead Response Time</span>
                  <Badge variant="destructive">-8%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Customer Satisfaction</span>
                  <Badge className="bg-yellow-100 text-yellow-800">-3%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Operational Efficiency</span>
                  <Badge className="bg-yellow-100 text-yellow-800">-5%</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}