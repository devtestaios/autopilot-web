// Test login functionality
console.log('Testing Supabase environment variables...');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing');

// Test if we can create a Supabase client
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

try {
  const supabase = createClientComponentClient();
  console.log('✅ Supabase client created successfully');
  
  // Test a simple operation
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('❌ Error getting session:', error);
    } else {
      console.log('✅ Session check successful:', data.session ? 'User logged in' : 'No active session');
    }
  });
} catch (error) {
  console.error('❌ Error creating Supabase client:', error);
}