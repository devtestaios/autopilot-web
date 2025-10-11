-- ===============================================
-- REFRESH SUPABASE SCHEMA CACHE
-- ===============================================

-- Reload the PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- Alternative: Force schema reload by updating a setting
ALTER DATABASE postgres SET "app.settings.jwt_secret" = 'reload';
ALTER DATABASE postgres RESET "app.settings.jwt_secret";
