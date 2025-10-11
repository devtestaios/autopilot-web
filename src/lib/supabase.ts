import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a fallback client if environment variables are not set
let supabase: any;

// Initialize Supabase if we have valid environment variables
// FIXED: Removed 'typeof window !== undefined' check to work server-side
if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: typeof window !== 'undefined', // Only persist in browser
        detectSessionInUrl: typeof window !== 'undefined',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined
      }
    });
    // Logging removed to prevent SSR errors
  } catch (error) {
    supabase = createMockClient();
  }
} else {
  supabase = createMockClient();
}

function createMockClient() {
  return {
    auth: {
      signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: { message: 'Supabase not configured' } })
        })
      }),
      insert: async () => ({ error: { message: 'Supabase not configured' } }),
      update: () => ({
        eq: async () => ({ error: { message: 'Supabase not configured' } })
      })
    })
  };
}

export { supabase };

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          role: 'admin' | 'user' | 'viewer';
          company: string | null;
          preferences: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'user' | 'viewer';
          company?: string | null;
          preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'user' | 'viewer';
          company?: string | null;
          preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
