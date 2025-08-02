# AetherOS Architecture Documentation

## System Overview

AetherOS is a dynamic generative operating environment built as a microservices architecture using modern web technologies. The system enables users to generate code, APIs, UIs, and CLI tools through natural language interaction.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Internet/Users                        │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                     Load Balancer                              │
│                    (Future: Nginx)                             │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                    Frontend (React)                            │
│                   Port: 3000                                   │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐  │
│   │    Auth     │ │    Chat     │ │      Generation         │  │
│   │  Components │ │    Interface│ │      Interface          │  │
│   └─────────────┘ └─────────────┘ └─────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                   API Gateway (Nginx)                          │
│                      Port: 8080                                │
│              Routes: /api/auth, /api/generate                  │
└─────────┬──────────────────────────────────┬───────────────────┘
          │                                  │
          ▼                                  ▼
┌──────────────────┐              ┌──────────────────────┐
│   Auth Service   │              │  Generation Service  │
│    Port: 3001    │              │     Port: 3002       │
│                  │              │                      │
│ • JWT Auth       │              │ • OpenAI Integration │
│ • OAuth (Google, │              │ • Code Generation    │
│   GitHub)        │              │ • Prompt Processing  │
│ • User Management│              │ • Result Caching     │
└──────────────────┘              └──────────────────────┘
          │                                  │
          ▼                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    WebSocket Service                            │
│                      Port: 3003                                │
│   • Real-time communication                                    │
│   • Live generation updates                                    │
│   • Chat message delivery                                      │
│   • User presence tracking                                     │
└─────────────────────────┬───────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐
│   PostgreSQL    │ │    Redis    │ │   File Storage  │
│   Port: 5432    │ │ Port: 6379  │ │   (Local/S3)    │
│                 │ │             │ │                 │
│ • User Data     │ │ • Sessions  │ │ • Generated     │
│ • Generations   │ │ • Cache     │ │   Assets        │
│ • Chat History  │ │ • Pub/Sub   │ │ • User Uploads  │
│ • System Config │ │ • Rate      │ │ • Exports       │
│               │ │   Limiting  │ │                 │
└─────────────────┘ └─────────────┘ └─────────────────┘
```

## Service Responsibilities

### Frontend Service (React)
**Purpose:** User interface and client-side application logic

**Responsibilities:**
- User authentication interface
- Chat-based interaction interface
- Code generation request forms
- Real-time result display
- Creation history management
- Responsive design across devices

**Technology Stack:**
- React 18+ with Create React App
- Tailwind CSS for styling
- Socket.IO client for real-time communication
- Context API for state management
- React Router for navigation

### API Gateway (Nginx)
**Purpose:** Route and load balance requests to appropriate services

**Responsibilities:**
- Route requests to appropriate backend services
- SSL termination (production)
- Request/response logging
- Basic rate limiting
- CORS handling

**Configuration:**
```nginx
upstream auth_service {
    server auth-service:3001;
}

upstream generation_service {
    server generation-service:3002;
}

location /api/auth/ {
    proxy_pass http://auth_service/;
}

location /api/generate/ {
    proxy_pass http://generation_service/;
}
```

### Auth Service (Node.js/Express)
**Purpose:** Handle all authentication and user management

**Responsibilities:**
- User registration and login
- JWT token generation and validation
- OAuth integration (Google, GitHub)
- Password hashing and validation
- User profile management
- Session management

**API Endpoints:**
```
POST /register        - User registration
POST /login          - User login
POST /logout         - User logout
GET  /profile        - Get user profile
PUT  /profile        - Update user profile
POST /oauth/google   - Google OAuth callback
POST /oauth/github   - GitHub OAuth callback
GET  /health         - Service health check
```

**Database Schema:**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Generation Service (Node.js/Express)
**Purpose:** Handle AI-powered code and content generation

**Responsibilities:**
- Process natural language prompts
- Interact with OpenAI API
- Cache generation results
- Manage generation history
- Handle different generation types (code, API, UI)

**API Endpoints:**
```
POST /code           - Generate code from prompt
POST /api            - Generate API specification
POST /ui             - Generate UI components
POST /cli            - Generate CLI tools
GET  /history        - Get generation history
GET  /history/:id    - Get specific generation
DELETE /history/:id  - Delete generation
GET  /health         - Service health check
```

**Database Schema:**
```sql
CREATE TABLE generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'code', 'api', 'ui', 'cli'
    prompt TEXT NOT NULL,
    result TEXT NOT NULL,
    language VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_type ON generations(type);
CREATE INDEX idx_generations_created_at ON generations(created_at);
```

### WebSocket Service (Node.js/Socket.IO)
**Purpose:** Real-time communication and live updates

**Responsibilities:**
- Real-time chat messaging
- Live generation progress updates
- User presence tracking
- Collaborative features
- Event broadcasting

**Socket Events:**
```javascript
// Client to Server
socket.emit('join_room', { userId, roomId });
socket.emit('send_message', { message, roomId });
socket.emit('start_generation', { prompt, type });

// Server to Client
socket.emit('message_received', { message, userId, timestamp });
socket.emit('generation_progress', { progress, status });
socket.emit('generation_complete', { result, metadata });
socket.emit('user_joined', { userId, name });
socket.emit('user_left', { userId });
```

## Data Flow

### User Authentication Flow
```
1. User submits login credentials
2. Frontend sends POST /api/auth/login
3. API Gateway routes to Auth Service
4. Auth Service validates credentials
5. JWT token generated and returned
6. Frontend stores token in memory/localStorage
7. Subsequent requests include JWT in Authorization header
```

### Code Generation Flow
```
1. User enters prompt in chat interface
2. Frontend emits WebSocket event 'start_generation'
3. WebSocket Service forwards to Generation Service
4. Generation Service validates request and user auth
5. OpenAI API called with processed prompt
6. Real-time progress updates via WebSocket
7. Result stored in database
8. Final result sent to user via WebSocket
9. Frontend displays generated code
```

### Real-time Chat Flow
```
1. User types message in chat interface
2. Frontend emits 'send_message' via WebSocket
3. WebSocket Service validates user authentication
4. Message stored in database (if persistent chat needed)
5. Message broadcast to all users in room
6. Recipients receive message via WebSocket
7. Frontend updates chat interface
```

## Database Design

### Entity Relationship Diagram
```
┌─────────────┐         ┌─────────────────┐
│    Users    │         │   Generations   │
├─────────────┤         ├─────────────────┤
│ id (PK)     │────────▶│ user_id (FK)    │
│ email       │         │ id (PK)         │
│ password    │         │ type            │
│ name        │         │ prompt          │
│ avatar_url  │         │ result          │
│ oauth_*     │         │ language        │
│ role        │         │ metadata        │
│ timestamps  │         │ created_at      │
└─────────────┘         └─────────────────┘
       │
       │                 ┌─────────────────┐
       │                 │   Chat_Messages │
       └────────────────▶│ (Future)        │
                         ├─────────────────┤
                         │ user_id (FK)    │
                         │ id (PK)         │
                         │ content         │
                         │ room_id         │
                         │ timestamps      │
                         └─────────────────┘
```

## Security Architecture

### Authentication & Authorization
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Auth Service  │
│                 │    │                 │    │                 │
│ • Store JWT     │───▶│ • Validate      │───▶│ • Issue JWT     │
│ • Send Auth     │    │   requests      │    │ • Validate user │
│   headers       │    │ • Forward with  │    │ • Hash passwords│
│ • Handle OAuth  │    │   auth context  │    │ • OAuth flow    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Protection
- **Encryption at Rest:** Database encryption using PostgreSQL built-in features
- **Encryption in Transit:** TLS 1.3 for all HTTPS communication
- **Password Security:** bcrypt hashing with salt rounds
- **JWT Security:** RS256 signing with key rotation capability
- **Input Validation:** Joi schemas for all API inputs
- **Rate Limiting:** Redis-based rate limiting per user/IP
- **CORS:** Strict CORS policies configured per environment

### Security Headers
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "https:"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## Deployment Architecture

### Development Environment
```
Docker Compose Setup:
┌─────────────────────────────────────────┐
│              Host Machine               │
│  ┌─────────────────────────────────────┐│
│  │           Docker Network            ││
│  │  ┌───────┐ ┌───────┐ ┌───────────┐  ││
│  │  │Frontend│ │Gateway│ │Services   │  ││
│  │  │:3000  │ │:8080  │ │:3001-3003 │  ││
│  │  └───────┘ └───────┘ └───────────┘  ││
│  │  ┌──────────────────────────────┐   ││
│  │  │     Database Layer           │   ││
│  │  │  PostgreSQL:5432 Redis:6379  │   ││
│  │  └──────────────────────────────┘   ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### Production Environment (Future)
```
Kubernetes Cluster:
┌─────────────────────────────────────────┐
│              Load Balancer              │
│               (Nginx/HAProxy)           │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│           Kubernetes Cluster           │
│  ┌───────────────────────────────────┐  │
│  │         Frontend Pods             │  │
│  │      (Horizontal Pod Autoscaler)  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │        Backend Services           │  │
│  │   Auth │ Generation │ WebSocket   │  │
│  │  (3 replicas each with HPA)      │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │          Data Layer               │  │
│  │  PostgreSQL │ Redis │ File Store  │  │
│  │   (Managed services or operators) │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Monitoring and Observability

### Logging Strategy
```javascript
// Structured logging format
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "info",
  "service": "auth-service",
  "traceId": "abc123",
  "userId": "user-456",
  "event": "user_login",
  "metadata": {
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  },
  "message": "User login successful"
}
```

### Metrics Collection
- **Application Metrics:** Request latency, error rates, throughput
- **Business Metrics:** User registrations, generations per day, feature usage
- **Infrastructure Metrics:** CPU, memory, disk usage, network I/O
- **Database Metrics:** Query performance, connection pools, index usage

### Health Checks
Each service implements health check endpoints:
```javascript
app.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'auth-service',
    version: process.env.APP_VERSION,
    dependencies: {
      database: 'healthy',
      redis: 'healthy',
      external_apis: 'healthy'
    }
  };
  res.json(health);
});
```

## Scalability Considerations

### Horizontal Scaling
- **Stateless Services:** All backend services are stateless for easy scaling
- **Database Connection Pooling:** PgBouncer for PostgreSQL connection management
- **Redis Clustering:** Redis Cluster for cache scaling
- **CDN Integration:** CloudFront/CloudFlare for static asset delivery

### Performance Optimization
- **Database Indexing:** Strategic indexes on frequently queried columns
- **Caching Strategy:** Redis for session data, API responses, and computed results
- **Asset Optimization:** Webpack bundle splitting and lazy loading
- **API Rate Limiting:** Protect against abuse and ensure fair usage

### Resource Planning
```
Current Estimates (per 1000 concurrent users):
- Frontend: 2-4 pods (1 CPU, 512MB RAM each)
- Auth Service: 3-5 pods (0.5 CPU, 256MB RAM each)
- Generation Service: 5-10 pods (1 CPU, 512MB RAM each)
- WebSocket Service: 2-4 pods (0.5 CPU, 256MB RAM each)
- PostgreSQL: 2-4 CPU, 4-8GB RAM
- Redis: 1-2 CPU, 2-4GB RAM
```

## Future Architecture Enhancements

### Phase 2: Enhanced Features
- **API Marketplace:** User-generated API sharing
- **Collaboration Tools:** Real-time collaborative editing
- **Plugin System:** Third-party integrations
- **Advanced Analytics:** Usage patterns and optimization insights

### Phase 3: Enterprise Features
- **Multi-tenancy:** Organization-level isolation
- **SAML/LDAP Integration:** Enterprise authentication
- **Advanced Security:** Vault integration, certificate management
- **Compliance:** SOC2, GDPR, HIPAA compliance frameworks

### Phase 4: Platform Evolution
- **AI Model Management:** Support for multiple AI providers
- **Edge Computing:** Regional deployments for performance
- **Mobile Applications:** Native iOS/Android apps
- **Desktop Applications:** Electron-based desktop clients