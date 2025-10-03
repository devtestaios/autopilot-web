-- ========================================
-- ADD FOREIGN KEY CONSTRAINTS
-- ========================================

-- Add template reference to campaigns after templates table exists
ALTER TABLE email_campaigns ADD CONSTRAINT fk_email_campaigns_template 
FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE SET NULL;

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'Foreign key constraints added successfully!';
END $$;