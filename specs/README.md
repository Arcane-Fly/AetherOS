# AetherOS Specifications

This directory contains the official specifications and standards for the AetherOS project, based on agent-os best practices and tailored for AetherOS's microservices architecture.

## Quick Start

### New to AetherOS?
1. **Start here:** [`setup-guide.md`](setup-guide.md) - Complete installation and configuration guide
2. **Understand the system:** [`architecture.md`](architecture.md) - System design and component overview
3. **Learn workflows:** [`instructions/meta/pre-flight.md`](instructions/meta/pre-flight.md) - Pre-development checklist

### Ready to Develop?
1. **Plan your work:** [`instructions/core/create-spec.md`](instructions/core/create-spec.md) - Feature specification template
2. **Execute tasks:** [`instructions/core/execute-task.md`](instructions/core/execute-task.md) - Development workflow guide
3. **Analyze existing code:** [`instructions/core/analyze-product.md`](instructions/core/analyze-product.md) - Codebase analysis framework

## Directory Structure

```
specs/
├── README.md                 # This file - overview and navigation
├── setup-guide.md           # Complete installation and setup guide
├── architecture.md          # System architecture documentation
├── roadmap.md               # Product roadmap and future plans
├── standards/               # Development standards and guidelines
│   ├── tech-stack.md        # Technology choices and package manager preferences
│   ├── build-tooling-recommendations.md  # Nx vs Bazel/Pants decision matrix
│   ├── build-tooling-quick-reference.md  # TL;DR and command cheat sheet
│   ├── best-practices.md    # Development best practices with conditional blocks
│   ├── code-style.md        # General code formatting and naming conventions
│   └── code-style/          # Language-specific style guides
│       ├── javascript-style.md  # JavaScript/React specific guidelines
│       ├── css-style.md         # CSS/Tailwind specific guidelines
│       └── html-style.md        # HTML/JSX specific guidelines
└── instructions/            # Development workflow instructions
    ├── core/               # Core development workflows
    │   ├── create-spec.md     # Feature specification creation
    │   ├── execute-task.md    # Task execution workflow
    │   └── analyze-product.md # Product/codebase analysis
    └── meta/               # Meta-development processes
        └── pre-flight.md      # Pre-development checklist
```

## Purpose and Philosophy

These specifications ensure:
- **Consistency** across all AetherOS development efforts
- **Quality** through established standards and best practices
- **Scalability** by defining architectural principles
- **Security** by mandating secure development practices
- **Maintainability** through consistent code style and organization
- **Developer Velocity** through clear workflows and automated tooling

## Package Management & Build Tooling Standards

AetherOS follows a hierarchical approach to package management and build tooling:

### JavaScript/Node.js
1. **Primary:** Yarn 4.9.2 (`yarn install`, `yarn add`)
2. **Fallback:** pnpm (`pnpm install`, `pnpm add`)
3. **Last Resort:** npm (`npm install`)

### Python (Future Services)
1. **Primary:** uv (`uv add`, `uv install`)
2. **Fallback:** Poetry (`poetry add`, `poetry install`)
3. **Last Resort:** pip (`pip install`)

**Rationale:** These tools provide better dependency resolution, faster installs, and more reliable lock files.

### Build & Monorepo Management
- **Current:** Yarn 4.9.2 Workspaces (sufficient for current scale)
- **Future:** Nx (when > 10 packages or > 5 developers)
- **Avoid:** Bazel/Pants (unless Python becomes 50%+ of codebase)

**📖 See [Build Tooling Recommendations](./standards/build-tooling-recommendations.md)** for comprehensive analysis of Nx vs Bazel/Pants decision matrix.

**📖 See [Build Tooling Quick Reference](./standards/build-tooling-quick-reference.md)** for TL;DR and command cheat sheet.

## Usage Guidelines

### For All Contributors
1. **Read and understand** these specifications before contributing
2. **Follow the guidelines** when writing code, documentation, or tests
3. **Reference these documents** during code reviews
4. **Propose updates** via pull requests when standards need evolution

### For New Team Members
1. **Start with** [`setup-guide.md`](setup-guide.md) for environment setup
2. **Review** [`standards/tech-stack.md`](standards/tech-stack.md) for technology choices
3. **Understand** [`standards/best-practices.md`](standards/best-practices.md) for development approach
4. **Follow** [`standards/code-style.md`](standards/code-style.md) for formatting standards

### For AI Development Assistants
These specifications are designed to work with AI coding assistants like Cursor, Claude Code, and GitHub Copilot:

1. **Context Loading:** Reference relevant specification files when starting new tasks
2. **Conditional Blocks:** Pay attention to conditional sections in best-practices.md
3. **Standards Compliance:** Ensure generated code follows established patterns
4. **Workflow Adherence:** Follow the structured workflows in the instructions directory

## Key Features of AetherOS Specifications

### 1. Agent-OS Inspired Structure
- Modular specification documents
- Conditional context blocks for efficient AI assistant usage
- Clear separation of concerns between different types of standards

### 2. Technology Stack Clarity
- Explicit package manager preferences
- Clear rationale for technology choices
- Upgrade paths and alternatives documented

### 3. Comprehensive Code Style
- Language-specific style guides
- Automated enforcement through linting
- Examples and anti-patterns

### 4. Structured Workflows
- Step-by-step development processes
- Checklists for quality assurance
- Integration with existing tooling

### 5. Security-First Approach
- Security considerations embedded in all processes
- Clear guidelines for sensitive data handling
- Regular security review requirements

## Development Workflow Integration

### Pre-Development
```bash
# 1. Review pre-flight checklist
open specs/instructions/meta/pre-flight.md

# 2. Set up development environment
# Follow specs/setup-guide.md

# 3. Understand the task requirements
# Use specs/instructions/core/create-spec.md for new features
```

### During Development
```bash
# 1. Follow task execution workflow
# Reference specs/instructions/core/execute-task.md

# 2. Ensure code quality
yarn lint
yarn test
yarn format

# 3. Follow architectural patterns
# Reference specs/architecture.md
```

### Code Review Process
1. **Standards Compliance:** Verify adherence to code style guidelines
2. **Security Review:** Check for security best practices
3. **Architecture Alignment:** Ensure changes fit the overall system design
4. **Documentation:** Verify that relevant documentation is updated

## Continuous Improvement

### Specification Updates
- **Regular Reviews:** Quarterly review of all specifications
- **Community Input:** Encourage team feedback on specification effectiveness
- **Version Control:** All changes tracked and reviewed through pull requests
- **Impact Assessment:** Evaluate impact of specification changes on existing code

### Metrics and Monitoring
- **Code Quality Metrics:** Track linting violations, test coverage
- **Development Velocity:** Monitor time from specification to deployment
- **Developer Satisfaction:** Regular surveys on specification utility
- **Security Metrics:** Track security-related issues and compliance

## Tools and Automation

### Code Quality Enforcement
```bash
# Linting and formatting
yarn lint          # Check code style
yarn lint:fix      # Auto-fix issues
yarn format        # Format code

# Testing
yarn test          # Run all tests
yarn test:coverage # Generate coverage reports
```

### Documentation Generation
- API documentation auto-generated from code
- Architecture diagrams kept in sync with implementation
- Specification compliance checks in CI/CD pipeline

### Development Environment
- Docker Compose for consistent development environments
- VS Code settings and extensions recommendations
- Automated setup scripts following these specifications

## Related Resources

### Internal Documentation
- **Product Requirements:** [`../product-requirements-document.md`](../product-requirements-document.md)
- **Project README:** [`../README.md`](../README.md)
- **Roadmap:** [`roadmap.md`](roadmap.md)

### External References
- **Agent-OS:** https://buildermethods.com/agent-os (Original inspiration)
- **React Documentation:** https://react.dev/
- **Express.js:** https://expressjs.com/
- **Docker:** https://docs.docker.com/
- **OpenAI API:** https://platform.openai.com/docs

## Getting Help

### For Specification Questions
1. **Check existing docs** in this directory first
2. **Search GitHub issues** for related discussions
3. **Create new GitHub issue** with "specs" label for clarification
4. **Propose changes** via pull request for improvements

### For Implementation Help
1. **Review relevant instruction files** in `instructions/` directory
2. **Check architecture documentation** for system understanding
3. **Follow setup guide** for environment issues
4. **Use GitHub discussions** for community support

---

**Status:** These specifications are actively maintained and regularly updated to reflect best practices and project evolution.

**Version:** 1.0.0 (aligned with AetherOS v1.0.0)

**Last Updated:** January 2024

For questions or improvements, please create an issue or pull request in the main repository.