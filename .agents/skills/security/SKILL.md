---
name: security
description: "Authentication, authorization, input validation, XSS, CSRF, SSRF, path traversal, secrets management, dependency vulnerabilities, CORS, JWT/session security, file-upload security, and OWASP Top 10. Auto-load when changes touch auth, user input handling, or security-sensitive code."
---

# Security Engineering

## When to Load (Auto-Trigger)
This skill should be loaded automatically when:
- Modifying authentication or authorization logic
- Handling user input (forms, file uploads, query params)
- Working with secrets, tokens, or credentials
- Adding new API endpoints
- Modifying CORS or CSP configuration
- Adding dependencies (check for known vulnerabilities)
- Handling file uploads or downloads

## OWASP Top 10 Checklist

### 1. Broken Access Control
- Verify authentication on every protected route
- Check authorization (does this user own this resource?)
- Deny by default — only allow explicitly permitted actions
- Don't rely on client-side checks alone

### 2. Cryptographic Failures
- Hash passwords with bcrypt (cost factor ≥ 10)
- Never store plaintext secrets
- Use environment variables for all secrets
- Use HTTPS in production
- Don't commit `.env` files

### 3. Injection
- **SQL/NoSQL Injection**: Use parameterized queries (Mongoose handles this)
- **XSS**: Sanitize user input before rendering in HTML
- **Command Injection**: Never pass user input to `exec()` or `spawn()`
- React/JSX auto-escapes by default — but `dangerouslySetInnerHTML` bypasses this

### 4. Insecure Design
- Validate business logic (e.g., user can't approve their own request)
- Rate limit sensitive operations
- Implement proper error handling that doesn't leak information

### 5. Security Misconfiguration
- Remove default credentials
- Disable directory listing
- Set proper security headers
- Keep dependencies updated
- Don't expose debug info in production

### 6. Vulnerable Components
- Check `npm audit` regularly
- Don't use deprecated packages
- Pin dependency versions
- Review changelogs before major updates

### 7. Authentication Failures
- Implement account lockout after failed attempts
- Use secure session management
- Invalidate sessions on logout
- Don't expose whether username or password was wrong

### 8. Data Integrity Failures
- Validate data on both client and server
- Use checksums for file integrity
- Verify external data sources

### 9. Logging & Monitoring Failures
- Log authentication events (success and failure)
- Log authorization failures
- Don't log sensitive data (passwords, tokens, PII)
- Monitor for unusual patterns

### 10. Server-Side Request Forgery (SSRF)
- Validate and whitelist URLs before making server-side requests
- Don't allow user input to control fetch destinations
- Block requests to internal networks (127.0.0.1, 10.x.x.x, etc.)

## Input Validation Rules

```
NEVER TRUST:
├── URL parameters
├── Query strings
├── Request body
├── HTTP headers
├── File uploads
├── Cookies
└── Any data from the client
```

### Validation Steps
1. Check type (string, number, boolean)
2. Check length/range
3. Check format (regex for email, phone, etc.)
4. Sanitize HTML entities
5. Reject unexpected fields
6. Validate file types and sizes for uploads

## File Upload Security
- Validate file type by checking magic bytes, not just extension
- Set maximum file size limits
- Store uploads outside the web root
- Generate random filenames — never use user-provided names
- Scan for malware if possible
- Use CDN (like Cloudinary) for file storage — don't store on the web server

## Secrets Management
- All secrets in `.env` files (never hardcoded)
- `.env` in `.gitignore`
- Different secrets for dev/staging/production
- Rotate secrets regularly
- Use platform-specific secret management (Vercel env vars, etc.)

## CORS Configuration
- Whitelist specific origins — never use `*` in production
- Only allow necessary HTTP methods
- Set `credentials: true` only when needed
- Include proper preflight handling

## Session/Token Security
- Use httpOnly cookies for session tokens
- Set secure flag in production
- Set SameSite attribute
- Implement token expiration
- Implement token refresh mechanism
- Invalidate tokens on logout

## Security Review Checklist

Before any PR touching auth, input, or security-adjacent code:

- [ ] All user input validated server-side
- [ ] Authentication required on protected routes
- [ ] Authorization checks for resource access
- [ ] No secrets in code or logs
- [ ] Dependencies checked for vulnerabilities
- [ ] Error messages don't leak internal details
- [ ] File uploads validated (type, size, name)
- [ ] CORS properly configured
- [ ] Security headers set (CSP, X-Frame-Options, etc.)
- [ ] Rate limiting on sensitive endpoints
