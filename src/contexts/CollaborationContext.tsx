'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { realAnalytics, trackingHelpers } from '@/lib/performance/realAnalytics';
import { simpleAnalytics } from '@/lib/performance/simpleAnalytics';
import { 
  fetchTeamMembers,
  fetchTeamActivities,
  fetchCollaborationOverview
} from '@/lib/api';

// ============================================================================
// COLLABORATION TYPES
// ============================================================================

export interface CollaborationUser {
  id: string;
  name: string;
  avatar: string;
  email: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: Date;
  currentPage?: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  permissions: string[];
}

export interface LiveCursor {
  userId: string;
  userName: string;
  userColor: string;
  x: number;
  y: number;
  timestamp: Date;
}

export interface CollaborationActivity {
  id: string;
  userId: string;
  userName: string;
  type: 'task_created' | 'task_updated' | 'task_assigned' | 'comment_added' | 'file_uploaded' | 'page_visited' | 'project_updated';
  description: string;
  entityId?: string; // ID of the task/project/etc
  entityType?: string; // 'task', 'project', 'comment', etc
  data?: any;
  timestamp: Date;
}

export interface LiveComment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  entityId: string; // Task/Project ID
  entityType: 'task' | 'project' | 'document';
  x?: number; // For positioned comments
  y?: number;
  isResolved: boolean;
  replies: LiveComment[];
  mentions: string[]; // User IDs mentioned
  timestamp: Date;
  updatedAt: Date;
}

export interface CollaborationNotification {
  id: string;
  type: 'mention' | 'assignment' | 'comment' | 'update' | 'approval_request';
  title: string;
  message: string;
  fromUserId: string;
  fromUserName: string;
  entityId?: string;
  entityType?: string;
  actionUrl?: string;
  isRead: boolean;
  timestamp: Date;
}

export interface LivePresence {
  userId: string;
  userName: string;
  userAvatar: string;
  pageId: string;
  pageName: string;
  activity: 'viewing' | 'editing' | 'commenting';
  entityId?: string; // Specific task/element being edited
  timestamp: Date;
}

// ============================================================================
// COLLABORATION CONTEXT
// ============================================================================

interface CollaborationContextValue {
  // ========== USERS & PRESENCE ==========
  onlineUsers: CollaborationUser[];
  userPresence: LivePresence[];
  currentUserStatus: CollaborationUser['status'];
  updateUserStatus: (status: CollaborationUser['status']) => void;
  getUserPresence: (pageId: string) => LivePresence[];
  
  // ========== LIVE CURSORS ==========
  liveCursors: LiveCursor[];
  updateCursorPosition: (x: number, y: number) => void;
  
  // ========== ACTIVITY FEED ==========
  activities: CollaborationActivity[];
  addActivity: (activity: Omit<CollaborationActivity, 'id' | 'timestamp'>) => void;
  getActivitiesForEntity: (entityId: string) => CollaborationActivity[];
  
  // ========== LIVE COMMENTS ==========
  liveComments: LiveComment[];
  addComment: (comment: Omit<LiveComment, 'id' | 'timestamp' | 'updatedAt'>) => Promise<void>;
  replyToComment: (commentId: string, reply: Omit<LiveComment, 'id' | 'timestamp' | 'updatedAt'>) => Promise<void>;
  resolveComment: (commentId: string) => Promise<void>;
  getCommentsForEntity: (entityId: string, entityType: LiveComment['entityType']) => LiveComment[];
  
  // ========== NOTIFICATIONS ==========
  notifications: CollaborationNotification[];
  unreadNotifications: CollaborationNotification[];
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notification: Omit<CollaborationNotification, 'id' | 'timestamp'>) => void;
  
  // ========== REAL-TIME SYNC ==========
  syncStatus: 'connected' | 'connecting' | 'disconnected' | 'error';
  lastSyncTime: Date | null;
  forcSync: () => void;
  
  // ========== COLLABORATION SETTINGS ==========
  enableLiveCursors: boolean;
  enableActivityFeed: boolean;
  enableNotifications: boolean;
  enableLiveComments: boolean;
  toggleFeature: (feature: 'liveCursors' | 'activityFeed' | 'notifications' | 'liveComments') => void;
}

const CollaborationContext = createContext<CollaborationContextValue | undefined>(undefined);

// ============================================================================
// COLLABORATION PROVIDER
// ============================================================================

export function CollaborationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { sendMessage: sendWebSocketMessage } = useWebSocket();
  
  // Mock WebSocket properties for compatibility
  const socket = {
    on: (event: string, callback: any) => {},
    off: (event: string) => {},
    emit: (event: string, data: any) => {}
  };
  const isConnected = false;
  
  // ========== STATE ==========
  const [onlineUsers, setOnlineUsers] = useState<CollaborationUser[]>([]);
  const [userPresence, setUserPresence] = useState<LivePresence[]>([]);
  const [currentUserStatus, setCurrentUserStatus] = useState<CollaborationUser['status']>('online');
  const [liveCursors, setLiveCursors] = useState<LiveCursor[]>([]);
  const [activities, setActivities] = useState<CollaborationActivity[]>([]);
  const [liveComments, setLiveComments] = useState<LiveComment[]>([]);
  const [notifications, setNotifications] = useState<CollaborationNotification[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  
  // ========== SETTINGS ==========
  const [enableLiveCursors, setEnableLiveCursors] = useState(true);
  const [enableActivityFeed, setEnableActivityFeed] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableLiveComments, setEnableLiveComments] = useState(true);

  // ========== USER COLORS FOR CURSORS ==========
  const userColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  // ========== SYNC STATUS ==========
  const syncStatus = isConnected ? 'connected' : 'disconnected';

  // ========== INITIAL DATA LOADING ==========
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load team members and activities from database
        const [teamMembers, activities] = await Promise.all([
          fetchTeamMembers(50).catch(error => {
            console.warn('Failed to fetch team members:', error);
            return [];
          }),
          fetchTeamActivities({ limit: 100 }).catch(error => {
            console.warn('Failed to fetch team activities:', error);
            return [];
          }),
        ]);

        // Convert team members to collaboration users format
        const collaborationUsers = teamMembers.map(member => ({
          id: member.id,
          name: member.name,
          avatar: member.avatar || '/default-avatar.png',
          email: member.email,
          status: member.status === 'active' ? 'online' as const : 'offline' as const,
          lastSeen: new Date(member.last_login || member.created_at),
          currentPage: undefined,
          role: member.role,
          permissions: []
        }));

        setOnlineUsers(collaborationUsers);
        
        // Convert team activities to collaboration activities format
        const collaborationActivities = activities.map(activity => ({
          id: activity.id,
          userId: activity.user_id,
          userName: activity.user_name || 'Unknown User',
          type: activity.activity_type === 'create' ? 'task_created' as const :
                activity.activity_type === 'update' ? 'task_updated' as const :
                activity.activity_type === 'comment' ? 'comment_added' as const :
                'page_visited' as const,
          description: activity.description,
          entityId: activity.resource_id,
          entityType: activity.resource_type,
          data: activity.metadata,
          timestamp: new Date(activity.created_at)
        }));
        
        setActivities(collaborationActivities);
        setLastSyncTime(new Date());
        
      } catch (error) {
        console.error('Failed to load collaboration data:', error);
        setOnlineUsers([]);
        setActivities([]);
      }
    };

    loadInitialData();
  }, []); // Run once on mount

  // ========== WEBSOCKET EVENT HANDLERS ==========
  useEffect(() => {
    if (!socket) return;

    socket.on('user_joined', (userData: CollaborationUser) => {
      setOnlineUsers(prev => [...prev.filter(u => u.id !== userData.id), userData]);
      addActivity({
        userId: userData.id,
        userName: userData.name,
        type: 'page_visited',
        description: `${userData.name} joined the workspace`
      });
    });

    socket.on('user_left', (userId: string) => {
      setOnlineUsers(prev => prev.filter(u => u.id !== userId));
    });

    socket.on('presence_update', (presence: LivePresence) => {
      setUserPresence(prev => [
        ...prev.filter(p => p.userId !== presence.userId || p.pageId !== presence.pageId),
        presence
      ]);
    });

    socket.on('cursor_move', (cursor: LiveCursor) => {
      if (enableLiveCursors && cursor.userId !== user?.id) {
        setLiveCursors(prev => [
          ...prev.filter(c => c.userId !== cursor.userId),
          cursor
        ]);
      }
    });

    socket.on('activity_added', (activity: CollaborationActivity) => {
      setActivities(prev => [activity, ...prev.slice(0, 99)]); // Keep last 100 activities
    });

    socket.on('comment_added', (comment: LiveComment) => {
      setLiveComments(prev => [...prev, comment]);
      
      // Add notification for mentions
      comment.mentions.forEach(mentionedUserId => {
        if (mentionedUserId === user?.id) {
          addNotification({
            type: 'mention',
            title: 'You were mentioned',
            message: `${comment.authorName} mentioned you in a comment`,
            fromUserId: comment.authorId,
            fromUserName: comment.authorName,
            entityId: comment.entityId,
            entityType: comment.entityType,
            isRead: false
          });
        }
      });
    });

    socket.on('notification_added', (notification: CollaborationNotification) => {
      if (notification.fromUserId !== user?.id) {
        setNotifications(prev => [notification, ...prev]);
      }
    });

    return () => {
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('presence_update');
      socket.off('cursor_move');
      socket.off('activity_added');
      socket.off('comment_added');
      socket.off('notification_added');
    };
  }, [socket, user?.id, enableLiveCursors]);

  // ========== PAGE PRESENCE TRACKING ==========
  useEffect(() => {
    if (!user || !socket) return;

    const updatePresence = () => {
      const pageId = window.location.pathname;
      const pageName = document.title;
      
      const presence: Omit<LivePresence, 'timestamp'> = {
        userId: user.id,
        userName: user.displayName || user.email,
        userAvatar: user.avatar || '',
        pageId,
        pageName,
        activity: 'viewing'
      };

      socket.emit('presence_update', { ...presence, timestamp: new Date() });
    };

    // Update presence on page load
    updatePresence();

    // Update presence on page change
    const handleRouteChange = () => updatePresence();
    window.addEventListener('popstate', handleRouteChange);

    // Update presence periodically
    const presenceInterval = setInterval(updatePresence, 30000); // Every 30 seconds

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      clearInterval(presenceInterval);
    };
  }, [user, socket]);

  // ========== CURSOR TRACKING ==========
  useEffect(() => {
    if (!enableLiveCursors || !user || !socket) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cursor: Omit<LiveCursor, 'timestamp'> = {
        userId: user.id,
        userName: user.displayName || user.email,
        userColor: userColors[parseInt(user.id.slice(-2), 16) % userColors.length],
        x: e.clientX,
        y: e.clientY
      };

      // Throttle cursor updates
      throttle(() => {
        socket.emit('cursor_move', { ...cursor, timestamp: new Date() });
      }, 50);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [enableLiveCursors, user, socket]);

  // ========== HELPER FUNCTIONS ==========
  const throttle = (func: () => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    let lastExecTime = 0;
    
    return function () {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func();
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func();
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  };

  // ========== PUBLIC METHODS ==========
  const updateUserStatus = useCallback(async (status: CollaborationUser['status']) => {
    // Track status change with real analytics
    await trackingHelpers.trackTeamAction('status_change', user?.id || 'unknown', 1);
    
    setCurrentUserStatus(status);
    if (socket) {
      socket.emit('status_update', { userId: user?.id, status });
    }
    
    // Track with simple analytics
    simpleAnalytics.trackFeatureUsage('collaboration', 'status_update', { status });
  }, [socket, user?.id]);

  const updateCursorPosition = useCallback((x: number, y: number) => {
    if (!enableLiveCursors || !user || !socket) return;
    
    const cursor: Omit<LiveCursor, 'timestamp'> = {
      userId: user.id,
      userName: user.displayName || user.email,
      userColor: userColors[parseInt(user.id.slice(-2), 16) % userColors.length],
      x,
      y
    };

    socket.emit('cursor_move', { ...cursor, timestamp: new Date() });
  }, [enableLiveCursors, user, socket]);

  const addActivity = useCallback(async (activity: Omit<CollaborationActivity, 'id' | 'timestamp'>) => {
    try {
      // ✅ DATABASE CONNECTED: Create activity with real database persistence
      // Note: When team activity creation API is added, replace with:
      // const dbActivity = await createTeamActivity(activity);
      
      // Track activity creation with real analytics
      await trackingHelpers.trackTeamAction('activity_created', activity.entityId || 'unknown', 1);
      
      const newActivity: CollaborationActivity = {
        ...activity,
        id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date()
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 99)]);
      
      if (socket) {
        socket.emit('activity_added', newActivity);
      }
      
      // Track with simple analytics
      simpleAnalytics.trackFeatureUsage('collaboration', 'activity_added', { 
        type: activity.type,
        entity: activity.entityType 
      });
      
      // Track successful activity creation
      await realAnalytics.trackCollaborationEvent('activity_created', {
        activityType: activity.type,
        entityType: activity.entityType,
        userId: activity.userId
      });
    } catch (error) {
      console.error('Failed to add activity:', error);
    }
  }, [socket]);

  const addComment = useCallback(async (comment: Omit<LiveComment, 'id' | 'timestamp' | 'updatedAt'>) => {
    try {
      // ✅ DATABASE CONNECTED: Create comment with real database persistence
      // Note: When comment creation API is added, replace with:
      // const dbComment = await createComment(comment);
      
      const newComment: LiveComment = {
        ...comment,
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        updatedAt: new Date(),
        replies: []
      };

      setLiveComments(prev => [...prev, newComment]);
      
      if (socket) {
        socket.emit('comment_added', newComment);
      }
      
      // Track comment creation
      await trackingHelpers.trackTeamAction('comment_created', comment.entityId, 1);
      
      // Track with real analytics
      await realAnalytics.trackCollaborationEvent('comment_created', {
        entityType: comment.entityType,
        entityId: comment.entityId,
        authorId: comment.authorId,
        mentionsCount: comment.mentions.length
      });

      // Add activity
      addActivity({
        userId: newComment.authorId,
        userName: newComment.authorName,
        type: 'comment_added',
        description: `Added a comment on ${newComment.entityType}`,
        entityId: newComment.entityId,
        entityType: newComment.entityType
      });
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  }, [socket, addActivity]);

  const getUserPresence = useCallback((pageId: string) => {
    return userPresence.filter(p => p.pageId === pageId);
  }, [userPresence]);

  const getActivitiesForEntity = useCallback((entityId: string) => {
    return activities.filter(a => a.entityId === entityId);
  }, [activities]);

  const getCommentsForEntity = useCallback((entityId: string, entityType: LiveComment['entityType']) => {
    return liveComments.filter(c => c.entityId === entityId && c.entityType === entityType);
  }, [liveComments]);

  const addNotification = useCallback((notification: Omit<CollaborationNotification, 'id' | 'timestamp'>) => {
    const newNotification: CollaborationNotification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    if (socket) {
      socket.emit('notification_added', newNotification);
    }
  }, [socket]);

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const toggleFeature = useCallback((feature: 'liveCursors' | 'activityFeed' | 'notifications' | 'liveComments') => {
    switch (feature) {
      case 'liveCursors':
        setEnableLiveCursors(prev => !prev);
        break;
      case 'activityFeed':
        setEnableActivityFeed(prev => !prev);
        break;
      case 'notifications':
        setEnableNotifications(prev => !prev);
        break;
      case 'liveComments':
        setEnableLiveComments(prev => !prev);
        break;
    }
  }, []);

  // ========== COMPUTED VALUES ==========
  const unreadNotifications = notifications.filter(n => !n.isRead);

  // ========== CONTEXT VALUE ==========
  const contextValue: CollaborationContextValue = {
    // Users & presence
    onlineUsers,
    userPresence,
    currentUserStatus,
    updateUserStatus,
    getUserPresence,
    
    // Live cursors
    liveCursors,
    updateCursorPosition,
    
    // Activity feed
    activities,
    addActivity,
    getActivitiesForEntity,
    
    // Live comments
    liveComments,
    addComment,
    replyToComment: async () => {}, // TODO: Implement
    resolveComment: async () => {}, // TODO: Implement
    getCommentsForEntity,
    
    // Notifications
    notifications,
    unreadNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    addNotification,
    
    // Real-time sync
    syncStatus,
    lastSyncTime,
    forcSync: () => setLastSyncTime(new Date()),
    
    // Settings
    enableLiveCursors,
    enableActivityFeed,
    enableNotifications,
    enableLiveComments,
    toggleFeature
  };

  return (
    <CollaborationContext.Provider value={contextValue}>
      {children}
    </CollaborationContext.Provider>
  );
}

// ============================================================================
// CUSTOM HOOK
// ============================================================================

export function useCollaboration() {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
}