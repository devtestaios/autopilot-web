-- ===============================================
-- QUICK FIX for Tables 13 & 14 - Duration Column Issues
-- Run this if you got the immutable function error
-- ===============================================

-- Fix Table 13: master_ai_cycles
-- Drop the problematic generated column and recreate as regular column
ALTER TABLE IF EXISTS master_ai_cycles 
DROP COLUMN IF EXISTS duration_minutes CASCADE;

ALTER TABLE master_ai_cycles 
ADD COLUMN duration_minutes INTEGER;

-- Fix Table 14: platform_ai_coordination  
-- Drop the problematic generated column and recreate as regular column
ALTER TABLE IF EXISTS platform_ai_coordination 
DROP COLUMN IF EXISTS total_coordination_time_minutes CASCADE;

ALTER TABLE platform_ai_coordination 
ADD COLUMN total_coordination_time_minutes INTEGER;

-- Create duration calculation functions
CREATE OR REPLACE FUNCTION calculate_cycle_duration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER AS $$
BEGIN
    PERFORM set_config('search_path', '', false);
    IF NEW.end_time IS NOT NULL AND NEW.start_time IS NOT NULL THEN
        NEW.duration_minutes = EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 60;
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION calculate_coordination_duration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER AS $$
BEGIN
    PERFORM set_config('search_path', '', false);
    IF NEW.coordination_end IS NOT NULL AND NEW.coordination_start IS NOT NULL THEN
        NEW.total_coordination_time_minutes = EXTRACT(EPOCH FROM (NEW.coordination_end - NEW.coordination_start)) / 60;
    END IF;
    RETURN NEW;
END;
$$;

-- Create triggers to automatically calculate durations
CREATE TRIGGER master_ai_cycles_duration_trigger 
BEFORE INSERT OR UPDATE ON master_ai_cycles 
FOR EACH ROW EXECUTE FUNCTION calculate_cycle_duration();

CREATE TRIGGER platform_ai_coordination_duration_trigger 
BEFORE INSERT OR UPDATE ON platform_ai_coordination 
FOR EACH ROW EXECUTE FUNCTION calculate_coordination_duration();

-- Verify fix
SELECT 'Tables 13 & 14 fixed successfully' as status;