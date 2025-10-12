'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Shield, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);

  // Initialize Supabase client only on client-side
  useEffect(() => {
    const initSupabase = async () => {
      const { supabase: client } = await import('@/lib/supabase');
      setSupabase(client);
      console.log('🔵 AdminLoginPage component mounted');
      console.log('✅ Supabase client loaded');
    };
    initSupabase();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🎯 BUTTON CLICKED - handleSubmit fired!');

    setLoading(true);
    setError('');

    console.log('🔐 Starting admin login process...');
    console.log('📧 Email:', formData.email);
    console.log('🔌 Supabase client exists:', !!supabase);

    try {
      // Check if supabase client is initialized
      if (!supabase || !supabase.auth) {
        console.error('❌ Supabase client not initialized!');
        setError('Authentication service not available. Please check configuration.');
        setLoading(false);
        return;
      }

      console.log('✅ Supabase client initialized, attempting login...');

      // Use Supabase authentication
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      console.log('🔍 Auth response:', {
        hasUser: !!authData?.user,
        hasError: !!authError,
        errorMessage: authError?.message
      });

      if (authError) {
        console.error('❌ Supabase auth error:', authError);
        setError(`Authentication failed: ${authError.message}`);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        console.error('❌ No user returned from auth');
        setError('Login failed. No user returned.');
        setLoading(false);
        return;
      }

      console.log('✅ User authenticated:', authData.user.id);
      console.log('🔍 Fetching user profile...');

      // Verify user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, account_status')
        .eq('id', authData.user.id)
        .single();

      console.log('🔍 Profile response:', {
        hasProfile: !!profile,
        role: profile?.role,
        status: profile?.account_status,
        hasError: !!profileError
      });

      if (profileError || !profile) {
        console.error('❌ Profile fetch error:', profileError);
        setError('Unable to verify admin status. Profile not found.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Check if user is admin
      if (!['super_admin', 'agency_owner'].includes(profile.role)) {
        console.error('❌ User is not admin. Role:', profile.role);
        setError(`Access denied. Admin privileges required. Your role: ${profile.role}`);
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Check account status
      if (profile.account_status !== 'active') {
        console.error('❌ Account not active. Status:', profile.account_status);
        setError('Account is not active. Please contact support.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      console.log('✅ Admin verification passed!');
      console.log('💾 Setting localStorage and session...');

      // Set admin session in localStorage
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_email', formData.email);
      localStorage.setItem('admin_role', profile.role);
      localStorage.setItem('admin_login_time', Date.now().toString());

      // The user is already authenticated with Supabase from the signInWithPassword call above
      // The session cookies will be automatically handled by Supabase
      console.log('✅ Supabase session active for:', authData.user.email);

      console.log('🚀 Redirecting to admin dashboard...');

      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err) {
      console.error('❌ Unexpected admin login error:', err);
      setError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('⌨️ Input changed:', e.target.name, '=', e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error when user types
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Admin Access
          </CardTitle>
          <CardDescription className="text-gray-600">
            Secure administrative portal for PulseBridge AI
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Admin Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="admin@pulsebridge.ai"
                className="h-11"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter admin password"
                  className="h-11 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !formData.email || !formData.password}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Sign In
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p className="mb-2">
                <strong>Admin Access</strong>
              </p>
              <div className="bg-gray-50 p-3 rounded text-left text-xs space-y-1">
                <p className="text-gray-600">
                  Use your admin credentials from Supabase to sign in.
                </p>
                <p className="text-gray-500 mt-2">
                  Email: <span className="font-mono">admin@pulsebridge.ai</span>
                </p>
                <p className="text-gray-500">
                  Password: <span className="font-mono">PulseBridge2025!</span>
                </p>
              </div>
              <p className="mt-2 text-gray-400">
                Authorized access only. All activities are logged.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}