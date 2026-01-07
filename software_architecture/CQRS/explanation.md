# CQRS (Command Query Responsibility Segregation)

## Introduction

CQRS separates reads (queries) from writes (commands). This allows different models for reading and writing data, which can improve performance and scalability.

## What It Is

- Commands change state; queries read state.
- The read model can be denormalized for fast queries (data is duplicated or pre-joined into query-friendly shapes to avoid expensive joins).
- The write model enforces business invariants (hard business rules that must always hold, like “an order total cannot be negative” or “a payment cannot exceed the balance”).

## When It Is the Best Solution

- Systems with very different read vs. write patterns (e.g., many reads but few writes, or reads need different shapes than writes).
- Complex domains where writes need strict validation (multi-step business rules, approvals, or invariants that must never be violated).
- High-scale systems where read performance is critical (read models can be optimized independently without slowing writes; teams often use separate read replicas, distinct connection pools, and stricter write permissions).

## Misuse and When It Is Overkill

- Overkill for simple CRUD apps.
- Misuse when it splits data without clear ownership.
- Can increase complexity and data synchronization work.

## Operational Patterns

- Use read replicas for queries and a primary for writes.
- Configure separate connection pools (larger read pools, smaller write pools).
- Apply stricter permissions on write paths and broader access on read paths.
- Cache read models aggressively since they are optimized for queries.

## Example (Separate Read/Write Paths)

`commandBus` represents the write side (commands that change state), while `queryBus` represents the read side (queries that return data without changing state).

```javascript
// command: create order
commandBus.handle('CreateOrder', { userId, items });

// query: list orders
queryBus.handle('GetOrdersForUser', { userId });
```
