# Migrations and Schema Design

## Migrations

Migrations track schema changes in code so environments stay consistent.
Apply migrations in order and make them idempotent where possible.
If needed, use a migration for required baseline data; use seeders for non‑essential or environment‑specific data. If you need idempotency, use upserts or “insert if not exists”.

## Constraints First

Use database constraints to enforce rules, not just application logic:

- `NOT NULL` and default values (+ Default to ensure required value)
- `UNIQUE` constraints for idempotency keys
- Foreign keys for referential integrity
- `CHECK` constraints for valid ranges

## Zero-Downtime Patterns

For production safety:

- Add new columns as nullable, backfill data, then make them required so old code keeps working during rollout.
Performance/locking is a big reason too. Adding a NOT NULL column with a default can rewrite or lock large tables, causing congestion. The safer flow (add nullable → backfill in batches → add NOT NULL) avoids long‑running locks, keeps reads/writes flowing, and spreads the write load so the DB stays responsive during rollout.
- Avoid destructive changes in a single step to prevent long locks and hard-to-recover failures (for example, dropping a column or rewriting a large table can lock writes and make rollback painful).
Example: renaming a column safely across deploys.
Step 1: add the new column and dual-write it in code.
Step 2: backfill existing rows in batches.
Step 3: switch reads to the new column.
Step 4: drop the old column in a later migration.
- Prefer expand/contract migrations for large tables to ship changes in two compatible phases.
Expand phase: add new schema elements in a backward‑compatible way (new columns/tables, nullable fields, dual‑writes), so old and new code both work.
Contract phase: once all code uses the new schema, remove the old columns/indexes/paths.
