import { NextRequest, NextResponse } from 'next/server';

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
  description?: string;
  metrics: string[];
  chartType?: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'heatmap';
  timeframe: string;
  groupBy?: string[];
  sortBy?: string;
  limit?: number;
  includeForecasting?: boolean;
  customizations: {
    colors?: string[];
    showTrends?: boolean;
    showBenchmarks?: boolean;
    highlightAnomalies?: boolean;
  };
}

interface ReportFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'between';
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
  previewUrl?: string;
  sections: GeneratedSection[];
  metadata: {
    totalRecords: number;
    timeframe: string;
    platforms: string[];
    campaigns: number;
  };
  insights: string[];
  error?: string;
}

interface GeneratedSection {
  id: string;
  title: string;
  type: string;
  data: any;
  visualization?: {
    type: string;
    config: any;
  };
  summary: string;
}

// =============================================================================
// MOCK DATA AND TEMPLATES
// =============================================================================

const defaultTemplates: ReportTemplate[] = [
  {
    id: 'template_executive',
    name: 'Executive Performance Summary',
    description: 'High-level overview of marketing performance for executives',
    category: 'executive',
    frequency: 'weekly',
    format: 'pdf',
    sections: [
      {
        id: 'exec_summary',
        type: 'summary',
        title: 'Key Performance Indicators',
        metrics: ['total_spend', 'total_revenue', 'overall_roas', 'new_customers'],
        timeframe: '30d',
        customizations: {
          showTrends: true,
          showBenchmarks: true
        }
      },
      {
        id: 'exec_chart',
        type: 'chart',
        title: 'Revenue Trend',
        metrics: ['revenue', 'spend'],
        chartType: 'line',
        timeframe: '90d',
        customizations: {
          colors: ['#10B981', '#EF4444'],
          showTrends: true
        }
      },
      {
        id: 'exec_insights',
        type: 'insights',
        title: 'Key Insights & Recommendations',
        metrics: [],
        timeframe: '30d',
        customizations: {}
      }
    ],
    filters: [
      {
        field: 'platform',
        operator: 'equals',
        value: 'all',
        label: 'All Platforms'
      }
    ],
    recipients: ['ceo@company.com', 'cmo@company.com'],
    isActive: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastGenerated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    nextScheduled: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'template_performance',
    name: 'Detailed Performance Analysis',
    description: 'Comprehensive performance metrics across all campaigns',
    category: 'performance',
    frequency: 'daily',
    format: 'excel',
    sections: [
      {
        id: 'perf_overview',
        type: 'summary',
        title: 'Performance Overview',
        metrics: ['impressions', 'clicks', 'conversions', 'ctr', 'cpc', 'cpa'],
        timeframe: '7d',
        customizations: {
          showTrends: true
        }
      },
      {
        id: 'perf_platform_comparison',
        type: 'comparison',
        title: 'Platform Performance Comparison',
        metrics: ['roas', 'cpa', 'conversion_rate'],
        timeframe: '30d',
        groupBy: ['platform'],
        customizations: {
          showBenchmarks: true
        }
      },
      {
        id: 'perf_campaign_table',
        type: 'table',
        title: 'Top Performing Campaigns',
        metrics: ['campaign_name', 'spend', 'revenue', 'roas', 'conversions'],
        timeframe: '30d',
        sortBy: 'roas',
        limit: 20,
        customizations: {}
      },
      {
        id: 'perf_trends',
        type: 'chart',
        title: 'Performance Trends',
        metrics: ['ctr', 'cpc', 'conversion_rate'],
        chartType: 'line',
        timeframe: '90d',
        includeForecasting: true,
        customizations: {
          highlightAnomalies: true
        }
      }
    ],
    filters: [],
    recipients: ['marketing@company.com'],
    isActive: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    lastGenerated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    nextScheduled: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'template_roi',
    name: 'ROI & Attribution Analysis',
    description: 'Revenue optimization and attribution modeling insights',
    category: 'roi',
    frequency: 'weekly',
    format: 'pdf',
    sections: [
      {
        id: 'roi_summary',
        type: 'summary',
        title: 'ROI Summary',
        metrics: ['total_revenue', 'total_spend', 'net_profit', 'roi_percentage'],
        timeframe: '30d',
        customizations: {
          showTrends: true,
          showBenchmarks: true
        }
      },
      {
        id: 'attribution_comparison',
        type: 'comparison',
        title: 'Attribution Model Comparison',
        metrics: ['attributed_revenue'],
        timeframe: '30d',
        groupBy: ['attribution_model'],
        customizations: {}
      },
      {
        id: 'customer_journey',
        type: 'chart',
        title: 'Customer Journey Analysis',
        metrics: ['touchpoints', 'conversion_rate'],
        chartType: 'bar',
        timeframe: '60d',
        groupBy: ['journey_length'],
        customizations: {}
      }
    ],
    filters: [
      {
        field: 'attribution_model',
        operator: 'equals',
        value: 'data_driven',
        label: 'Data-Driven Attribution'
      }
    ],
    recipients: ['analyst@company.com', 'cmo@company.com'],
    isActive: true,
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    lastGenerated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    nextScheduled: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'template_optimization',
    name: 'Campaign Optimization Report',
    description: 'AI-powered optimization recommendations and performance improvements',
    category: 'optimization',
    frequency: 'weekly',
    format: 'dashboard',
    sections: [
      {
        id: 'opt_recommendations',
        type: 'recommendations',
        title: 'Active Optimization Recommendations',
        metrics: ['recommendation_count', 'potential_impact', 'confidence_score'],
        timeframe: '7d',
        customizations: {}
      },
      {
        id: 'opt_implemented',
        type: 'summary',
        title: 'Implemented Optimizations',
        metrics: ['optimizations_applied', 'performance_improvement', 'revenue_impact'],
        timeframe: '30d',
        customizations: {
          showTrends: true
        }
      },
      {
        id: 'opt_opportunities',
        type: 'chart',
        title: 'Optimization Opportunities',
        metrics: ['potential_improvement'],
        chartType: 'bar',
        timeframe: '30d',
        groupBy: ['optimization_type'],
        customizations: {}
      }
    ],
    filters: [
      {
        field: 'confidence',
        operator: 'greater_than',
        value: 80,
        label: 'High Confidence (>80%)'
      }
    ],
    recipients: ['marketing@company.com'],
    isActive: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    lastGenerated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    nextScheduled: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const generateMockReportData = (section: ReportSection): any => {
  switch (section.type) {
    case 'summary':
      return {
        metrics: section.metrics.map(metric => ({
          name: metric,
          value: Math.random() * 100000,
          change: (Math.random() - 0.5) * 40,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          benchmark: Math.random() * 100000
        }))
      };

    case 'chart':
      const dataPoints = 30;
      return {
        datasets: section.metrics.map(metric => ({
          label: metric,
          data: Array.from({ length: dataPoints }, (_, i) => ({
            x: new Date(Date.now() - (dataPoints - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            y: Math.random() * 10000 + Math.sin(i / 5) * 2000
          }))
        }))
      };

    case 'table':
      return {
        headers: section.metrics,
        rows: Array.from({ length: section.limit || 10 }, (_, i) => 
          section.metrics.map(metric => {
            if (metric.includes('name')) return `Campaign ${i + 1}`;
            if (metric.includes('rate') || metric.includes('ctr')) return `${(Math.random() * 10).toFixed(2)}%`;
            if (metric.includes('$') || metric.includes('spend') || metric.includes('revenue')) return `$${(Math.random() * 10000).toFixed(2)}`;
            return Math.floor(Math.random() * 1000);
          })
        )
      };

    case 'insights':
      return {
        insights: [
          'Facebook campaigns are outperforming Google Ads by 23% in ROAS',
          'Mobile traffic conversion rate has increased 15% this month',
          'Video ads are generating 40% higher engagement than static images',
          'Weekend performance drops 12% - consider dayparting adjustments'
        ]
      };

    case 'recommendations':
      return {
        recommendations: [
          {
            title: 'Increase LinkedIn Budget',
            impact: 'High',
            description: 'LinkedIn campaigns show 180% higher ROAS',
            confidence: 92,
            estimatedGain: '$15,000'
          },
          {
            title: 'Optimize Mobile Targeting',
            impact: 'Medium',
            description: 'Mobile CPA is 30% higher than desktop',
            confidence: 85,
            estimatedGain: '$8,500'
          }
        ]
      };

    case 'comparison':
      const groups = section.groupBy?.[0] === 'platform' ? 
        ['Facebook', 'Google Ads', 'LinkedIn'] : 
        ['Group A', 'Group B', 'Group C'];
      
      return {
        groups: groups.map(group => ({
          name: group,
          metrics: section.metrics.reduce((acc, metric) => {
            acc[metric] = Math.random() * 1000;
            return acc;
          }, {} as any)
        }))
      };

    default:
      return { data: 'No data available' };
  }
};

const generateReport = (template: ReportTemplate): GeneratedReport => {
  const generatedSections = template.sections.map(section => ({
    id: section.id,
    title: section.title,
    type: section.type,
    data: generateMockReportData(section),
    visualization: section.chartType ? {
      type: section.chartType,
      config: {
        colors: section.customizations.colors || ['#3B82F6', '#10B981', '#F59E0B'],
        showTrends: section.customizations.showTrends || false,
        showBenchmarks: section.customizations.showBenchmarks || false
      }
    } : undefined,
    summary: `Generated data for ${section.title} covering ${section.timeframe}`
  }));

  return {
    id: `report_${Date.now()}`,
    templateId: template.id,
    name: `${template.name} - ${new Date().toLocaleDateString()}`,
    generatedAt: new Date().toISOString(),
    format: template.format,
    size: `${Math.floor(Math.random() * 5 + 1)}.${Math.floor(Math.random() * 9)}MB`,
    status: 'completed',
    downloadUrl: `/api/reports/download/${template.id}`,
    previewUrl: `/api/reports/preview/${template.id}`,
    sections: generatedSections,
    metadata: {
      totalRecords: Math.floor(Math.random() * 10000 + 1000),
      timeframe: template.sections[0]?.timeframe || '30d',
      platforms: ['Facebook', 'Google Ads', 'LinkedIn'],
      campaigns: Math.floor(Math.random() * 50 + 10)
    },
    insights: [
      'Overall performance has improved 12% compared to last period',
      'Mobile campaigns are driving 65% of total conversions',
      'Video content generates 2.3x higher engagement rates',
      'Attribution analysis reveals search ads influence 40% of social conversions'
    ]
  };
};

// =============================================================================
// API HANDLERS
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'templates';
    const templateId = searchParams.get('templateId');
    const reportId = searchParams.get('reportId');

    switch (endpoint) {
      case 'templates': {
        const category = searchParams.get('category');
        let templates = defaultTemplates;
        
        if (category && category !== 'all') {
          templates = templates.filter(t => t.category === category);
        }

        return NextResponse.json({
          success: true,
          data: {
            templates,
            categories: [...new Set(defaultTemplates.map(t => t.category))],
            totalTemplates: templates.length
          }
        });
      }

      case 'template': {
        if (!templateId) {
          return NextResponse.json(
            { success: false, error: 'Template ID is required' },
            { status: 400 }
          );
        }

        const template = defaultTemplates.find(t => t.id === templateId);
        if (!template) {
          return NextResponse.json(
            { success: false, error: 'Template not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          data: { template }
        });
      }

      case 'generate': {
        if (!templateId) {
          return NextResponse.json(
            { success: false, error: 'Template ID is required' },
            { status: 400 }
          );
        }

        const template = defaultTemplates.find(t => t.id === templateId);
        if (!template) {
          return NextResponse.json(
            { success: false, error: 'Template not found' },
            { status: 404 }
          );
        }

        const report = generateReport(template);
        
        return NextResponse.json({
          success: true,
          data: { report }
        });
      }

      case 'reports': {
        // Generate some sample reports
        const sampleReports = defaultTemplates.slice(0, 3).map(template => {
          const report = generateReport(template);
          return {
            ...report,
            generatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
          };
        });

        return NextResponse.json({
          success: true,
          data: {
            reports: sampleReports,
            summary: {
              total: sampleReports.length,
              lastWeek: sampleReports.filter(r => 
                new Date(r.generatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              ).length,
              scheduled: defaultTemplates.filter(t => t.frequency !== 'manual').length
            }
          }
        });
      }

      case 'report': {
        if (!reportId) {
          return NextResponse.json(
            { success: false, error: 'Report ID is required' },
            { status: 400 }
          );
        }

        // Generate a mock report for the requested ID
        const template = defaultTemplates[0]; // Use first template as example
        const report = generateReport(template);
        report.id = reportId;

        return NextResponse.json({
          success: true,
          data: { report }
        });
      }

      case 'metrics': {
        const availableMetrics = [
          { id: 'impressions', name: 'Impressions', category: 'reach', dataType: 'number' },
          { id: 'clicks', name: 'Clicks', category: 'engagement', dataType: 'number' },
          { id: 'conversions', name: 'Conversions', category: 'conversion', dataType: 'number' },
          { id: 'spend', name: 'Spend', category: 'cost', dataType: 'currency' },
          { id: 'revenue', name: 'Revenue', category: 'revenue', dataType: 'currency' },
          { id: 'ctr', name: 'Click-Through Rate', category: 'engagement', dataType: 'percentage' },
          { id: 'cpc', name: 'Cost Per Click', category: 'cost', dataType: 'currency' },
          { id: 'cpa', name: 'Cost Per Acquisition', category: 'cost', dataType: 'currency' },
          { id: 'roas', name: 'Return on Ad Spend', category: 'revenue', dataType: 'ratio' },
          { id: 'roi', name: 'Return on Investment', category: 'revenue', dataType: 'percentage' }
        ];

        return NextResponse.json({
          success: true,
          data: {
            metrics: availableMetrics,
            categories: [...new Set(availableMetrics.map(m => m.category))]
          }
        });
      }

      default: {
        return NextResponse.json({
          success: true,
          data: {
            overview: {
              totalTemplates: defaultTemplates.length,
              activeTemplates: defaultTemplates.filter(t => t.isActive).length,
              scheduledReports: defaultTemplates.filter(t => t.frequency !== 'manual').length,
              lastGenerated: Math.max(...defaultTemplates.map(t => 
                t.lastGenerated ? new Date(t.lastGenerated).getTime() : 0
              ))
            },
            recentActivity: defaultTemplates
              .filter(t => t.lastGenerated)
              .sort((a, b) => new Date(b.lastGenerated!).getTime() - new Date(a.lastGenerated!).getTime())
              .slice(0, 5)
              .map(t => ({
                id: t.id,
                name: t.name,
                generated: t.lastGenerated,
                format: t.format
              }))
          }
        });
      }
    }

  } catch (error) {
    console.error('Error in report builder API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process report request' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, templateData, reportId } = body;

    switch (action) {
      case 'create_template': {
        const newTemplate: ReportTemplate = {
          id: `template_${Date.now()}`,
          ...templateData,
          createdAt: new Date().toISOString(),
          isActive: true
        };

        return NextResponse.json({
          success: true,
          message: 'Report template created successfully',
          data: { template: newTemplate }
        });
      }

      case 'update_template': {
        const { templateId, updates } = body;
        
        return NextResponse.json({
          success: true,
          message: 'Report template updated successfully',
          data: { templateId, updates }
        });
      }

      case 'schedule_report': {
        const { templateId, schedule } = body;
        
        return NextResponse.json({
          success: true,
          message: 'Report scheduled successfully',
          data: { templateId, schedule }
        });
      }

      case 'export_report': {
        const { reportId, format } = body;
        
        return NextResponse.json({
          success: true,
          message: 'Report export initiated',
          data: {
            reportId,
            format,
            downloadUrl: `/api/reports/download/${reportId}`,
            estimatedTime: '2-3 minutes'
          }
        });
      }

      default: {
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
      }
    }

  } catch (error) {
    console.error('Error in report builder POST:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}