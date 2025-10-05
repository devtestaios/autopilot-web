'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Create context without default values to enable error checking
const ThemeContext = createContext<ThemeContextProps | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always start with 'light' theme to ensure SSR/client consistency
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');

  // Apply theme to document - stable with useCallback
  const updateDocumentTheme = useCallback((theme: Theme) => {
    if (typeof window !== 'undefined' && document) {
      // Remove all theme classes
      document.documentElement.classList.remove('light', 'dark');
      document.body.classList.remove('light', 'dark', 'light-theme');
      
      // Add the new theme class to both html and body
      document.documentElement.classList.add(theme);
      document.body.classList.add(theme);
      
      // Add legacy light-theme class for backwards compatibility
      if (theme === 'light') {
        document.body.classList.add('light-theme');
      }
    }
  }, []);

  // Initialize theme on mount - only run on client side
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme') as Theme;
      
      if (savedTheme === 'light' || savedTheme === 'dark') {
        // Use saved theme preference
        setCurrentTheme(savedTheme);
        updateDocumentTheme(savedTheme);
      } else {
        // No saved theme - check system preference
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemTheme: Theme = prefersDark ? 'dark' : 'light';
        setCurrentTheme(systemTheme);
        updateDocumentTheme(systemTheme);
      }
    } catch (error) {
      // Fallback to light theme if localStorage access fails
      console.warn('Failed to load theme preference:', error);
      setCurrentTheme('light');
      updateDocumentTheme('light');
    }
  }, [updateDocumentTheme]);

  // Toggle between themes - stable with useCallback
  const handleToggleTheme = useCallback(() => {
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    updateDocumentTheme(newTheme);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('theme', newTheme);
      } catch (error) {
        console.warn('Failed to save theme preference:', error);
      }
    }
  }, [currentTheme, updateDocumentTheme]);

  // Set specific theme - stable with useCallback
  const handleSetTheme = useCallback((theme: Theme) => {
    setCurrentTheme(theme);
    updateDocumentTheme(theme);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('theme', theme);
      } catch (error) {
        console.warn('Failed to save theme preference:', error);
      }
    }
  }, [updateDocumentTheme]);

  // Create stable context value with useMemo and stable dependencies
  const themeContextValue: ThemeContextProps = useMemo(() => ({
    theme: currentTheme,
    toggleTheme: handleToggleTheme,
    setTheme: handleSetTheme,
  }), [currentTheme, handleToggleTheme, handleSetTheme]);

  return (
    <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme context
export function useTheme(): ThemeContextProps {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}