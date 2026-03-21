# Caching and Queues

## What matters

- Caches reduce repeated work.
- Queues move slow or retryable work out of the request path.

## Interview points

- In-memory cache is process-local; Redis or similar is needed for shared state. A queue is a system that stores work so it can be processed later or by another worker.
- Cache invalidation, TTL choice, and stale data tradeoffs matter more than the basic `Map` implementation.
- Queues need retries, backoff, idempotency, and dead-letter handling.

## Senior notes

- Use caches to speed up correct systems, not to mask stale data, race conditions, or broken business logic.
- For critical jobs, reliable persistence and safe replay after failures matter more than maximum messages-per-second throughput.

## Example

```javascript
const cache = new Map();

function getUser(id) {
  if (cache.has(id)) return cache.get(id);
  const user = { id, name: 'Ada' };
  cache.set(id, user);
  return user;
}
```
