'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { useAuth } from '@/contexts/EnhancedAuthContext';

// SSR-safe imports using social-media pattern
const UnifiedSidebar = dynamic(() => import('@/components/UnifiedSidebar'), {
  ssr: false,
  loading: () => <div className="fixed left-0 top-0 h-screen w-56 bg-gray-900 animate-pulse" />
});

const AdvancedNavigation = dynamic(() => import('@/components/DashboardNavbar'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-900 border-b animate-pulse" />
});

const AIControlChat = dynamic(() => import('@/components/AIControlChat'), {
  ssr: false,
  loading: () => null
});

import { 
  Users, 
  MessageCircle, 
  Bell, 
  Activity,
  Eye,
  Edit3,
  Clock,
  Send,
  X,
  Check,
  Dot,
  Settings,
  UserCheck,
  Zap,
  Globe,
  Heart
} from 'lucide-react';

// ============================================================================
// LIVE CURSORS COMPONENT
// ============================================================================

function LiveCursors() {
  const { liveCursors, enableLiveCursors } = useCollaboration();

  if (!enableLiveCursors) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {liveCursors.map((cursor) => (
          <motion.div
            key={cursor.userId}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: cursor.x,
              y: cursor.y
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute pointer-events-none z-50"
          >
            {/* Cursor */}
            <div className="relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5.65376 12.3673H7.33578L9.94952 6.43524L13.9132 18.9648L12.9117 19.3337C12.4715 19.5273 12.1225 19.2256 12.0914 18.7474L11.7775 14.1799L9.60247 16.1799C9.2825 16.4799 8.80676 16.4102 8.58006 16.0302C8.41555 15.7803 8.50918 15.4404 8.77589 15.3106L11.7775 14.1799C12.1225 14.0705 12.4715 14.3121 12.5026 14.7903L12.8165 19.3337L13.9132 18.9648Z"
                  fill={cursor.userColor}
                  stroke="white"
                  strokeWidth="1"
                />
              </svg>
              {/* User name badge */}
              <div 
                className="absolute top-6 left-6 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap"
                style={{ backgroundColor: cursor.userColor }}
              >
                {cursor.userName}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// ONLINE USERS SIDEBAR
// ============================================================================

function OnlineUsersSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { onlineUsers, userPresence, currentUserStatus, updateUserStatus } = useCollaboration();

  const statusOptions = [
    { value: 'online' as const, label: 'Online', color: 'bg-green-500', icon: '🟢' },
    { value: 'away' as const, label: 'Away', color: 'bg-yellow-500', icon: '🟡' },
    { value: 'busy' as const, label: 'Busy', color: 'bg-red-500', icon: '🔴' },
    { value: 'offline' as const, label: 'Offline', color: 'bg-gray-500', icon: '⚫' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 border-l border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Online Users ({onlineUsers.length})</span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Current user status */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Your Status</p>
                <div className="space-y-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateUserStatus(option.value)}
                      className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                        currentUserStatus === option.value
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>{option.icon}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </span>
                      {currentUserStatus === option.value && (
                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Online users list */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Team Members</p>
                <div className="space-y-3">
                  {onlineUsers.map((user) => {
                    const presence = userPresence.find(p => p.userId === user.id);
                    const statusColor = statusOptions.find(s => s.value === user.status)?.color || 'bg-gray-500';
                    
                    return (
                      <div key={user.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                            {user.name[0]?.toUpperCase() || user.email[0]?.toUpperCase()}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColor} rounded-full border-2 border-white dark:border-gray-800`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {user.name || user.email}
                          </p>
                          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                            {presence ? (
                              <>
                                <div className="flex items-center space-x-1">
                                  {presence.activity === 'editing' ? (
                                    <Edit3 className="w-3 h-3" />
                                  ) : (
                                    <Eye className="w-3 h-3" />
                                  )}
                                  <span>{presence.activity}</span>
                                </div>
                                <Dot className="w-3 h-3" />
                                <span>{presence.pageName}</span>
                              </>
                            ) : (
                              <span>Last seen {new Date(user.lastSeen).toLocaleTimeString()}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <span className={`w-2 h-2 ${statusColor} rounded-full`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// ACTIVITY FEED SIDEBAR
// ============================================================================

function ActivityFeedSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { activities, enableActivityFeed } = useCollaboration();

  if (!enableActivityFeed) return null;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_created': return '✅';
      case 'task_updated': return '📝';
      case 'task_assigned': return '👤';
      case 'comment_added': return '💬';
      case 'file_uploaded': return '📎';
      case 'page_visited': return '👀';
      case 'project_updated': return '🚀';
      default: return '📄';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 border-r border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Activity Feed</span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {activities.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No activity yet. Start collaborating!
                    </p>
                  </div>
                ) : (
                  activities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="text-lg">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          <span className="font-medium">{activity.userName}</span>{' '}
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// COLLABORATION FLOATING TOOLBAR
// ============================================================================

function CollaborationFloatingToolbar() {
  const { 
    onlineUsers, 
    unreadNotifications,
    activities,
    syncStatus,
    enableLiveCursors,
    enableActivityFeed,
    enableNotifications,
    toggleFeature
  } = useCollaboration();
  
  const [activePanel, setActivePanel] = useState<'users' | 'activity' | 'settings' | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Floating Toolbar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed right-6 top-1/2 -translate-y-1/2 z-30 transition-all duration-300 ${
          isCollapsed ? 'w-12' : 'w-64'
        }`}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    syncStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Live Collaboration
                  </span>
                </div>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded transition-colors"
              >
                {isCollapsed ? (
                  <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {!isCollapsed && (
            <>
              {/* Quick Stats */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {onlineUsers.length} online
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bell className={`w-3 h-3 ${unreadNotifications.length > 0 ? 'text-red-500' : 'text-gray-400'}`} />
                    <span className="text-gray-600 dark:text-gray-400">
                      {unreadNotifications.length} alerts
                    </span>
                  </div>
                </div>

                {/* Recent Activity Preview */}
                {activities.length > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded p-2">
                    <span className="font-medium">Latest:</span>{' '}
                    {activities[0].description.substring(0, 40)}...
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 space-y-2">
                <button
                  onClick={() => setActivePanel(activePanel === 'users' ? null : 'users')}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-900 dark:text-white">Team ({onlineUsers.length})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {onlineUsers.slice(0, 3).map((user, index) => (
                      <div 
                        key={user.id}
                        className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-xs flex items-center justify-center"
                        style={{ transform: `translateX(-${index * 8}px)` }}
                      >
                        {user.name[0]?.toUpperCase()}
                      </div>
                    ))}
                  </div>
                </button>

                <button
                  onClick={() => setActivePanel(activePanel === 'activity' ? null : 'activity')}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-green-500" />
                    <span className="text-gray-900 dark:text-white">Activity</span>
                  </div>
                  {activities.length > 0 && (
                    <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs">
                      {activities.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActivePanel(activePanel === 'settings' ? null : 'settings')}
                  className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  <Settings className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-900 dark:text-white">Settings</span>
                </button>
              </div>

              {/* Feature Settings */}
              {activePanel === 'settings' && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Collaboration Features
                  </h4>
                  
                  {[
                    { key: 'liveCursors' as const, label: 'Live Cursors', enabled: enableLiveCursors, icon: '👆' },
                    { key: 'activityFeed' as const, label: 'Activity Feed', enabled: enableActivityFeed, icon: '📊' },
                    { key: 'notifications' as const, label: 'Notifications', enabled: enableNotifications, icon: '🔔' }
                  ].map((feature) => (
                    <div key={feature.key} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span>{feature.icon}</span>
                        <span className="text-sm text-gray-900 dark:text-white">{feature.label}</span>
                      </div>
                      <button
                        onClick={() => toggleFeature(feature.key)}
                        className={`w-8 h-4 rounded-full transition-colors ${
                          feature.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div className={`w-3 h-3 bg-white rounded-full shadow transform transition-transform ${
                          feature.enabled ? 'translate-x-4' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* Sidebars */}
      <OnlineUsersSidebar 
        isOpen={activePanel === 'users'} 
        onClose={() => setActivePanel(null)} 
      />
      <ActivityFeedSidebar 
        isOpen={activePanel === 'activity'} 
        onClose={() => setActivePanel(null)} 
      />

      {/* Live Cursors */}
      <LiveCursors />
    </>
  );
}

// ============================================================================
// MAIN COLLABORATION DASHBOARD
// ============================================================================

export default function CollaborationHub() {
  // Sidebar state management for unified layout
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Unified Sidebar */}
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      {/* Advanced Navigation */}
      <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
      
      {/* Main Content with dynamic margins */}
      <div className={`transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'ml-14' : 'ml-56'
      } pt-16`}>
        {/* Collaboration Content */}
        <div className="relative min-h-screen">
          {/* Main Content - This would typically wrap your app */}
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-8">
                  <Globe className="w-4 h-4" />
                  <span>Real-Time Collaboration Active</span>
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Live Collaboration Hub
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  Experience seamless teamwork with live cursors, real-time activity feeds, instant notifications, and collaborative commenting.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  icon: <Users className="w-8 h-8" />, 
                  title: 'Team Presence', 
                  description: 'See who\'s online and what they\'re working on',
                  color: 'from-blue-500 to-cyan-500'
                },
                { 
                  icon: <Zap className="w-8 h-8" />, 
                  title: 'Live Cursors', 
                  description: 'Watch team members navigate in real-time',
                  color: 'from-yellow-500 to-orange-500'
                },
                { 
                  icon: <MessageCircle className="w-8 h-8" />, 
                  title: 'Live Comments', 
                  description: 'Collaborate with contextual comments',
                  color: 'from-green-500 to-emerald-500'
                },
                { 
                  icon: <Heart className="w-8 h-8" />, 
                  title: 'Activity Feed', 
                  description: 'Stay updated on all team activities',
                  color: 'from-purple-500 to-pink-500'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        </div>

        {/* Floating Collaboration Toolbar */}
        <CollaborationFloatingToolbar />
      </div>
      </div>
      
      {/* AI Control Chat - Fixed positioning outside content flow */}
      <AIControlChat />
    </div>
  );
}