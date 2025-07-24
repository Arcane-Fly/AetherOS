const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const { createClient } = require('redis');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.WEBSOCKET_SERVICE_PORT || 3003;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Redis client for pub/sub and caching
let redisClient;
const initRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });
    
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Redis connection failed:', error);
  }
};

// Authentication middleware for WebSocket
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    socket.userId = decoded.id;
    socket.userEmail = decoded.email;
    
    console.log(`User ${decoded.email} connected via WebSocket`);
    next();
  } catch (error) {
    console.error('WebSocket authentication error:', error);
    next(new Error('Authentication failed'));
  }
};

// Active users tracking
const activeUsers = new Map();
const chatRooms = new Map();
const creationRooms = new Map();

// Socket.IO middleware
io.use(authenticateSocket);

// Handle WebSocket connections
io.on('connection', (socket) => {
  const userId = socket.userId;
  const userEmail = socket.userEmail;
  
  // Add user to active users
  activeUsers.set(userId, {
    id: userId,
    email: userEmail,
    socketId: socket.id,
    connectedAt: new Date(),
    rooms: new Set()
  });

  // Broadcast active users update
  io.emit('active_users_update', Array.from(activeUsers.values()));

  // Chat room events
  socket.on('join_chat', ({ userId: roomUserId }) => {
    const roomId = `chat_${roomUserId}`;
    socket.join(roomId);
    
    if (!chatRooms.has(roomId)) {
      chatRooms.set(roomId, new Set());
    }
    chatRooms.get(roomId).add(userId);
    activeUsers.get(userId)?.rooms.add(roomId);
    
    console.log(`User ${userEmail} joined chat room: ${roomId}`);
    
    // Notify others in the room
    socket.to(roomId).emit('user_joined_chat', {
      userId,
      email: userEmail,
      joinedAt: new Date()
    });
  });

  socket.on('leave_chat', ({ userId: roomUserId }) => {
    const roomId = `chat_${roomUserId}`;
    socket.leave(roomId);
    
    if (chatRooms.has(roomId)) {
      chatRooms.get(roomId).delete(userId);
      if (chatRooms.get(roomId).size === 0) {
        chatRooms.delete(roomId);
      }
    }
    activeUsers.get(userId)?.rooms.delete(roomId);
    
    console.log(`User ${userEmail} left chat room: ${roomId}`);
    
    // Notify others in the room
    socket.to(roomId).emit('user_left_chat', {
      userId,
      email: userEmail,
      leftAt: new Date()
    });
  });

  socket.on('chat_message', (message) => {
    const roomId = `chat_${message.recipientId || 'global'}`;
    
    const messageWithMetadata = {
      ...message,
      senderId: userId,
      senderEmail: userEmail,
      timestamp: new Date(),
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    // Send to all users in the room except sender
    socket.to(roomId).emit('message_received', messageWithMetadata);
    
    // Cache message in Redis for history
    if (redisClient) {
      redisClient.lPush(`chat_history_${roomId}`, JSON.stringify(messageWithMetadata)).catch(console.error);
      redisClient.lTrim(`chat_history_${roomId}`, 0, 100).catch(console.error); // Keep last 100 messages
    }
  });

  socket.on('typing', ({ userId: roomUserId }) => {
    const roomId = `chat_${roomUserId}`;
    socket.to(roomId).emit('user_typing', {
      userId,
      email: userEmail,
      timestamp: new Date()
    });
  });

  // Creation room events
  socket.on('join_creation', ({ creationId }) => {
    const roomId = `creation_${creationId}`;
    socket.join(roomId);
    
    if (!creationRooms.has(roomId)) {
      creationRooms.set(roomId, new Set());
    }
    creationRooms.get(roomId).add(userId);
    activeUsers.get(userId)?.rooms.add(roomId);
    
    console.log(`User ${userEmail} joined creation room: ${roomId}`);
    
    // Notify others in the room
    socket.to(roomId).emit('user_joined_creation', {
      userId,
      email: userEmail,
      creationId,
      joinedAt: new Date()
    });
  });

  socket.on('leave_creation', ({ creationId }) => {
    const roomId = `creation_${creationId}`;
    socket.leave(roomId);
    
    if (creationRooms.has(roomId)) {
      creationRooms.get(roomId).delete(userId);
      if (creationRooms.get(roomId).size === 0) {
        creationRooms.delete(roomId);
      }
    }
    activeUsers.get(userId)?.rooms.delete(roomId);
    
    console.log(`User ${userEmail} left creation room: ${roomId}`);
    
    // Notify others in the room
    socket.to(roomId).emit('user_left_creation', {
      userId,
      email: userEmail,
      creationId,
      leftAt: new Date()
    });
  });

  socket.on('update_creation', ({ creationId, update }) => {
    const roomId = `creation_${creationId}`;
    
    const updateWithMetadata = {
      ...update,
      updatedBy: userId,
      updatedByEmail: userEmail,
      timestamp: new Date(),
      creationId
    };
    
    // Broadcast update to all users in the creation room except sender
    socket.to(roomId).emit('creation_updated', updateWithMetadata);
    
    // Cache update in Redis
    if (redisClient) {
      redisClient.lPush(`creation_updates_${creationId}`, JSON.stringify(updateWithMetadata)).catch(console.error);
      redisClient.lTrim(`creation_updates_${creationId}`, 0, 50).catch(console.error); // Keep last 50 updates
    }
  });

  // Generation events
  socket.on('generation_started', ({ prompt, type }) => {
    // Broadcast to all connected users that generation started
    io.emit('generation_started', {
      userId,
      email: userEmail,
      prompt,
      type,
      timestamp: new Date()
    });
  });

  socket.on('generation_progress', ({ generationId, progress, status }) => {
    // Broadcast generation progress
    io.emit('generation_progress', {
      generationId,
      userId,
      progress,
      status,
      timestamp: new Date()
    });
  });

  socket.on('generation_completed', ({ generationId, result }) => {
    // Broadcast completion
    io.emit('generation_completed', {
      generationId,
      userId,
      email: userEmail,
      result,
      timestamp: new Date()
    });
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`User ${userEmail} disconnected: ${reason}`);
    
    // Remove from all rooms
    const user = activeUsers.get(userId);
    if (user) {
      user.rooms.forEach(roomId => {
        if (roomId.startsWith('chat_')) {
          chatRooms.get(roomId)?.delete(userId);
          if (chatRooms.get(roomId)?.size === 0) {
            chatRooms.delete(roomId);
          }
        } else if (roomId.startsWith('creation_')) {
          creationRooms.get(roomId)?.delete(userId);
          if (creationRooms.get(roomId)?.size === 0) {
            creationRooms.delete(roomId);
          }
        }
        
        // Notify others in rooms
        socket.to(roomId).emit('user_disconnected', {
          userId,
          email: userEmail,
          disconnectedAt: new Date()
        });
      });
    }
    
    // Remove from active users
    activeUsers.delete(userId);
    
    // Broadcast active users update
    io.emit('active_users_update', Array.from(activeUsers.values()));
  });

  // Send initial data
  socket.emit('connected', {
    userId,
    email: userEmail,
    connectedAt: new Date(),
    activeUsers: Array.from(activeUsers.values())
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'websocket-service',
    activeConnections: activeUsers.size,
    chatRooms: chatRooms.size,
    creationRooms: creationRooms.size
  });
});

// Stats endpoint
app.get('/stats', (req, res) => {
  res.json({
    activeUsers: Array.from(activeUsers.values()),
    chatRooms: Array.from(chatRooms.keys()),
    creationRooms: Array.from(creationRooms.keys()),
    uptime: process.uptime()
  });
});

// Start server
const startServer = async () => {
  try {
    await initRedis();
    
    server.listen(PORT, () => {
      console.log(`WebSocket service running on port ${PORT}`);
      console.log(`Health check available at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start WebSocket server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close(() => {
    if (redisClient) {
      redisClient.disconnect();
    }
    process.exit(0);
  });
});

startServer();