# Unit of Work

## Overview

Tracks changes and coordinates writing them as a single transaction.

## When to use

- You need atomic persistence across multiple aggregates.
- You want to batch writes for efficiency.
- Consistency should be enforced at commit time.

## Trade-offs

- Complex lifecycle management of tracked objects.
- Harder to reason about when changes are flushed.
- Requires transaction-aware infrastructure.
