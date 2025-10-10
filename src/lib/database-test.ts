import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...')
    console.log('URL:', supabaseUrl)
    console.log('Key prefix:', supabaseKey.substring(0, 20) + '...')
    
    const results = {
      connection: false,
      tables: {
        campaigns: false,
        performance_snapshots: false,
        leads: false
      },
      errors: [] as string[]
    }
    
    // Test each expected table
    const tablesToTest = ['campaigns', 'performance_snapshots', 'leads']
    
    for (const table of tablesToTest) {
      try {
        const { data, error } = await supabase.from(table).select('count', { count: 'exact', head: true })
        
        if (error) {
          console.error(`❌ Table '${table}' test failed:`, error.message)
          results.errors.push(`${table}: ${error.message}`)
          results.tables[table as keyof typeof results.tables] = false
        } else {
          console.log(`✅ Table '${table}' exists and accessible`)
          results.tables[table as keyof typeof results.tables] = true
        }
      } catch (error) {
        console.error(`❌ Exception testing table '${table}':`, error)
        results.errors.push(`${table}: ${(error as Error).message}`)
      }
    }
    
    // Overall connection status
    results.connection = Object.values(results.tables).some(exists => exists)
    
    if (results.connection) {
      console.log('✅ Database connection successful!')
      console.log('� Table status:', results.tables)
    } else {
      console.error('❌ Database connection failed - no accessible tables')
    }
    
    return { 
      success: results.connection, 
      data: results,
      error: results.errors.length > 0 ? results.errors.join('; ') : null
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error)
    return { success: false, error: (error as Error).message }
  }
}

// Auto-run test when imported
if (typeof window !== 'undefined') {
  testDatabaseConnection()
}