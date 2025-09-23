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
  const subscribersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());

  useEffect(() => {
    // Only connect in production or when WebSocket server is available
    if (process.env.NODE_ENV !== 'production') {
      console.log('WebSocket: Development mode - using mock connection');
      setConnected(true);
      
      // Simulate real-time updates in development
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
    }

    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(url);
        
        ws.onopen = () => {
          console.log('WebSocket connected');
          setConnected(true);
          setSocket(ws);
        };
        
        ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            setLastMessage(message);
            
            // Notify subscribers
            const typeSubscribers = subscribersRef.current.get(message.type);
            if (typeSubscribers) {
              typeSubscribers.forEach((callback: (data: any) => void) => callback(message.data));
            }
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };
        
        ws.onclose = () => {
          console.log('WebSocket disconnected');
          setConnected(false);
          setSocket(null);
          
          // Attempt to reconnect after 5 seconds
          setTimeout(connectWebSocket, 5000);
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnected(false);
        };
        
      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        setConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [url]);

  const sendMessage = (message: any) => {
    if (socket && connected) {
      socket.send(JSON.stringify(message));
    } else if (process.env.NODE_ENV !== 'production') {
      console.log('WebSocket: Mock send message', message);
    }
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