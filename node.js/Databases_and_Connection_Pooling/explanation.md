# Databases and Connection Pooling

## What matters

- Database connections are expensive; use a shared pool.
- Pooling controls concurrency and prevents opening a new connection per query. A pool is a reusable set of open connections managed by the driver.

## Interview points

- Always release borrowed clients.
- Size pools relative to database limits and total service replicas.
- Use parameterized queries to prevent SQL injection.
- Slow queries, lock contention, and pool exhaustion often look like “Node is slow” even when the bottleneck is the database.

## Senior notes

- Pool tuning is a system-level decision, not a local code decision.
- In serverless or highly bursty environments, connection management is a major design concern.

## Example

```javascript
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function getUsers() {
  const result = await pool.query('SELECT id, name FROM users');
  return result.rows;
}
```
