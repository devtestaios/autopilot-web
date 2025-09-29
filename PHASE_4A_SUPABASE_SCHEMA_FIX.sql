-- ====================================================================
-- PHASE 4A SUPABASE SCHEMA FIX - PostgreSQL Index Issue Resolution
-- ====================================================================
-- Execute these SQL commands in your Supabase SQL Editor to fix the index issue

-- ====================================================================
-- 1. SIMPLE SOLUTION: Remove Problematic Index
-- ====================================================================

-- The problematic index with NOW() in WHERE clause causes issues
-- We'll remove it and use application-level filtering instead

-- Remove the problematic index if it exists
DROP INDEX IF EXISTS idx_forecasts_active;

-- ====================================================================
-- 2. CREATE WORKING INDEXES
-- ====================================================================

-- Create the other indexes that work fine
CREATE INDEX IF NOT EXISTS idx_forecasts_campaign_type 
ON ai_campaign_forecasts(campaign_id, forecast_type);

CREATE INDEX IF NOT EXISTS idx_forecasts_horizon 
ON ai_campaign_forecasts(forecast_horizon, base_date DESC);

-- Create a simple expires_at index for efficient filtering
CREATE INDEX IF NOT EXISTS idx_forecasts_expires_at 
ON ai_campaign_forecasts(expires_at DESC);

-- ====================================================================
-- 3. ALTERNATIVE: Use Fixed Date if Needed
-- ====================================================================

-- If you need an index for "active" forecasts, use a fixed future date
-- This example assumes forecasts are active if they expire after 2025-01-01
-- You can adjust this date as needed for your use case

-- CREATE INDEX IF NOT EXISTS idx_forecasts_recent 
-- ON ai_campaign_forecasts(expires_at) 
-- WHERE expires_at > '2025-01-01T00:00:00+00:00';

-- ====================================================================
-- 4. APPLICATION-LEVEL FILTERING APPROACH
-- ====================================================================

-- Instead of using a partial index with NOW(), your application can filter active forecasts like this:
-- SELECT * FROM ai_campaign_forecasts WHERE expires_at > NOW();
-- 
-- This approach:
-- 1. Uses the idx_forecasts_expires_at index for efficient sorting
-- 2. Applies the NOW() filter at query time (which is fine in WHERE clauses)
-- 3. Avoids the immutable function issue in index definitions

-- ====================================================================
-- 5. VERIFICATION QUERIES
-- ====================================================================

-- Check that indexes were created successfully
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'ai_campaign_forecasts'
ORDER BY indexname;

-- Test query performance for active forecasts
-- EXPLAIN ANALYZE SELECT * FROM ai_campaign_forecasts WHERE expires_at > NOW();

-- ====================================================================
-- COMPLETION MESSAGE
-- ====================================================================

DO $$
BEGIN
  RAISE NOTICE '🔧 PHASE 4A SUPABASE SCHEMA FIX COMPLETE!';
  RAISE NOTICE '✅ Problematic NOW() index removed';
  RAISE NOTICE '✅ Working indexes created: campaign_type, horizon, expires_at';
  RAISE NOTICE '✅ Use application-level filtering: WHERE expires_at > NOW()';
  RAISE NOTICE '✅ All AI capability tables and indexes are now functional!';
  RAISE NOTICE '';
  RAISE NOTICE '� For active forecasts, use: SELECT * FROM ai_campaign_forecasts WHERE expires_at > NOW()';
  RAISE NOTICE '🚀 Your PulseBridge.ai AI database is ready for use!';
END $$;