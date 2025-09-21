'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user' | 'viewer';
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean | NotificationSettings;
    dashboardLayout: 'compact' | 'detailed';
    defaultView: 'dashboard' | 'campaigns' | 'analytics';
    company?: string;
    timezone?: string;
    language?: string;
    privacy?: PrivacySettings;
    integrations?: Record<string, any>;
  };
  createdAt: string;
  lastLogin: string;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  campaignAlerts: boolean;
  performanceUpdates: boolean;
  budgetAlerts: boolean;
  weeklyReports: boolean;
}

interface PrivacySettings {
  dataSharing: boolean;
  analytics: boolean;
  marketingEmails: boolean;
  profileVisibility: 'public' | 'private' | 'contacts';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: Partial<User['preferences']>) => Promise<void>;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => Promise<void>; // Alias for compatibility
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);

  // Check if Supabase is properly configured
  useEffect(() => {
    const configured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    setIsSupabaseConfigured(configured);
    if (!configured) {
      console.warn('Supabase not configured. Using mock authentication for demo purposes.');
    }
  }, []);

  // Helper function for safe localStorage access
  const safeLocalStorage = {
    getItem: (key: string) => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    },
    setItem: (key: string, value: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    },
    removeItem: (key: string) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    }
  };

  // Check for existing session and listen for auth changes
  useEffect(() => {
    // Initial auth check
    const checkAuth = async () => {
      try {
        if (!isSupabaseConfigured) {
          // For mock authentication, just set loading to false
          setIsLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user profile from our profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const appUser: User = {
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || session.user.email?.split('@')[0] || 'User',
            avatar: profile?.avatar_url,
            role: profile?.role || 'user',
            preferences: profile?.preferences || {
              theme: 'light',
              notifications: true,
              dashboardLayout: 'detailed',
              defaultView: 'dashboard'
            },
            createdAt: session.user.created_at,
            lastLogin: new Date().toISOString()
          };

          setUser(appUser);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };    checkAuth();

    // Listen for auth state changes only if Supabase is configured
    let subscription: any = null;
    
    if (isSupabaseConfigured) {
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        async (event: any, session: any) => {
          if (session?.user) {
            // User signed in
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            const appUser: User = {
              id: session.user.id,
              email: session.user.email!,
              name: profile?.name || session.user.email?.split('@')[0] || 'User',
              avatar: profile?.avatar_url,
              role: profile?.role || 'user',
              preferences: profile?.preferences || {
                theme: 'light',
                notifications: true,
                dashboardLayout: 'detailed',
                defaultView: 'dashboard'
              },
              createdAt: session.user.created_at,
              lastLogin: new Date().toISOString()
            };

            setUser(appUser);
          } else {
            // User signed out
            setUser(null);
          }
          setIsLoading(false);
        }
      );
      
      subscription = authSubscription;
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Helper function to create user profile in database
  const createUserProfile = async (supabaseUser: SupabaseUser) => {
    if (!isSupabaseConfigured) {
      // Skip profile creation for mock authentication
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .insert({
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0],
        role: 'user',
        preferences: {
          theme: 'light',
          notifications: true,
          dashboardLayout: 'detailed',
          defaultView: 'dashboard'
        }
      });

    if (error) {
      console.error('Error creating user profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Use Supabase authentication if configured, otherwise fall back to mock
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          // Get user profile from our profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            console.warn('Profile not found, creating one:', profileError);
            // Create profile if it doesn't exist
            await createUserProfile(data.user);
          }

          const appUser: User = {
            id: data.user.id,
            email: data.user.email!,
            name: profile?.name || data.user.email?.split('@')[0] || 'User',
            avatar: profile?.avatar_url,
            role: profile?.role || 'user',
            preferences: profile?.preferences || {
              theme: 'light',
              notifications: true,
              dashboardLayout: 'detailed',
              defaultView: 'dashboard'
            },
            createdAt: data.user.created_at,
            lastLogin: new Date().toISOString()
          };

          setUser(appUser);
          setIsLoading(false);
          return { success: true };
        }

        setIsLoading(false);
        return { success: false, error: 'Authentication failed' };
      } else {
        // Mock authentication for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email && password.length >= 6) {
          const mockUser: User = {
            id: `user_${Date.now()}`,
            email,
            name: email.split('@')[0],
            role: 'user',
            preferences: {
              theme: 'light',
              notifications: true,
              dashboardLayout: 'detailed',
              defaultView: 'dashboard'
            },
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };

          setUser(mockUser);
          setIsLoading(false);
          return { success: true };
        } else {
          setIsLoading(false);
          return { success: false, error: 'Invalid email or password' };
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Use Supabase authentication if configured, otherwise fall back to mock
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name
            }
          }
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          // Create user profile
          await createUserProfile(data.user);

          // If email confirmation is required, inform user
          if (!data.session) {
            setIsLoading(false);
            return { 
              success: true, 
              error: 'Please check your email to confirm your account before signing in.' 
            };
          }

          // If auto-confirmed, set user immediately
          const appUser: User = {
            id: data.user.id,
            email: data.user.email!,
            name: name,
            role: 'user',
            preferences: {
              theme: 'light',
              notifications: true,
              dashboardLayout: 'detailed',
              defaultView: 'dashboard'
            },
            createdAt: data.user.created_at,
            lastLogin: new Date().toISOString()
          };

          setUser(appUser);
          setIsLoading(false);
          return { success: true };
        }

        setIsLoading(false);
        return { success: false, error: 'Signup failed. Please try again.' };
      } else {
        // Mock signup for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email && password.length >= 6 && name) {
          const mockUser: User = {
            id: `user_${Date.now()}`,
            email,
            name,
            role: 'user',
            preferences: {
              theme: 'light',
              notifications: true,
              dashboardLayout: 'detailed',
              defaultView: 'dashboard'
            },
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };

          setUser(mockUser);
          setIsLoading(false);
          return { success: true };
        } else {
          setIsLoading(false);
          return { success: false, error: 'Please fill in all fields with valid data' };
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      setUser(null);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      try {
        // Update in database only if Supabase is configured
        if (isSupabaseConfigured) {
          const { error } = await supabase
            .from('profiles')
            .update({
              name: updates.name,
              avatar_url: updates.avatar,
              role: updates.role,
              preferences: updates.preferences || user.preferences,
              company: updates.preferences?.company
            })
            .eq('id', user.id);

          if (error) {
            console.error('Error updating user:', error);
            return;
          }
        }

        // Update local state
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  const updatePreferences = async (preferences: Partial<User['preferences']>) => {
    if (user) {
      try {
        const updatedPreferences = { ...user.preferences, ...preferences };
        
        // Update in database only if Supabase is configured
        if (isSupabaseConfigured) {
          const { error } = await supabase
            .from('profiles')
            .update({ preferences: updatedPreferences })
            .eq('id', user.id);

          if (error) {
            console.error('Error updating preferences:', error);
            return;
          }
        }

        // Update local state
        const updatedUser = {
          ...user,
          preferences: updatedPreferences
        };
        setUser(updatedUser);
      } catch (error) {
        console.error('Error updating preferences:', error);
      }
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateUser,
    updatePreferences,
    updateUserPreferences: updatePreferences // Alias for compatibility
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}