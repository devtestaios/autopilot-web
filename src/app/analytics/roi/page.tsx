'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calculator,
  Target,
  BarChart3,
  PieChart,
  Users,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, AreaChart, Area, ScatterChart, Scatter, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import NavigationTabs from '@/components/NavigationTabs';
import UnifiedSidebar from '@/components/UnifiedSidebar';

// Mock ROI data
const roiData = [
  { month: 'Jan', spend: 8500, revenue: 34000, roi: 3.0, customers: 127 },
  { month: 'Feb', spend: 9200, revenue: 39600, roi: 3.3, customers: 145 },
  { month: 'Mar', spend: 8800, revenue: 35200, roi: 3.0, customers: 132 },
  { month: 'Apr', spend: 10500, revenue: 47250, roi: 3.5, customers: 168 },
  { month: 'May', spend: 11200, revenue: 50400, roi: 3.5, customers: 179 },
  { month: 'Jun', spend: 12000, revenue: 60000, roi: 4.0, customers: 201 }
];

const campaignROI = [
  { 
    campaign: 'Holiday Sale 2025', 
    spend: 4200, 
    revenue: 18900, 
    roi: 3.5, 
    customers: 89, 
    ltv: 312, 
    cac: 47.2,
    paybackPeriod: 2.4,
    status: 'excellent'
  },
  { 
    campaign: 'Brand Keywords', 
    spend: 3800, 
    revenue: 15200, 
    roi: 3.0, 
    customers: 76, 
    ltv: 289, 
    cac: 50.0,
    paybackPeriod: 2.8,
    status: 'good'
  },
  { 
    campaign: 'Product Search', 
    spend: 2900, 
    revenue: 8700, 
    roi: 2.0, 
    customers: 58, 
    ltv: 245, 
    cac: 50.0,
    paybackPeriod: 4.2,
    status: 'fair'
  },
  { 
    campaign: 'Retargeting', 
    spend: 1800, 
    revenue: 9000, 
    roi: 4.0, 
    customers: 45, 
    ltv: 356, 
    cac: 40.0,
    paybackPeriod: 1.8,
    status: 'excellent'
  },
  { 
    campaign: 'Video Campaign', 
    spend: 5300, 
    revenue: 10600, 
    roi: 1.0, 
    customers: 53, 
    ltv: 198, 
    cac: 100.0,
    paybackPeriod: 6.5,
    status: 'poor'
  }
];

const channelROI = [
  { channel: 'Google Ads', spend: 7200, revenue: 28800, roi: 3.0, color: '#4285F4' },
  { channel: 'Meta', spend: 5100, revenue: 20400, roi: 3.0, color: '#1877F2' },
  { channel: 'LinkedIn', spend: 3200, revenue: 12800, roi: 3.0, color: '#0A66C2' },
  { channel: 'Email', spend: 800, revenue: 4800, roi: 5.0, color: '#34D399' },
  { channel: 'Organic', spend: 1700, revenue: 8500, roi: 4.0, color: '#8B5CF6' }
];

const customerSegmentROI = [
  { segment: 'Enterprise', customers: 23, revenue: 34500, cac: 280, ltv: 1500, ratio: 5.4 },
  { segment: 'SMB', customers: 145, revenue: 29000, cac: 95, ltv: 450, ratio: 4.7 },
  { segment: 'Startup', customers: 89, revenue: 8900, cac: 45, ltv: 180, ratio: 4.0 },
  { segment: 'Individual', customers: 234, revenue: 7020, cac: 15, ltv: 60, ratio: 4.0 }
];

export default function ROIAnalyticsPage() {
  const { theme } = useTheme();
  const [selectedTimeRange, setSelectedTimeRange] = useState<'3m' | '6m' | '12m'>('6m');
  const [selectedView, setSelectedView] = useState<'revenue' | 'roi' | 'customers'>('roi');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 dark:text-green-400';
      case 'good': return 'text-blue-600 dark:text-blue-400';
      case 'fair': return 'text-yellow-600 dark:text-yellow-400';
      case 'poor': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-4 h-4" />;
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'fair': return <AlertTriangle className="w-4 h-4" />;
      case 'poor': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const totalSpend = roiData.reduce((sum, month) => sum + month.spend, 0);
  const totalRevenue = roiData.reduce((sum, month) => sum + month.revenue, 0);
  const averageROI = totalRevenue / totalSpend;
  const totalCustomers = roiData.reduce((sum, month) => sum + month.customers, 0);
  const averageCAC = totalSpend / totalCustomers;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-56'
      }`}>
        <NavigationTabs />
        
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                ROI Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Return on investment analysis and profitability insights
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                {[
                  { id: '3m', label: '3 Months' },
                  { id: '6m', label: '6 Months' },
                  { id: '12m', label: '12 Months' }
                ].map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setSelectedTimeRange(range.id as any)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      selectedTimeRange === range.id
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Key ROI Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="text-sm font-medium">+18.5%</span>
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Average ROI
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {averageROI.toFixed(1)}x
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="text-sm font-medium">+12.3%</span>
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Revenue
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalRevenue.toLocaleString()}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="text-sm font-medium">+25.8%</span>
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Customers
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalCustomers}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Calculator className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <ArrowDownRight className="w-4 h-4" />
                    <span className="text-sm font-medium">-5.2%</span>
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Average CAC
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${averageCAC.toFixed(0)}
              </p>
            </motion.div>
          </div>

          {/* ROI Trend Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  ROI Trends Over Time
                </h3>
                
                {/* View Selector */}
                <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  {[
                    { id: 'revenue', label: 'Revenue' },
                    { id: 'roi', label: 'ROI' },
                    { id: 'customers', label: 'Customers' }
                  ].map((view) => (
                    <button
                      key={view.id}
                      onClick={() => setSelectedView(view.id as any)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        selectedView === view.id
                          ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      {view.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={roiData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={selectedView}
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="spend"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={{ fill: '#EF4444', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Channel ROI & Customer Segments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Channel ROI */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  ROI by Channel
                </h3>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={channelROI}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="channel" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="roi" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Customer Segment Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Customer Segment LTV/CAC
                </h3>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={customerSegmentROI}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="cac" 
                      stroke="#6b7280" 
                      fontSize={12}
                      label={{ value: 'Customer Acquisition Cost', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      dataKey="ltv" 
                      stroke="#6b7280" 
                      fontSize={12}
                      label={{ value: 'Lifetime Value', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                      formatter={(value, name, props) => [
                        `${name}: $${value}`,
                        `Segment: ${props.payload.segment}`
                      ]}
                    />
                    <Scatter dataKey="ltv" fill="#8B5CF6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Campaign ROI Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Campaign ROI Analysis
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Spend
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ROI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      CAC
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      LTV
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Payback Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {campaignROI.map((campaign, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {campaign.campaign}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        ${campaign.spend.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        ${campaign.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {campaign.roi.toFixed(1)}x
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        ${campaign.cac}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        ${campaign.ltv}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {campaign.paybackPeriod} months
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center gap-1 ${getStatusColor(campaign.status)}`}>
                          {getStatusIcon(campaign.status)}
                          <span className="text-sm font-medium capitalize">
                            {campaign.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Segment Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Customer Segment Profitability
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {customerSegmentROI.map((segment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4"
                  >
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {segment.segment}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Customers:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {segment.customers}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Revenue:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ${segment.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">CAC:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ${segment.cac}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">LTV:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ${segment.ltv}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">LTV/CAC:</span>
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {segment.ratio.toFixed(1)}x
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}