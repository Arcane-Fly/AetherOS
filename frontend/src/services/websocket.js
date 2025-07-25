import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    const socketUrl = process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:3003';
    
    this.socket = io(socketUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      this.connected = true;
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  isConnected() {
    return this.connected;
  }

  // Chat collaboration
  joinChatRoom(userId) {
    if (this.socket) {
      this.socket.emit('join_chat', { userId });
    }
  }

  leaveChatRoom(userId) {
    if (this.socket) {
      this.socket.emit('leave_chat', { userId });
    }
  }

  sendMessage(message) {
    if (this.socket) {
      this.socket.emit('chat_message', message);
    }
  }

  onMessageReceived(callback) {
    if (this.socket) {
      this.socket.on('message_received', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  sendTyping(userId) {
    if (this.socket) {
      this.socket.emit('typing', { userId });
    }
  }

  // Creation collaboration
  joinCreationRoom(creationId) {
    if (this.socket) {
      this.socket.emit('join_creation', { creationId });
    }
  }

  leaveCreationRoom(creationId) {
    if (this.socket) {
      this.socket.emit('leave_creation', { creationId });
    }
  }

  onCreationUpdated(callback) {
    if (this.socket) {
      this.socket.on('creation_updated', callback);
    }
  }

  onCreationLinked(callback) {
    if (this.socket) {
      this.socket.on('creation_linked', callback);
    }
  }

  sendCreationUpdate(creationId, update) {
    if (this.socket) {
      this.socket.emit('update_creation', { creationId, update });
    }
  }

  // Generation collaboration
  onGenerationStarted(callback) {
    if (this.socket) {
      this.socket.on('generation_started', callback);
    }
  }

  onGenerationProgress(callback) {
    if (this.socket) {
      this.socket.on('generation_progress', callback);
    }
  }

  onGenerationCompleted(callback) {
    if (this.socket) {
      this.socket.on('generation_completed', callback);
    }
  }

  // Active users
  onActiveUsersUpdate(callback) {
    if (this.socket) {
      this.socket.on('active_users_update', callback);
    }
  }

  // System notifications
  onSystemNotification(callback) {
    if (this.socket) {
      this.socket.on('system_notification', callback);
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export const websocketService = new WebSocketService();
export default websocketService;