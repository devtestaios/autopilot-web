-- ============================================================================
-- SIMPLE FUNCTION SEARCH PATH FIX - NO VERIFICATION QUERIES
-- ============================================================================
-- This script fixes function search_path warnings with minimal complexity
-- Copy and paste this into Supabase SQL Editor and run it

-- Drop ALL versions of problematic functions with CASCADE
DROP FUNCTION IF EXISTS public.increment_install_count() CASCADE;
DROP FUNCTION IF EXISTS public.increment_install_count(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.increment_install_count(INTEGER) CASCADE;

DROP FUNCTION IF EXISTS public.calculate_ai_performance_score() CASCADE;
DROP FUNCTION IF EXISTS public.calculate_ai_performance_score(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS public.calculate_ai_performance_score(INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS public.calculate_ai_performance_score(INTEGER, INTEGER, FLOAT) CASCADE;

DROP FUNCTION IF EXISTS public.get_performance_grade() CASCADE;
DROP FUNCTION IF EXISTS public.get_performance_grade(FLOAT) CASCADE;
DROP FUNCTION IF EXISTS public.get_performance_grade(INTEGER) CASCADE;

DROP FUNCTION IF EXISTS public.cleanup_ai_data() CASCADE;

-- Recreate increment_install_count with search_path
CREATE OR REPLACE FUNCTION public.increment_install_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.install_count = COALESCE(OLD.install_count, 0) + 1;
    RETURN NEW;
END;
$$;

-- Recreate calculate_ai_performance_score with search_path
CREATE OR REPLACE FUNCTION public.calculate_ai_performance_score(
    cycles_completed INTEGER DEFAULT 0,
    decisions_made INTEGER DEFAULT 0,
    success_rate FLOAT DEFAULT 0.0
)
RETURNS FLOAT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    performance_score FLOAT;
BEGIN
    performance_score := (
        (cycles_completed * 0.3) +
        (decisions_made * 0.4) + 
        (success_rate * 0.3)
    ) / 100.0;
    
    performance_score := GREATEST(0.0, LEAST(1.0, performance_score));
    
    RETURN performance_score;
END;
$$;

-- Recreate get_performance_grade with search_path
CREATE OR REPLACE FUNCTION public.get_performance_grade(score FLOAT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    CASE 
        WHEN score >= 0.9 THEN RETURN 'A+';
        WHEN score >= 0.8 THEN RETURN 'A';
        WHEN score >= 0.7 THEN RETURN 'B';
        WHEN score >= 0.6 THEN RETURN 'C';
        WHEN score >= 0.5 THEN RETURN 'D';
        ELSE RETURN 'F';
    END CASE;
END;
$$;

-- Recreate cleanup_ai_data with search_path
CREATE OR REPLACE FUNCTION public.cleanup_ai_data()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'master_ai_cycles') THEN
        DELETE FROM public.master_ai_cycles 
        WHERE created_at < NOW() - INTERVAL '30 days';
        GET DIAGNOSTICS deleted_count = ROW_COUNT;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_decision_logs') THEN
        DELETE FROM public.ai_decision_logs 
        WHERE created_at < NOW() - INTERVAL '60 days';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_performance_scores') THEN
        DELETE FROM public.ai_performance_scores 
        WHERE created_at < NOW() - INTERVAL '90 days';
    END IF;
    
    RETURN deleted_count;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.increment_install_count() TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_ai_performance_score(INTEGER, INTEGER, FLOAT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_performance_grade(FLOAT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_ai_data() TO authenticated;

-- Refresh schema
NOTIFY pgrst, 'reload schema';

-- Simple success message
SELECT 'Functions recreated with search_path settings' as result;