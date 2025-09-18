'use client';

import { useState, useEffect } from 'react';
import { Zap, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { 
  googleAdsService, 
  type GoogleAdsConnectionStatus 
} from '@/lib/services/googleAdsService';

interface GoogleAdsIntegrationProps {
  onSync?: () => void;
  loading?: boolean;
}

export default function GoogleAdsIntegration({ onSync, loading }: GoogleAdsIntegrationProps) {
  const [connectionStatus, setConnectionStatus] = useState<GoogleAdsConnectionStatus>({
    connected: false,
    status: 'checking'
  });
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState<string>('');

  // Check connection on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const status = await googleAdsService.checkConnection();
    setConnectionStatus(status);
  };

  const handleSync = async () => {
    setSyncStatus('syncing');
    setSyncMessage('Syncing campaigns from Google Ads...');
    
    try {
      const result = await googleAdsService.syncCampaigns();
      
      if (result.success) {
        setSyncStatus('success');
        setSyncMessage(result.message);
        setLastSync(new Date().toLocaleString());
        
        // Call the onSync callback to refresh the UI
        if (onSync) {
          onSync();
        }
        
        // Reset status after 3 seconds
        setTimeout(() => {
          setSyncStatus('idle');
          setSyncMessage('');
        }, 3000);
      } else {
        setSyncStatus('error');
        setSyncMessage(result.message);
      }
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage('Connection error during sync');
      console.error('Sync failed:', error);
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus.status) {
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
    switch (connectionStatus.status) {
      case 'connected':
        return 'Connected to Google Ads';
      case 'disconnected':
        return 'Google Ads Demo Mode';
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
          disabled={connectionStatus.status === 'checking'}
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
        
        {/* Sync Status Message */}
        {syncMessage && (
          <div className={`mb-3 p-2 rounded-md text-sm ${
            syncStatus === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            syncStatus === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {syncMessage}
          </div>
        )}
        
                <div className="flex gap-2">
          <button
            onClick={handleSync}
            disabled={loading || syncStatus === 'syncing'}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {syncStatus === 'syncing' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Syncing...
              </>
            ) : connectionStatus.status === 'connected' ? (
              'Sync Campaigns'
            ) : (
              'Try Demo Sync'
            )}
          </button>
          <button
            onClick={() => window.open('/DEPLOYMENT_STEPS.md', '_blank')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Setup Guide
          </button>
        </div>
      </div>

      {/* Demo Mode Instructions */}
      {connectionStatus.status === 'disconnected' && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 mb-2">🚀 Demo Mode Active</h4>
          <p className="text-sm text-blue-700 mb-3">
            {connectionStatus.message || 'Try the demo sync to see how Google Ads campaigns will appear. Ready to connect your real Google Ads account?'}
          </p>
          <div className="flex gap-2">
            <a
              href="/DEPLOYMENT_STEPS.md"
              target="_blank"
              className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200 transition-colors"
            >
              📋 Setup Guide
            </a>
            <a
              href="/GOOGLE_ADS_SETUP.md"
              target="_blank"
              className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200 transition-colors"
            >
              🔧 API Credentials
            </a>
          </div>
        </div>
      )}

      {/* Error State */}
      {connectionStatus.status === 'error' && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <h4 className="text-sm font-medium text-red-800 mb-2">Connection Error</h4>
          <p className="text-sm text-red-700 mb-3">
            {connectionStatus.error || 'Unable to connect to Google Ads API. Check your credentials and try again.'}
          </p>
          <button
            onClick={checkConnection}
            className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
          >
            🔄 Retry Connection
          </button>
        </div>
      )}

      {/* Connected State - Show additional info */}
      {connectionStatus.status === 'connected' && connectionStatus.customer_id && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <h4 className="text-sm font-medium text-green-800 mb-2">✅ Google Ads Connected</h4>
          <p className="text-sm text-green-700">
            Customer ID: {connectionStatus.customer_id}
          </p>
          {connectionStatus.last_checked && (
            <p className="text-xs text-green-600 mt-1">
              Last checked: {new Date(connectionStatus.last_checked).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}