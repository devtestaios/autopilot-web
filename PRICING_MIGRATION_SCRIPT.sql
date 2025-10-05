-- ===============================================
-- PRICING STRUCTURE MIGRATION SCRIPT
-- Migrate existing database to new pricing tiers
-- Execute in Supabase SQL Editor AFTER backing up data
-- ===============================================

-- Step 1: Add new trial management fields to companies table
DO $$ 
BEGIN
  -- Add trial_started_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'companies' AND column_name = 'trial_started_at') THEN
    ALTER TABLE public.companies ADD COLUMN trial_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
  
  -- Update trial_ends_at to have default value for new records
  ALTER TABLE public.companies ALTER COLUMN trial_ends_at SET DEFAULT (NOW() + INTERVAL '15 days');
END $$;

-- Step 2: Update subscription tier constraints for companies table
ALTER TABLE public.companies DROP CONSTRAINT IF EXISTS companies_subscription_tier_check;
ALTER TABLE public.companies ADD CONSTRAINT companies_subscription_tier_check 
  CHECK (subscription_tier IN ('trial', 'solo_professional', 'growth_team', 'professional_agency', 'enterprise', 'enterprise_plus'));

-- Step 3: Update account status constraints for companies table  
ALTER TABLE public.companies DROP CONSTRAINT IF EXISTS companies_account_status_check;
ALTER TABLE public.companies ADD CONSTRAINT companies_account_status_check 
  CHECK (account_status IN ('trial', 'active', 'suspended', 'cancelled'));

-- Step 4: Update subscription tier constraints for profiles table
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_subscription_tier_check 
  CHECK (subscription_tier IN ('trial', 'solo_professional', 'growth_team', 'professional_agency', 'enterprise', 'enterprise_plus'));

-- Step 5: Migrate existing data to new pricing structure
UPDATE public.companies SET 
  subscription_tier = CASE 
    WHEN subscription_tier = 'free' THEN 'trial'
    WHEN subscription_tier = 'starter' THEN 'growth_team'  
    WHEN subscription_tier = 'professional' THEN 'professional_agency'
    WHEN subscription_tier = 'enterprise' THEN 'enterprise'
    ELSE 'trial'
  END,
  account_status = CASE
    WHEN account_status = 'active' AND subscription_tier = 'free' THEN 'trial'
    ELSE account_status
  END,
  trial_ends_at = CASE
    WHEN subscription_tier = 'free' OR account_status = 'trial' THEN NOW() + INTERVAL '15 days'
    ELSE trial_ends_at
  END,
  trial_started_at = CASE
    WHEN trial_started_at IS NULL THEN NOW()
    ELSE trial_started_at
  END;

UPDATE public.profiles SET 
  subscription_tier = CASE 
    WHEN subscription_tier = 'free' THEN 'trial'
    WHEN subscription_tier = 'starter' THEN 'growth_team'
    WHEN subscription_tier = 'professional' THEN 'professional_agency'  
    WHEN subscription_tier = 'enterprise' THEN 'enterprise'
    ELSE 'trial'
  END;

-- Step 6: Set default values for new accounts
ALTER TABLE public.companies ALTER COLUMN subscription_tier SET DEFAULT 'trial';
ALTER TABLE public.companies ALTER COLUMN account_status SET DEFAULT 'trial';
ALTER TABLE public.profiles ALTER COLUMN subscription_tier SET DEFAULT 'trial';

-- Step 7: Verification queries
SELECT 'Migration completed successfully!' AS status;
SELECT 'Companies with new pricing tiers:' AS info;
SELECT subscription_tier, COUNT(*) as count FROM public.companies GROUP BY subscription_tier;
SELECT 'Profiles with new pricing tiers:' AS info;
SELECT subscription_tier, COUNT(*) as count FROM public.profiles GROUP BY subscription_tier;

-- Step 8: Check for any remaining old tier references
SELECT 'Companies with old tiers (should be empty):' AS warning;
SELECT * FROM public.companies 
WHERE subscription_tier NOT IN ('trial', 'solo_professional', 'growth_team', 'professional_agency', 'enterprise', 'enterprise_plus');

SELECT 'Profiles with old tiers (should be empty):' AS warning;
SELECT * FROM public.profiles 
WHERE subscription_tier NOT IN ('trial', 'solo_professional', 'growth_team', 'professional_agency', 'enterprise', 'enterprise_plus');