'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  AlertCircle, 
  CheckCircle, 
  ExternalLink, 
  Loader2, 
  RefreshCw,
  Settings,
  Trash2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

// =============================================================================
// TYPES
// =============================================================================

interface Platform {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  scopes: string[];
  isEnabled: boolean;
  requiredPermissions?: string[];
}

interface PlatformConnection {
  id: string;
  platform_type: string;
  platform_name: string;
  account_id: string;
  account_name: string;
  is_active: boolean;
  sync_status: 'success' | 'error' | 'pending';
  error_message?: string;
  last_sync: string;
  created_at: string;
}

// =============================================================================
// PLATFORM CONNECTION CARD COMPONENT
// =============================================================================

interface PlatformConnectionCardProps {
  platform: Platform;
  connection?: PlatformConnection;
  onConnect: (platformId: string) => void;
  onDisconnect: (connectionId: string) => void;
  onToggle: (connectionId: string, isActive: boolean) => void;
  onRefresh: (connectionId: string) => void;
  isLoading?: boolean;
}

export function PlatformConnectionCard({
  platform,
  connection,
  onConnect,
  onDisconnect,
  onToggle,
  onRefresh,
  isLoading = false
}: PlatformConnectionCardProps) {
  const { toast } = useToast();
  
  const handleConnect = () => {
    if (!platform.isEnabled) {
      toast({
        title: 'Platform Not Available',
        description: `${platform.name} integration is not configured. Please contact support.`,
        variant: 'destructive',
      });
      return;
    }
    
    onConnect(platform.id);
  };
  
  const getStatusIcon = () => {
    if (!connection) return null;
    
    switch (connection.sync_status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-400" />;
    }
  };
  
  const getStatusText = () => {
    if (!connection) return 'Not connected';
    
    if (!connection.is_active) return 'Disconnected';
    
    switch (connection.sync_status) {
      case 'success':
        return `Connected • Last sync: ${new Date(connection.last_sync).toLocaleDateString()}`;
      case 'error':
        return `Error: ${connection.error_message || 'Connection failed'}`;
      case 'pending':
        return 'Connecting...';
      default:
        return 'Unknown status';
    }
  };
  
  return (
    <Card className={`relative transition-all duration-200 hover:shadow-md ${
      connection?.is_active ? 'ring-2 ring-green-200' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
              style={{ backgroundColor: platform.color }}
            >
              {platform.name.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-lg">{platform.name}</CardTitle>
              <CardDescription className="text-sm">
                {platform.description}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            {!platform.isEnabled && (
              <Badge variant="secondary" className="text-xs">
                Not Available
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {getStatusText()}
          </span>
          {connection && (
            <div className="flex items-center space-x-2">
              <Switch
                checked={connection.is_active}
                onCheckedChange={(checked) => onToggle(connection.id, checked)}
                disabled={isLoading}
              />
              <span className="text-xs text-muted-foreground">
                {connection.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          )}
        </div>
        
        {/* Account Information */}
        {connection && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Account:</span>
              <span className="text-sm text-muted-foreground">
                {connection.account_name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">ID:</span>
              <span className="text-sm text-muted-foreground font-mono">
                {connection.account_id}
              </span>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {connection?.sync_status === 'error' && connection.error_message && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {connection.error_message}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Required Permissions */}
        {!connection && platform.requiredPermissions && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Required Permissions:</span>
            <ul className="text-xs text-muted-foreground space-y-1">
              {platform.requiredPermissions.map((permission, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>{permission}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          {!connection ? (
            <Button 
              onClick={handleConnect}
              disabled={!platform.isEnabled || isLoading}
              className="flex-1"
              style={{ backgroundColor: platform.isEnabled ? platform.color : undefined }}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4 mr-2" />
              )}
              Connect {platform.name}
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRefresh(connection.id)}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {/* TODO: Open settings modal */}}
              >
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDisconnect(connection.id)}
                disabled={isLoading}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// PLATFORMS GRID COMPONENT
// =============================================================================

interface PlatformsGridProps {
  platforms: Platform[];
  connections: PlatformConnection[];
  onConnect: (platformId: string) => void;
  onDisconnect: (connectionId: string) => void;
  onToggle: (connectionId: string, isActive: boolean) => void;
  onRefresh: (connectionId: string) => void;
  isLoading?: boolean;
}

export function PlatformsGrid({
  platforms,
  connections,
  onConnect,
  onDisconnect,
  onToggle,
  onRefresh,
  isLoading = false
}: PlatformsGridProps) {
  
  const getConnectionForPlatform = (platformId: string) => {
    return connections.find(conn => conn.platform_type === platformId);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {platforms.map(platform => (
        <PlatformConnectionCard
          key={platform.id}
          platform={platform}
          connection={getConnectionForPlatform(platform.id)}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
          onToggle={onToggle}
          onRefresh={onRefresh}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}

// =============================================================================
// CONNECTION STATS COMPONENT
// =============================================================================

interface ConnectionStatsProps {
  connections: PlatformConnection[];
}

export function ConnectionStats({ connections }: ConnectionStatsProps) {
  const activeConnections = connections.filter(conn => conn.is_active).length;
  const totalConnections = connections.length;
  const errorConnections = connections.filter(conn => conn.sync_status === 'error').length;
  const successfulConnections = connections.filter(conn => conn.sync_status === 'success').length;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{activeConnections}</div>
          <div className="text-sm text-muted-foreground">Active Connections</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{successfulConnections}</div>
          <div className="text-sm text-muted-foreground">Successful Syncs</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{errorConnections}</div>
          <div className="text-sm text-muted-foreground">Connection Errors</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{totalConnections}</div>
          <div className="text-sm text-muted-foreground">Total Platforms</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PlatformConnectionCard;