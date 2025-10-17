'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { PulseWaveLogo } from '@/components/PulseWaveLogo';

export default function LoginPage() {
  console.log('🔵 [LOGIN PAGE] Component rendering');

  const router = useRouter();
  const { theme } = useTheme();
  const { login, isLoading } = useAuth();

  console.log('🔧 [LOGIN PAGE] Auth context loaded:', {
    hasLogin: typeof login === 'function',
    isLoading,
    loginFunction: login?.toString().substring(0, 50)
  });

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('🎯 [LOGIN PAGE] handleSubmit called!');
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    console.log('📝 [LOGIN PAGE] Form data:', { email: formData.email, passwordLength: formData.password.length });
    console.log('🔧 [LOGIN PAGE] Auth context:', { login: typeof login, isLoading });

    // Validation
    if (!formData.email || !formData.password) {
      console.log('❌ [LOGIN PAGE] Validation failed: empty fields');
      setError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.includes('@')) {
      console.log('❌ [LOGIN PAGE] Validation failed: invalid email');
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    console.log('✅ [LOGIN PAGE] Validation passed, calling login...');

    try {
      const result = await login(formData.email, formData.password);
      console.log('📊 [LOGIN PAGE] Login result:', result);

      if (result && result.success) {
        console.log('✅ [LOGIN PAGE] Login successful, redirecting to dashboard...');
        
        // Show success message
        setSuccessMessage('Login successful! Redirecting to dashboard...');
        
        // Check if there's a redirect parameter
        const searchParams = new URLSearchParams(window.location.search);
        const redirectTo = searchParams.get('redirectTo') || '/dashboard';
        
        console.log('🔄 [LOGIN PAGE] Redirecting to:', redirectTo);
        
        // Use router.push for client-side navigation with Next.js App Router
        router.push(redirectTo);
        
        // Keep submitting state true during redirect
        // Don't set setIsSubmitting(false) here
      } else {
        console.log('❌ [LOGIN PAGE] Login failed:', result?.error);
        setError(result?.error || 'Invalid email or password. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('❌ [LOGIN PAGE] Login error:', error);
      setError('Authentication service temporarily unavailable. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className={`min-h-screen flex ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <Link href="/" className={`inline-flex items-center mb-8 transition-colors ${
              theme === 'dark'
                ? 'text-blue-400 hover:text-blue-300'
                : 'text-blue-600 hover:text-blue-700'
            }`}>
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Link>

            <div className="flex justify-center mb-6">
              <PulseWaveLogo size="large" className="text-pulse-cyan" />
            </div>

            <h2 className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome back
            </h2>
            <p className={`mt-2 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Sign in to your PulseBridge account
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`px-4 py-3 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-red-900/20 border-red-800/50 text-red-200'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              {/* Demo Credentials Hint */}
              <div className={`p-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-blue-900/20 border-blue-800/50 text-blue-200' 
                  : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}>
                <p className="text-sm">
                  <strong>Demo Login:</strong> demo@pulsebridge.ai / TestPassword123!
                </p>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className={`h-5 w-5 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                    ) : (
                      <Eye className={`h-5 w-5 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className={`h-4 w-4 rounded border focus:ring-2 focus:ring-offset-2 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500'
                      : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                  }`}
                />
                <label htmlFor="remember-me" className={`ml-2 block text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className={`font-medium transition-colors ${
                  theme === 'dark'
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-700'
                }`}>
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || isSubmitting}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                  (isLoading || isSubmitting)
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {(isLoading || isSubmitting) ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {successMessage ? 'Redirecting...' : 'Signing in...'}
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800"
              >
                <p className="text-sm text-green-800 dark:text-green-200 text-center">
                  {successMessage}
                </p>
              </motion.div>
            )}

            {/* Sign up link */}
            <div className="text-center">
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Don't have an account?{' '}
                <Link href="/signup" className={`font-medium transition-colors ${
                  theme === 'dark'
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-700'
                }`}>
                  Sign up for free
                </Link>
              </span>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Right side - Marketing content */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-teal-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative h-full flex items-center justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-md"
          >
            <h3 className="text-3xl font-bold mb-6">
              Transform Your Marketing Today
            </h3>
            <p className="text-lg text-blue-100 mb-8">
              Join thousands of marketers who've revolutionized their campaigns with AI-powered automation.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <span className="text-blue-100">340% average ROI improvement</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <span className="text-blue-100">24/7 autonomous optimization</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <span className="text-blue-100">Enterprise-grade security</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
