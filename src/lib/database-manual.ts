import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function createTablesManually() {
  console.log('🔧 Creating tables manually...')
  
  const results = {
    success: false,
    tables_created: [] as string[],
    errors: [] as string[]
  }
  
  // Simple table creation using basic SQL
  const tables = [
    {
      name: 'campaigns',
      sql: `
        CREATE TABLE IF NOT EXISTS campaigns (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(50) DEFAULT 'draft',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'performance_snapshots', 
      sql: `
        CREATE TABLE IF NOT EXISTS performance_snapshots (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          campaign_id UUID,
          impressions INTEGER DEFAULT 0,
          clicks INTEGER DEFAULT 0,
          conversions INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'leads',
      sql: `
        CREATE TABLE IF NOT EXISTS leads (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          campaign_id UUID,
          email VARCHAR(255),
          name VARCHAR(255),
          status VARCHAR(50) DEFAULT 'new',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }
  ]
  
  for (const table of tables) {
    try {
      // Try using rpc to execute SQL
      const { data, error } = await supabaseAdmin.rpc('exec_sql', {
        sql: table.sql
      })
      
      if (error) {
        console.log(`ℹ️ RPC failed for ${table.name}, trying alternative...`)
        // RPC might not be available, let's try creating via raw query
        try {
          // This is a workaround - we'll create a temporary function
          const createResult = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'apikey': supabaseServiceKey
            },
            body: JSON.stringify({ sql: table.sql })
          })
          
          if (createResult.ok) {
            console.log(`✅ Table ${table.name} created via API`)
            results.tables_created.push(table.name)
          } else {
            console.log(`❌ Failed to create ${table.name} via API`)
            results.errors.push(`${table.name}: API call failed`)
          }
        } catch (apiError) {
          console.log(`❌ API error for ${table.name}:`, apiError)
          results.errors.push(`${table.name}: ${(apiError as Error).message}`)
        }
      } else {
        console.log(`✅ Table ${table.name} created via RPC`)
        results.tables_created.push(table.name)
      }
    } catch (err) {
      console.log(`❌ Exception creating ${table.name}:`, err)
      results.errors.push(`${table.name}: ${(err as Error).message}`)
    }
  }
  
  results.success = results.tables_created.length > 0
  return results
}

// Let's try a different approach - check if we can insert sample data
export async function testTableAccess() {
  console.log('🔍 Testing table access...')
  
  const results = {
    success: false,
    accessible_tables: [] as string[],
    errors: [] as string[]
  }
  
  const tables = ['campaigns', 'performance_snapshots', 'leads']
  
  for (const table of tables) {
    try {
      // Try to select from the table
      const { data, error } = await supabaseAdmin
        .from(table)
        .select('*')
        .limit(1)
      
      if (!error) {
        console.log(`✅ Table ${table} is accessible`)
        results.accessible_tables.push(table)
      } else {
        console.log(`❌ Table ${table} error:`, error.message)
        results.errors.push(`${table}: ${error.message}`)
      }
    } catch (err) {
      console.log(`❌ Exception accessing ${table}:`, err)
      results.errors.push(`${table}: ${(err as Error).message}`)
    }
  }
  
  results.success = results.accessible_tables.length > 0
  return results
}

// Create a simple test record to verify write access
export async function testInsertCampaign() {
  console.log('🧪 Testing campaign insertion...')
  
  try {
    const { data, error } = await supabaseAdmin
      .from('campaigns')
      .insert({
        name: 'Test Campaign',
        description: 'Test campaign for database verification',
        status: 'draft'
      })
      .select()
      .single()
    
    if (error) {
      console.log('❌ Insert failed:', error)
      return { success: false, error: error.message }
    }
    
    console.log('✅ Test campaign created:', data)
    
    // Clean up - delete the test record
    await supabaseAdmin
      .from('campaigns')
      .delete()
      .eq('id', data.id)
    
    console.log('✅ Test campaign cleaned up')
    
    return { success: true, data }
  } catch (err) {
    console.log('❌ Insert exception:', err)
    return { success: false, error: (err as Error).message }
  }
}