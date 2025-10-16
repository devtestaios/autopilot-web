"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Mail, ArrowLeft } from "lucide-react";
import { PulseWaveLogo } from "@/components/PulseWaveLogo";

export default function ForgotPasswordPage() {
  const { resetPassword, isLoading } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    const result = await resetPassword(email);
    if (result.success) {
      setSuccess("Password reset instructions sent! Please check your email.");
    } else {
      setError(result.error || "Failed to send reset instructions. Try again.");
    }
  };

  return (
    <div className={`min-h-screen flex ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="text-center">
            <Link href="/login" className={`inline-flex items-center mb-8 transition-colors ${theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}>
              <ArrowLeft size={20} className="mr-2" />
              Back to Login
            </Link>
            <div className="flex justify-center mb-6">
              <PulseWaveLogo size="large" className="text-pulse-cyan" />
            </div>
            <h2 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Forgot your password?</h2>
            <p className={`mt-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Enter your email and we'll send password reset instructions.</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`px-4 py-3 rounded-md border ${theme === "dark" ? "bg-red-900/20 border-red-800/50 text-red-200" : "bg-red-50 border-red-200 text-red-700"}`}>{error}</motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`px-4 py-3 rounded-md border ${theme === "dark" ? "bg-green-900/20 border-green-800/50 text-green-200" : "bg-green-50 border-green-200 text-green-700"}`}>{success}</motion.div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"}`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  "Send Reset Instructions"
                )}
              </button>
            </div>
            <div className="text-center">
              <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Remembered your password?{' '}
                <Link href="/login" className={`font-medium transition-colors ${theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}>Back to Login</Link>
              </span>
            </div>
          </form>
        </motion.div>
      </div>
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-teal-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative h-full flex items-center justify-center p-12 text-white">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="max-w-md">
            <h3 className="text-3xl font-bold mb-6">Enterprise-Grade Security</h3>
            <p className="text-lg text-blue-100 mb-8">Your account and data are protected with advanced security protocols.</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <span className="text-blue-100">SOC2 & GDPR Compliant</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <span className="text-blue-100">Zero Trust Architecture</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <span className="text-blue-100">Multi-Factor Authentication</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
