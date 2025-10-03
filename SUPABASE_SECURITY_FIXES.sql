-- 🔒 SUPABASE SECURITY FIXES
-- Addresses Supabase linter warnings for enhanced security
-- October 3, 2025

-- ===== FIX 1: FUNCTION SEARCH PATH SECURITY =====
-- Fix function_search_path_mutable warnings by setting SECURITY DEFINER with immutable search_path

-- Drop and recreate increment_install_count function with secure search_path
DROP FUNCTION IF EXISTS public.increment_install_count(UUID);

CREATE OR REPLACE FUNCTION public.increment_install_count(app_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE integration_apps 
    SET install_count = install_count + 1,
        updated_at = NOW()
    WHERE id = app_id;
END;
$$;

-- Drop and recreate calculate_ai_performance_score function with secure search_path  
DROP FUNCTION IF EXISTS public.calculate_ai_performance_score(UUID);

CREATE OR REPLACE FUNCTION public.calculate_ai_performance_score(campaign_id UUID)
RETURNS decimal
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    score decimal := 0;
    open_rate decimal;
    click_rate decimal;
BEGIN
    -- Calculate performance score based on email campaign metrics
    SELECT 
        COALESCE((clicks::decimal / NULLIF(delivered, 0)) * 100, 0),
        COALESCE((opens::decimal / NULLIF(delivered, 0)) * 100, 0)
    INTO click_rate, open_rate
    FROM email_campaigns 
    WHERE id = campaign_id;
    
    -- Simple scoring algorithm: weighted average of open and click rates
    score := (open_rate * 0.4) + (click_rate * 0.6);
    
    RETURN COALESCE(score, 0);
END;
$$;

-- ===== FIX 2: MOVE EXTENSIONS TO DEDICATED SCHEMA =====
-- Create extensions schema and move extensions there

-- Create dedicated schema for extensions
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move uuid-ossp extension to extensions schema
DROP EXTENSION IF EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Move pgcrypto extension to extensions schema  
DROP EXTENSION IF EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;

-- Grant usage on extensions schema to public
GRANT USAGE ON SCHEMA extensions TO public;

-- Update any existing table defaults to use the new schema path
-- (This handles the uuid_generate_v4() function calls in existing tables)
DO $$
DECLARE
    table_record RECORD;
    column_record RECORD;
BEGIN
    -- Update all tables that use uuid_generate_v4() as default
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
    LOOP
        FOR column_record IN
            SELECT column_name, column_default
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = table_record.table_name
            AND column_default LIKE '%uuid_generate_v4%'
        LOOP
            -- Update the default to use the extensions schema
            EXECUTE format('ALTER TABLE %I ALTER COLUMN %I SET DEFAULT extensions.uuid_generate_v4()', 
                          table_record.table_name, column_record.column_name);
        END LOOP;
    END LOOP;
END $$;

-- ===== VERIFICATION QUERIES =====
-- Run these to verify the fixes worked

-- Check function search_path settings
SELECT 
    proname as function_name,
    prosecdef as security_definer,
    proconfig as config_settings
FROM pg_proc 
WHERE proname IN ('increment_install_count', 'calculate_ai_performance_score')
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- Check extension locations
SELECT 
    e.extname as extension_name,
    n.nspname as schema_name
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE e.extname IN ('uuid-ossp', 'pgcrypto');

-- Verify uuid generation still works
SELECT extensions.uuid_generate_v4() as test_uuid;

-- ===== REFRESH SCHEMA CACHE =====
SELECT pg_notify('pgrst', 'reload schema');

-- Success message
SELECT 'Security fixes applied successfully! Functions secured and extensions moved to dedicated schema.' AS result;