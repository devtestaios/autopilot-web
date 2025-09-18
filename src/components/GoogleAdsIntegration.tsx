'use client';

import { useState, useEffect } from 'react';
import { Zap, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

interface GoogleAdsIntegrationProps {
  onSync?: () => void;
  loading?: boolean;
}

export default function GoogleAdsIntegration({ onSync, loading }: GoogleAdsIntegrationProps) {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected' | 'error'>('checking');
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState<string>('');

  // Check connection on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com'}/google-ads/status`);
      
      if (response.status === 404) {
        // Endpoint not implemented yet - show setup needed
        setConnectionStatus('disconnected');
        return;
      }
      
      const data = await response.json();
      
      if (data.connected === true) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    } catch {
      setConnectionStatus('disconnected');
    }
  };

  const handleSync = async () => {
    setSyncStatus('syncing');
    setSyncMessage('Syncing campaigns from Google Ads...');
    
    try {
      // Check if Google Ads endpoints exist
      const statusCheck = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com'}/google-ads/status`);
      
      if (statusCheck.status === 404) {
        // Demo mode - create sample Google Ads campaigns
        await createDemoCampaigns();
        return;
      }
      
      // Call real sync endpoint
      const campaignSync = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com'}/google-ads/sync-campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await campaignSync.json();
      
      if (campaignSync.ok) {
        setSyncStatus('success');
        setSyncMessage(`Successfully synced ${result.synced || 0} campaigns`);
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
        setSyncMessage(result.detail || 'Sync failed');
      }
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage('Connection error during sync');
      console.error('Sync failed:', error);
    }
  };

  const createDemoCampaigns = async () => {
    // Sample Google Ads campaigns with realistic data
    const sampleCampaigns = [
      {
        name: 'Google Ads - Brand Search Campaign',
        platform: 'google_ads',
        client_name: 'Demo Google Ads Account',
        budget: 2500,
        status: 'active',
        metrics: {
          impressions: 12450,
          clicks: 892,
          conversions: 34,
          ctr: 7.17,
          channel_type: 'SEARCH'
        }
      },
      {
        name: 'Google Ads - Shopping Campaign',
        platform: 'google_ads', 
        client_name: 'Demo Google Ads Account',
        budget: 1800,
        status: 'active',
        metrics: {
          impressions: 8230,
          clicks: 445,
          conversions: 28,
          ctr: 5.41,
          channel_type: 'SHOPPING'
        }
      },
      {
        name: 'Google Ads - Display Remarketing',
        platform: 'google_ads',
        client_name: 'Demo Google Ads Account', 
        budget: 1200,
        status: 'active',
        metrics: {
          impressions: 15680,
          clicks: 234,
          conversions: 12,
          ctr: 1.49,
          channel_type: 'DISPLAY'
        }
      }
    ];

    try {
      let createdCount = 0;
      
      for (const campaign of sampleCampaigns) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com'}/campaigns`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(campaign)
        });
        
        if (response.ok) {
          createdCount++;
        }
      }
      
      setSyncStatus('success');
      setSyncMessage(`Demo: Created ${createdCount} sample Google Ads campaigns`);
      setLastSync(new Date().toLocaleString());
      
      // Call the onSync callback to refresh the UI
      if (onSync) {
        onSync();
      }
      
      // Reset status after 5 seconds for demo
      setTimeout(() => {
        setSyncStatus('idle');
        setSyncMessage('');
      }, 5000);
      
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage('Demo mode failed - please try again');
      console.error('Demo campaign creation failed:', error);
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
            ) : connectionStatus === 'connected' ? (
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
      {connectionStatus === 'disconnected' && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 mb-2">🚀 Demo Mode Active</h4>
          <p className="text-sm text-blue-700 mb-3">
            Try the demo sync to see how Google Ads campaigns will appear. Ready to connect your real Google Ads account?
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
      {connectionStatus === 'error' && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <h4 className="text-sm font-medium text-red-800 mb-2">Connection Error</h4>
          <p className="text-sm text-red-700 mb-3">
            Unable to connect to Google Ads API. Check your credentials and try again.
          </p>
          <button
            onClick={checkConnection}
            className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
          >
            🔄 Retry Connection
          </button>
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