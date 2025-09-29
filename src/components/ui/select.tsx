import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
  className?: string;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

export function Select({ value, onValueChange, children, className }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const setIsOpenCallback = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ PERFORMANCE: useMemo prevents context consumers from unnecessary re-renders
  const contextValue = useMemo(() => ({ 
    value, 
    onValueChange, 
    isOpen, 
    setIsOpen: setIsOpenCallback 
  }), [value, onValueChange, isOpen, setIsOpenCallback]);

  return (
    <SelectContext.Provider value={contextValue}>
      <div ref={selectRef} className={`relative ${className}`}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className }: SelectTriggerProps) {
  const { isOpen, setIsOpen } = React.useContext(SelectContext);

  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={`
        flex w-full items-center justify-between rounded-md border border-gray-300 
        bg-white px-3 py-2 text-sm placeholder:text-gray-400 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
        disabled:cursor-not-allowed disabled:opacity-50
        dark:border-gray-700 dark:bg-gray-800 dark:text-white
        ${className}
      `}
    >
      {children}
      <svg
        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

export function SelectContent({ children, className }: SelectContentProps) {
  const { isOpen } = React.useContext(SelectContext);

  if (!isOpen) return null;

  return (
    <div
      className={`
        absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-gray-300 
        bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800
        ${className}
      `}
    >
      <div className="max-h-60 overflow-auto py-1">
        {children}
      </div>
    </div>
  );
}

export function SelectItem({ value, children, className }: SelectItemProps) {
  const { onValueChange, setIsOpen } = React.useContext(SelectContext);

  const handleClick = () => {
    onValueChange?.(value);
    setIsOpen(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        flex w-full items-center px-3 py-2 text-sm text-left
        hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
        dark:hover:bg-gray-700 dark:focus:bg-gray-700 dark:text-white
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const { value } = React.useContext(SelectContext);

  return (
    <span className={value ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
      {value || placeholder}
    </span>
  );
}