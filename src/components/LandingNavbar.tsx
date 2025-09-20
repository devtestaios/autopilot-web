'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { 
  User, 
  Menu, 
  X, 
  LogIn,
  UserPlus,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { PulseWaveLogo } from './PulseWaveLogo';

interface LandingNavbarProps {
  className?: string;
}

export default function LandingNavbar({ className = '' }: LandingNavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Features', href: '#features' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/30 text-gray-900 dark:text-gray-300 ${className}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Link href="/" className="flex items-center">
              <PulseWaveLogo 
                size="medium" 
                variant="dark" 
                animated={true} 
                showText={true}
                className="drop-shadow-sm"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              item.href.startsWith('/') ? (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className="font-exo-2 font-medium text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    {item.label}
                  </motion.div>
                </Link>
              ) : (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="font-exo-2 font-medium text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  {item.label}
                </motion.a>
              )
            ))}
          </div>

          {/* Auth & Theme Controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.button>

            {/* Authentication Buttons */}
            {isAuthenticated ? (
              <>
                <motion.div
                  className="hidden sm:flex items-center space-x-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href="/dashboard">
                    <motion.button
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-exo-2 font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 212, 255, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </motion.button>
                  </Link>
                  
                  <motion.button
                    onClick={logout}
                    className="p-2 text-gray-800 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Logout"
                  >
                    <LogIn className="w-5 h-5 rotate-180" />
                  </motion.button>
                </motion.div>
              </>
            ) : (
              <motion.div
                className="hidden sm:flex items-center space-x-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Link href="/login">
                  <motion.button
                    className="flex items-center space-x-2 px-4 py-2 text-gray-800 dark:text-gray-300 font-exo-2 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Log In</span>
                  </motion.button>
                </Link>
                
                <Link href="/signup">
                  <motion.button
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-exo-2 font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 10px 20px rgba(0, 212, 255, 0.3)",
                      background: "linear-gradient(to right, #00d4ff, #ec4899)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </motion.button>
                </Link>
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden p-2 rounded-lg text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="lg:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4 border-t border-gray-200/20 dark:border-gray-800/30">
            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-800 dark:text-gray-300 font-exo-2 font-medium hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-gray-200/20 dark:border-gray-800/30 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <motion.button
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-exo-2 font-semibold rounded-lg"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Go to Dashboard</span>
                    </motion.button>
                  </Link>
                  <motion.button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-purple-600 dark:text-purple-400 border border-purple-600/30 dark:border-purple-400/30 rounded-lg font-exo-2 font-medium"
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogIn className="w-4 h-4 rotate-180" />
                    <span>Log Out</span>
                  </motion.button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <motion.button
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-exo-2 font-medium"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Log In</span>
                    </motion.button>
                  </Link>
                  <Link href="/signup">
                    <motion.button
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-exo-2 font-semibold rounded-lg"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Sign Up Free</span>
                    </motion.button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}