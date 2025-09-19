'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user' | 'viewer';
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    dashboardLayout: 'compact' | 'detailed';
    defaultView: 'dashboard' | 'campaigns' | 'analytics';
  };
  createdAt: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
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

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('autopilot_user');
      const savedToken = localStorage.getItem('autopilot_token');
      
      if (savedUser && savedToken) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('autopilot_user');
          localStorage.removeItem('autopilot_token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Simulate API call - replace with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
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

        const mockToken = `token_${Date.now()}`;
        
        localStorage.setItem('autopilot_user', JSON.stringify(mockUser));
        localStorage.setItem('autopilot_token', mockToken);
        
        setUser(mockUser);
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Simulate API call - replace with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful signup
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

        const mockToken = `token_${Date.now()}`;
        
        localStorage.setItem('autopilot_user', JSON.stringify(mockUser));
        localStorage.setItem('autopilot_token', mockToken);
        
        setUser(mockUser);
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: 'Please fill in all fields with valid information' };
      }
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'Signup failed. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('autopilot_user');
    localStorage.removeItem('autopilot_token');
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('autopilot_user', JSON.stringify(updatedUser));
    }
  };

  const updatePreferences = (preferences: Partial<User['preferences']>) => {
    if (user) {
      const updatedUser = {
        ...user,
        preferences: { ...user.preferences, ...preferences }
      };
      setUser(updatedUser);
      localStorage.setItem('autopilot_user', JSON.stringify(updatedUser));
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
    updatePreferences
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}