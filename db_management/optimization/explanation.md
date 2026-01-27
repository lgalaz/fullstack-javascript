# Database Optimization

## Core Principles

- Optimize for the dominant query paths, not theoretical edge cases.
- Measure first: use query logs, slow query logs, and `EXPLAIN`.
  - Logs usually need to be enabled. MySQL example:

```sql
-- Enable slow query log (session/global)
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 0.5;
SET GLOBAL log_queries_not_using_indexes = 'ON';

-- Optional: enable general query log (very verbose; avoid in production)
SET GLOBAL general_log = 'ON';
```
- Prefer simple, correct schema and queries over clever tricks.
- Indexes speed reads but add write cost and storage overhead.

## Schema and Indexing

- Use appropriate types (e.g., `INT` vs `BIGINT`, `VARCHAR` length) to reduce row size and cache pressure.
- Always index foreign keys and columns used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY`.
- Composite indexes should match query patterns (leftmost prefix rule).
Most relational indexes are B‑trees (or similar) ordered by the index columns in sequence. That means the index is only efficiently usable for queries that start with the leftmost columns. So you get efficient lookups for (a) or (a,b) when the index is (a,b,c), but not for (b) alone.
- Avoid indexing low‑cardinality columns unless combined with others. 
Low‑cardinality means a column has few distinct values relative to the number of rows.
- Use unique indexes to enforce invariants and speed lookups.

## Query Design

- Select only needed columns (avoid `SELECT *`).
- Avoid N+1 queries; batch or join when appropriate.
- Prefer pagination over loading large result sets.
- Use `LIMIT` with stable ordering (e.g., by indexed columns).
- Move expensive computations out of hot queries (precompute or cache).

## Transactions and Locking

- Keep transactions short to reduce lock contention.
- Lock only what you need (row‑level > table‑level when possible).
- Avoid long‑running transactions in user requests.
- Use idempotency for retry‑safe writes.

## Caching and Denormalization

- Cache hot reads at the application or CDN layer.
- Denormalize carefully when read performance dominates and write complexity is acceptable.
- Use materialized views or rollup tables for heavy aggregates.
Materialized view: a stored, precomputed result of a query (like a cached table). It’s refreshed on a schedule or on demand.
Rollup table: a table that stores aggregated data (e.g., daily sales totals) instead of raw rows, to make heavy aggregate queries fast.

## Concurrency and Scalability

- Understand isolation levels (e.g., READ COMMITTED vs REPEATABLE READ).
- Use optimistic concurrency (version columns) when conflicts are rare.
- Use queueing or background jobs for heavy writes.
- Scale reads with replicas; avoid stale reads for critical paths.

Laravel example (optimistic concurrency with a version column):

```php
use Illuminate\Support\Facades\DB;

// Table has: id, balance, version
$updated = DB::table('accounts')
    ->where('id', $id)
    ->where('version', $currentVersion)
    ->update([
        'balance' => $newBalance,
        'version' => $currentVersion + 1,
    ]);

if ($updated === 0) {
    throw new RuntimeException('Conflict: record was updated by another request.');
}
```

## Monitoring and Tooling

- Use `EXPLAIN` to verify index usage and row estimates.
- Track slow queries and regression after deployments.
- Monitor connection pool saturation, lock waits, and replication lag.
  - A pool/metrics monitor is clearer than raw status values (shows in-use vs idle vs waiting).

## Common Red Flags

- Queries scanning large tables without indexes.
- Unbounded queries in web requests (no `LIMIT`/pagination), which can load huge result sets and spike latency/memory.
- Long transactions with user interactions.
- High cache miss rates on hot endpoints.
- Repeated queries with only parameter changes (N+1).

## Quick Checklist

- Are hot queries indexed and explain‑verified?
- Are large tables paginated and ordered by indexed columns?
- Are transactions short and minimal?
- Are slow queries logged and reviewed regularly?
- Are caches and background jobs used appropriately?
