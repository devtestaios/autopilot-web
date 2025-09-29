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
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark');
  const [isReady, setIsReady] = useState(false);

  // Apply theme to document - stable with useCallback
  const updateDocumentTheme = useCallback((theme: Theme) => {
    if (typeof window !== 'undefined' && document) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = typeof window !== 'undefined' 
      ? (localStorage.getItem('theme') as Theme) || 'dark'
      : 'dark';
    
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setCurrentTheme(savedTheme);
      updateDocumentTheme(savedTheme);
    }
    setIsReady(true);
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
    theme: isReady ? currentTheme : 'dark',
    toggleTheme: handleToggleTheme,
    setTheme: handleSetTheme,
  }), [isReady, currentTheme, handleToggleTheme, handleSetTheme]);

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