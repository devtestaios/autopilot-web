'use client';

import { useState } from 'react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First try the new API-based authentication
      const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const apiData = await apiResponse.json();

      if (apiResponse.ok && apiData.access_token) {
        // Store admin token and info
        localStorage.setItem('admin_token', apiData.access_token);
        localStorage.setItem('admin_email', apiData.email);
        localStorage.setItem('admin_role', apiData.role);
        localStorage.setItem('admin_login_time', Date.now().toString());
        
        // Redirect to admin dashboard
        router.push('/admin');
        return;
      }

      // Fallback to local credentials for development
      const validEmails = ['admin@pulsebridge.ai', 'admin@20n1.ai', 'admin@20n1digital.com'];
      const validPassword = 'PulseBridge2025!';

      if (validEmails.includes(formData.email) && formData.password === validPassword) {
        // Set admin session in localStorage
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_email', formData.email);
        localStorage.setItem('admin_role', 'super_admin');
        localStorage.setItem('admin_login_time', Date.now().toString());
        
        // Redirect to admin dashboard
        router.push('/admin');
        return;
      }

      setError('Invalid admin credentials');
    } catch (err) {
      console.error('Admin login error:', err);
      
      // Fallback authentication if API is down
      const validEmails = ['admin@pulsebridge.ai', 'admin@20n1.ai', 'admin@20n1digital.com'];
      const validPassword = 'PulseBridge2025!';

      if (validEmails.includes(formData.email) && formData.password === validPassword) {
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_email', formData.email);
        localStorage.setItem('admin_role', 'super_admin');
        localStorage.setItem('admin_login_time', Date.now().toString());
        router.push('/admin');
        return;
      }

      setError('Login failed. Please check your credentials.');
    }

    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                <strong>Admin Credentials:</strong>
              </p>
              <div className="bg-gray-50 p-3 rounded text-left font-mono text-xs space-y-1">
                <p><strong>Email:</strong> admin@pulsebridge.ai</p>
                <p><strong>Password:</strong> PulseBridge2025!</p>
                <p className="text-gray-400 text-xs mt-2">
                  Also accepts: admin@20n1.ai, admin@20n1digital.com
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