import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () => createClientComponentClient()

// Server-side client for API routes
export { createServerComponentClient } from '@supabase/auth-helpers-nextjs'