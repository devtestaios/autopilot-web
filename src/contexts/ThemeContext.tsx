'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextProps>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always start with 'dark' theme to ensure SSR/client consistency
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark');

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
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'dark';
    
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setCurrentTheme(savedTheme);
      updateDocumentTheme(savedTheme);
    }
  }, [updateDocumentTheme]);

  // Toggle between themes - stable with useCallback
  const handleToggleTheme = useCallback(() => {
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    updateDocumentTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  }, [currentTheme, updateDocumentTheme]);

  // Set specific theme - stable with useCallback
  const handleSetTheme = useCallback((theme: Theme) => {
    setCurrentTheme(theme);
    updateDocumentTheme(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
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