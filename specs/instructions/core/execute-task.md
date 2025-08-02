# Execute Task - AetherOS Development

## Context

Execute a specific development task for AetherOS following established standards and best practices.

## Before You Start

1. **Read Project Standards:**
   - Review `/specs/standards/tech-stack.md` for technology choices
   - Review `/specs/standards/best-practices.md` for development guidelines
   - Review `/specs/standards/code-style.md` for formatting standards

2. **Understand the Task:**
   - Clarify requirements and acceptance criteria
   - Identify dependencies and prerequisites
   - Understand the scope and impact

3. **Set Up Environment:**
   - Ensure you have the latest code: `git pull origin main`
   - Install dependencies: `yarn install:all`
   - Verify services are running: `yarn dev`

## Task Execution Process

### 1. Planning Phase

- [ ] Break down the task into smaller, manageable subtasks
- [ ] Identify which services/components will be affected
- [ ] Plan the implementation approach
- [ ] Consider testing strategy
- [ ] Estimate effort and timeline

### 2. Implementation Phase

- [ ] Create a feature branch: `git checkout -b feature/task-description`
- [ ] Implement changes following code style guidelines
- [ ] Write or update tests as needed
- [ ] Ensure code passes linting: `yarn lint`
- [ ] Test locally to verify functionality

### 3. Testing Phase

- [ ] Run unit tests: `yarn test`
- [ ] Test integration with other services
- [ ] Verify UI changes in browser (if applicable)
- [ ] Test error scenarios and edge cases
- [ ] Validate performance impact

### 4. Documentation Phase

- [ ] Update relevant documentation
- [ ] Add/update code comments where necessary
- [ ] Update API documentation if endpoints changed
- [ ] Document any new environment variables or configuration

### 5. Review and Submission

- [ ] Self-review changes using `git diff`
- [ ] Ensure commit messages follow conventional format
- [ ] Push branch: `git push origin feature/task-description`
- [ ] Create pull request with detailed description
- [ ] Request code review from team members

## Implementation Guidelines

### For Frontend Tasks (React)

```bash
# Navigate to frontend
cd frontend

# Install new dependencies
yarn add <package-name>

# Run development server
yarn start

# Run tests
yarn test

# Build for production
yarn build
```

### For Backend Tasks (Node.js Services)

```bash
# Navigate to specific service
cd backend/services/auth-service  # or generation-service, websocket-service

# Install new dependencies
yarn add <package-name>

# Run in development mode
yarn dev

# Run tests
yarn test

# Check logs
docker compose logs auth-service
```

### For Database Changes

```bash
# Create migration
node scripts/migrate.js create migration_name

# Run migrations
node scripts/migrate.js up

# Seed test data
node scripts/seed-templates.js
```

## Code Quality Checklist

### General Code Quality
- [ ] Code follows established naming conventions
- [ ] Functions are small and focused on single responsibility
- [ ] Error handling is comprehensive and user-friendly
- [ ] No hardcoded values (use environment variables or constants)
- [ ] Code is commented where business logic is complex

### Security Considerations
- [ ] Input validation is implemented
- [ ] Authentication/authorization is properly handled
- [ ] Sensitive data is not logged
- [ ] Dependencies are up to date and secure
- [ ] Rate limiting is implemented for public endpoints

### Performance Considerations
- [ ] Database queries are optimized
- [ ] Large datasets are paginated
- [ ] Caching is implemented where appropriate
- [ ] Bundle size impact is considered (frontend)
- [ ] Memory leaks are avoided

## Testing Strategy

### Unit Tests
- Test individual functions and components
- Mock external dependencies
- Aim for >80% code coverage on business logic

### Integration Tests
- Test API endpoints with real database
- Test service-to-service communication
- Verify authentication flows

### Manual Testing
- Test happy path scenarios
- Test error conditions
- Test edge cases and boundary conditions
- Verify responsive design (frontend)

## Common Issues and Solutions

### Dependency Conflicts
```bash
# Clear node_modules and reinstall
rm -rf node_modules yarn.lock
yarn install
```

### Service Communication Issues
```bash
# Check service health
curl http://localhost:3001/health  # auth-service
curl http://localhost:3002/health  # generation-service

# Check Docker network
docker compose ps
docker compose logs
```

### Database Connection Issues
```bash
# Check PostgreSQL connection
docker compose exec postgres psql -U postgres -d aetheros -c "SELECT 1;"

# Run migrations
yarn migrate
```

## Deployment Considerations

### Before Deployment
- [ ] All tests pass
- [ ] Code has been reviewed and approved
- [ ] Documentation is updated
- [ ] Environment variables are configured
- [ ] Database migrations are ready

### Deployment Process
- [ ] Merge to main branch
- [ ] Run production build
- [ ] Deploy to staging environment first
- [ ] Run smoke tests on staging
- [ ] Deploy to production
- [ ] Monitor for errors and performance issues

## Rollback Plan

If issues are discovered after deployment:
1. Immediately rollback to previous version
2. Investigate root cause
3. Fix issues in development environment
4. Re-test thoroughly
5. Redeploy with fixes

## Best Practices Reminders

1. **Commit Early and Often:** Make small, logical commits
2. **Test Thoroughly:** Don't rely solely on automated tests
3. **Document Changes:** Update relevant documentation
4. **Follow Standards:** Adhere to established coding standards
5. **Communicate:** Keep team informed of progress and blockers
6. **Security First:** Always consider security implications
7. **Performance Matters:** Monitor impact on system performance
8. **User Experience:** Consider end-user impact of changes