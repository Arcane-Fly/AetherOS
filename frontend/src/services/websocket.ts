import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  id: string;
  text: string;
  userId: number;
  timestamp: Date;
}

interface CreationUpdate {
  id: number;
  field: string;
  value: any;
  timestamp: Date;
}

class WebSocketService {
  private socket: Socket | null;
  private connected: boolean;

  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(token: string): Socket | null {
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

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  // Chat collaboration
  joinChatRoom(userId: number): void {
    if (this.socket) {
      this.socket.emit('join_chat', { userId });
    }
  }

  leaveChatRoom(userId: number): void {
    if (this.socket) {
      this.socket.emit('leave_chat', { userId });
    }
  }

  sendMessage(message: ChatMessage): void {
    if (this.socket) {
      this.socket.emit('chat_message', message);
    }
  }

  onMessageReceived(callback: (message: ChatMessage) => void): void {
    if (this.socket) {
      this.socket.on('message_received', callback);
    }
  }

  onUserTyping(callback: (data: { userId: number }) => void): void {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  sendTyping(userId: number): void {
    if (this.socket) {
      this.socket.emit('typing', { userId });
    }
  }

  // Creation collaboration
  joinCreationRoom(creationId: number): void {
    if (this.socket) {
      this.socket.emit('join_creation', { creationId });
    }
  }

  leaveCreationRoom(creationId: number): void {
    if (this.socket) {
      this.socket.emit('leave_creation', { creationId });
    }
  }

  onCreationUpdated(callback: (update: CreationUpdate) => void): void {
    if (this.socket) {
      this.socket.on('creation_updated', callback);
    }
  }

  onCreationLinked(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('creation_linked', callback);
    }
  }

  sendCreationUpdate(creationId: number, update: Partial<CreationUpdate>): void {
    if (this.socket) {
      this.socket.emit('update_creation', { creationId, update });
    }
  }

  // Generation collaboration
  onGenerationStarted(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('generation_started', callback);
    }
  }

  onGenerationProgress(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('generation_progress', callback);
    }
  }

  onGenerationCompleted(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('generation_completed', callback);
    }
  }

  // Active users
  onActiveUsersUpdate(callback: (users: any[]) => void): void {
    if (this.socket) {
      this.socket.on('active_users_update', callback);
    }
  }

  // System notifications
  onSystemNotification(callback: (notification: any) => void): void {
    if (this.socket) {
      this.socket.on('system_notification', callback);
    }
  }

  // Remove all listeners
  removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export const websocketService = new WebSocketService();
export default websocketService;