'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Command } from 'lucide-react';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { SearchResults } from '@/components/SearchResults';
import { useSearchContext } from '@/contexts/SearchContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlobalSearchProps {
  className?: string;
  placeholder?: string;
  variant?: 'default' | 'header' | 'modal';
  onClose?: () => void;
}

export function GlobalSearch({ 
  className, 
  placeholder = "Search campaigns, leads, pages...", 
  variant = 'default',
  onClose 
}: GlobalSearchProps) {
  const { campaigns, leads } = useSearchContext();
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { 
    searchTerm, 
    setSearchTerm, 
    isSearching, 
    results, 
    hasResults, 
    showResults 
  } = useGlobalSearch({ campaigns, leads });

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        if (variant === 'modal') {
          setIsOpen(true);
        } else {
          inputRef.current?.focus();
        }
      }
      
      // Escape to close
      if (event.key === 'Escape') {
        if (variant === 'modal') {
          setIsOpen(false);
          onClose?.();
        } else {
          inputRef.current?.blur();
          setSearchTerm('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchTerm, variant, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        if (variant === 'modal') {
          setIsOpen(false);
          onClose?.();
        }
      }
    };

    if (isFocused || isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isFocused, isOpen, variant, onClose]);

  const handleResultClick = () => {
    setSearchTerm('');
    setIsFocused(false);
    if (variant === 'modal') {
      setIsOpen(false);
      onClose?.();
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    inputRef.current?.focus();
  };

  // Modal variant for full-screen search
  if (variant === 'modal') {
    return (
      <>
        {/* Trigger button for modal */}
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors",
            className
          )}
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">{placeholder}</span>
          <div className="hidden sm:flex items-center gap-1 ml-auto">
            <kbd className="px-1.5 py-0.5 text-xs font-semibold text-foreground bg-muted border border-border rounded">
              ⌘
            </kbd>
            <kbd className="px-1.5 py-0.5 text-xs font-semibold text-foreground bg-muted border border-border rounded">
              K
            </kbd>
          </div>
        </button>

        {/* Modal overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[10vh] px-4"
            >
              <motion.div
                ref={containerRef}
                role="dialog"
                aria-modal="true"
                aria-label="Global Search"
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="w-full max-w-2xl bg-card rounded-xl shadow-2xl border border-border overflow-hidden"
              >
                <div className="flex items-center px-4 py-3 border-b border-border">
                  <Search className="w-5 h-5 text-muted-foreground mr-3" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent text-lg placeholder-muted-foreground focus:outline-none text-foreground"
                    autoFocus
                  />
                  {searchTerm && (
                    <button
                      onClick={handleClear}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onClose?.();
                    }}
                    className="ml-2 p-1 hover:bg-muted rounded"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {showResults && (
                    <SearchResults
                      results={results}
                      isSearching={isSearching}
                      searchTerm={searchTerm}
                      onResultClick={handleResultClick}
                    />
                  )}
                  
                  {!searchTerm && (
                    <div className="p-8 text-center text-muted-foreground">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-40" />
                      <p className="text-lg font-medium mb-2">Search everything</p>
                      <p className="text-sm">Find campaigns, leads, pages, and more...</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Header variant for navigation bars
  if (variant === 'header') {
    return (
      <div ref={containerRef} className={cn("relative", className)}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted/80 rounded"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
          {!searchTerm && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-muted-foreground bg-muted border border-border rounded">
                ⌘K
              </kbd>
            </div>
          )}
        </div>
        
        {isFocused && showResults && (
          <SearchResults
            results={results}
            isSearching={isSearching}
            searchTerm={searchTerm}
            onResultClick={handleResultClick}
          />
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>
      
      {isFocused && showResults && (
        <SearchResults
          results={results}
          isSearching={isSearching}
          searchTerm={searchTerm}
          onResultClick={handleResultClick}
        />
      )}
    </div>
  );
}

export default GlobalSearch;