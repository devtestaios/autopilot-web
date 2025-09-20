-- Automation Rules Schema for PulseBridge.ai
-- Execute these commands in Supabase SQL Editor

-- Create automation_rules table
CREATE TABLE automation_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  rule_type TEXT NOT NULL, -- 'budget_optimization', 'performance_trigger', 'auto_pause', 'bid_adjustment'
  conditions JSONB NOT NULL, -- Trigger conditions (CTR < 0.02, spend > budget * 0.8, etc.)
  actions JSONB NOT NULL, -- Actions to take (pause, adjust_budget, adjust_bid, send_alert)
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 1, -- Higher number = higher priority
  last_triggered TIMESTAMP WITH TIME ZONE,
  trigger_count INTEGER DEFAULT 0,
  created_by UUID, -- Reference to auth.users if using Supabase Auth
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create automation_logs table for tracking rule executions
CREATE TABLE automation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_id UUID REFERENCES automation_rules(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  action_taken TEXT NOT NULL,
  conditions_met JSONB,
  results JSONB, -- What actually happened (budget changed from X to Y, etc.)
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaign_snapshots table for historical tracking
CREATE TABLE campaign_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  snapshot_data JSONB NOT NULL, -- Full campaign state at time of snapshot
  snapshot_type TEXT NOT NULL, -- 'scheduled', 'before_automation', 'after_automation'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_snapshots ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (adjust based on auth requirements)
CREATE POLICY "Allow all on automation_rules" ON automation_rules FOR ALL USING (true);
CREATE POLICY "Allow all on automation_logs" ON automation_logs FOR ALL USING (true);
CREATE POLICY "Allow all on campaign_snapshots" ON campaign_snapshots FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX idx_automation_rules_campaign_id ON automation_rules(campaign_id);
CREATE INDEX idx_automation_rules_rule_type ON automation_rules(rule_type);
CREATE INDEX idx_automation_rules_is_active ON automation_rules(is_active);
CREATE INDEX idx_automation_logs_rule_id ON automation_logs(rule_id);
CREATE INDEX idx_automation_logs_campaign_id ON automation_logs(campaign_id);
CREATE INDEX idx_automation_logs_triggered_at ON automation_logs(triggered_at);
CREATE INDEX idx_campaign_snapshots_campaign_id ON campaign_snapshots(campaign_id);

-- Sample automation rule data
INSERT INTO automation_rules (name, description, rule_type, conditions, actions) VALUES
('Auto-Pause Low CTR Campaigns', 'Automatically pause campaigns with CTR below 1% after 1000 impressions', 'performance_trigger', 
 '{"ctr_threshold": 0.01, "min_impressions": 1000, "evaluation_period": "24h"}',
 '{"action": "pause_campaign", "send_alert": true, "alert_message": "Campaign paused due to low CTR"}'),

('Budget Overrun Protection', 'Pause campaign when spend exceeds 90% of daily budget', 'budget_optimization',
 '{"spend_threshold_percentage": 0.9, "budget_type": "daily"}',
 '{"action": "pause_campaign", "send_alert": true, "alert_message": "Campaign paused - budget threshold exceeded"}'),

('High-Performance Bid Increase', 'Increase bids by 15% for campaigns with CTR > 3% and CPA below target', 'bid_adjustment',
 '{"ctr_threshold": 0.03, "cpa_below_target": true, "min_conversions": 5}',
 '{"action": "increase_bid", "adjustment_percentage": 0.15, "max_bid_limit": 10.00}'),

('Underperforming Keyword Pause', 'Pause keywords with 0 conversions after 500 clicks', 'performance_trigger',
 '{"min_clicks": 500, "max_conversions": 0, "evaluation_period": "7d"}',
 '{"action": "pause_keywords", "send_alert": true}');