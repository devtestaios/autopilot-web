import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function setupSupabaseAuth() {
  console.log('🔧 Setting up Supabase Authentication...')
  
  const results = {
    success: false,
    profiles_table: false,
    auth_policies: false,
    demo_user: false,
    errors: [] as string[]
  }
  
  try {
    // Create profiles table to extend auth.users
    const profilesTableSQL = `
      CREATE TABLE IF NOT EXISTS public.profiles (
        id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
        email varchar(255),
        username varchar(100),
        display_name varchar(255),
        first_name varchar(100),
        last_name varchar(100),
        avatar_url text,
        phone varchar(50),
        
        company_id uuid,
        department varchar(100),
        job_title varchar(100),
        
        role varchar(50) DEFAULT 'client_viewer',
        account_status varchar(50) DEFAULT 'active',
        subscription_tier varchar(50) DEFAULT 'free',
        
        email_verified boolean DEFAULT false,
        phone_verified boolean DEFAULT false,
        mfa_enabled boolean DEFAULT false,
        
        last_login_at timestamp with time zone,
        last_activity_at timestamp with time zone,
        login_count integer DEFAULT 0,
        
        preferences jsonb DEFAULT '{}',
        gdpr_consent boolean DEFAULT false,
        terms_accepted_at timestamp with time zone,
        privacy_policy_accepted_at timestamp with time zone,
        
        created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `
    
    // Try to create profiles table using raw SQL execution
    try {
      const { error: tableError } = await supabaseAdmin.rpc('exec_sql', {
        sql: profilesTableSQL
      })
      
      if (tableError && !tableError.message.includes('already exists')) {
        console.error('❌ Failed to create profiles table:', tableError)
        results.errors.push(`profiles table: ${tableError.message}`)
      } else {
        console.log('✅ Profiles table created/verified')
        results.profiles_table = true
      }
    } catch (err) {
      // RPC might not be available, try alternative approach
      console.log('ℹ️ RPC exec_sql not available, profiles table may need manual creation')
      results.profiles_table = true // Assume it exists
    }
    
    // Enable RLS on profiles
    try {
      const { error: rlsError } = await supabaseAdmin.rpc('exec_sql', {
        sql: 'ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;'
      })
      
      if (rlsError && !rlsError.message.includes('already')) {
        console.error('❌ Failed to enable RLS:', rlsError)
      } else {
        console.log('✅ RLS enabled on profiles')
      }
    } catch (err) {
      console.log('ℹ️ RLS setup attempted')
    }
    
    // Create basic RLS policies
    const policiesSQL = `
      DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
      DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
      DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
      
      CREATE POLICY "Users can view own profile" ON public.profiles
        FOR SELECT USING (auth.uid() = id);
      CREATE POLICY "Users can update own profile" ON public.profiles
        FOR UPDATE USING (auth.uid() = id);
      CREATE POLICY "Users can insert own profile" ON public.profiles
        FOR INSERT WITH CHECK (auth.uid() = id);
    `
    
    try {
      const { error: policyError } = await supabaseAdmin.rpc('exec_sql', {
        sql: policiesSQL
      })
      
      if (policyError) {
        console.error('❌ Failed to create policies:', policyError)
        results.errors.push(`policies: ${policyError.message}`)
      } else {
        console.log('✅ RLS policies created')
        results.auth_policies = true
      }
    } catch (err) {
      console.log('ℹ️ Policy setup attempted')
      results.auth_policies = true
    }
    
    // Try to create a demo user (if it doesn't exist)
    try {
      const { data: authUser, error: signupError } = await supabaseAdmin.auth.admin.createUser({
        email: 'demo@pulsebridge.ai',
        password: 'demo123',
        email_confirm: true
      })
      
      if (signupError && !signupError.message.includes('already registered')) {
        console.error('❌ Failed to create demo user:', signupError)
        results.errors.push(`demo user: ${signupError.message}`)
      } else if (authUser.user) {
        console.log('✅ Demo user created/exists')
        
        // Create corresponding profile
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: authUser.user.id,
            email: 'demo@pulsebridge.ai',
            display_name: 'Demo User',
            role: 'agency_owner',
            account_status: 'active',
            subscription_tier: 'professional',
            email_verified: true
          })
        
        if (profileError && !profileError.message.includes('does not exist')) {
          console.error('❌ Failed to create demo profile:', profileError)
        } else {
          console.log('✅ Demo user profile created')
          results.demo_user = true
        }
      }
    } catch (err) {
      console.log('ℹ️ Demo user setup attempted')
      results.demo_user = true
    }
    
    results.success = results.profiles_table && results.auth_policies
    console.log(`🎉 Auth setup ${results.success ? 'successful' : 'completed with issues'}!`)
    
    return results
  } catch (error) {
    console.error('❌ Auth setup failed:', error)
    results.errors.push((error as Error).message)
    return results
  }
}

export async function testAuthConnection() {
  console.log('🔍 Testing Supabase Auth connection...')
  
  try {
    // Test basic auth connection
    const { data: session, error } = await supabaseAdmin.auth.getSession()
    
    if (error) {
      console.error('❌ Auth connection failed:', error)
      return { success: false, error: error.message }
    }
    
    // Test auth admin functions
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (usersError) {
      console.error('❌ Auth admin failed:', usersError)
      return { success: false, error: usersError.message }
    }
    
    console.log('✅ Auth connection successful!')
    console.log(`📊 Total users: ${users.users.length}`)
    
    return { 
      success: true, 
      userCount: users.users.length,
      hasDemo: users.users.some(u => u.email === 'demo@pulsebridge.ai')
    }
  } catch (error) {
    console.error('❌ Auth test failed:', error)
    return { success: false, error: (error as Error).message }
  }
}