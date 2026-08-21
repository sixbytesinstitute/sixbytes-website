---
name: database
description: "Schema design, relationships, normalization, indexing, transactions, migrations, query optimization, connection pooling, data integrity, and database security. Use when designing schemas, writing queries, or optimizing database performance."
---

# Database Engineering

## When to Load
- Designing or modifying database schemas
- Writing complex queries
- Optimizing query performance
- Adding indexes
- Managing migrations
- Fixing data integrity issues

## Schema Design

### Principles
1. **Normalize first, denormalize for performance** — Start with 3NF, denormalize only when measured performance requires it
2. **Use appropriate data types** — Don't store numbers as strings, use Date for timestamps
3. **Name consistently** — camelCase for MongoDB fields, snake_case for PostgreSQL columns
4. **Document relationships** — Comment on why references exist
5. **Add timestamps** — `createdAt` and `updatedAt` on every collection/table

### MongoDB-Specific (This Project)
- Use Mongoose schemas with explicit types
- Define required fields explicitly
- Add validation at schema level where possible
- Use `mongoose.models.X || mongoose.model('X', schema)` pattern to prevent model recompilation
- Use refs for relationships: `{ type: mongoose.Schema.Types.ObjectId, ref: 'Model' }`

### Relationship Patterns
| Pattern | When |
|---------|------|
| Embedding | Data always accessed together, rarely updated independently |
| Referencing | Data accessed independently, many-to-many, large subdocuments |
| Hybrid | Embed summary, reference full document |

## Indexing

### When to Add Indexes
- Fields used in queries (find, sort, filter)
- Fields used in unique constraints
- Fields used in joins/lookups
- Do NOT index fields that are rarely queried

### Index Types (MongoDB)
- **Single field**: `{ field: 1 }`
- **Compound**: `{ field1: 1, field2: -1 }` — order matters
- **Unique**: `{ field: 1 }, { unique: true }`
- **Text**: For full-text search
- **TTL**: For auto-expiring documents

## Query Optimization

### Process
```
1. Identify slow query (measure response time)
2. Explain the query (MongoDB: .explain('executionStats'))
3. Check if appropriate index exists
4. Add index or restructure query
5. Measure again
6. Document the optimization
```

### Anti-Patterns
- Avoid `$where` — it scans every document
- Avoid unbounded queries — always use `.limit()`
- Avoid fetching fields you don't need — use `.select()` or projection
- Avoid N+1 queries — use `.populate()` or aggregation pipeline

## Connection Pooling

### MongoDB Connection Pattern (This Project)
```javascript
// Singleton pattern — cache connection across hot reloads
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

- Always call `connectDB()` at the start of API routes
- Never create new connections per request
- Set connection pool size via `mongoose.connect(uri, { maxPoolSize: 10 })`

## Data Integrity

### Validation Layers
1. **Application-level** — Validate before writing to DB
2. **Schema-level** — Mongoose validators, required fields
3. **Database-level** — Unique indexes, TTL indexes

### Transactions
- Use transactions for multi-document operations that must be atomic
- MongoDB transactions require replica sets
- Always handle transaction errors and rollback

## Security

- Never expose database connection strings
- Use parameterized queries (Mongoose does this by default)
- Validate and sanitize user input before queries
- Don't allow user input in `$where` or `$expr` clauses
- Use read-only users for read-only operations where possible
- Rotate credentials regularly

## Checklist

- [ ] Schema matches business requirements
- [ ] Required fields marked as required
- [ ] Indexes added for query patterns
- [ ] Connection pooling configured
- [ ] Input validated before database operations
- [ ] No sensitive data logged
- [ ] Migrations documented (if applicable)
