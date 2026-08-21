---
name: devops
description: "DevOps practices, Docker containerization, CI/CD pipelines, GitHub Actions, deployment automation, health checks, logging, monitoring, rollback strategies, environment configuration, and secrets management. Use when configuring build pipelines, deployments, infrastructure, or container environments."
---

# DevOps, CI/CD & Deployment Engineering

## When to Load
- Setting up or debugging CI/CD pipelines (GitHub Actions, Vercel, etc.)
- Configuring Docker containerization and Dockerfile builds
- Managing environment variables and deployment secrets
- Implementing production health checks, monitoring, or logging
- Planning and executing deployment rollbacks
- Verifying post-deployment stability and build artifacts

## Environment Configuration & Secrets Management

### Hierarchy of Environments
1. **Local (`.env.local`)**: Machine-specific secrets for local development. Never committed to VCS.
2. **Preview / Staging (`.env.preview`)**: Ephemeral environments mirroring production configurations.
3. **Production (`.env.production` / Cloud Secrets Manager)**: Production credentials, high-entropy API keys, MongoDB Atlas connection strings.

### Secret Management Rules
- Maintain `.env.example` containing dummy values and documentation for every required variable.
- Never commit actual `.env`, `.env.local`, or secret credentials into git.
- Restrict write access to production secrets to authorized deployment pipelines.

## Docker Containerization Standards

### Multi-Stage Next.js Dockerfile Pattern
```dockerfile
# 1. Dependencies stage
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Builder stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3. Runner stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

## CI/CD Pipeline Design (GitHub Actions)

### Core Pipeline Stages
```
Lint & Format ──► Typecheck ──► Automated Tests ──► Production Build ──► Deploy
```

### Essential Workflow File (`.github/workflows/ci.yml`)
```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck --if-present
      - run: npm test --if-present
      - run: npm run build
```

## Health Checks, Monitoring & Logging

### Health Check Endpoint Standard
Provide `/api/health` returning:
- HTTP 200 if server and database connection are functional
- Response payload:
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-08-19T22:00:00Z",
    "services": {
      "database": "connected",
      "uptime": 3600
    }
  }
  ```

### Logging Best Practices
- Structured JSON logging in production.
- Separate log severity levels: `ERROR`, `WARN`, `INFO`, `DEBUG`.
- Redact PII (Personally Identifiable Information), tokens, passwords, and database connection strings before writing logs.

## Rollback & Production Verification

### Rollback Strategy
- Keep previous deployment build artifacts accessible for instant 1-click rollback.
- When a critical issue is discovered post-release:
  1. Trigger immediate rollback to the last verified stable release commit/tag.
  2. Confirm site recovery via synthetic smoke tests and health check.
  3. Investigate the root cause in isolation on a branch, never in production directly.

### Post-Deployment Verification (Smoke Test)
1. Verify 200 OK on primary endpoints: `/`, `/about`, `/courses`, `/results`, `/contact`.
2. Test critical user journeys (e.g. Student Login flow, Contact CTA clicks).
3. Validate SSL certificates and response headers.
