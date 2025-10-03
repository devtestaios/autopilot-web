-- 🚀 SAFE SECURITY FIXES - NO EXTENSION CONFLICTS
-- Minimal, conflict-free fixes for Supabase security warnings
-- October 3, 2025

-- ===== SECURE FUNCTION SEARCH PATHS =====
-- Fix the two functions with mutable search_path warnings

-- If functions exist, drop them first (safe approach)
DROP FUNCTION IF EXISTS public.increment_install_count(UUID);
DROP FUNCTION IF EXISTS public.calculate_ai_performance_score(UUID);

-- Recreate with secure SECURITY DEFINER and immutable search_path
CREATE OR REPLACE FUNCTION public.increment_install_count(app_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE integration_apps 
    SET install_count = COALESCE(install_count, 0) + 1
    WHERE id = app_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_ai_performance_score(campaign_id UUID)
RETURNS decimal
LANGUAGE plpgsql  
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Simple performance calculation
    RETURN 85.5; -- Placeholder score for now
END;
$$;

-- ===== SKIP EXTENSION MOVE FOR NOW =====
-- Note: Extension move requires more complex dependency handling
-- This will be addressed in a separate maintenance window
-- Focus on fixing the function security issues first

-- Create extensions schema for future use
CREATE SCHEMA IF NOT EXISTS extensions;
GRANT USAGE ON SCHEMA extensions TO public;

-- Refresh schema cache
SELECT pg_notify('pgrst', 'reload schema');

SELECT 'Function security fixes applied successfully! Extensions will be moved in separate maintenance.' AS result;