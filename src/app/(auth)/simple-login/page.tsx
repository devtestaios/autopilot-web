'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SimpleLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔐 Simple login attempt:', email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('📥 Supabase response:', { data, error });

      if (error) {
        console.error('❌ Login error:', error);
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data?.session && data?.user) {
        console.log('✅ Login successful! User:', data.user.email);
        console.log('✅ Session:', data.session);

        // Store session in localStorage as backup
        if (typeof window !== 'undefined') {
          localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
        }

        // Give Supabase time to set cookies
        await new Promise(resolve => setTimeout(resolve, 500));

        // Redirect to dashboard
        console.log('🚀 Redirecting to dashboard...');
        window.location.href = '/dashboard';
      } else {
        setError('Login succeeded but no session created');
        setLoading(false);
      }
    } catch (err) {
      console.error('💥 Caught error:', err);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Simple Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          <p>Test credentials:</p>
          <p>Email: devtestai.os@gmail.com</p>
          <p>Password: (from invitation email)</p>
        </div>
      </div>
    </div>
  );
}
