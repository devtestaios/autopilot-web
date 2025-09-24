'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark'; // Simplified to dark-only

interface ThemeContextProps {
  theme: Theme;
  // Keeping these for compatibility but they won't do anything
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useState<Theme>('dark'); // Always dark
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Always ensure dark theme is applied
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    document.body.classList.remove('light-theme');
    
    // Clean up any old localStorage theme preferences
    try {
      localStorage.removeItem('theme');
    } catch (error) {
      // Handle localStorage errors gracefully
      console.warn('Failed to remove old theme preference:', error);
    }
  }, []);

  // No-op functions for compatibility
  const toggleTheme = () => {
    // Theme is fixed to dark, so this does nothing
  };

  
  const setTheme = (newTheme: Theme) => {
    // Theme is fixed to dark, so this does nothing
  };

  // Always provide the context with dark theme
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}