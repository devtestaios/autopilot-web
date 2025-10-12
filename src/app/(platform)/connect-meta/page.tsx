'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/EnhancedAuthContext'
import toast, { Toaster } from 'react-hot-toast'

export default function ConnectMetaPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const userId = user?.id || 'test-user-123' // Use real user ID with fallback for demo
  const router = useRouter()

  async function handleConnectMeta() {
    setLoading(true)
    setError('')

    try {
      // Call backend to get authorization URL
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'}/api/v1/oauth/meta/authorize-url?user_id=${userId}`
      )

      if (!response.ok) {
        throw new Error('Failed to get authorization URL')
      }

      const data = await response.json()

      // Redirect to Meta authorization
      window.location.href = data.authorization_url

    } catch (err: any) {
      console.error('Failed to connect Meta:', err)
      setError(err.message || 'Failed to connect to Meta')
      setLoading(false)
    }
  }

  async function checkConnection() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'}/api/v1/oauth/meta/status/${userId}`
      )

      const data = await response.json()
      console.log('Meta connection status:', data)

      if (data.connected) {
        toast.success('✅ Meta account connected successfully!', {
          duration: 4000,
          position: 'top-center',
        })
      } else {
        toast.error('❌ Meta account not connected', {
          duration: 4000,
          position: 'top-center',
        })
      }
    } catch (err) {
      console.error('Failed to check status:', err)
      toast.error('Failed to check connection status')
    }
  }

  async function syncCampaigns() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'}/api/v1/meta/sync-campaigns?user_id=${userId}`,
        { method: 'POST' }
      )

      if (!response.ok) {
        throw new Error('Failed to sync campaigns')
      }

      const data = await response.json()
      toast.success(
        `🎉 Successfully synced ${data.campaigns_synced} campaigns with ${data.metrics_synced} metrics!`,
        {
          duration: 5000,
          position: 'top-center',
        }
      )

    } catch (err: any) {
      console.error('Failed to sync:', err)
      setError(err.message || 'Failed to sync campaigns')
      toast.error(err.message || 'Failed to sync campaigns', {
        duration: 4000,
        position: 'top-center',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-2">
            Connect Meta Ads
          </h1>
          <p className="text-slate-300 mb-8">
            Connect your Meta (Facebook/Instagram) Ads account to sync campaigns and metrics
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Connect Button */}
            <button
              onClick={handleConnectMeta}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Connecting...
                </span>
              ) : (
                'Connect Meta Ads Account'
              )}
            </button>

            {/* Check Status Button */}
            <button
              onClick={checkConnection}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-lg transition-all"
            >
              Check Connection Status
            </button>

            {/* Sync Button */}
            <button
              onClick={syncCampaigns}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all"
            >
              {loading ? 'Syncing...' : 'Sync Campaigns & Metrics'}
            </button>
          </div>

          {/* Info */}
          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h3 className="text-blue-300 font-semibold mb-2">What happens when you connect:</h3>
            <ul className="text-slate-300 text-sm space-y-2">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">1.</span>
                You'll be redirected to Meta to authorize access
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">2.</span>
                We'll fetch your ad accounts and campaigns
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">3.</span>
                Campaign data will be synced to your dashboard
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">4.</span>
                Metrics will update automatically
              </li>
            </ul>
          </div>

          {/* Current User ID (for testing) */}
          <div className="mt-6 text-xs text-slate-500">
            Testing with User ID: <code className="bg-slate-800 px-2 py-1 rounded">{userId}</code>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
