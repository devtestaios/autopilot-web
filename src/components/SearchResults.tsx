'use client';

import Link from 'next/link';
import { SearchResult } from '@/hooks/useGlobalSearch';
import { Search, FileText, Users, AlertTriangle, Globe } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  isSearching: boolean;
  searchTerm: string;
  onResultClick: () => void;
}

const getResultIcon = (type: SearchResult['type']) => {
  switch (type) {
    case 'campaign':
      return <Globe className="w-4 h-4" />;
    case 'lead':
      return <Users className="w-4 h-4" />;
    case 'alert':
      return <AlertTriangle className="w-4 h-4" />;
    case 'page':
      return <FileText className="w-4 h-4" />;
    default:
      return <Search className="w-4 h-4" />;
  }
};

const getResultTypeColor = (type: SearchResult['type']) => {
  switch (type) {
    case 'campaign':
      return 'text-blue-600 bg-blue-50';
    case 'lead':
      return 'text-green-600 bg-green-50';
    case 'alert':
      return 'text-red-600 bg-red-50';
    case 'page':
      return 'text-purple-600 bg-purple-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export function SearchResults({ results, isSearching, searchTerm, onResultClick }: SearchResultsProps) {
  if (isSearching) {
    return (
      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
        <div className="p-4 text-center text-gray-500">
          <Search className="w-5 h-5 animate-spin mx-auto mb-2" />
          Searching...
        </div>
      </div>
    );
  }

  if (!searchTerm.trim()) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
        <div className="p-4 text-center text-gray-500">
          <Search className="w-5 h-5 mx-auto mb-2" />
          No results found for "{searchTerm}"
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-96 overflow-y-auto">
      <div className="p-2">
        <div className="text-xs text-gray-500 px-3 py-2 font-medium uppercase tracking-wide">
          {results.length} result{results.length !== 1 ? 's' : ''} for "{searchTerm}"
        </div>
        <div className="space-y-1">
          {results.map((result) => (
            <Link
              key={result.id}
              href={result.url}
              onClick={onResultClick}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className={`p-2 rounded-md ${getResultTypeColor(result.type)}`}>
                {getResultIcon(result.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {result.title}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getResultTypeColor(result.type)} capitalize`}>
                    {result.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {result.description}
                </p>
                {result.metadata && (
                  <div className="flex items-center gap-2 mt-1">
                    {result.metadata.platform && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {result.metadata.platform}
                      </span>
                    )}
                    {result.metadata.status && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        result.metadata.status === 'active' 
                          ? 'text-green-700 bg-green-100' 
                          : 'text-gray-700 bg-gray-100'
                      }`}>
                        {result.metadata.status}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}