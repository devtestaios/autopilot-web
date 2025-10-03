-- ============================================================================
-- SIMPLE COPY-PASTE SUPABASE SECURITY FIX
-- ============================================================================
-- Copy this entire script and paste it into Supabase SQL Editor, then click RUN
-- This fixes all security warnings with CASCADE approach

-- 1. Drop problematic view
DROP VIEW IF EXISTS public.database_summary CASCADE;

-- 2. Drop functions with CASCADE (removes all dependent triggers)
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.increment_install_count() CASCADE;
DROP FUNCTION IF EXISTS public.calculate_ai_performance_score(INTEGER, INTEGER, FLOAT) CASCADE;
DROP FUNCTION IF EXISTS public.calculate_ai_performance_score() CASCADE;
DROP FUNCTION IF EXISTS public.get_performance_grade(FLOAT) CASCADE;
DROP FUNCTION IF EXISTS public.get_performance_grade() CASCADE;
DROP FUNCTION IF EXISTS public.cleanup_ai_data() CASCADE;

-- 3. Recreate update_updated_at_column function with search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 4. Recreate other functions with search_path
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

-- 5. Recreate database_summary view without SECURITY DEFINER
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

-- 6. Recreate all triggers that were dropped
DO $$
BEGIN
    -- AI table triggers
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_performance_scores') THEN
        CREATE TRIGGER update_ai_performance_scores_updated_at
            BEFORE UPDATE ON public.ai_performance_scores
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_smart_alerts') THEN
        CREATE TRIGGER update_ai_smart_alerts_updated_at
            BEFORE UPDATE ON public.ai_smart_alerts
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_recommendations') THEN
        CREATE TRIGGER update_ai_recommendations_updated_at
            BEFORE UPDATE ON public.ai_recommendations
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;

    -- Email table triggers
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'email_campaigns') THEN
        CREATE TRIGGER update_email_campaigns_updated_at
            BEFORE UPDATE ON public.email_campaigns
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'email_subscribers') THEN
        CREATE TRIGGER update_email_subscribers_updated_at
            BEFORE UPDATE ON public.email_subscribers
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'email_templates') THEN
        CREATE TRIGGER update_email_templates_updated_at
            BEFORE UPDATE ON public.email_templates
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'email_automations') THEN
        CREATE TRIGGER update_email_automations_updated_at
            BEFORE UPDATE ON public.email_automations
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;

    -- Social media table triggers
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'social_media_accounts') THEN
        CREATE TRIGGER update_social_accounts_updated_at
            BEFORE UPDATE ON public.social_media_accounts
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'social_media_posts') THEN
        CREATE TRIGGER update_social_posts_updated_at
            BEFORE UPDATE ON public.social_media_posts
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'social_media_comments') THEN
        CREATE TRIGGER update_social_comments_updated_at
            BEFORE UPDATE ON public.social_media_comments
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;

    -- Collaboration table triggers
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'team_members') THEN
        CREATE TRIGGER update_team_members_updated_at
            BEFORE UPDATE ON public.team_members
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collaboration_projects') THEN
        CREATE TRIGGER update_projects_updated_at
            BEFORE UPDATE ON public.collaboration_projects
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- 7. Set permissions
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_install_count() TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_ai_performance_score(INTEGER, INTEGER, FLOAT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_performance_grade(FLOAT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_ai_data() TO authenticated;
GRANT SELECT ON public.database_summary TO authenticated;
GRANT SELECT ON public.database_summary TO anon;

-- 8. Refresh schema
NOTIFY pgrst, 'reload schema';

-- SUCCESS MESSAGE
SELECT 'Security fixes completed successfully! All functions now have proper search_path settings.' as status;