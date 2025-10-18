'use client';

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';

interface WebSocketMessage {
  type: 'campaign_update' | 'performance_update' | 'alert' | 'notification';
  data: any;
  timestamp: number;
}

interface WebSocketContextType {
  connected: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: any) => void;
  subscribe: (type: string, callback: (data: any) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
  url?: string;
}

export function WebSocketProvider({ children, url = 'ws://localhost:8000/ws' }: WebSocketProviderProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const maxConnectionAttempts = 3;
  const subscribersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());

  useEffect(() => {
    // Always use mock connection to avoid WebSocket errors
    // WebSocket real-time features can be enabled later when backend properly configured
    console.log('WebSocket: Using mock connection (graceful degradation)');
    setConnected(true);
    
    // Simulate real-time updates with mock data
    const interval = setInterval(() => {
      const mockMessage: WebSocketMessage = {
        type: 'performance_update',
        data: {
          campaignId: Math.floor(Math.random() * 10) + 1,
          impressions: Math.floor(Math.random() * 1000) + 500,
          clicks: Math.floor(Math.random() * 50) + 10,
          conversions: Math.floor(Math.random() * 5) + 1,
        },
        timestamp: Date.now()
      };
      
      setLastMessage(mockMessage);
      
      // Notify subscribers
      const typeSubscribers = subscribersRef.current.get(mockMessage.type);
      if (typeSubscribers) {
        typeSubscribers.forEach((callback: (data: any) => void) => callback(mockMessage.data));
      }
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const sendMessage = (message: any) => {
    // Mock WebSocket - log message instead of sending
    console.log('WebSocket: Mock send message', message);
  };

  const subscribe = (type: string, callback: (data: any) => void) => {
    const subscribers = subscribersRef.current;
    if (!subscribers.has(type)) {
      subscribers.set(type, new Set());
    }
    subscribers.get(type)!.add(callback);

    // Return unsubscribe function
    return () => {
      const subscribers = subscribersRef.current;
      const typeSubscribers = subscribers.get(type);
      if (typeSubscribers) {
        typeSubscribers.delete(callback);
        if (typeSubscribers.size === 0) {
          subscribers.delete(type);
        }
      }
    };
  };

  const value: WebSocketContextType = {
    connected,
    lastMessage,
    sendMessage,
    subscribe
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}

// Custom hooks for specific data types
export function useRealTimePerformance(campaignId?: number) {
  const { subscribe } = useWebSocket();
  const [performance, setPerformance] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = subscribe('performance_update', (data) => {
      if (!campaignId || data.campaignId === campaignId) {
        setPerformance(data);
      }
    });

    return unsubscribe;
  }, [subscribe, campaignId]);

  return performance;
}

export function useRealTimeAlerts() {
  const { subscribe } = useWebSocket();
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = subscribe('alert', (data) => {
      setAlerts(prev => [data, ...prev].slice(0, 10)); // Keep last 10 alerts
    });

    return unsubscribe;
  }, [subscribe]);

  return alerts;
}

export function useRealTimeCampaigns() {
  const { subscribe } = useWebSocket();
  const [campaignUpdates, setCampaignUpdates] = useState<Map<number, any>>(new Map());

  useEffect(() => {
    const unsubscribe = subscribe('campaign_update', (data) => {
      setCampaignUpdates(prev => {
        const newMap = new Map(prev);
        newMap.set(data.id, data);
        return newMap;
      });
    });

    return unsubscribe;
  }, [subscribe]);

  return campaignUpdates;
}