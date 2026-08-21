---
name: backend
description: "Backend architecture, REST/API design, authentication, authorization, input validation, error handling, service/repository patterns, and integration testing. Use when building or modifying API routes, middleware, or server-side logic."
---

# Backend Engineering

## When to Load
- Building or modifying API routes
- Implementing authentication or authorization
- Designing service/repository architecture
- Adding input validation or error handling
- API versioning or rate limiting

## API Design Principles

### RESTful Conventions
- Use nouns for resources, verbs for actions
- Consistent URL patterns: `/api/<resource>` (collection), `/api/<resource>/[id]` (item)
- Use appropriate HTTP methods: GET (read), POST (create), PUT/PATCH (update), DELETE (remove)
- Return appropriate status codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Internal Server Error)

### Request/Response Patterns
- Always validate request body before processing
- Return consistent response shapes: `{ success: boolean, data?: any, error?: string }`
- Include pagination for list endpoints: `{ data: [], total: number, page: number, limit: number }`
- Use proper Content-Type headers

### Error Handling
- Never expose internal errors to clients
- Log full error details server-side
- Return user-friendly error messages
- Use error boundaries/middleware for consistent handling
- Always catch async errors (try/catch or .catch())

## Authentication & Authorization

### Authentication
- Hash passwords with bcrypt (cost factor ≥ 10)
- Use JWT or session cookies for stateless auth
- Never store plaintext passwords
- Implement rate limiting on login endpoints
- Use HTTPS in production

### Authorization
- Check permissions at the route level
- Implement role-based access control (RBAC) when needed
- Verify resource ownership before mutations
- Admin routes must verify admin status

## Input Validation

### Required Checks
1. Type validation (string, number, boolean, array, object)
2. Length/range validation
3. Format validation (email, phone, URL)
4. Sanitize HTML/script injection
5. Validate file upload types and sizes
6. Reject unexpected fields

### Validation Pattern
```
1. Parse request body
2. Validate required fields exist
3. Validate field types and formats
4. Sanitize input
5. Proceed with business logic
```

## Service Architecture

### Layer Separation
```
Route Handler → Service Layer → Data Access Layer → Database
```

- **Route Handlers**: Parse request, call service, format response
- **Service Layer**: Business logic, validation, orchestration
- **Data Access Layer**: Database queries, model operations

### Error Propagation
- Throw typed errors from service layer
- Catch and transform in route handlers
- Never let database errors reach the client

## Integration Testing

### What to Test
1. Successful operations (happy path)
2. Validation failures (bad input)
3. Authentication failures (missing/invalid credentials)
4. Authorization failures (insufficient permissions)
5. Not found cases (invalid IDs)
6. Edge cases (empty arrays, null values, concurrent requests)

### Testing Approach
```
1. Set up test database/mock
2. Seed required data
3. Make HTTP request
4. Assert response status code
5. Assert response body shape and content
6. Verify side effects (database state, emails sent, etc.)
7. Clean up test data
```

## Framework-Specific: Next.js App Router

### Route Handlers
- Export named functions: `GET`, `POST`, `PUT`, `DELETE`
- Use `NextRequest` and `NextResponse`
- Access params via the second argument
- Always return a `NextResponse`

### Middleware
- Use `middleware.ts` at project root for cross-cutting concerns
- Match routes with `config.matcher`
- Use for auth checks, redirects, headers

## Checklist Before Shipping

- [ ] All endpoints return consistent response shapes
- [ ] Input validation on all write endpoints
- [ ] Authentication required on protected routes
- [ ] Authorization checks for resource access
- [ ] Error handling catches all async operations
- [ ] No sensitive data in error responses
- [ ] Rate limiting on auth endpoints
- [ ] Proper HTTP status codes
- [ ] API documented (at minimum in code comments)
