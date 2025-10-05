import { useState, useEffect, useCallback, useRef } from 'react'

export interface SearchResult {
  id: string
  title: string
  description: string
  url: string
  type: 'page' | 'campaign' | 'lead' | 'template' | 'alert'
  metadata?: Record<string, any>
}

interface SearchData {
  campaigns?: any[]
  leads?: any[]
  templates?: any[]
}

export const useGlobalSearch = (searchData?: SearchData) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  // Use ref to cache search content and prevent re-renders
  const searchContentRef = useRef<SearchResult[]>([])
  const lastSearchDataRef = useRef<SearchData | undefined>(undefined)

  // Build search content only when data actually changes
  const buildSearchContent = useCallback(() => {
    const content: SearchResult[] = []

    // Static pages (always available)
    content.push(
      {
        id: 'page-dashboard',
        type: 'page',
        title: 'Dashboard',
        description: 'Main dashboard with campaign overview',
        url: '/dashboard',
      },
      {
        id: 'page-campaigns',
        type: 'page',
        title: 'Campaigns',
        description: 'Manage your marketing campaigns',
        url: '/campaigns',
      },
      {
        id: 'page-campaign-management',
        type: 'page',
        title: 'Campaign Management',
        description: 'Advanced campaign management and optimization',
        url: '/campaigns/management',
      },
      {
        id: 'page-analytics',
        type: 'page',
        title: 'Analytics',
        description: 'View campaign performance and analytics',
        url: '/analytics',
      },
      {
        id: 'page-alerts',
        type: 'page',
        title: 'Alerts & Notifications',
        description: 'Monitor campaign alerts and notifications',
        url: '/alerts',
      },
      {
        id: 'page-status',
        type: 'page',
        title: 'System Status',
        description: 'Check system and integration status',
        url: '/status',
      }
    )

    // Add dynamic content if available
    if (searchData?.campaigns) {
      searchData.campaigns.forEach(campaign => {
        content.push({
          id: `campaign-${campaign.id}`,
          type: 'campaign',
          title: campaign.name,
          description: `${campaign.platform} campaign - ${campaign.status}`,
          url: `/campaigns/${campaign.id}`,
          metadata: { 
            platform: campaign.platform, 
            status: campaign.status,
            budget: campaign.budget
          }
        })
      })
    }

    if (searchData?.leads) {
      searchData.leads.forEach(lead => {
        content.push({
          id: `lead-${lead.id}`,
          type: 'lead',
          title: lead.name || lead.email,
          description: `Lead from ${lead.source || 'unknown'} source`,
          url: `/leads?search=${encodeURIComponent(lead.email)}`,
          metadata: { 
            source: lead.source, 
            email: lead.email,
            created_at: lead.created_at
          }
        })
      })
    }

    if (searchData?.templates) {
      searchData.templates.forEach(template => {
        content.push({
          id: `template-${template.id}`,
          type: 'template',
          title: template.name,
          description: template.description,
          url: `/campaigns/templates?search=${encodeURIComponent(template.name)}`,
          metadata: { 
            category: template.category, 
            platform: template.platform
          }
        })
      })
    }

    // Mock alerts
    content.push(
      {
        id: 'alert-budget',
        type: 'alert',
        title: 'Budget Alert',
        description: 'Campaign budget utilization at 85%',
        url: '/alerts',
        metadata: { severity: 'warning' }
      },
      {
        id: 'alert-performance',
        type: 'alert',
        title: 'Performance Alert',
        description: 'CTR below threshold for Summer Sale campaign',
        url: '/alerts',
        metadata: { severity: 'info' }
      }
    )

    return content
  }, [searchData])

  // Update search content when data changes or on mount
  useEffect(() => {
    if (searchData !== lastSearchDataRef.current) {
      searchContentRef.current = buildSearchContent()
      lastSearchDataRef.current = searchData
    }
  }, [searchData, buildSearchContent])

  // Initial build on mount to ensure static pages are always available
  useEffect(() => {
    if (searchContentRef.current.length === 0) {
      searchContentRef.current = buildSearchContent()
    }
  }, [buildSearchContent])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchModalOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Debounced search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    
    const searchTimeout = setTimeout(() => {
      const filteredResults = searchContentRef.current.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.metadata && Object.values(item.metadata).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        ))
      )

      // Sort by relevance
      filteredResults.sort((a, b) => {
        const aExact = a.title.toLowerCase().includes(searchTerm.toLowerCase())
        const bExact = b.title.toLowerCase().includes(searchTerm.toLowerCase())
        
        if (aExact && !bExact) return -1
        if (!aExact && bExact) return 1
        return 0
      })

      setResults(filteredResults.slice(0, 10)) // Limit results
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [searchTerm])

  return {
    isSearchModalOpen,
    setIsSearchModalOpen,
    searchTerm,
    setSearchTerm,
    results,
    isSearching,
    searchContent: searchContentRef.current,
    hasResults: results.length > 0,
    showResults: searchTerm.trim().length > 0,
    openSearch: () => setIsSearchModalOpen(true),
    closeSearch: () => setIsSearchModalOpen(false)
  }
}

export default useGlobalSearch