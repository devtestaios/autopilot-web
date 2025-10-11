-- ===============================================
-- CHECK EXISTING LEADS TABLE STRUCTURE
-- ===============================================

-- Check if leads table exists and its structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'leads'
ORDER BY ordinal_position;

-- Check existing data
SELECT COUNT(*) as existing_leads FROM public.leads;

-- Show sample row if exists
SELECT * FROM public.leads LIMIT 1;
