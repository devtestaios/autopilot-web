import { supabase } from '@/lib/supabase';

export async function testAuthConnection() {
  try {
    // Test basic Supabase connection
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      return {
        success: false,
        error: `Auth connection error: ${error.message}`,
        isConfigured: false
      };
    }

    // Test profiles table exists (for auth setup)
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1);

    return {
      success: true,
      isConfigured: true,
      hasSession: !!data.session,
      currentUser: data.session?.user || null,
      profilesTableExists: !profilesError,
      profilesError: profilesError?.message
    };
  } catch (error) {
    return {
      success: false,
      error: `Connection test failed: ${error}`,
      isConfigured: false
    };
  }
}

export async function testDemoLogin() {
  try {
    // Test demo login credentials
    const result = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    });

    return {
      success: !result.error,
      error: result.error?.message,
      user: result.data?.user,
      session: result.data?.session
    };
  } catch (error) {
    return {
      success: false,
      error: `Demo login test failed: ${error}`
    };
  }
}