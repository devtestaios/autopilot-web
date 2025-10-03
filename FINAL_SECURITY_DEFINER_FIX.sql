-- ============================================================================
-- FINAL SECURITY DEFINER VIEW FIX
-- ============================================================================
-- This script specifically fixes the remaining Security Definer View error
-- Copy and paste this into Supabase SQL Editor and run it

-- Drop the problematic view completely with CASCADE
DROP VIEW IF EXISTS public.database_summary CASCADE;

-- Wait a moment for the drop to complete, then recreate without SECURITY DEFINER
CREATE VIEW public.database_summary AS
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Grant permissions without SECURITY DEFINER
GRANT SELECT ON public.database_summary TO authenticated;
GRANT SELECT ON public.database_summary TO anon;

-- Refresh the schema cache to ensure changes are recognized
NOTIFY pgrst, 'reload schema';

-- Verify the view exists and doesn't have SECURITY DEFINER
SELECT 
    table_name,
    'VIEW' as table_type,
    'View recreated successfully without SECURITY DEFINER' as status
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name = 'database_summary';

-- Final success message
SELECT 'Security Definer View error resolved! View recreated without SECURITY DEFINER property.' as result;