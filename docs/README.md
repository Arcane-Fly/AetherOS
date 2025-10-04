# AetherOS Documentation

Welcome to the AetherOS documentation! This directory contains comprehensive guides for developing, deploying, and maintaining the AetherOS platform.

## 📚 Documentation Index

### Getting Started

- **[SETUP.md](./SETUP.md)** - Complete setup guide with step-by-step instructions
  - Initial setup with Yarn 4.9.2 and Corepack
  - Development environment configuration
  - Common tasks and workflows
  - Troubleshooting guide

### Development Standards

- **[development-standards.md](./development-standards.md)** - React/TypeScript Development Standards
  - Project structure and folder organization
  - Naming conventions for components, functions, and files
  - Tooling configuration (ESLint, Prettier, TypeScript)
  - Yarn 4 best practices and workspace management
  - Sample components and utilities
  - Quality checks and validation

- **[python-standards.md](./python-standards.md)** - Python Backend Development Standards
  - Python naming conventions and code style
  - Linting with Pylint and formatting with Black
  - Type checking with mypy
  - Project structure for Python modules
  - Best practices and error handling
  - Testing with pytest

### Deployment & Operations

- **[railway-fix.md](./railway-fix.md)** - Railway Deployment Guide
  - Railpack configuration troubleshooting
  - Shell compatibility issues and solutions
  - Validation scripts for deployment
  - CI/CD best practices

## 🎯 Quick Links by Task

### I want to...

#### Set up a development environment
→ Start with [SETUP.md](./SETUP.md)

#### Learn the coding standards
→ Read [development-standards.md](./development-standards.md) for frontend
→ Read [python-standards.md](./python-standards.md) for backend

#### Deploy to Railway
→ Follow [railway-fix.md](./railway-fix.md)

#### Understand the project structure
→ See the project structure section in [development-standards.md](./development-standards.md)

#### Configure linting and formatting
→ Check the tooling section in [development-standards.md](./development-standards.md)

#### Work with Yarn workspaces
→ See Yarn workspace commands in [SETUP.md](./SETUP.md#yarn-workspace-commands)

#### Fix common issues
→ Check the troubleshooting section in [SETUP.md](./SETUP.md#troubleshooting)

## 📖 Document Summaries

### SETUP.md (Complete Setup Guide)
**Purpose**: Your first stop for getting AetherOS running locally

**Contents**:
- Prerequisites and required software
- Step-by-step setup instructions
- Environment configuration
- Development workflow
- Common tasks and commands
- Comprehensive troubleshooting

**Best for**: New developers, setup issues, common tasks reference

### development-standards.md (React/TypeScript Standards)
**Purpose**: Comprehensive guide for frontend development

**Contents**:
- Naming conventions for all file types
- Folder structure and organization
- ESLint, Prettier, TypeScript configuration
- Yarn 4 workspace management
- Sample components demonstrating best practices
- Quality checks and validation

**Best for**: Frontend development, code reviews, setting up tooling

### python-standards.md (Python Backend Standards)
**Purpose**: Complete guide for Python backend development

**Contents**:
- Python naming conventions (PEP 8)
- Pylint, Black, mypy configuration
- Project structure for Python services
- Documentation standards
- Error handling and logging
- Testing with pytest

**Best for**: Backend development, Python code reviews, service architecture

### railway-fix.md (Railway Deployment)
**Purpose**: Railway deployment troubleshooting and best practices

**Contents**:
- Railpack configuration issues and solutions
- Shell compatibility (sh vs bash)
- Validation scripts
- Corepack integration for Railway
- CI/CD recommendations

**Best for**: Deployment issues, Railway configuration, CI/CD setup

## 🚀 Getting Started Workflow

### For New Developers

1. **Read [SETUP.md](./SETUP.md)** - Set up your environment
2. **Review [development-standards.md](./development-standards.md)** - Learn the conventions
3. **Check [build-tooling-summary.md](./build-tooling-summary.md)** - Understand current build tooling (optional)
4. **Check the main [README.md](../README.md)** - Understand the project
5. **Start coding!**

### For Code Reviews

1. Check adherence to [development-standards.md](./development-standards.md) (frontend)
2. Check adherence to [python-standards.md](./python-standards.md) (backend)
3. Verify linting passes
4. Ensure tests are included

### For Deployment

1. Review [railway-fix.md](./railway-fix.md) for Railway-specific issues
2. Run `yarn validate:railpack-advanced` before deployment
3. Verify environment variables are set
4. Check health endpoints

## 🔧 Tools & Configuration

### Yarn 4.9.2+
AetherOS uses Yarn 4.9.2 or higher via Corepack for package management.

```bash
# Enable and verify
corepack enable
corepack prepare yarn@4.9.2 --activate
yarn --version
```

### ESLint & Prettier
Code quality and formatting tools configured for the frontend.

```bash
# Lint code
cd frontend && yarn lint

# Format code
cd frontend && yarn format
```

### Husky
Pre-commit hooks automatically run linting before commits.

```bash
# Hooks run automatically on commit
git commit -m "Your message"
```

## 📝 Additional Resources

### Internal Documentation

- [Main README](../README.md) - Project overview
- [Setup Guide](../specs/setup-guide.md) - Detailed setup instructions
- [Roadmap](../specs/roadmap.md) - Project roadmap and features
- [Code Style](../specs/standards/code-style.md) - General code style guide
- [Tech Stack](../specs/standards/tech-stack.md) - Technology choices
- [Build Tooling Summary](./build-tooling-summary.md) - Build tool recommendations (Nx vs Bazel)
- [Build Tooling Full Analysis](../specs/standards/build-tooling-recommendations.md) - Comprehensive decision matrix

### External Resources

- [Yarn 4 Documentation](https://yarnpkg.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Python PEP 8 Style Guide](https://peps.python.org/pep-0008/)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)

## 🆘 Getting Help

### Quick Reference

| Issue Type | Resource |
|------------|----------|
| Setup problems | [SETUP.md Troubleshooting](./SETUP.md#troubleshooting) |
| Coding standards | [development-standards.md](./development-standards.md) or [python-standards.md](./python-standards.md) |
| Deployment issues | [railway-fix.md](./railway-fix.md) |
| Yarn/package issues | [SETUP.md Yarn Issues](./SETUP.md#yarn-issues) |
| ESLint/Prettier | [development-standards.md Tooling](./development-standards.md#tooling-configuration) |

### Community Support

1. **Check documentation** - Most answers are here
2. **Search GitHub issues** - Someone may have had the same problem
3. **Create an issue** - Include error messages and steps to reproduce
4. **Use GitHub Discussions** - For questions and community help

## 🎓 Learning Path

### Beginner Path
1. [SETUP.md](./SETUP.md) - Get environment running
2. [Main README](../README.md) - Understand the project
3. [development-standards.md](./development-standards.md) - Learn frontend basics
4. Build your first feature!

### Intermediate Path
1. Review all documentation
2. Understand Yarn workspaces
3. Master ESLint and Prettier
4. Contribute to existing features

### Advanced Path
1. [railway-fix.md](./railway-fix.md) - Deployment knowledge
2. [python-standards.md](./python-standards.md) - Backend architecture
3. CI/CD pipeline understanding
4. Lead feature development

## 📊 Documentation Metrics

| Document | Size | Purpose | Audience |
|----------|------|---------|----------|
| SETUP.md | 10KB | Complete setup guide | All developers |
| development-standards.md | 12KB | Frontend standards | Frontend developers |
| python-standards.md | 15KB | Backend standards | Backend developers |
| railway-fix.md | 5KB | Deployment guide | DevOps, deployments |

## ✅ Documentation Checklist

Before starting development:
- [ ] Read SETUP.md and set up environment
- [ ] Review relevant standards document
- [ ] Understand naming conventions
- [ ] Configure editor with ESLint/Prettier
- [ ] Test linting and formatting

Before submitting code:
- [ ] Code follows standards
- [ ] Linting passes (`yarn lint`)
- [ ] Formatting is correct (`yarn format:check`)
- [ ] Tests are included
- [ ] Documentation updated if needed

Before deployment:
- [ ] Railpack validation passes
- [ ] Environment variables configured
- [ ] Build succeeds
- [ ] Health checks work

## 🔄 Keeping Documentation Updated

Documentation should be updated when:
- New tools are added
- Standards change
- New workflows are introduced
- Common issues are discovered
- Project structure changes

To update documentation:
1. Edit the relevant markdown file
2. Follow existing formatting
3. Update this README.md if adding new docs
4. Submit a PR with clear description

## 📞 Contact & Support

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and help
- **Pull Requests**: For contributions

---

**Last Updated**: January 2024  
**Documentation Version**: 1.0.0  
**AetherOS Version**: 1.0.0

Happy coding! 🚀
