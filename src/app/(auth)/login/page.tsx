'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { PulseWaveLogo } from '@/components/PulseWaveLogo';
import EnvironmentDebug from '@/components/debug/EnvironmentDebug';

// Immediate execution test - this runs when the module loads
console.log('🚨 LOGIN PAGE MODULE LOADED - JavaScript IS executing!');
console.log('🚨 Current URL:', typeof window !== 'undefined' ? window.location.href : 'SSR');
console.log('🚨 Console methods available:', typeof console.log);

// Test if we can access window and document
if (typeof window !== 'undefined') {
  console.log('🚨 Window is available');
  console.log('🚨 Document ready state:', document.readyState);

  // Add a global click listener to verify ANY clicks are working
  window.addEventListener('click', (e) => {
    console.log('🚨 GLOBAL CLICK DETECTED on:', e.target);
  });
}

export default function LoginPage() {
  console.log('🔧 Login page component rendering...');

  const router = useRouter();
  const { theme } = useTheme();
  const { login, isLoading } = useAuth();

  console.log('✅ All hooks loaded');
  console.log('Login function type:', typeof login);
  console.log('isLoading state:', isLoading);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Test component mounting
  useEffect(() => {
    console.log('✅ LoginPage component MOUNTED');
    console.log('✅ FormData state:', formData);
    console.log('✅ Window location:', window.location.href);

    // Add inline onclick test to test button after mount
    const testBtn = document.getElementById('test-button');
    if (testBtn) {
      console.log('✅ Found test button element');
      testBtn.onclick = () => {
        console.log('🎯 INLINE ONCLICK FIRED!');
        alert('Inline onclick works!');
      };
    }
  }, []);

  const handleAutoFill = () => {
    setFormData({
      email: 'demo@pulsebridge.ai',
      password: 'demo123'
    });
    setError('Demo credentials filled! Click "Sign in" or use Auto Login.');
  };

  const handleDemoLogin = async () => {
    try {
      // Auto-fill with demo credentials and login
      const demoResult = await login('demo@pulsebridge.ai', 'demo123');
      if (demoResult.success) {
        router.push('/dashboard');
      } else {
        // If login fails, just bypass auth and go to dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      // Fallback: just go to dashboard regardless
      router.push('/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Login form submitted');
    console.log('📧 Email:', formData.email);
    console.log('🔑 Password length:', formData.password.length);
    console.log('📝 Form valid?', (e.currentTarget as HTMLFormElement).checkValidity());
    
    // Validation
    if (!formData.email || !formData.password) {
      const errorMsg = 'Please fill in all fields';
      console.log('❌ Validation failed:', errorMsg);
      setError(errorMsg);
      return;
    }
    
    if (!formData.email.includes('@')) {
      const errorMsg = 'Please enter a valid email address';
      console.log('❌ Email validation failed:', errorMsg);
      setError(errorMsg);
      return;
    }
    
    setError('');

    try {
      console.log('⏳ Calling login function...');
      console.log('⏳ Login function type:', typeof login);
      
      const result = await login(formData.email, formData.password);
      console.log('📥 Login result:', result);
      console.log('📥 Result type:', typeof result);
      console.log('📥 Result success:', result?.success);

      if (result && result.success) {
        console.log('✅ Login successful, redirecting to dashboard...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      } else {
        console.log('❌ Login failed:', result?.error);
        setError(result?.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('💥 Login error caught:', error);
      console.error('💥 Error type:', typeof error);
      console.error('💥 Error message:', error instanceof Error ? error.message : String(error));
      setError('Authentication service temporarily unavailable. Please try the demo access below.');
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
              theme === 'dark' ? 'text-gray-400' : 'text-gray-800'
            }`}>
              Sign in to your PulseBridge account
            </p>
          </div>

          {/* Debug Test Button */}
                    {/* Environment Debug Information */}
                  <EnvironmentDebug />

                  {/* Enhanced Debug Test Buttons */}
          <div className="space-y-2 mb-4">
            <button
              id="test-button"
              onClick={() => {
                console.log('🧪 TEST BUTTON CLICKED - JS is working!');
                console.log('🧪 Current time:', new Date().toISOString());
                console.log('🧪 User agent:', navigator.userAgent);
                console.log('🧪 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
                console.log('🧪 Base URL:', process.env.NEXT_PUBLIC_BASE_URL);
                alert('JavaScript is working! Check console for environment details.');
              }}
              className="w-full bg-yellow-500 text-black py-2 px-4 rounded mb-2 cursor-pointer"
            >
              🧪 Test Environment & JS
            </button>
            
            <button
              onClick={async () => {
                console.log('🔍 ENVIRONMENT DIAGNOSTIC STARTING...');
                console.log('🔍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
                console.log('🔍 Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
                console.log('🔍 Base URL:', process.env.NEXT_PUBLIC_BASE_URL);
                
                try {
                  console.log('🔍 Testing Auth Context...');
                  console.log('🔍 Login function type:', typeof login);
                  console.log('🔍 isLoading state:', isLoading);
                  console.log('🔍 Current user:', user);
                  
                  // Test with mock credentials
                  console.log('🔍 Testing mock login...');
                  const result = await login('test@example.com', 'password123');
                  console.log('🔍 Mock login result:', result);
                  
                } catch (error) {
                  console.error('🔍 Diagnostic error:', error);
                  console.error('🔍 Error details:', {
                    message: error instanceof Error ? error.message : String(error),
                    stack: error instanceof Error ? error.stack : undefined
                  });
                }
              }}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
            >
              🔍 Run Full Environment Diagnostic
            </button>

            <button
              onClick={async () => {
                console.log('🚀 DEMO LOGIN BUTTON CLICKED');
                try {
                  console.log('📋 Filling demo credentials...');
                  setFormData({
                    email: 'admin@pulsebridge.ai',
                    password: 'demo123'
                  });
                  console.log('✅ Demo credentials filled');
                  
                  // Show success message
                  setError('Demo credentials loaded! Now testing login...');
                  
                  setTimeout(async () => {
                    console.log('🔐 Testing login function...');
                    try {
                      const result = await login('admin@pulsebridge.ai', 'demo123');
                      console.log('📥 Login result:', result);
                      
                      if (result && result.success) {
                        console.log('✅ Login successful, redirecting...');
                        router.push('/dashboard');
                      } else {
                        console.log('❌ Login failed, but going to dashboard anyway...');
                        setError(`Login failed: ${result?.error || 'Unknown error'}`);
                        // Still redirect for demo purposes
                        setTimeout(() => router.push('/dashboard'), 2000);
                      }
                    } catch (loginError) {
                      console.error('💥 Login function error:', loginError);
                      setError(`Login error: ${loginError instanceof Error ? loginError.message : String(loginError)}`);
                      // Still redirect for demo purposes
                      setTimeout(() => router.push('/dashboard'), 2000);
                    }
                  }, 1000);
                } catch (error) {
                  console.error('💥 Demo login error:', error);
                  setError(`Demo error: ${error instanceof Error ? error.message : String(error)}`);
                  router.push('/dashboard');
                }
              }}
              className="w-full bg-green-500 text-white py-2 px-4 rounded cursor-pointer"
            >
              🚀 Enhanced Demo Login Test
            </button>
          </div>

          {/* Form */}
          <form
            className="mt-8 space-y-6"
            onSubmit={(e) => {
              console.log('📝 Form onSubmit fired!');
              console.log('📝 Event type:', e.type);
              console.log('📝 Form data:', formData);
              console.log('📝 IsLoading:', isLoading);
              
              e.preventDefault(); // Prevent default form submission
              
              console.log('📝 Calling handleSubmit...');
              handleSubmit(e);
            }}
            noValidate
          >
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
              {/* Email Field */}
              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}>
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
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
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
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
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`} />
                    ) : (
                      <Eye className={`h-5 w-5 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
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
            <div className="space-y-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={async (e) => {
                  console.log('🖱️ MAIN SIGN IN BUTTON CLICKED!');
                  console.log('🖱️ Button type:', e.currentTarget.type);
                  console.log('🖱️ Is loading:', isLoading);
                  console.log('🖱️ Is disabled:', e.currentTarget.disabled);
                  console.log('🖱️ Form element:', e.currentTarget.form);
                  console.log('🖱️ Form data before submit:', formData);
                  console.log('🖱️ Email length:', formData.email.length);
                  console.log('🖱️ Password length:', formData.password.length);
                  
                  // Create a synthetic form event and call handleSubmit directly
                  const syntheticEvent = {
                    preventDefault: () => {},
                    currentTarget: { checkValidity: () => true }
                  } as React.FormEvent;
                  
                  console.log('🖱️ Calling handleSubmit directly...');
                  await handleSubmit(syntheticEvent);
                }}
                onMouseDown={() => console.log('🐭 Mouse down on main button')}
                onMouseUp={() => console.log('🐭 Mouse up on main button')}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pulse-cyan transition-colors ${
                  isLoading
                    ? 'bg-pulse-cyan/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pulse-cyan to-pulse-purple hover:from-pulse-cyan/80 hover:to-pulse-purple/80'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>

              {/* Auto Fill Demo Credentials */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleAutoFill}
                className={`w-full flex justify-center py-2 px-4 border text-xs font-medium rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'border-blue-600 text-blue-400 hover:bg-blue-900/20'
                    : 'border-blue-300 text-blue-600 hover:bg-blue-50'
                }`}
              >
                📋 Fill Demo Credentials
              </motion.button>

              {/* Demo Access Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleDemoLogin}
                className={`w-full flex justify-center py-3 px-4 border-2 border-dashed text-sm font-medium rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-800'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                🚀 Auto Login & Access Dashboard
              </motion.button>
            </div>

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