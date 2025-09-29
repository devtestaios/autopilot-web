// CRM API Service
// Comprehensive API service for the Unified CRM Platform Suite

import { 
  Lead, 
  CustomerJourney, 
  CRMIntegration, 
  Pipeline,
  SalesMetrics,
  AIInsight,
  AutomationRule,
  LeadScore,
  Activity,
  Note,
  ApiResponse,
  ListResponse,
  SearchParams,
  ExportOptions,
  ImportOptions,
  ImportResult
} from '../types/crm.types';

const API_BASE = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com'
  : 'http://localhost:8000';

class APIError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = 'APIError';
  }
}

// Enhanced fetch with retry and error handling
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE}/api/v1/crm${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    cache: 'no-store',
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError('Network error: Unable to connect to CRM service', 0, 'NETWORK_ERROR');
    }
    
    throw new APIError(error instanceof Error ? error.message : 'Unknown error occurred');
  }
}

export class CRMApiService {
  // Lead Management
  static async getLeads(params: SearchParams = {}): Promise<ListResponse<Lead>> {
    const queryString = new URLSearchParams();
    
    if (params.query) queryString.append('query', params.query);
    if (params.page) queryString.append('page', params.page.toString());
    if (params.limit) queryString.append('limit', params.limit.toString());
    if (params.sort) {
      queryString.append('sortField', params.sort.field);
      queryString.append('sortDirection', params.sort.direction);
    }
    if (params.filters) {
      queryString.append('filters', JSON.stringify(params.filters));
    }

    const endpoint = `/leads${queryString.toString() ? `?${queryString}` : ''}`;
    return apiRequest<Lead[]>(endpoint);
  }

  static async getLead(id: string): Promise<ApiResponse<Lead>> {
    return apiRequest<Lead>(`/leads/${id}`);
  }

  static async createLead(lead: Partial<Lead>): Promise<ApiResponse<Lead>> {
    return apiRequest<Lead>('/leads', {
      method: 'POST',
      body: JSON.stringify(lead),
    });
  }

  static async updateLead(id: string, lead: Partial<Lead>): Promise<ApiResponse<Lead>> {
    return apiRequest<Lead>(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(lead),
    });
  }

  static async deleteLead(id: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/leads/${id}`, {
      method: 'DELETE',
    });
  }

  static async bulkUpdateLeads(ids: string[], updates: Partial<Lead>): Promise<ApiResponse<Lead[]>> {
    return apiRequest<Lead[]>('/leads/bulk-update', {
      method: 'PUT',
      body: JSON.stringify({ ids, updates }),
    });
  }

  // Lead Scoring
  static async calculateLeadScore(leadId: string): Promise<ApiResponse<LeadScore>> {
    return apiRequest<LeadScore>(`/leads/${leadId}/score`, {
      method: 'POST',
    });
  }

  static async getLeadScores(leadIds?: string[]): Promise<ListResponse<LeadScore>> {
    const endpoint = leadIds 
      ? `/scores?leadIds=${leadIds.join(',')}`
      : '/scores';
    return apiRequest<LeadScore[]>(endpoint);
  }

  static async updateScoringRules(rules: any): Promise<ApiResponse<void>> {
    return apiRequest<void>('/scoring/rules', {
      method: 'PUT',
      body: JSON.stringify(rules),
    });
  }

  // Activities and Notes
  static async getLeadActivities(leadId: string): Promise<ListResponse<Activity>> {
    return apiRequest<Activity[]>(`/leads/${leadId}/activities`);
  }

  static async addActivity(activity: Omit<Activity, 'id'>): Promise<ApiResponse<Activity>> {
    return apiRequest<Activity>('/activities', {
      method: 'POST',
      body: JSON.stringify(activity),
    });
  }

  static async getLeadNotes(leadId: string): Promise<ListResponse<Note>> {
    return apiRequest<Note[]>(`/leads/${leadId}/notes`);
  }

  static async addNote(note: Omit<Note, 'id' | 'createdAt'>): Promise<ApiResponse<Note>> {
    return apiRequest<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
  }

  static async updateNote(id: string, note: Partial<Note>): Promise<ApiResponse<Note>> {
    return apiRequest<Note>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(note),
    });
  }

  static async deleteNote(id: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/notes/${id}`, {
      method: 'DELETE',
    });
  }

  // Customer Journey
  static async getCustomerJourney(leadId: string): Promise<ApiResponse<CustomerJourney>> {
    return apiRequest<CustomerJourney>(`/leads/${leadId}/journey`);
  }

  static async getJourneyAnalytics(period: string = 'last_30_days'): Promise<ApiResponse<any>> {
    return apiRequest<any>(`/journey/analytics?period=${period}`);
  }

  static async getStageConversions(): Promise<ApiResponse<any>> {
    return apiRequest<any>('/journey/conversions');
  }

  // Pipelines
  static async getPipelines(): Promise<ListResponse<Pipeline>> {
    return apiRequest<Pipeline[]>('/pipelines');
  }

  static async getPipeline(id: string): Promise<ApiResponse<Pipeline>> {
    return apiRequest<Pipeline>(`/pipelines/${id}`);
  }

  static async createPipeline(pipeline: Omit<Pipeline, 'id'>): Promise<ApiResponse<Pipeline>> {
    return apiRequest<Pipeline>('/pipelines', {
      method: 'POST',
      body: JSON.stringify(pipeline),
    });
  }

  static async updatePipeline(id: string, pipeline: Partial<Pipeline>): Promise<ApiResponse<Pipeline>> {
    return apiRequest<Pipeline>(`/pipelines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pipeline),
    });
  }

  static async deletePipeline(id: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/pipelines/${id}`, {
      method: 'DELETE',
    });
  }

  // CRM Integrations
  static async getIntegrations(): Promise<ListResponse<CRMIntegration>> {
    return apiRequest<CRMIntegration[]>('/integrations');
  }

  static async getIntegration(id: string): Promise<ApiResponse<CRMIntegration>> {
    return apiRequest<CRMIntegration>(`/integrations/${id}`);
  }

  static async createIntegration(integration: Omit<CRMIntegration, 'id'>): Promise<ApiResponse<CRMIntegration>> {
    return apiRequest<CRMIntegration>('/integrations', {
      method: 'POST',
      body: JSON.stringify(integration),
    });
  }

  static async updateIntegration(id: string, integration: Partial<CRMIntegration>): Promise<ApiResponse<CRMIntegration>> {
    return apiRequest<CRMIntegration>(`/integrations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(integration),
    });
  }

  static async deleteIntegration(id: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/integrations/${id}`, {
      method: 'DELETE',
    });
  }

  static async testIntegration(id: string): Promise<ApiResponse<any>> {
    return apiRequest<any>(`/integrations/${id}/test`, {
      method: 'POST',
    });
  }

  static async syncIntegration(id: string): Promise<ApiResponse<any>> {
    return apiRequest<any>(`/integrations/${id}/sync`, {
      method: 'POST',
    });
  }

  static async getIntegrationLogs(id: string): Promise<ListResponse<any>> {
    return apiRequest<any[]>(`/integrations/${id}/logs`);
  }

  // Analytics and Metrics
  static async getSalesMetrics(period: string = 'this_month'): Promise<ApiResponse<SalesMetrics>> {
    return apiRequest<SalesMetrics>(`/analytics/sales?period=${period}`);
  }

  static async getLeadMetrics(period: string = 'this_month'): Promise<ApiResponse<any>> {
    return apiRequest<any>(`/analytics/leads?period=${period}`);
  }

  static async getConversionFunnel(period: string = 'this_month'): Promise<ApiResponse<any>> {
    return apiRequest<any>(`/analytics/funnel?period=${period}`);
  }

  static async getROIAnalysis(period: string = 'this_month'): Promise<ApiResponse<any>> {
    return apiRequest<any>(`/analytics/roi?period=${period}`);
  }

  static async getPerformanceTrends(period: string = 'last_90_days'): Promise<ApiResponse<any>> {
    return apiRequest<any>(`/analytics/trends?period=${period}`);
  }

  // AI Insights
  static async getAIInsights(leadId?: string): Promise<ListResponse<AIInsight>> {
    const endpoint = leadId ? `/insights?leadId=${leadId}` : '/insights';
    return apiRequest<AIInsight[]>(endpoint);
  }

  static async generateInsights(type?: string, targetId?: string): Promise<ApiResponse<AIInsight[]>> {
    return apiRequest<AIInsight[]>('/insights/generate', {
      method: 'POST',
      body: JSON.stringify({ type, targetId }),
    });
  }

  static async dismissInsight(id: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/insights/${id}/dismiss`, {
      method: 'POST',
    });
  }

  // Automation Rules
  static async getAutomationRules(): Promise<ListResponse<AutomationRule>> {
    return apiRequest<AutomationRule[]>('/automation/rules');
  }

  static async getAutomationRule(id: string): Promise<ApiResponse<AutomationRule>> {
    return apiRequest<AutomationRule>(`/automation/rules/${id}`);
  }

  static async createAutomationRule(rule: Omit<AutomationRule, 'id'>): Promise<ApiResponse<AutomationRule>> {
    return apiRequest<AutomationRule>('/automation/rules', {
      method: 'POST',
      body: JSON.stringify(rule),
    });
  }

  static async updateAutomationRule(id: string, rule: Partial<AutomationRule>): Promise<ApiResponse<AutomationRule>> {
    return apiRequest<AutomationRule>(`/automation/rules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(rule),
    });
  }

  static async deleteAutomationRule(id: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/automation/rules/${id}`, {
      method: 'DELETE',
    });
  }

  static async toggleAutomationRule(id: string, isActive: boolean): Promise<ApiResponse<AutomationRule>> {
    return apiRequest<AutomationRule>(`/automation/rules/${id}/toggle`, {
      method: 'PUT',
      body: JSON.stringify({ isActive }),
    });
  }

  static async testAutomationRule(id: string, testData: any): Promise<ApiResponse<any>> {
    return apiRequest<any>(`/automation/rules/${id}/test`, {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  }

  // Data Import/Export
  static async exportLeads(options: ExportOptions): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiRequest<{ downloadUrl: string }>('/export/leads', {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  static async importLeads(file: File, options: ImportOptions): Promise<ApiResponse<ImportResult>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('options', JSON.stringify(options));

    return apiRequest<ImportResult>('/import/leads', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type header for FormData
    });
  }

  static async validateImportData(file: File, options: ImportOptions): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('options', JSON.stringify(options));

    return apiRequest<any>('/import/validate', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type header for FormData
    });
  }

  // Search and Filters
  static async searchLeads(query: string, filters?: any): Promise<ListResponse<Lead>> {
    return apiRequest<Lead[]>('/search/leads', {
      method: 'POST',
      body: JSON.stringify({ query, filters }),
    });
  }

  static async getFilterOptions(): Promise<ApiResponse<any>> {
    return apiRequest<any>('/filters/options');
  }

  static async saveSearch(name: string, params: SearchParams): Promise<ApiResponse<any>> {
    return apiRequest<any>('/search/saved', {
      method: 'POST',
      body: JSON.stringify({ name, params }),
    });
  }

  static async getSavedSearches(): Promise<ListResponse<any>> {
    return apiRequest<any[]>('/search/saved');
  }

  // System Health
  static async getSystemHealth(): Promise<ApiResponse<any>> {
    return apiRequest<any>('/health');
  }

  static async getSystemMetrics(): Promise<ApiResponse<any>> {
    return apiRequest<any>('/metrics');
  }

  // Real-time Updates (WebSocket wrapper methods)
  static subscribeToLeadUpdates(leadId: string, callback: (data: any) => void): () => void {
    // WebSocket implementation would go here
    // For now, return empty unsubscribe function
    return () => {};
  }

  static subscribeToActivityFeed(callback: (data: any) => void): () => void {
    // WebSocket implementation would go here
    return () => {};
  }
}

export default CRMApiService;