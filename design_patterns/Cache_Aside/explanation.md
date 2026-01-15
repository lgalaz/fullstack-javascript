# Cache Aside

## Overview

Loads data into cache on demand and updates cache after writes.

## When to use

- Read-heavy workloads benefit from caching.
- You can tolerate eventual cache consistency.
- You want to keep cache logic in application code.

## Trade-offs

- Cache invalidation is still hard.
- Cold cache misses can be expensive.
- Stale data risk without proper expiration.
