# AetherOS Technology Stack Standards

This document defines the preferred technologies, frameworks, libraries, and services for building AetherOS.

## Core Philosophy

AetherOS prioritizes developer velocity, scalability, security, and maintainability. We leverage cloud-native technologies, embrace polyglot programming where appropriate, and favor managed services to reduce operational overhead.

## Backend

### Primary Language & Framework

*   **Language:** TypeScript (Node.js LTS - currently v20.x)
*   **Runtime:** Node.js
*   **Primary Framework:** NestJS
    *   Rationale: Provides strong architectural patterns (modules, controllers, services), excellent TypeScript support, built-in DI, and scalability features out of the box. Integrates well with various databases and services.

### Secondary Services (Microservices)

*   **Language:** Python (for AI/ML intensive tasks, leveraging libraries like LangChain, LlamaIndex)
*   **Language:** Go (for performance-critical background services or APIs)
*   **Framework (Python):** FastAPI (for its async support, automatic OpenAPI/Swagger generation, and ease of use with AI libraries)
*   **Framework (Go):** Standard `net/http` or Gin for lightweight services.

### API Standards

*   **Primary:** RESTful APIs (leveraging NestJS controllers)
*   **Secondary:** GraphQL (for complex data fetching needs, potentially via Apollo Server)
*   **Real-time Communication:** WebSocket (for chat updates, live previews, agent status) - NestJS Gateways or Socket.IO.

## Frontend

*   **Language:** TypeScript
*   **Framework:** React 18+ with Vite
    *   Rationale: Industry standard for modern SPAs, excellent ecosystem, fast development cycle with Vite.
*   **State Management:** Redux Toolkit (RTK) + RTK Query for predictable state and data fetching.
*   **UI Library:** Tailwind CSS + Headless UI
    *   Rationale: Utility-first CSS allows for rapid UI development and consistent design. Headless UI provides accessible, unstyled components.
*   **Component Architecture:** Atomic Design Principles.
*   **Build Tool:** Vite (for speed and modern features).

## Data Storage

### Primary Database (Relational)

*   **Choice:** PostgreSQL 15+
    *   Rationale: Robust, feature-rich, supports JSONB for flexible schema needs, strong community and ecosystem, ACID compliance.

### Cache / Session Store

*   **Choice:** Redis 7+
    *   Rationale: Excellent performance for caching, session management, pub/sub messaging, and rate limiting.

### Search

*   **Choice:** Elasticsearch (or managed equivalent like AWS OpenSearch Service)
    *   Rationale: Powerful full-text search capabilities for searching through creations, logs, and user content.

### Object/File Storage

*   **Choice:** S3-compatible Object Storage (AWS S3, MinIO, Google Cloud Storage)
    *   Rationale: Scalable storage for user uploads, generated assets, exported creations.

### Message Queue / Streaming

*   **Choice:** Redis Pub/Sub (for simple messaging) / Apache Kafka or RabbitMQ (for complex workflows and event streaming)
    *   Rationale: Redis for lightweight communication; Kafka/RabbitMQ for durable, scalable event-driven architectures.

## AI Integration

*   **API Abstraction Layer:** Custom service layer abstracting calls to providers listed in `ai1docs.abacusai.app`.
*   **Multi-Provider Strategy:** Integrate with OpenAI, Anthropic Claude, Google Gemini, Groq, and others as needed.
    *   Use provider-specific SDKs or standardized OpenAI-compatible interfaces where available.
*   **Model Selection Logic:** Implement logic to choose models based on task requirements (reasoning, speed, cost, multimodal needs).
*   **Rate Limiting & Retry Logic:** Implement robust handling for API rate limits and transient errors, following best practices from `ai1docs.abacusai.app`.

## Infrastructure & Deployment

*   **Containerization:** Docker
*   **Orchestration:** Kubernetes (K8s)
    *   Rationale: Industry standard for container orchestration, provides scalability, resilience, and service discovery.
*   **Cloud Provider:** Multi-cloud strategy (AWS, GCP, Azure) with a preference for managed services (EKS, GKE, AKS).
*   **CI/CD:** GitHub Actions
*   **Infrastructure as Code:** Terraform or Pulumi
*   **Monitoring & Logging:** Prometheus + Grafana (metrics), ELK Stack or similar (logs), OpenTelemetry (distributed tracing).
*   **Secrets Management:** HashiCorp Vault or cloud-native secrets managers (AWS Secrets Manager, GCP Secret Manager).

## Security

*   **Authentication:** OAuth 2.0 (JWT tokens) with Multi-Factor Authentication (MFA) support.
*   **Authorization:** Role-Based Access Control (RBAC) using libraries like CASL integrated with NestJS.
*   **Data Encryption:** At rest (using cloud provider KMS) and in transit (TLS 1.3).
*   **Secure Execution:** Sandboxed environments (Docker containers with strict limits) for executing user-generated code.