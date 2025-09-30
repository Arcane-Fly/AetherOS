# AetherOS Development Best Practices

This document outlines the core principles and practices for developing high-quality, secure, and maintainable code for AetherOS.

## Context

Global development guidelines for AetherOS projects.

<conditional-block context-check="core-principles">
IF this Core Principles section already read in current context:
  SKIP: Re-reading this section
  NOTE: "Using Core Principles already in context"
ELSE:
  READ: The following principles

## Core Principles

### Keep It Simple
- Implement code in the fewest lines possible
- Avoid over-engineering solutions
- Choose straightforward approaches over clever ones
- Prefer composition over inheritance

### Optimize for Readability
- Prioritize code clarity over micro-optimizations
- Write self-documenting code with clear variable names
- Add comments for "why" not "what"
- Use consistent naming conventions across the codebase

### DRY (Don't Repeat Yourself)
- Extract repeated business logic to reusable functions
- Extract repeated UI markup to reusable components
- Create utility functions for common operations
- Share common configuration across services

### File Structure
- Keep files focused on a single responsibility
- Group related functionality together
- Use consistent naming conventions
- Follow established project structure patterns
</conditional-block>

## Development Process

*   **Git Workflow:** Feature branching with Pull Requests
*   **Branch Naming:** `feature/issue-number-short-description`, `bugfix/issue-number-short-description`, `hotfix/issue-number-short-description`
*   **Commit Messages:** Conventional Commits format (`<type>(<scope>): <description>`)
*   **Pull Requests:** Require review by at least one other developer. Use descriptive PR descriptions
*   **Continuous Integration (CI):** Run linting, formatting checks, unit tests, and security scans on every PR

## Package Management Best Practices

### JavaScript/Node.js
- **Primary:** Use `yarn` for all new projects and dependency management
- **Lock Files:** Always commit `yarn.lock` files, remove `package-lock.json` files
- **Scripts:** Use `yarn run <script>` or `yarn <script>` for package scripts
- **Dependencies:** Use `yarn add` for runtime dependencies, `yarn add -D` for dev dependencies

### Version Management
- Pin exact versions for critical dependencies in production
- Use semantic versioning ranges carefully (prefer `~` over `^` for patch updates)
- Regularly audit and update dependencies with `yarn audit`

## Testing Philosophy

*   **Strategy:** A balanced approach combining Unit Testing, Integration Testing, and End-to-End Testing. Emphasis on testing critical business logic and user flows.
*   **Unit Testing:**
    *   **Target:** Individual functions, methods, and isolated units of logic
    *   **Framework:** Jest for both frontend and backend
    *   **Coverage Goal:** Aim for >80% coverage on core business logic modules
    *   **Mocking:** Use Jest mocks for external dependencies and API calls
*   **Integration Testing:**
    *   **Target:** Interaction between modules, services, and external dependencies (databases, APIs)
    *   **Framework:** Jest with Supertest for API endpoints
    *   **Database:** Use test databases or in-memory alternatives
*   **End-to-End (E2E) Testing:**
    *   **Target:** Critical user journeys simulating real user behavior
    *   **Tool:** Playwright for comprehensive browser testing
    *   **Focus:** Authentication flows, core generation features, UI interactions
*   **Test Data:** Use factories or fixtures to manage test data cleanly and consistently

<conditional-block context-check="dependencies" task-condition="choosing-external-library">
IF current task involves choosing an external library:
  IF Dependencies section already read in current context:
    SKIP: Re-reading this section
    NOTE: "Using Dependencies guidelines already in context"
  ELSE:
    READ: The following guidelines
ELSE:
  SKIP: Dependencies section not relevant to current task

## Dependencies

### Choose Libraries Wisely
When adding third-party dependencies:
- Select the most popular and actively maintained option
- Check the library's GitHub repository for:
  - Recent commits (within last 6 months)
  - Active issue resolution
  - Number of stars/downloads
  - Clear documentation
- Prefer libraries with TypeScript support or type definitions
- Consider bundle size impact for frontend dependencies
- Evaluate security track record and vulnerability history
</conditional-block>

## Performance vs Readability

*   **Default:** Prioritize readability and maintainability
*   **Optimization:** Profile and optimize only when performance bottlenecks are identified through monitoring or load testing
*   **Documentation:** Clearly document any intentional trade-offs made for performance reasons
*   **Caching:** Implement intelligent caching strategies for API responses and expensive operations

## Security Considerations

*   **Principle of Least Privilege:** Services and users should have only the minimum permissions necessary
*   **Input Validation:** Validate and sanitize *all* inputs (API requests, user data, file uploads) at the boundary layer
*   **Dependency Management:** Regularly scan dependencies for vulnerabilities using `yarn audit` and automated security tools
*   **Authentication & Authorization:**
    *   Implement robust JWT authentication with proper token expiration
    *   Use secure OAuth 2.0 flows for third-party authentication (Google, GitHub)
    *   Never log sensitive information (passwords, tokens, PII)
*   **Secure Coding Practices:**
    *   Prevent common vulnerabilities (OWASP Top 10): Injection, Broken Authentication, XSS, etc.
    *   Use parameterized queries for database interactions
    *   Implement proper Content Security Policy (CSP) headers
    *   Use HTTPS everywhere in production
*   **Secrets Management:** Never hardcode secrets. Use environment variables and secure secret stores
*   **Rate Limiting:** Implement rate limiting on all public API endpoints to prevent abuse

## API Design Best Practices

*   **RESTful Design:** Use standard HTTP methods (GET, POST, PUT, PATCH, DELETE) correctly
*   **Resource Naming:** Use nouns for resources, not verbs (e.g., `/users` not `/getUsers`)
*   **Error Handling:** Return consistent error response formats with appropriate HTTP status codes
*   **Validation:** Use Joi or similar validation library for request validation
*   **Documentation:** Maintain clear API documentation with request/response examples
*   **Versioning:** Consider API versioning strategy for future changes

## Microservices Best Practices

*   **Service Independence:** Each service should be independently deployable and scalable
*   **Communication:** Use HTTP/REST for synchronous communication, events for asynchronous
*   **Data Isolation:** Each service should own its data and database schema
*   **Health Checks:** Implement health check endpoints for all services
*   **Circuit Breakers:** Implement circuit breaker patterns for external service calls
*   **Logging:** Use structured logging with correlation IDs across service calls

## AI Integration Specifics

*   **Prompt Engineering:** Treat prompts as code - version control them and use templates
*   **Model Evaluation:** Log and monitor the quality/relevance of AI outputs
*   **Fallbacks:** Design fallback logic for AI service failures or poor-quality outputs
*   **Cost Management:** Monitor and optimize LLM usage costs through caching and intelligent routing
*   **Rate Limiting & Retries:** Implement robust retry logic with exponential backoff for AI API calls
*   **Error Handling:** Graceful degradation when AI services are unavailable