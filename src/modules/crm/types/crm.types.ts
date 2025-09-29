// CRM Type Definitions
// Comprehensive type system for the Unified CRM Platform Suite

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  position?: string;
  score: number;
  stage: LeadStage;
  lastActivity: string;
  value: number;
  source: LeadSource;
  probability: number;
  assignedTo?: string;
  tags: string[];
  customFields: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  activities: Activity[];
  notes: Note[];
}

export type LeadStage = 
  | 'lead' 
  | 'qualified' 
  | 'nurturing' 
  | 'discovery' 
  | 'proposal' 
  | 'negotiation' 
  | 'closing' 
  | 'won' 
  | 'lost';

export type LeadSource = 
  | 'Website' 
  | 'LinkedIn' 
  | 'Google Ads' 
  | 'Facebook' 
  | 'Email Campaign' 
  | 'Referral' 
  | 'Cold Outreach' 
  | 'Trade Show' 
  | 'Webinar'
  | 'Other';

export interface Activity {
  id: string;
  leadId: string;
  type: ActivityType;
  description: string;
  timestamp: Date;
  userId?: string;
  metadata?: Record<string, any>;
}

export type ActivityType = 
  | 'email_sent'
  | 'email_opened' 
  | 'email_clicked'
  | 'call_made'
  | 'call_received'
  | 'meeting_scheduled'
  | 'meeting_completed'
  | 'website_visit'
  | 'form_submitted'
  | 'document_downloaded'
  | 'proposal_sent'
  | 'contract_signed'
  | 'note_added'
  | 'stage_changed'
  | 'score_updated';

export interface Note {
  id: string;
  leadId: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  isPrivate: boolean;
}

export interface LeadScore {
  leadId: string;
  score: number;
  factors: ScoreFactor[];
  lastCalculated: Date;
  trend: 'up' | 'down' | 'stable';
}

export interface ScoreFactor {
  category: ScoreCategory;
  factor: string;
  weight: number;
  value: number;
  impact: number;
}

export type ScoreCategory = 
  | 'demographic'
  | 'behavioral' 
  | 'engagement'
  | 'company_fit'
  | 'intent_signals'
  | 'social_signals';

export interface CustomerJourney {
  leadId: string;
  stages: JourneyStage[];
  currentStage: string;
  progression: JourneyProgression[];
  totalDuration: number; // in days
  stagesDuration: Record<string, number>;
  touchpoints: Touchpoint[];
}

export interface JourneyStage {
  stage: string;
  name: string;
  description: string;
  leads: number;
  conversion: number;
  avgDuration: number; // in days
  dropOffReasons?: string[];
}

export interface JourneyProgression {
  fromStage: string;
  toStage: string;
  timestamp: Date;
  trigger?: string;
  duration: number; // time spent in previous stage
}

export interface Touchpoint {
  id: string;
  leadId: string;
  channel: TouchpointChannel;
  type: string;
  timestamp: Date;
  engagement: EngagementMetrics;
  attribution: number; // contribution to conversion (0-1)
}

export type TouchpointChannel = 
  | 'email'
  | 'phone'
  | 'website'
  | 'social_media'
  | 'advertising'
  | 'direct_mail'
  | 'webinar'
  | 'trade_show'
  | 'referral';

export interface EngagementMetrics {
  duration?: number; // in seconds
  clicks?: number;
  opens?: number;
  responses?: number;
  shares?: number;
  downloads?: number;
}

export interface CRMIntegration {
  id: string;
  name: string;
  provider: CRMProvider;
  status: IntegrationStatus;
  lastSync: Date;
  syncFrequency: SyncFrequency;
  recordCount: number;
  config: CRMConfig;
  errors: IntegrationError[];
  fieldMappings: FieldMapping[];
}

export type CRMProvider = 
  | 'salesforce'
  | 'hubspot'
  | 'pipedrive'
  | 'zoho'
  | 'microsoft_dynamics'
  | 'sugar_crm'
  | 'copper'
  | 'insightly'
  | 'freshworks'
  | 'monday';

export type IntegrationStatus = 
  | 'connected'
  | 'connecting'
  | 'disconnected'
  | 'error'
  | 'syncing'
  | 'pending_auth';

export type SyncFrequency = 
  | 'real_time'
  | '15_minutes'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'manual';

export interface CRMConfig {
  apiKey?: string;
  apiSecret?: string;
  domain?: string;
  refreshToken?: string;
  accessToken?: string;
  instanceUrl?: string;
  userId?: string;
  customSettings: Record<string, any>;
}

export interface IntegrationError {
  id: string;
  timestamp: Date;
  type: ErrorType;
  message: string;
  details?: Record<string, any>;
  resolved: boolean;
  resolvedAt?: Date;
}

export type ErrorType = 
  | 'auth_failed'
  | 'api_limit_exceeded'
  | 'invalid_data'
  | 'network_error'
  | 'mapping_error'
  | 'sync_conflict'
  | 'permission_denied';

export interface FieldMapping {
  localField: string;
  remoteField: string;
  direction: MappingDirection;
  transform?: string; // transformation function name
  required: boolean;
}

export type MappingDirection = 'import' | 'export' | 'bidirectional';

export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
  leads: Lead[];
  totalValue: number;
  conversionRate: number;
  avgDealSize: number;
  avgSalesCycle: number; // in days
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  probability: number;
  color: string;
  leads: Lead[];
  value: number;
  avgDuration: number; // in days
}

export interface SalesMetrics {
  period: TimePeriod;
  totalLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  totalValue: number;
  avgDealSize: number;
  conversionRate: number;
  avgSalesCycle: number;
  topSources: SourceMetrics[];
  stageMetrics: StageMetrics[];
}

export interface SourceMetrics {
  source: LeadSource;
  leads: number;
  conversionRate: number;
  avgValue: number;
  costPerLead?: number;
  roi?: number;
}

export interface StageMetrics {
  stage: LeadStage;
  leads: number;
  conversionRate: number;
  avgDuration: number;
  dropOffRate: number;
}

export type TimePeriod = 
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'last_week'
  | 'this_month'
  | 'last_month'
  | 'this_quarter'
  | 'last_quarter'
  | 'this_year'
  | 'last_year'
  | 'custom';

export interface AIInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  confidence: number; // 0-1
  impact: InsightImpact;
  actionable: boolean;
  recommendations: string[];
  data: Record<string, any>;
  createdAt: Date;
  expiresAt?: Date;
}

export type InsightType = 
  | 'lead_quality'
  | 'conversion_opportunity'
  | 'stage_bottleneck'
  | 'source_performance'
  | 'engagement_pattern'
  | 'churn_risk'
  | 'upsell_opportunity'
  | 'timing_optimization';

export type InsightImpact = 'low' | 'medium' | 'high' | 'critical';

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  isActive: boolean;
  createdAt: Date;
  lastExecuted?: Date;
  executionCount: number;
}

export interface AutomationTrigger {
  type: TriggerType;
  config: Record<string, any>;
}

export type TriggerType = 
  | 'lead_created'
  | 'lead_updated'
  | 'stage_changed'
  | 'score_changed'
  | 'activity_logged'
  | 'time_based'
  | 'inactivity'
  | 'field_updated';

export interface AutomationCondition {
  field: string;
  operator: ConditionOperator;
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export type ConditionOperator = 
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'less_than'
  | 'contains'
  | 'not_contains'
  | 'in'
  | 'not_in'
  | 'is_empty'
  | 'is_not_empty'
  | 'regex';

export interface AutomationAction {
  type: ActionType;
  config: Record<string, any>;
  delay?: number; // in minutes
}

export type ActionType = 
  | 'update_field'
  | 'change_stage'
  | 'assign_to'
  | 'add_tag'
  | 'remove_tag'
  | 'send_email'
  | 'create_task'
  | 'add_note'
  | 'trigger_webhook'
  | 'calculate_score';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: ResponseMeta;
}

export interface ResponseMeta {
  total?: number;
  page?: number;
  limit?: number;
  hasMore?: boolean;
  filters?: Record<string, any>;
}

export interface ListResponse<T> extends ApiResponse<T[]> {
  meta: ResponseMeta;
}

// Search and Filter Types
export interface SearchParams {
  query?: string;
  filters?: FilterParams;
  sort?: SortParams;
  page?: number;
  limit?: number;
}

export interface FilterParams {
  stage?: LeadStage[];
  source?: LeadSource[];
  scoreRange?: [number, number];
  valueRange?: [number, number];
  assignedTo?: string[];
  tags?: string[];
  dateRange?: DateRange;
  customFields?: Record<string, any>;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

// Export/Import Types
export interface ExportOptions {
  format: ExportFormat;
  fields: string[];
  filters?: FilterParams;
  includeActivities?: boolean;
  includeNotes?: boolean;
}

export type ExportFormat = 'csv' | 'excel' | 'json' | 'pdf';

export interface ImportOptions {
  format: ImportFormat;
  mappings: Record<string, string>;
  skipDuplicates: boolean;
  updateExisting: boolean;
  validateData: boolean;
}

export type ImportFormat = 'csv' | 'excel' | 'json';

export interface ImportResult {
  total: number;
  imported: number;
  updated: number;
  skipped: number;
  errors: ImportError[];
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
  value: any;
}