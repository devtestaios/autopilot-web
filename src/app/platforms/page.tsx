'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { 
  PlatformsGrid, 
  ConnectionStats,
  type Platform,
  type PlatformConnection 
} from '@/components/platforms/PlatformConnectionCard';
import { 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Plus,
  Settings,
  Info
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

// =============================================================================
// PLATFORMS PAGE COMPONENT
// =============================================================================

export default function PlatformsPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Handle OAuth callback results
  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const platform = searchParams.get('platform');
    const account = searchParams.get('account');
    
    if (success === 'true' && platform) {
      toast({
        title: 'Platform Connected!',
        description: `Successfully connected ${platform}${account ? ` (${account})` : ''}`,
        variant: 'default',
      });
      
      // Clean up URL parameters
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('success');
      newUrl.searchParams.delete('platform');
      newUrl.searchParams.delete('account');
      router.replace(newUrl.pathname);
      
      // Refresh connections
      loadConnections();
    }
    
    if (error && platform) {
      toast({
        title: 'Connection Failed',
        description: `Failed to connect ${platform}: ${error}`,
        variant: 'destructive',
      });
      
      // Clean up URL parameters
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      newUrl.searchParams.delete('platform');
      router.replace(newUrl.pathname);
    }
  }, [searchParams, toast, router]);
  
  // Load available platforms
  const loadPlatforms = async () => {
    try {
      const response = await fetch('/api/oauth');
      const data = await response.json();
      
      if (data.success) {
        setPlatforms(data.platforms);
      } else {
        setError('Failed to load platform configurations');
      }
    } catch (error) {
      console.error('Error loading platforms:', error);
      setError('Failed to load platform configurations');
    }
  };
  
  // Load user's platform connections
  const loadConnections = async () => {
    try {
      const response = await fetch('/api/platforms/connections');
      const data = await response.json();
      
      if (data.success) {
        setConnections(data.connections);
      } else {
        if (response.status === 401) {
          router.push('/auth/login?redirect=/platforms');
          return;
        }
        setError('Failed to load platform connections');
      }
    } catch (error) {
      console.error('Error loading connections:', error);
      setError('Failed to load platform connections');
    }
  };
  
  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([loadPlatforms(), loadConnections()]);
      setIsLoading(false);
    };
    
    loadData();
  }, []);
  
  // Handle platform connection
  const handleConnect = async (platformId: string) => {
    setIsConnecting(true);
    
    try {
      // Generate OAuth URL
      const response = await fetch('/api/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          platform: platformId,
          redirectUrl: '/platforms'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Redirect to OAuth provider
        window.location.href = data.authUrl;
      } else {
        toast({
          title: 'Connection Failed',
          description: data.error || 'Failed to initiate platform connection',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error connecting platform:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to initiate platform connection',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Handle platform disconnection
  const handleDisconnect = async (connectionId: string) => {
    try {
      const response = await fetch(`/api/platforms/connections?id=${connectionId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Platform Disconnected',
          description: 'Platform has been successfully disconnected',
        });
        loadConnections();
      } else {
        toast({
          title: 'Disconnection Failed',
          description: data.error || 'Failed to disconnect platform',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error disconnecting platform:', error);
      toast({
        title: 'Disconnection Failed',
        description: 'Failed to disconnect platform',
        variant: 'destructive',
      });
    }
  };
  
  // Handle connection toggle
  const handleToggle = async (connectionId: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/platforms/connections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          connectionId,
          isActive 
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: `Connection ${isActive ? 'Activated' : 'Deactivated'}`,
          description: `Platform connection has been ${isActive ? 'activated' : 'deactivated'}`,
        });
        loadConnections();
      } else {
        toast({
          title: 'Update Failed',
          description: data.error || 'Failed to update connection status',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error toggling connection:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update connection status',
        variant: 'destructive',
      });
    }
  };
  
  // Handle connection refresh
  const handleRefresh = async (connectionId: string) => {
    try {
      // Trigger a sync for this specific connection
      const response = await fetch('/api/platforms/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'sync',
          connectionIds: [connectionId]
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Sync Started',
          description: 'Platform data synchronization has been initiated',
        });
        
        // Refresh connections after a delay
        setTimeout(() => {
          loadConnections();
        }, 2000);
      } else {
        toast({
          title: 'Sync Failed',
          description: data.error || 'Failed to sync platform data',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error refreshing connection:', error);
      toast({
        title: 'Sync Failed',
        description: 'Failed to sync platform data',
        variant: 'destructive',
      });
    }
  };
  
  // Handle sync all platforms
  const handleSyncAll = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/platforms/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Sync Complete',
          description: `Synced ${data.summary.platformsSuccessful}/${data.summary.platformsConnected} platforms successfully`,
        });
        loadConnections();
      } else {
        toast({
          title: 'Sync Failed',
          description: 'Failed to sync platform data',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error syncing platforms:', error);
      toast({
        title: 'Sync Failed',
        description: 'Failed to sync platform data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading platforms...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Platform Connections</h1>
          <p className="text-muted-foreground mt-2">
            Connect your marketing platforms to sync campaign data and metrics
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleSyncAll}
            disabled={connections.length === 0 || isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Sync All
          </Button>
          
          <Button onClick={() => router.push('/platforms/setup')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Platform
          </Button>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Connection Stats */}
      <ConnectionStats connections={connections} />
      
      {/* Platform Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="h-5 w-5 mr-2" />
            How Platform Connections Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Secure OAuth</p>
                <p className="text-muted-foreground">
                  We use industry-standard OAuth 2.0 for secure platform connections
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Real-time Sync</p>
                <p className="text-muted-foreground">
                  Campaign data is synchronized automatically every hour
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Read-only Access</p>
                <p className="text-muted-foreground">
                  We only read your campaign data, never make changes to your accounts
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Platforms Grid */}
      <PlatformsGrid
        platforms={platforms}
        connections={connections}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onToggle={handleToggle}
        onRefresh={handleRefresh}
        isLoading={isConnecting}
      />
      
      {/* Empty State */}
      {platforms.length === 0 && !isLoading && (
        <Card className="text-center py-12">
          <CardContent>
            <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Platforms Available</h3>
            <p className="text-muted-foreground">
              Platform integrations are not configured. Please contact your administrator.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}