# AetherOS - Dynamic Generative Operating Environment

🌊 **AetherOS** is a fluid, adaptive web-based operating system where all components - APIs, CLIs, UIs, workflows, and integrations - are generated on-demand to solve user problems in real-time.

![AetherOS Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB)
![Backend](https://img.shields.io/badge/Backend-Node.js-339933)
![Database](https://img.shields.io/badge/Database-PostgreSQL-336791)
![AI](https://img.shields.io/badge/AI-OpenAI-412991)

## 🎯 Vision

Create a "liquid" container that holds generative capabilities, allowing users to create anything from simple tools to complex applications through natural language interaction, with a robust foundation for authentication, history, and security.

## ✨ Key Features

- 🤖 **AI-Powered Generation**: Create code, APIs, UIs, and CLI tools through natural language
- 🔐 **Secure Authentication**: JWT-based auth with user management
- 💬 **Chat Interface**: Intuitive conversation-based interaction
- 📚 **Creation History**: Track and manage all generated components
- 🏗️ **Microservices Architecture**: Scalable and maintainable design
- 🐳 **Docker Ready**: Easy deployment with Docker Compose
- 🔗 **API-First**: RESTful APIs for all functionality

## 🚀 Quick Start

### Prerequisites

- **Node.js**: >= 20.0.0
- **Yarn**: >= 4.9.2 (managed via Corepack)
- **Docker and Docker Compose** (for production deployment)
- **OpenAI API key** (for code generation)

### Installation

#### For Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Arcane-Fly/AetherOS.git
   cd AetherOS
   ```

2. **Enable Corepack and Yarn 4.9.2**
   ```bash
   # Enable Corepack (comes with Node.js 16.9+)
   corepack enable
   
   # Activate Yarn 4.9.2
   corepack prepare yarn@4.9.2 --activate
   
   # Verify installation
   yarn --version  # Should output: 4.9.2
   ```

3. **Install dependencies**
   ```bash
   # Install all dependencies across workspaces
   yarn install
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your OpenAI API key
   nano .env
   ```

5. **Start development server**
   ```bash
   # Start frontend
   cd frontend && yarn dev
   ```

6. **Visit the application**
   - Frontend: http://localhost:3000

#### For Production (Docker)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Arcane-Fly/AetherOS.git
   cd AetherOS
   ```

2. **Run the setup script**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your OpenAI API key
   nano .env
   ```

4. **Start the services**
   ```bash
   docker-compose up --build
   ```

5. **Visit the application**
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:8080

## 🏗️ Architecture

### System Overview
```
Frontend (React) ↔ API Gateway ↔ Microservices ↔ Databases
                    ↓
              Message Queue (Redis)
                    ↓
              Container Runtime (Docker)
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| **Frontend** | 3000 | React.js web application with Tailwind CSS |
| **API Gateway** | 8080 | Nginx reverse proxy and load balancer |
| **Auth Service** | 3001 | JWT authentication and user management |
| **Generation Service** | 3002 | AI-powered code/API/UI generation |
| **PostgreSQL** | 5432 | Primary database for users and creations |
| **Redis** | 6379 | Caching and session storage |

## 📁 Project Structure

```
aether-os/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API communication layer
│   │   └── utils/          # Utility functions
│   └── Dockerfile
├── backend/
│   ├── services/
│   │   ├── auth-service/   # Authentication microservice
│   │   └── generation-service/ # AI generation microservice
│   └── api-gateway/        # Nginx configuration
├── scripts/                # Setup and deployment scripts
├── docs/                   # Documentation
└── docker-compose.yml     # Docker services configuration
```

## 💡 Usage Examples

### Generate Code
```
User: "Create a Python function to calculate fibonacci numbers"
AetherOS: *Generates optimized Python code with proper documentation*
```

### Generate API
```
User: "Build a REST API for user management with CRUD operations"
AetherOS: *Creates OpenAPI specification with endpoints and schemas*
```

### Generate UI Components
```
User: "Create a responsive dashboard with charts and user stats"
AetherOS: *Generates React component with Tailwind CSS styling*
```

## 🔧 Development

### Development Standards

AetherOS follows comprehensive development standards using modern tooling:

- **Package Manager**: Yarn 4.9.2+ via Corepack
- **Linting**: ESLint with React and TypeScript rules
- **Formatting**: Prettier for consistent code style
- **Pre-commit Hooks**: Husky for automated quality checks
- **TypeScript**: Absolute imports configured for cleaner code
- **Naming Conventions**: 
  - Components: `PascalCase` (e.g., `Button.tsx`)
  - Functions/Variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Types/Interfaces: `PascalCase` (without 'I' prefix)

📖 **See [Development Standards Guide](docs/development-standards.md)** for complete details on:
- Project structure and folder organization
- Naming conventions for all file types
- Tooling configuration (ESLint, Prettier, TypeScript)
- Yarn 4 best practices and workspace management
- Component development examples

📖 **See [Build Tooling Recommendations](specs/standards/build-tooling-recommendations.md)** for analysis of:
- Nx vs Bazel/Pants decision matrix
- When to adopt advanced build tools
- Python integration with uv
- Migration guides and performance benchmarks
- Quick reference: [Build Tooling Cheat Sheet](specs/standards/build-tooling-quick-reference.md)

### Quality Checks

```bash
# Run linting
cd frontend && yarn lint

# Auto-fix linting issues
cd frontend && yarn lint:fix

# Format code
cd frontend && yarn format

# Check formatting
cd frontend && yarn format:check
```

### Running in Development Mode

1. **Install dependencies**
   ```bash
   # Frontend
   cd frontend && npm install
   
   # Backend services
   cd backend/services/auth-service && npm install
   cd ../generation-service && npm install
   ```

2. **Start services individually**
   ```bash
   # Database
   docker-compose up postgres redis -d
   
   # Backend services
   cd backend/services/auth-service && npm run dev
   cd ../generation-service && npm run dev
   
   # Frontend
   cd frontend && npm start
   ```

### API Documentation

#### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

#### Generation Endpoints
- `POST /api/generate/code` - Generate code from natural language
- `POST /api/generate/api` - Generate API specifications
- `POST /api/generate/ui` - Generate UI components
- `POST /api/generate/cli` - Generate CLI tools

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for generation | Required |
| `JWT_SECRET` | Secret for JWT token signing | Change in production |
| `DATABASE_URL` | PostgreSQL connection string | See .env.example |
| `REDIS_URL` | Redis connection string | redis://localhost:6379 |

## 🧪 Testing

```bash
# Run all tests
docker-compose exec auth-service npm test
docker-compose exec generation-service npm test

# Run frontend tests
cd frontend && npm test
```

## 📊 Monitoring

### Health Checks
- `/health` - Overall system health
- Individual service health endpoints available

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f auth-service
docker-compose logs -f generation-service
```

## 🔒 Security

- JWT-based authentication with secure token handling
- Input validation on all endpoints
- Rate limiting on API endpoints
- SQL injection protection with parameterized queries
- CORS configuration for secure cross-origin requests

## 🚀 Deployment

### Production Deployment

1. **Update environment variables**
   ```bash
   # Set production values
   export NODE_ENV=production
   export JWT_SECRET=your-secure-production-secret
   export OPENAI_API_KEY=your-production-api-key
   ```

2. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

### Kubernetes Deployment
```bash
# Apply Kubernetes manifests
kubectl apply -f kubernetes/
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@aetheros.dev
- 💬 Discord: [AetherOS Community](https://discord.gg/aetheros)
- 📖 Documentation: [docs.aetheros.dev](https://docs.aetheros.dev)

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- [x] Core authentication system
- [x] Basic chat interface with history
- [x] Simple code generation capabilities
- [x] Creation storage and management
- [x] Docker-based deployment

### Phase 2: Enhanced Features
- [ ] Advanced generation capabilities (APIs, CLIs)
- [ ] Creation linking and mesh network
- [ ] Improved security and secret management
- [ ] Performance optimization
- [ ] Real-time collaboration

### Phase 3: Scale and Polish
- [ ] Marketplace and sharing features
- [ ] Advanced collaboration tools
- [ ] Enterprise features and integrations
- [ ] Mobile application support
- [ ] Plugin system

---

Made with ❤️ by the AetherOS Team