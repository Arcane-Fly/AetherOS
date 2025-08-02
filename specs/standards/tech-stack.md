# AetherOS Technology Stack Standards

This document defines the preferred technologies, frameworks, libraries, and services for building AetherOS.

## Core Philosophy

AetherOS prioritizes developer velocity, scalability, security, and maintainability. We leverage cloud-native technologies, embrace polyglot programming where appropriate, and favor managed services to reduce operational overhead.

## Package Management Hierarchy

Following modern development best practices, AetherOS uses the following package manager preferences:

### JavaScript/Node.js
1. **Primary:** Yarn (Classic or Berry) - `yarn install`, `yarn add`
2. **Fallback:** pnpm - `pnpm install`, `pnpm add`
3. **Last Resort:** npm - `npm install`, `npm install --save`

### Python
1. **Primary:** uv - `uv add`, `uv install`
2. **Fallback:** Poetry - `poetry add`, `poetry install`
3. **Last Resort:** pip - `pip install`

**Rationale:** These package managers provide better dependency resolution, faster installs, and more reliable lock files compared to their base counterparts.

## Backend

### Primary Language & Framework

*   **Language:** JavaScript/TypeScript (Node.js LTS - currently v20.x)
*   **Runtime:** Node.js
*   **Primary Framework:** Express.js with microservices architecture
    *   Rationale: Lightweight, flexible, and well-suited for microservices. Allows each service to be independently deployable and scalable.

### Microservices Architecture

*   **Auth Service:** Express.js with JWT authentication, OAuth integration
*   **Generation Service:** Express.js with OpenAI API integration for code generation
*   **WebSocket Service:** Socket.IO for real-time communication
*   **API Gateway:** Nginx reverse proxy for service routing and load balancing

### AI/ML Integration

*   **Language:** Python (for AI/ML intensive tasks, leveraging libraries like LangChain, LlamaIndex)
*   **Framework (Python):** FastAPI (for its async support, automatic OpenAPI/Swagger generation, and ease of use with AI libraries)
*   **AI Providers:** OpenAI GPT models for code generation and natural language processing

### API Standards

*   **Primary:** RESTful APIs with Express.js routers
*   **Real-time Communication:** WebSocket via Socket.IO for chat updates, live previews, agent status
*   **Authentication:** JWT tokens with OAuth 2.0 support (Google, GitHub)

## Frontend

*   **Language:** JavaScript with modern ES6+ features
*   **Framework:** React 18+ with Create React App
    *   Rationale: Industry standard for modern SPAs, excellent ecosystem, extensive community support
*   **State Management:** Context API + useState/useReducer for simpler state management
*   **UI Library:** Tailwind CSS for utility-first styling
    *   Rationale: Utility-first CSS allows for rapid UI development and consistent design
*   **Component Architecture:** Atomic Design Principles with reusable components
*   **Build Tool:** React Scripts (Create React App) with potential migration to Vite for performance

## Data Storage

### Primary Database (Relational)

*   **Choice:** PostgreSQL 15+
    *   Rationale: Robust, feature-rich, supports JSONB for flexible schema needs, strong community and ecosystem, ACID compliance.

### Cache / Session Store

*   **Choice:** Redis 7+
    *   Rationale: Excellent performance for caching, session management, pub/sub messaging, and rate limiting.

### Object/File Storage

*   **Choice:** Local file system (development) / S3-compatible Object Storage (production)
    *   Rationale: Simple file handling for development, scalable cloud storage for production deployments.

## Infrastructure & Deployment

*   **Containerization:** Docker
*   **Orchestration:** Docker Compose (development) / Kubernetes (production)
    *   Rationale: Docker Compose for simple local development, Kubernetes for production scalability
*   **Reverse Proxy:** Nginx (for API gateway and static file serving)
*   **CI/CD:** GitHub Actions
*   **Cloud Provider:** Multi-cloud strategy with preference for managed services
*   **Monitoring & Logging:** Application-level logging with structured JSON format
*   **Secrets Management:** Environment variables with .env files (development) / cloud-native secrets managers (production)

## Security

*   **Authentication:** JWT tokens with OAuth 2.0 (Google, GitHub) support
*   **Authorization:** Role-Based Access Control (RBAC) integrated with user management
*   **Data Encryption:** At rest (database encryption) and in transit (TLS 1.3)
*   **Input Validation:** Joi validation library for API request validation
*   **Rate Limiting:** Express rate limiting middleware
*   **Security Headers:** Helmet.js for security headers
*   **Session Management:** Express sessions with Redis storage

## Development Tools

### Code Quality
*   **Linting:** ESLint with React and Node.js configurations
*   **Formatting:** Prettier for consistent code formatting
*   **Git Hooks:** Pre-commit hooks for linting and formatting

### Testing
*   **Unit Testing:** Jest for both frontend and backend
*   **Integration Testing:** Supertest for API testing
*   **E2E Testing:** Playwright (future consideration)

### Package Management Commands

#### JavaScript/Node.js (Primary: Yarn)
```bash
# Install dependencies
yarn install

# Add dependency
yarn add <package>

# Add dev dependency
yarn add -D <package>

# Run scripts
yarn start
yarn build
yarn test
```

#### Python (Primary: uv)
```bash
# Create project
uv init

# Add dependency
uv add <package>

# Install dependencies
uv install

# Run scripts
uv run <script>
```

## AI Integration Standards

*   **Primary Provider:** OpenAI GPT models
*   **API Client:** OpenAI official Node.js SDK
*   **Rate Limiting:** Built-in retry logic with exponential backoff
*   **Model Selection:** GPT-4 for complex generation, GPT-3.5-turbo for simpler tasks
*   **Prompt Management:** Structured prompts with version control
*   **Cost Optimization:** Request caching and intelligent model selection
*   **Error Handling:** Graceful fallbacks for API failures