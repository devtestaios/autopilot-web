'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  DollarSign,
  Eye,
  MousePointer,
  Target,
  Filter,
  Search,
  Settings,
  Share2,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  MoreHorizontal
} from 'lucide-react';
import NavigationTabs from '@/components/NavigationTabs';
import UnifiedSidebar from '@/components/UnifiedSidebar';

// Types for reports
interface Report {
  id: string;
  name: string;
  type: 'performance' | 'roi' | 'campaign_summary' | 'audience' | 'custom';
  status: 'generating' | 'ready' | 'scheduled' | 'failed';
  createdAt: string;
  lastGenerated?: string;
  schedule?: 'daily' | 'weekly' | 'monthly' | 'manual';
  format: 'pdf' | 'csv' | 'xlsx' | 'json';
  size?: string;
  description: string;
  metrics: {
    campaigns: number;
    dateRange: string;
    platforms: string[];
  };
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'performance' | 'roi' | 'campaign_summary' | 'audience' | 'custom';
  icon: React.ComponentType<any>;
  estimatedTime: string;
  metrics: string[];
}

// Mock data for reports
const mockReports: Report[] = [
  {
    id: '1',
    name: 'Monthly Performance Report - September 2025',
    type: 'performance',
    status: 'ready',
    createdAt: '2025-09-20T10:00:00Z',
    lastGenerated: '2025-09-20T10:00:00Z',
    schedule: 'monthly',
    format: 'pdf',
    size: '2.4 MB',
    description: 'Comprehensive performance analysis across all campaigns',
    metrics: {
      campaigns: 12,
      dateRange: 'September 1-19, 2025',
      platforms: ['Google Ads', 'Meta', 'LinkedIn']
    }
  },
  {
    id: '2',
    name: 'ROI Analysis Q3 2025',
    type: 'roi',
    status: 'ready',
    createdAt: '2025-09-19T15:30:00Z',
    lastGenerated: '2025-09-19T15:30:00Z',
    schedule: 'manual',
    format: 'xlsx',
    size: '1.8 MB',
    description: 'Return on investment analysis for Q3 campaigns',
    metrics: {
      campaigns: 8,
      dateRange: 'July 1 - September 19, 2025',
      platforms: ['Google Ads', 'Meta']
    }
  },
  {
    id: '3',
    name: 'Weekly Campaign Summary',
    type: 'campaign_summary',
    status: 'generating',
    createdAt: '2025-09-20T09:00:00Z',
    schedule: 'weekly',
    format: 'pdf',
    description: 'Weekly summary of campaign performance and key metrics',
    metrics: {
      campaigns: 15,
      dateRange: 'September 14-20, 2025',
      platforms: ['Google Ads', 'Meta', 'LinkedIn', 'TikTok']
    }
  },
  {
    id: '4',
    name: 'Audience Demographics Report',
    type: 'audience',
    status: 'scheduled',
    createdAt: '2025-09-19T12:00:00Z',
    schedule: 'weekly',
    format: 'csv',
    description: 'Detailed audience demographics and behavior analysis',
    metrics: {
      campaigns: 10,
      dateRange: 'September 1-20, 2025',
      platforms: ['Meta', 'LinkedIn']
    }
  }
];

const reportTemplates: ReportTemplate[] = [
  {
    id: 'performance',
    name: 'Performance Report',
    description: 'Comprehensive campaign performance analysis with KPIs',
    type: 'performance',
    icon: TrendingUp,
    estimatedTime: '3-5 minutes',
    metrics: ['Impressions', 'Clicks', 'CTR', 'Conversions', 'CPA', 'ROAS']
  },
  {
    id: 'roi',
    name: 'ROI Analysis',
    description: 'Return on investment analysis with revenue attribution',
    type: 'roi',
    icon: DollarSign,
    estimatedTime: '2-3 minutes',
    metrics: ['Revenue', 'Spend', 'ROI', 'ROAS', 'Profit Margin', 'LTV']
  },
  {
    id: 'campaign_summary',
    name: 'Campaign Summary',
    description: 'High-level overview of all campaign activities',
    type: 'campaign_summary',
    icon: BarChart3,
    estimatedTime: '1-2 minutes',
    metrics: ['Active Campaigns', 'Total Spend', 'Avg. CTR', 'Top Performers']
  },
  {
    id: 'audience',
    name: 'Audience Report',
    description: 'Demographics, interests, and behavior analysis',
    type: 'audience',
    icon: Users,
    estimatedTime: '4-6 minutes',
    metrics: ['Demographics', 'Interests', 'Devices', 'Locations', 'Behaviors']
  }
];

export default function ReportsPage() {
  const { theme } = useTheme();
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedView, setSelectedView] = useState<'reports' | 'templates'>('reports');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ready' | 'generating' | 'scheduled'>('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'generating': return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      case 'scheduled': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      default: return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'generating': return <Clock className="w-4 h-4" />;
      case 'scheduled': return <Calendar className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredReports = filterStatus === 'all' 
    ? reports 
    : reports.filter(report => report.status === filterStatus);

  const downloadReport = (reportId: string) => {
    // Mock download functionality
    console.log(`Downloading report ${reportId}`);
  };

  const generateReport = (templateId: string) => {
    // Mock report generation
    const template = reportTemplates.find(t => t.id === templateId);
    if (template) {
      const newReport: Report = {
        id: `report_${Date.now()}`,
        name: `${template.name} - ${new Date().toLocaleDateString()}`,
        type: template.type,
        status: 'generating',
        createdAt: new Date().toISOString(),
        schedule: 'manual',
        format: 'pdf',
        description: template.description,
        metrics: {
          campaigns: 12,
          dateRange: 'Last 30 days',
          platforms: ['Google Ads', 'Meta']
        }
      };
      setReports([newReport, ...reports]);
    }
  };

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
                Reports & Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Generate and manage comprehensive performance reports
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                New Report
              </button>
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
            {[
              { id: 'reports', label: 'My Reports', icon: <FileText className="w-4 h-4" /> },
              { id: 'templates', label: 'Templates', icon: <BarChart3 className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedView(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedView === tab.id
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Reports View */}
          {selectedView === 'reports' && (
            <>
              {/* Status Filter */}
              <div className="flex items-center gap-4">
                <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'ready', label: 'Ready' },
                    { id: 'generating', label: 'Generating' },
                    { id: 'scheduled', label: 'Scheduled' }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setFilterStatus(filter.id as any)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        filterStatus === filter.id
                          ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reports List */}
              <div className="space-y-4">
                {filteredReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {report.name}
                            </h3>
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                              {getStatusIcon(report.status)}
                              {report.status}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                              {report.format.toUpperCase()}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {report.description}
                          </p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 dark:text-gray-500 mb-1">Campaigns</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {report.metrics.campaigns}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-500 mb-1">Date Range</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {report.metrics.dateRange}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-500 mb-1">Platforms</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {report.metrics.platforms.join(', ')}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-500 mb-1">Size</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {report.size || 'Generating...'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {report.status === 'ready' && (
                          <>
                            <button
                              onClick={() => downloadReport(report.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                            <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Templates View */}
          {selectedView === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                      <template.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {template.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {template.description}
                      </p>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                          Estimated generation time: {template.estimatedTime}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {template.metrics.map((metric, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                            >
                              {metric}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => generateReport(template.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Generate Report
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredReports.length === 0 && selectedView === 'reports' && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No reports found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {filterStatus === 'all' 
                  ? 'Generate your first report using one of our templates.'
                  : `No ${filterStatus} reports at the moment.`
                }
              </p>
              <button
                onClick={() => setSelectedView('templates')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Templates
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}