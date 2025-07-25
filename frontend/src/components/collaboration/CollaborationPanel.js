import React, { useState, useEffect } from 'react';
import websocketService from '../../services/websocket';

const CollaborationPanel = ({ user, currentCreation = null }) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const socket = websocketService.connect(token);
      
      // Set up event listeners
      socket.on('connect', () => {
        setIsConnected(true);
        websocketService.joinChatRoom(user.id);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      websocketService.onActiveUsersUpdate((users) => {
        setActiveUsers(users.filter(u => u.id !== user.id));
      });

      websocketService.onUserTyping((data) => {
        setTypingUsers(prev => {
          const filtered = prev.filter(u => u.userId !== data.userId);
          return [...filtered, { ...data, timestamp: Date.now() }];
        });
        
        // Remove typing indicator after 3 seconds
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
        }, 3000);
      });

      websocketService.onGenerationStarted((data) => {
        setRecentActivity(prev => [{
          id: Date.now(),
          type: 'generation_started',
          message: `${data.email} started generating ${data.type}`,
          timestamp: new Date(data.timestamp),
          user: data.email
        }, ...prev.slice(0, 9)]);
      });

      websocketService.onGenerationCompleted((data) => {
        setRecentActivity(prev => [{
          id: Date.now(),
          type: 'generation_completed',
          message: `${data.email} completed generation`,
          timestamp: new Date(data.timestamp),
          user: data.email
        }, ...prev.slice(0, 9)]);
      });

      websocketService.onCreationUpdated((data) => {
        setRecentActivity(prev => [{
          id: Date.now(),
          type: 'creation_updated',
          message: `${data.updatedByEmail} updated a creation`,
          timestamp: new Date(data.timestamp),
          user: data.updatedByEmail
        }, ...prev.slice(0, 9)]);
      });

      websocketService.onSystemNotification((notification) => {
        setRecentActivity(prev => [{
          id: Date.now(),
          type: 'system',
          message: notification.message,
          timestamp: new Date(),
          user: 'System'
        }, ...prev.slice(0, 9)]);
      });

      return () => {
        websocketService.leaveChatRoom(user.id);
        websocketService.disconnect();
      };
    }
  }, [user.id]);

  useEffect(() => {
    if (currentCreation && websocketService.isConnected()) {
      websocketService.joinCreationRoom(currentCreation.id);
      
      return () => {
        websocketService.leaveCreationRoom(currentCreation.id);
      };
    }
  }, [currentCreation]);

  const getActivityIcon = (type) => {
    const icons = {
      generation_started: '🚀',
      generation_completed: '✅',
      creation_updated: '✏️',
      system: '🔔'
    };
    return icons[type] || '📝';
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Collaboration</h3>
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} 
             title={isConnected ? 'Connected' : 'Disconnected'} />
      </div>

      {/* Active Users */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Active Users ({activeUsers.length})
        </h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {activeUsers.length === 0 ? (
            <p className="text-xs text-gray-500">No other users online</p>
          ) : (
            activeUsers.map(activeUser => (
              <div key={activeUser.id} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-700">{activeUser.email}</span>
                <span className="text-xs text-gray-400">
                  {formatTimestamp(new Date(activeUser.connectedAt))}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Typing Indicators */}
      {typingUsers.length > 0 && (
        <div className="mb-4 p-2 bg-blue-50 rounded-lg">
          <div className="text-xs text-blue-700">
            {typingUsers.map(t => t.email).join(', ')} 
            {typingUsers.length === 1 ? ' is' : ' are'} typing...
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {recentActivity.length === 0 ? (
            <p className="text-xs text-gray-500">No recent activity</p>
          ) : (
            recentActivity.map(activity => (
              <div key={activity.id} className="flex items-start gap-2 text-xs">
                <span className="text-sm">{getActivityIcon(activity.type)}</span>
                <div className="flex-1">
                  <p className="text-gray-700">{activity.message}</p>
                  <p className="text-gray-400 mt-1">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
          {currentCreation && (
            <span>📝 Viewing: {currentCreation.name}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaborationPanel;