import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () => {
  // Check if we have valid Supabase environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Return null client if environment variables are missing or placeholder
  if (!supabaseUrl || !supabaseKey || 
      supabaseUrl.includes('placeholder') || 
      supabaseKey.includes('placeholder') ||
      supabaseUrl.includes('your-project') ||
      supabaseKey.includes('your-anon-key')) {
    console.warn('Supabase environment variables not configured, authentication features will be disabled')
    return null
  }
  
  try {
    return createClientComponentClient()
  } catch (error) {
    console.warn('Failed to create Supabase client:', error)
    return null
  }
}

// Server-side client for API routes
export { createServerComponentClient } from '@supabase/auth-helpers-nextjs'