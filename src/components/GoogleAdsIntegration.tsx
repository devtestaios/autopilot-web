'use client';

import { useState } from 'react';
import { Zap, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

interface GoogleAdsIntegrationProps {
  onSync?: () => void;
  loading?: boolean;
}

export default function GoogleAdsIntegration({ onSync, loading }: GoogleAdsIntegrationProps) {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected' | 'error'>('checking');
  const [lastSync, setLastSync] = useState<string | null>(null);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com'}/google-ads/status`);
      const data = await response.json();
      
      if (data.available && data.connection_test?.success) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      setConnectionStatus('error');
    }
  };

  const handleSync = async () => {
    if (onSync) {
      onSync();
    }
    
    try {
      // Call sync endpoints
      const campaignSync = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com'}/google-ads/sync-campaigns`, {
        method: 'POST'
      });
      
      if (campaignSync.ok) {
        setLastSync(new Date().toLocaleString());
      }
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'disconnected':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <RefreshCw className="w-5 h-5 text-gray-500 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected to Google Ads';
      case 'disconnected':
        return 'Google Ads Not Configured';
      case 'error':
        return 'Connection Error';
      default:
        return 'Checking Connection...';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Google Ads Integration</h3>
        </div>
        <button
          onClick={checkConnection}
          disabled={connectionStatus === 'checking'}
          className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          Check Status
        </button>
      </div>

      {/* Connection Status */}
      <div className="flex items-center gap-2 mb-4">
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
      </div>

      {/* Feature List */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm">Real-time campaign performance sync</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm">Automated budget optimization</span>
        </div>
        <div className="flex items-center gap-3">
          <Zap className="w-4 h-4 text-green-500" />
          <span className="text-sm">AI-powered bid adjustments</span>
        </div>
      </div>

      {/* Sync Controls */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Campaign Data Sync</span>
          {lastSync && (
            <span className="text-xs text-gray-500">
              Last sync: {lastSync}
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleSync}
            disabled={loading || connectionStatus !== 'connected'}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Syncing...' : 'Sync Now'}
          </button>
          <button
            onClick={() => alert('Auto-sync will be available in the next update!')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Auto-Sync
          </button>
        </div>
      </div>

      {/* Setup Instructions */}
      {connectionStatus === 'disconnected' && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Setup Required</h4>
          <p className="text-sm text-yellow-700 mb-2">
            Configure Google Ads API credentials to enable automated campaign management.
          </p>
          <a
            href="/GOOGLE_ADS_SETUP.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-yellow-800 underline hover:text-yellow-900"
          >
            View Setup Instructions →
          </a>
        </div>
      )}

      {/* Connection Error */}
      {connectionStatus === 'error' && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <h4 className="text-sm font-medium text-red-800 mb-2">Connection Error</h4>
          <p className="text-sm text-red-700">
            Unable to connect to Google Ads API. Please check your configuration and try again.
          </p>
        </div>
      )}
    </div>
  );
}