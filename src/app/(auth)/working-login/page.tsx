'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function WorkingLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🎯 [WORKING LOGIN] Login button clicked!');
    console.log('📝 [WORKING LOGIN] Email:', email, 'Password length:', password.length);

    try {
      const supabase = createClientComponentClient();

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('❌ [WORKING LOGIN] Auth error:', authError);
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        console.log('✅ [WORKING LOGIN] Login successful!');
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('❌ [WORKING LOGIN] Unexpected error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Working Login Test
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Simplified login without complex auth context
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="px-4 py-3 rounded bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          <div className="p-3 rounded bg-blue-50 border border-blue-200 text-blue-700 text-sm">
            <strong>Demo:</strong> demo@pulsebridge.ai / TestPassword123!
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          <p>This is a simplified login page for testing.</p>
          <p className="mt-2">No complex auth context, no infinite loops.</p>
        </div>
      </div>
    </div>
  );
}
