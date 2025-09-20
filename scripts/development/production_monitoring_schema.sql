-- =====================================================================================
-- AUTOPILOT PRODUCTION FEATURES & MONITORING DATABASE SCHEMA
-- =====================================================================================
-- Purpose: Enterprise-grade monitoring, alerting, and operational infrastructure
-- Features: System health, alert management, audit logs, notifications, performance tracking
-- Created: September 2025
-- =====================================================================================

-- =====================================================================================
-- 1. SYSTEM HEALTH MONITORING TABLE
-- =====================================================================================
-- Purpose: Track system performance, uptime, and health metrics
CREATE TABLE IF NOT EXISTS system_health_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  service_name TEXT NOT NULL, -- 'frontend', 'backend', 'database', 'google_ads_api', etc.
  status TEXT NOT NULL, -- 'healthy', 'degraded', 'unhealthy', 'offline'
  response_time_ms INTEGER, -- Response time in milliseconds
  cpu_usage DECIMAL(5,2), -- CPU usage percentage
  memory_usage DECIMAL(5,2), -- Memory usage percentage
  error_rate DECIMAL(5,2), -- Error rate percentage
  uptime_percentage DECIMAL(5,2), -- Service uptime percentage
  metadata JSONB, -- Additional service-specific metrics
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_system_health_timestamp ON system_health_metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_system_health_service ON system_health_metrics(service_name);
CREATE INDEX IF NOT EXISTS idx_system_health_status ON system_health_metrics(status);

-- =====================================================================================
-- 2. ALERT MANAGEMENT SYSTEM
-- =====================================================================================
-- Purpose: Manage intelligent alerts, notifications, and escalation policies
CREATE TABLE IF NOT EXISTS alert_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL, -- 'performance', 'budget', 'error_rate', 'uptime', 'custom'
  trigger_condition JSONB NOT NULL, -- Condition logic (thresholds, operators, etc.)
  severity TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  notification_channels JSONB, -- Array of notification methods
  escalation_policy JSONB, -- Escalation rules and timeouts
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alert instances for tracking triggered alerts
CREATE TABLE IF NOT EXISTS alert_instances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_rule_id UUID REFERENCES alert_rules(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'triggered', -- 'triggered', 'acknowledged', 'resolved', 'escalated'
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB, -- Context data that triggered the alert
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  escalated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for alert management
CREATE INDEX IF NOT EXISTS idx_alert_instances_status ON alert_instances(status);
CREATE INDEX IF NOT EXISTS idx_alert_instances_severity ON alert_instances(severity);
CREATE INDEX IF NOT EXISTS idx_alert_instances_triggered ON alert_instances(triggered_at DESC);

-- =====================================================================================
-- 3. AUDIT TRAIL & ACTIVITY LOGGING
-- =====================================================================================
-- Purpose: Comprehensive audit trail for all system activities and changes
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout', 'sync', etc.
  resource_type TEXT NOT NULL, -- 'campaign', 'alert_rule', 'user', 'system', etc.
  resource_id TEXT, -- ID of the affected resource
  changes JSONB, -- Before/after data for updates
  metadata JSONB, -- Additional context (IP, user agent, etc.)
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  severity TEXT DEFAULT 'info' -- 'info', 'warning', 'error', 'critical'
);

-- Indexes for audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- =====================================================================================
-- 4. NOTIFICATION DELIVERY TRACKING
-- =====================================================================================
-- Purpose: Track notification delivery status and preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  push_enabled BOOLEAN DEFAULT true,
  webhook_enabled BOOLEAN DEFAULT false,
  email_address TEXT,
  phone_number TEXT,
  webhook_url TEXT,
  notification_types JSONB, -- Array of notification types user wants to receive
  quiet_hours JSONB, -- Start/end times for quiet hours
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification delivery log
CREATE TABLE IF NOT EXISTS notification_deliveries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_instance_id UUID REFERENCES alert_instances(id),
  user_id UUID REFERENCES auth.users(id),
  channel TEXT NOT NULL, -- 'email', 'sms', 'push', 'webhook'
  recipient TEXT NOT NULL, -- Email address, phone number, webhook URL
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed', 'bounced'
  message_content TEXT,
  error_message TEXT,
  attempts INTEGER DEFAULT 0,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for notification tracking
CREATE INDEX IF NOT EXISTS idx_notification_deliveries_status ON notification_deliveries(status);
CREATE INDEX IF NOT EXISTS idx_notification_deliveries_sent ON notification_deliveries(sent_at DESC);

-- =====================================================================================
-- 5. PERFORMANCE OPTIMIZATION & CACHING
-- =====================================================================================
-- Purpose: Track performance metrics and cache effectiveness
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL, -- 'page_load_time', 'api_response_time', 'cache_hit_rate', etc.
  metric_value DECIMAL(10,4) NOT NULL,
  unit TEXT, -- 'ms', 'seconds', 'percentage', 'bytes', etc.
  context JSONB, -- Additional context (page, endpoint, user agent, etc.)
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cache performance tracking
CREATE TABLE IF NOT EXISTS cache_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key TEXT NOT NULL,
  operation TEXT NOT NULL, -- 'hit', 'miss', 'set', 'delete', 'expire'
  size_bytes INTEGER,
  ttl_seconds INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance analysis
CREATE INDEX IF NOT EXISTS idx_performance_metrics_name ON performance_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_cache_metrics_key ON cache_metrics(cache_key);
CREATE INDEX IF NOT EXISTS idx_cache_metrics_operation ON cache_metrics(operation);

-- =====================================================================================
-- 6. SYSTEM CONFIGURATION & FEATURE FLAGS
-- =====================================================================================
-- Purpose: Manage system configuration and feature rollouts
CREATE TABLE IF NOT EXISTS system_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,
  is_sensitive BOOLEAN DEFAULT false, -- For secrets/API keys
  environment TEXT DEFAULT 'production', -- 'development', 'staging', 'production'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Feature flags for gradual rollouts
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flag_name TEXT UNIQUE NOT NULL,
  is_enabled BOOLEAN DEFAULT false,
  rollout_percentage DECIMAL(5,2) DEFAULT 0, -- 0-100 percentage for gradual rollout
  target_users JSONB, -- Array of specific user IDs or criteria
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================================================
-- Enable RLS on all tables
ALTER TABLE system_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE cache_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing all operations for now, adjust based on auth requirements)
CREATE POLICY "Allow all on system_health_metrics" ON system_health_metrics FOR ALL USING (true);
CREATE POLICY "Allow all on alert_rules" ON alert_rules FOR ALL USING (true);
CREATE POLICY "Allow all on alert_instances" ON alert_instances FOR ALL USING (true);
CREATE POLICY "Allow all on audit_logs" ON audit_logs FOR ALL USING (true);
CREATE POLICY "Allow all on notification_preferences" ON notification_preferences FOR ALL USING (true);
CREATE POLICY "Allow all on notification_deliveries" ON notification_deliveries FOR ALL USING (true);
CREATE POLICY "Allow all on performance_metrics" ON performance_metrics FOR ALL USING (true);
CREATE POLICY "Allow all on cache_metrics" ON cache_metrics FOR ALL USING (true);
CREATE POLICY "Allow all on system_config" ON system_config FOR ALL USING (true);
CREATE POLICY "Allow all on feature_flags" ON feature_flags FOR ALL USING (true);

-- =====================================================================================
-- SAMPLE DATA FOR DEVELOPMENT & TESTING
-- =====================================================================================

-- Sample system health metrics
INSERT INTO system_health_metrics (service_name, status, response_time_ms, cpu_usage, memory_usage, error_rate, uptime_percentage, metadata) VALUES
('frontend', 'healthy', 234, 12.5, 45.2, 0.1, 99.95, '{"version": "1.0.0", "deployment": "vercel"}'),
('backend', 'healthy', 89, 8.3, 32.1, 0.05, 99.98, '{"version": "1.0.0", "deployment": "render"}'),
('database', 'healthy', 45, 15.2, 28.7, 0.02, 99.99, '{"version": "PostgreSQL 15", "provider": "supabase"}'),
('google_ads_api', 'degraded', 1234, NULL, NULL, 2.1, 98.5, '{"rate_limit_remaining": 85, "quota_usage": "67%"}');

-- Sample alert rules
INSERT INTO alert_rules (name, description, trigger_type, trigger_condition, severity, notification_channels, escalation_policy, is_active) VALUES
('High Error Rate', 'Alert when error rate exceeds 5%', 'error_rate', '{"threshold": 5, "operator": "greater_than", "duration_minutes": 5}', 'high', '["email", "push"]', '{"escalate_after_minutes": 15, "escalate_to": "on_call_engineer"}', true),
('Budget Threshold', 'Alert when campaign spend approaches budget limit', 'budget', '{"threshold_percentage": 90, "operator": "greater_than"}', 'medium', '["email"]', '{"escalate_after_minutes": 30}', true),
('System Downtime', 'Alert when service becomes unavailable', 'uptime', '{"threshold": 95, "operator": "less_than", "duration_minutes": 2}', 'critical', '["email", "sms", "push"]', '{"escalate_after_minutes": 5, "escalate_to": "management"}', true),
('Poor Performance', 'Alert when response time is consistently slow', 'performance', '{"threshold_ms": 2000, "operator": "greater_than", "duration_minutes": 10}', 'medium', '["push"]', '{"escalate_after_minutes": 20}', true);

-- Sample notification preferences
INSERT INTO notification_preferences (user_id, email_enabled, sms_enabled, push_enabled, email_address, notification_types, quiet_hours) VALUES
('550e8400-e29b-41d4-a716-446655440000', true, false, true, 'admin@pulsebridge.ai', '["critical", "high", "medium"]', '{"start": "22:00", "end": "08:00", "timezone": "UTC"}');

-- Sample performance metrics
INSERT INTO performance_metrics (metric_name, metric_value, unit, context) VALUES
('page_load_time', 1.234, 'seconds', '{"page": "/dashboard", "user_agent": "Chrome", "device": "desktop"}'),
('api_response_time', 89.5, 'ms', '{"endpoint": "/campaigns", "method": "GET"}'),
('cache_hit_rate', 94.2, 'percentage', '{"cache_type": "redis", "period": "1h"}'),
('database_query_time', 23.1, 'ms', '{"query_type": "SELECT", "table": "campaigns"}');

-- Sample system configuration
INSERT INTO system_config (config_key, config_value, description, environment) VALUES
('max_campaigns_per_user', '100', 'Maximum number of campaigns a user can create', 'production'),
('alert_cooldown_minutes', '15', 'Minimum time between similar alerts', 'production'),
('cache_ttl_seconds', '300', 'Default cache time-to-live', 'production'),
('maintenance_mode', 'false', 'Whether the system is in maintenance mode', 'production');

-- Sample feature flags
INSERT INTO feature_flags (flag_name, is_enabled, rollout_percentage, description) VALUES
('advanced_analytics_v2', true, 100.0, 'New advanced analytics dashboard'),
('ai_content_generation', true, 85.0, 'AI-powered content generation feature'),
('real_time_notifications', false, 0.0, 'Real-time push notifications'),
('beta_google_ads_sync', true, 25.0, 'Beta Google Ads real-time sync feature');

-- =====================================================================================
-- HELPFUL VIEWS FOR MONITORING DASHBOARD
-- =====================================================================================

-- System health overview view
CREATE OR REPLACE VIEW system_health_overview AS
SELECT 
  service_name,
  status,
  AVG(response_time_ms) as avg_response_time,
  AVG(cpu_usage) as avg_cpu_usage,
  AVG(memory_usage) as avg_memory_usage,
  AVG(error_rate) as avg_error_rate,
  AVG(uptime_percentage) as avg_uptime,
  COUNT(*) as metric_count,
  MAX(timestamp) as last_updated
FROM system_health_metrics 
WHERE timestamp >= NOW() - INTERVAL '1 hour'
GROUP BY service_name, status
ORDER BY service_name;

-- Active alerts summary
CREATE OR REPLACE VIEW active_alerts_summary AS
SELECT 
  severity,
  COUNT(*) as alert_count,
  COUNT(CASE WHEN acknowledged_at IS NULL THEN 1 END) as unacknowledged_count,
  MIN(triggered_at) as oldest_alert,
  MAX(triggered_at) as newest_alert
FROM alert_instances 
WHERE status IN ('triggered', 'acknowledged', 'escalated')
GROUP BY severity
ORDER BY 
  CASE severity 
    WHEN 'critical' THEN 1 
    WHEN 'high' THEN 2 
    WHEN 'medium' THEN 3 
    WHEN 'low' THEN 4 
  END;

-- Performance trends view
CREATE OR REPLACE VIEW performance_trends AS
SELECT 
  metric_name,
  DATE_TRUNC('hour', timestamp) as hour,
  AVG(metric_value) as avg_value,
  MIN(metric_value) as min_value,
  MAX(metric_value) as max_value,
  COUNT(*) as sample_count
FROM performance_metrics 
WHERE timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY metric_name, DATE_TRUNC('hour', timestamp)
ORDER BY metric_name, hour;

-- =====================================================================================
-- COMPLETION MESSAGE
-- =====================================================================================
-- Production monitoring schema created successfully!
-- 
-- Features included:
-- ✅ System health monitoring with real-time metrics
-- ✅ Intelligent alert management with escalation policies  
-- ✅ Comprehensive audit trail and activity logging
-- ✅ Notification delivery tracking and preferences
-- ✅ Performance metrics and cache optimization
-- ✅ System configuration and feature flag management
-- ✅ Sample data for immediate testing
-- ✅ Optimized indexes for query performance
-- ✅ Row Level Security policies enabled
-- ✅ Helpful views for monitoring dashboard
--
-- Next steps:
-- 1. Execute this schema in Supabase SQL Editor
-- 2. Implement FastAPI backend endpoints
-- 3. Build monitoring dashboard UI components
-- 4. Set up alert notification system
-- =====================================================================================