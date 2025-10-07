'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, Command, X, FileText, BarChart3, Settings, Target, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchResult {
  id: string
  title: string
  description: string
  url: string
  category: 'campaigns' | 'analytics' | 'reports' | 'settings' | 'pages'
  icon: React.ComponentType<{ className?: string }>
}

// Mock search data - in real app this would come from API
const searchData: SearchResult[] = [
  {
    id: '1',
    title: 'Dashboard',
    description: 'Main platform overview with key metrics',
    url: '/dashboard',
    category: 'pages',
    icon: BarChart3
  },
  {
    id: '2',
    title: 'Campaigns',
    description: 'Manage all marketing campaigns',
    url: '/campaigns',
    category: 'campaigns',
    icon: Target
  },
  {
    id: '3',
    title: 'Analytics Performance',
    description: 'View detailed performance metrics',
    url: '/analytics/performance',
    category: 'analytics',
    icon: BarChart3
  },
  {
    id: '4',
    title: 'Analytics ROI',
    description: 'Return on investment analysis',
    url: '/analytics/roi',
    category: 'analytics',
    icon: BarChart3
  },
  {
    id: '5',
    title: 'Reports',
    description: 'Generate and view reports',
    url: '/reports',
    category: 'reports',
    icon: FileText
  },
  {
    id: '6',
    title: 'Scheduler',
    description: 'Schedule campaigns and automation',
    url: '/scheduler',
    category: 'pages',
    icon: Calendar
  },
  {
    id: '7',
    title: 'Settings',
    description: 'Platform configuration and preferences',
    url: '/settings',
    category: 'settings',
    icon: Settings
  },
  {
    id: '8',
    title: 'Create New Campaign',
    description: 'Start a new marketing campaign',
    url: '/campaigns/new',
    category: 'campaigns',
    icon: Target
  },
  {
    id: '9',
    title: 'Campaign Templates',
    description: 'Browse campaign templates',
    url: '/campaigns/templates',
    category: 'campaigns',
    icon: Target
  },
  {
    id: '10',
    title: 'Optimization',
    description: 'AI-powered campaign optimization',
    url: '/optimization',
    category: 'pages',
    icon: BarChart3
  }
]

const categoryColors = {
  campaigns: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20',
  analytics: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20',
  reports: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20',
  settings: 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20',
  pages: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20'
}

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter results based on query
  useEffect(() => {
    if (query.trim() === '') {
      setFilteredResults(searchData.slice(0, 6)) // Show top 6 results by default
    } else {
      const filtered = searchData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredResults(filtered.slice(0, 10)) // Limit to 10 results
    }
    setSelectedIndex(0)
  }, [query])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredResults.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredResults[selectedIndex]) {
          handleSelect(filteredResults[selectedIndex])
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredResults, selectedIndex, onClose])

  const handleSelect = (result: SearchResult) => {
    router.push(result.url)
    onClose()
    setQuery('')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-auto px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search campaigns, analytics, reports..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none text-lg"
              />
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded border">⌘</kbd>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded border">K</kbd>
              </div>
              <button
                onClick={onClose}
                className="ml-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {filteredResults.length > 0 ? (
                <div className="p-2">
                  {filteredResults.map((result, index) => {
                    const Icon = result.icon
                    const isSelected = index === selectedIndex

                    return (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                        onClick={() => handleSelect(result)}
                      >
                        <div className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 ${categoryColors[result.category]}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {result.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {result.description}
                          </p>
                        </div>
                        <div className="ml-3">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-md capitalize ${categoryColors[result.category]}`}>
                            {result.category}
                          </span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {query ? 'No results found' : 'Start typing to search'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {query 
                      ? `No results found for "${query}". Try different keywords.`
                      : 'Search for campaigns, analytics, reports, and more...'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <kbd className="px-1.5 py-1 bg-white dark:bg-gray-600 rounded border text-xs">↑</kbd>
                    <kbd className="px-1.5 py-1 bg-white dark:bg-gray-600 rounded border text-xs">↓</kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <kbd className="px-1.5 py-1 bg-white dark:bg-gray-600 rounded border text-xs">↵</kbd>
                    <span>Select</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <kbd className="px-1.5 py-1 bg-white dark:bg-gray-600 rounded border text-xs">esc</kbd>
                    <span>Close</span>
                  </div>
                </div>
                <div className="text-gray-400">
                  {filteredResults.length} results
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}