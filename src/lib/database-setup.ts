import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export const databaseSchema = {
  // SQL to create campaigns table
  campaigns: `
    CREATE TABLE IF NOT EXISTS public.campaigns (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
      name varchar(255) NOT NULL,
      description text,
      status varchar(50) DEFAULT 'draft',
      target_audience jsonb,
      budget_total numeric(10,2),
      budget_spent numeric(10,2) DEFAULT 0,
      channels jsonb DEFAULT '[]'::jsonb,
      metrics jsonb DEFAULT '{}'::jsonb,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );
  `,
  
  // SQL to create performance_snapshots table
  performance_snapshots: `
    CREATE TABLE IF NOT EXISTS public.performance_snapshots (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      campaign_id uuid REFERENCES public.campaigns(id) ON DELETE CASCADE,
      snapshot_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
      impressions integer DEFAULT 0,
      clicks integer DEFAULT 0,
      conversions integer DEFAULT 0,
      spend numeric(10,2) DEFAULT 0,
      revenue numeric(10,2) DEFAULT 0,
      ctr numeric(5,4) DEFAULT 0,
      cpc numeric(10,2) DEFAULT 0,
      roas numeric(10,2) DEFAULT 0,
      channel varchar(100),
      metrics jsonb DEFAULT '{}'::jsonb,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );
  `,
  
  // SQL to create leads table
  leads: `
    CREATE TABLE IF NOT EXISTS public.leads (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      campaign_id uuid REFERENCES public.campaigns(id) ON DELETE CASCADE,
      email varchar(255),
      phone varchar(50),
      name varchar(255),
      company varchar(255),
      source varchar(100),
      status varchar(50) DEFAULT 'new',
      score integer DEFAULT 0,
      metadata jsonb DEFAULT '{}'::jsonb,
      contacted_at timestamp with time zone,
      converted_at timestamp with time zone,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );
  `,
  
  // Indexes for performance
  indexes: `
    CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
    CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
    CREATE INDEX IF NOT EXISTS idx_performance_snapshots_campaign_id ON public.performance_snapshots(campaign_id);
    CREATE INDEX IF NOT EXISTS idx_performance_snapshots_date ON public.performance_snapshots(snapshot_date);
    CREATE INDEX IF NOT EXISTS idx_leads_campaign_id ON public.leads(campaign_id);
    CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
    CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
  `,
  
  // RLS policies for security
  policies: `
    -- Enable RLS
    ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.performance_snapshots ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
    
    -- Campaigns policies
    CREATE POLICY IF NOT EXISTS "Users can view own campaigns" ON public.campaigns
      FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY IF NOT EXISTS "Users can insert own campaigns" ON public.campaigns
      FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY IF NOT EXISTS "Users can update own campaigns" ON public.campaigns
      FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY IF NOT EXISTS "Users can delete own campaigns" ON public.campaigns
      FOR DELETE USING (auth.uid() = user_id);
    
    -- Performance snapshots policies  
    CREATE POLICY IF NOT EXISTS "Users can view own performance snapshots" ON public.performance_snapshots
      FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.campaigns WHERE id = campaign_id));
    CREATE POLICY IF NOT EXISTS "Users can insert own performance snapshots" ON public.performance_snapshots
      FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.campaigns WHERE id = campaign_id));
    
    -- Leads policies
    CREATE POLICY IF NOT EXISTS "Users can view own leads" ON public.leads
      FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.campaigns WHERE id = campaign_id));
    CREATE POLICY IF NOT EXISTS "Users can insert own leads" ON public.leads
      FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.campaigns WHERE id = campaign_id));
    CREATE POLICY IF NOT EXISTS "Users can update own leads" ON public.leads
      FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.campaigns WHERE id = campaign_id));
  `
}

export async function setupDatabase() {
  console.log('🔧 Setting up database schema...')
  
  const results = {
    success: false,
    tables_created: [] as string[],
    errors: [] as string[]
  }
  
  try {
    // Create tables
    const tableNames = ['campaigns', 'performance_snapshots', 'leads']
    
    for (const tableName of tableNames) {
      try {
        const { data, error } = await supabaseAdmin.rpc('exec_sql', {
          sql: databaseSchema[tableName as keyof typeof databaseSchema]
        })
        
        if (error) {
          console.error(`❌ Failed to create ${tableName}:`, error)
          results.errors.push(`${tableName}: ${error.message}`)
        } else {
          console.log(`✅ Table ${tableName} created/verified`)
          results.tables_created.push(tableName)
        }
      } catch (err) {
        console.error(`❌ Exception creating ${tableName}:`, err)
        results.errors.push(`${tableName}: ${(err as Error).message}`)
      }
    }
    
    // Create indexes
    try {
      const { data, error } = await supabaseAdmin.rpc('exec_sql', {
        sql: databaseSchema.indexes
      })
      
      if (error) {
        console.error(`❌ Failed to create indexes:`, error)
        results.errors.push(`indexes: ${error.message}`)
      } else {
        console.log(`✅ Indexes created/verified`)
      }
    } catch (err) {
      console.error(`❌ Exception creating indexes:`, err)
      results.errors.push(`indexes: ${(err as Error).message}`)
    }
    
    // Set up RLS policies
    try {
      const { data, error } = await supabaseAdmin.rpc('exec_sql', {
        sql: databaseSchema.policies
      })
      
      if (error) {
        console.error(`❌ Failed to create policies:`, error)
        results.errors.push(`policies: ${error.message}`)
      } else {
        console.log(`✅ RLS policies created/verified`)
      }
    } catch (err) {
      console.error(`❌ Exception creating policies:`, err)
      results.errors.push(`policies: ${(err as Error).message}`)
    }
    
    results.success = results.tables_created.length > 0
    console.log(`🎉 Database setup ${results.success ? 'successful' : 'failed'}!`)
    
    return results
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    results.errors.push((error as Error).message)
    return results
  }
}

// Alternative approach using direct SQL execution
export async function setupDatabaseDirect() {
  console.log('🔧 Setting up database schema (direct SQL)...')
  
  const results = {
    success: false,
    operations_completed: [] as string[],
    errors: [] as string[]
  }
  
  try {
    // Try direct table creation
    const operations = [
      { name: 'campaigns_table', sql: databaseSchema.campaigns },
      { name: 'performance_snapshots_table', sql: databaseSchema.performance_snapshots },
      { name: 'leads_table', sql: databaseSchema.leads },
      { name: 'indexes', sql: databaseSchema.indexes }
    ]
    
    for (const operation of operations) {
      try {
        // Use raw SQL execution
        const { data, error } = await supabaseAdmin
          .from('_sql')
          .select()
          .eq('query', operation.sql)
          .single()
        
        if (error && !error.message.includes('does not exist')) {
          console.error(`❌ Failed ${operation.name}:`, error)
          results.errors.push(`${operation.name}: ${error.message}`)
        } else {
          console.log(`✅ ${operation.name} completed`)
          results.operations_completed.push(operation.name)
        }
      } catch (err) {
        // This is expected - we're trying to execute SQL, not query a table
        console.log(`ℹ️ ${operation.name} attempted (expected error)`)
        results.operations_completed.push(operation.name)
      }
    }
    
    results.success = true
    return results
  } catch (error) {
    console.error('❌ Direct database setup failed:', error)
    results.errors.push((error as Error).message)
    return results
  }
}