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
            "flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
            className
          )}
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">{placeholder}</span>
          <div className="hidden sm:flex items-center gap-1 ml-auto">
            <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
              ⌘
            </kbd>
            <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
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
              className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[10vh] px-4"
            >
              <motion.div
                ref={containerRef}
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent text-lg placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-gray-900 dark:text-white"
                    autoFocus
                  />
                  {searchTerm && (
                    <button
                      onClick={handleClear}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onClose?.();
                    }}
                    className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <X className="w-5 h-5 text-gray-400" />
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
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          )}
          {!searchTerm && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X className="w-4 h-4 text-gray-400" />
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