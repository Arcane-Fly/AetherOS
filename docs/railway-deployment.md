# Railway Deployment Guide for AetherOS

This guide covers deploying AetherOS to Railway using railpack.json configurations.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Railway CLI**: Install with `npm install -g @railway/cli` or `curl -fsSL https://railway.app/install.sh | sh`
3. **Environment Variables**: Prepare your production environment variables

## Deployment Architecture

AetherOS is deployed as a multi-service application on Railway:
- **Frontend Service**: React application (Static hosting)
- **Auth Service**: Authentication microservice
- **Generation Service**: AI code generation microservice  
- **WebSocket Service**: Real-time communication service
- **PostgreSQL**: Database addon
- **Redis**: Cache and session storage addon

## Step-by-Step Deployment

### 1. Login to Railway

```bash
railway login
```

### 2. Create Railway Project

```bash
railway init
# Select "Create new project"
# Choose your team/account
```

### 3. Add Database Services

```bash
# Add PostgreSQL database
railway add --service postgresql

# Add Redis cache
railway add --service redis
```

### 4. Deploy Backend Services

Deploy each service separately:

#### Auth Service
```bash
cd backend/services/auth-service
railway up

# Configure environment variables in Railway dashboard:
# - JWT_SECRET (generate secure random string)
# - DATABASE_URL (use ${{Postgres.DATABASE_URL}})  
# - SESSION_SECRET (generate secure random string)
# - CORS_ORIGIN (use ${{frontend.RAILWAY_PUBLIC_DOMAIN}})
```

#### Generation Service  
```bash
cd backend/services/generation-service
railway up

# Configure environment variables:
# - OPENAI_API_KEY (your OpenAI API key)
# - REDIS_URL (use ${{Redis.REDIS_URL}})
# - All model configuration variables from .env.railway.example
```

#### WebSocket Service
```bash
cd backend/services/websocket-service  
railway up

# Configure environment variables:
# - REDIS_URL (use ${{Redis.REDIS_URL}})
# - JWT_SECRET (same as auth service)
# - CORS_ORIGIN (use ${{frontend.RAILWAY_PUBLIC_DOMAIN}})
```

### 5. Deploy Frontend

```bash
cd frontend
railway up

# Configure environment variables:
# - REACT_APP_API_URL (use appropriate service domains)
# - REACT_APP_WEBSOCKET_URL (use websocket service domain)
```

### 6. Configure Service Communication

In Railway dashboard, set up service references:

**Auth Service Environment:**
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
CORS_ORIGIN=https://${{frontend.RAILWAY_PUBLIC_DOMAIN}}
```

**Generation Service Environment:**
```
REDIS_URL=${{Redis.REDIS_URL}}
AUTH_SERVICE_URL=https://${{auth-service.RAILWAY_PRIVATE_DOMAIN}}
```

**WebSocket Service Environment:**
```
REDIS_URL=${{Redis.REDIS_URL}}
AUTH_SERVICE_URL=https://${{auth-service.RAILWAY_PRIVATE_DOMAIN}}
```

**Frontend Environment:**
```
REACT_APP_API_URL=https://${{auth-service.RAILWAY_PUBLIC_DOMAIN}}/api
REACT_APP_WEBSOCKET_URL=https://${{websocket-service.RAILWAY_PUBLIC_DOMAIN}}
```

## Environment Variables Setup

### Required Variables by Service

**All Backend Services:**
- `NODE_ENV=production`
- `LOG_LEVEL=info`

**Auth Service:**
- `JWT_SECRET` (min 32 characters)
- `SESSION_SECRET` (min 32 characters) 
- `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- `CORS_ORIGIN=https://${{frontend.RAILWAY_PUBLIC_DOMAIN}}`

**Generation Service:**
- `OPENAI_API_KEY` (your API key)
- `REDIS_URL=${{Redis.REDIS_URL}}`
- Model configuration variables (see .env.railway.example)

**WebSocket Service:**
- `REDIS_URL=${{Redis.REDIS_URL}}`
- `JWT_SECRET` (same as auth service)
- `CORS_ORIGIN=https://${{frontend.RAILWAY_PUBLIC_DOMAIN}}`

**Frontend:**
- `REACT_APP_API_URL=https://${{auth-service.RAILWAY_PUBLIC_DOMAIN}}/api`
- `REACT_APP_WEBSOCKET_URL=https://${{websocket-service.RAILWAY_PUBLIC_DOMAIN}}`

## Health Check Endpoints

All services expose health check endpoints:

- **Auth Service**: `GET /health`
- **Generation Service**: `GET /health`
- **WebSocket Service**: `GET /health`
- **Frontend**: `GET /` (serves React app)

Railway automatically uses these for health monitoring.

## Troubleshooting

### Common Issues

1. **Build Failures**: 
   - Verify railpack.json syntax with `jq '.' railpack.json`
   - Ensure no conflicting Dockerfile exists
   - Check yarn.lock compatibility with Yarn 4.x

2. **Port Binding Issues**:
   - Services automatically bind to Railway's provided `PORT` environment variable
   - Never set PORT manually - Railway handles this automatically

3. **Service Communication**:
   - Use `${{service-name.RAILWAY_PRIVATE_DOMAIN}}` for internal service-to-service communication
   - Use `${{service-name.RAILWAY_PUBLIC_DOMAIN}}` for external/frontend access

4. **Environment Variable References**:
   - Use Railway's variable reference syntax: `${{ServiceName.VARIABLE}}`
   - Database and Redis URLs are automatically provided by addons

### Debugging Commands

```bash
# Check service status
railway status

# View service logs
railway logs --service auth-service

# Check environment variables
railway variables

# Redeploy service
railway up --force

# Test health endpoints
curl https://your-auth-service.railway.app/health
```

## Production Checklist

- [ ] All environment variables configured
- [ ] OAuth callback URLs updated for production domains
- [ ] JWT and session secrets generated (min 32 characters)
- [ ] OpenAI API key configured
- [ ] Database migrations run successfully
- [ ] All health checks passing
- [ ] Service-to-service communication working
- [ ] Frontend API calls working
- [ ] WebSocket connections working
- [ ] CORS configuration correct

## Cost Optimization

- **Shared Services**: Use single PostgreSQL and Redis instances for all microservices
- **Model Selection**: Configure cost-effective AI models via environment variables
- **Resource Limits**: Set appropriate resource limits in Railway dashboard
- **Monitoring**: Use Railway's built-in monitoring to track usage

## Next Steps

After deployment:
1. Set up monitoring and alerts
2. Configure custom domain (optional)
3. Set up backup strategy for database
4. Implement CI/CD pipeline with GitHub Actions
5. Configure environment-specific deployments (staging/production)