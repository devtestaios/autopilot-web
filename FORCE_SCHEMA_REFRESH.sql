-- ============================================================================
-- FORCE SCHEMA CACHE REFRESH FOR AI ENDPOINTS
-- ============================================================================
-- Run this in Supabase SQL Editor to force schema cache refresh

-- Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- Wait a moment, then verify AI tables exist and are accessible
SELECT 
    table_name,
    'AI Table Available' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'master_ai_cycles',
    'ai_decision_logs', 
    'ai_performance_scores',
    'ai_smart_alerts',
    'ai_recommendations'
)
ORDER BY table_name;

-- Test basic table access
SELECT 
    COUNT(*) as total_ai_cycles,
    'Data accessible' as status
FROM public.master_ai_cycles;

-- Success message
SELECT 'Schema cache refreshed successfully!' as result;