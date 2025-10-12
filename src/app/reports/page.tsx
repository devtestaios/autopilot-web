'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
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
  MoreHorizontal,
  Play,
  Pause,
  Edit,
  Trash2,
  Copy,
  RefreshCw,
  ExternalLink,
  Mail,
  Zap,
  Activity,
  Brain,
  PlusCircle,
  X,
  ChevronDown,
  ChevronUp,
  Calendar as CalendarIcon,
  FileSpreadsheet,
  FileImage,
  Database,
  LineChart,
  Building
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'roi' | 'attribution' | 'optimization' | 'executive' | 'custom';
  frequency: 'manual' | 'daily' | 'weekly' | 'monthly';
  format: 'pdf' | 'excel' | 'csv' | 'json' | 'dashboard';
  sections: ReportSection[];
  filters: ReportFilter[];
  recipients: string[];
  isActive: boolean;
  createdAt: string;
  lastGenerated?: string;
  nextScheduled?: string;
}

interface ReportSection {
  id: string;
  type: 'summary' | 'chart' | 'table' | 'insights' | 'recommendations' | 'comparison';
  title: string;
  metrics: string[];
  chartType?: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'heatmap';
  timeframe: string;
  groupBy?: string[];
  customizations: any;
}

interface ReportFilter {
  field: string;
  operator: string;
  value: any;
  label: string;
}

interface GeneratedReport {
  id: string;
  templateId: string;
  name: string;
  generatedAt: string;
  format: string;
  size: string;
  status: 'generating' | 'completed' | 'failed';
  downloadUrl?: string;
  metadata: any;
}

interface AvailableMetric {
  id: string;
  name: string;
  category: string;
  dataType: string;
}

// =============================================================================
// REPORT BUILDER COMPONENT
// =============================================================================

export default function ReportBuilder() {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [availableMetrics, setAvailableMetrics] = useState<AvailableMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<ReportTemplate>>({
    name: '',
    description: '',
    category: 'custom',
    frequency: 'manual',
    format: 'pdf',
    sections: [],
    filters: [],
    recipients: []
  });
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    loadReportData();
  }, [selectedCategory]);

  const loadReportData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load templates
      const templatesResponse = await fetch(`/api/analytics/reports?endpoint=templates&category=${selectedCategory}`);
      const templatesData = await templatesResponse.json();
      
      if (templatesData.success) {
        setTemplates(templatesData.data.templates);
      }

      // Load reports
      const reportsResponse = await fetch('/api/analytics/reports?endpoint=reports');
      const reportsData = await reportsResponse.json();
      
      if (reportsData.success) {
        setReports(reportsData.data.reports);
      }

      // Load available metrics
      const metricsResponse = await fetch('/api/analytics/reports?endpoint=metrics');
      const metricsData = await metricsResponse.json();
      
      if (metricsData.success) {
        setAvailableMetrics(metricsData.data.metrics);
      }

    } catch (error) {
      console.error('Error loading report data:', error);
      setError('Failed to load report data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async (templateId: string) => {
    try {
      const response = await fetch(`/api/analytics/reports?endpoint=generate&templateId=${templateId}`);
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Report Generated',
          description: 'Your report has been generated successfully.',
        });
        loadReportData(); // Refresh reports list
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate report. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleCreateTemplate = async () => {
    try {
      if (!newTemplate.name || !newTemplate.description) {
        toast({
          title: 'Validation Error',
          description: 'Please provide a name and description for the template.',
          variant: 'destructive'
        });
        return;
      }

      const response = await fetch('/api/analytics/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_template',
          templateData: newTemplate
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Template Created',
          description: 'Report template has been created successfully.',
        });
        setIsCreatingTemplate(false);
        setNewTemplate({
          name: '',
          description: '',
          category: 'custom',
          frequency: 'manual',
          format: 'pdf',
          sections: [],
          filters: [],
          recipients: []
        });
        loadReportData();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'Creation Failed',
        description: 'Failed to create template. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const addSectionToTemplate = () => {
    const newSection: ReportSection = {
      id: `section_${Date.now()}`,
      type: 'summary',
      title: 'New Section',
      metrics: [],
      timeframe: '30d',
      customizations: {}
    };

    setNewTemplate(prev => ({
      ...prev,
      sections: [...(prev.sections || []), newSection]
    }));
  };

  const updateSection = (sectionId: string, updates: Partial<ReportSection>) => {
    setNewTemplate(prev => ({
      ...prev,
      sections: prev.sections?.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  const removeSection = (sectionId: string) => {
    setNewTemplate(prev => ({
      ...prev,
      sections: prev.sections?.filter(section => section.id !== sectionId)
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <Activity className="h-4 w-4" />;
      case 'roi': return <DollarSign className="h-4 w-4" />;
      case 'attribution': return <Target className="h-4 w-4" />;
      case 'optimization': return <Brain className="h-4 w-4" />;
      case 'executive': return <Building className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'excel': return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
      case 'pdf': return <FileText className="h-4 w-4 text-red-600" />;
      case 'csv': return <Database className="h-4 w-4 text-blue-600" />;
      case 'dashboard': return <BarChart3 className="h-4 w-4 text-purple-600" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-green-100 text-green-800';
      case 'weekly': return 'bg-blue-100 text-blue-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading && templates.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-purple-600" />
              Report Builder
            </h1>
            <p className="text-gray-600 mt-1">
              Create, customize, and automate performance reports
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Categories</option>
              <option value="performance">Performance</option>
              <option value="roi">ROI</option>
              <option value="attribution">Attribution</option>
              <option value="optimization">Optimization</option>
              <option value="executive">Executive</option>
              <option value="custom">Custom</option>
            </select>
            
            <Button
              onClick={() => setIsCreatingTemplate(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Template
            </Button>
            
            <Button
              onClick={loadReportData}
              variant="outline"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="templates">Report Templates</TabsTrigger>
            <TabsTrigger value="reports">Generated Reports</TabsTrigger>
            <TabsTrigger value="builder">Template Builder</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(template.category)}
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-1">
                        {getFormatIcon(template.format)}
                        <Badge className={getFrequencyColor(template.frequency)}>
                          {template.frequency}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{template.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Sections:</span>
                        <span className="font-medium">{template.sections.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Recipients:</span>
                        <span className="font-medium">{template.recipients.length}</span>
                      </div>
                      {template.lastGenerated && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Last Generated:</span>
                          <span className="font-medium">
                            {new Date(template.lastGenerated).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t">
                      <Button
                        onClick={() => handleGenerateReport(template.id)}
                        className="flex-1 flex items-center justify-center gap-2"
                        size="sm"
                      >
                        <Play className="h-4 w-4" />
                        Generate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getFormatIcon(report.format)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{report.name}</h3>
                          <p className="text-sm text-gray-600">
                            Generated {new Date(report.generatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">{report.size}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {report.status === 'completed' && report.downloadUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Share2 className="h-4 w-4" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {report.metadata && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Records:</span>
                            <span className="ml-1 font-medium">{report.metadata.totalRecords?.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Timeframe:</span>
                            <span className="ml-1 font-medium">{report.metadata.timeframe}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Platforms:</span>
                            <span className="ml-1 font-medium">{report.metadata.platforms?.length}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Campaigns:</span>
                            <span className="ml-1 font-medium">{report.metadata.campaigns}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="builder" className="space-y-6">
            {isCreatingTemplate ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Create New Report Template</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCreatingTemplate(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template Name
                      </label>
                      <input
                        type="text"
                        value={newTemplate.name || ''}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter template name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={newTemplate.category || 'custom'}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="custom">Custom</option>
                        <option value="performance">Performance</option>
                        <option value="roi">ROI</option>
                        <option value="attribution">Attribution</option>
                        <option value="optimization">Optimization</option>
                        <option value="executive">Executive</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newTemplate.description || ''}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe what this report template will generate"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency
                      </label>
                      <select
                        value={newTemplate.frequency || 'manual'}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, frequency: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="manual">Manual</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Format
                      </label>
                      <select
                        value={newTemplate.format || 'pdf'}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, format: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="pdf">PDF</option>
                        <option value="excel">Excel</option>
                        <option value="csv">CSV</option>
                        <option value="dashboard">Dashboard</option>
                      </select>
                    </div>
                  </div>

                  {/* Sections */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Report Sections</h3>
                      <Button
                        onClick={addSectionToTemplate}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Add Section
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {newTemplate.sections?.map((section, index) => (
                        <Card key={section.id} className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">Section {index + 1}</h4>
                            <Button
                              onClick={() => removeSection(section.id)}
                              variant="outline"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                              </label>
                              <input
                                type="text"
                                value={section.title}
                                onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type
                              </label>
                              <select
                                value={section.type}
                                onChange={(e) => updateSection(section.id, { type: e.target.value as any })}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              >
                                <option value="summary">Summary</option>
                                <option value="chart">Chart</option>
                                <option value="table">Table</option>
                                <option value="insights">Insights</option>
                                <option value="recommendations">Recommendations</option>
                                <option value="comparison">Comparison</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Timeframe
                              </label>
                              <select
                                value={section.timeframe}
                                onChange={(e) => updateSection(section.id, { timeframe: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              >
                                <option value="7d">Last 7 days</option>
                                <option value="30d">Last 30 days</option>
                                <option value="90d">Last 90 days</option>
                              </select>
                            </div>
                          </div>

                          {section.type === 'chart' && (
                            <div className="mt-3">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Chart Type
                              </label>
                              <select
                                value={section.chartType || 'line'}
                                onChange={(e) => updateSection(section.id, { chartType: e.target.value as any })}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              >
                                <option value="line">Line Chart</option>
                                <option value="bar">Bar Chart</option>
                                <option value="pie">Pie Chart</option>
                                <option value="area">Area Chart</option>
                              </select>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t">
                    <Button
                      onClick={handleCreateTemplate}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Create Template
                    </Button>
                    <Button
                      onClick={() => setIsCreatingTemplate(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Create Custom Report Templates
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Build custom reports with your preferred metrics, visualizations, and schedules
                  </p>
                  <Button
                    onClick={() => setIsCreatingTemplate(true)}
                    className="flex items-center gap-2 mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Start Building
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}