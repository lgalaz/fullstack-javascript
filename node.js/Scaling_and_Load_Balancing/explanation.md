# Scaling and Load Balancing

## What matters

- Node scales best with stateless services and externalized state.
- `stateless services`: any instance can handle any request because correctness does not depend on per-process memory.
- `externalized state`: shared state such as sessions, cache, queues, and persistent data lives outside the Node process in systems like Redis, databases, or object storage.
- This makes load balancing, restarts, autoscaling, and deployments much simpler because requests are not tied to one specific instance.

## Interview points

- Keep instances replaceable; store sessions and shared state outside the process.
- Avoid sticky sessions unless there is a hard requirement. A sticky session means the load balancer keeps sending the same client to the same backend instance, usually because session state lives only in that instance's memory.
- Horizontal scaling is often simpler than trying to make one process do everything. Add more service instances for throughput; use Worker Threads only when one process has CPU-heavy work that should not block the main thread.

## Senior notes

- Per-instance caches are optional optimizations, not correctness dependencies.

```js
const productCache = new Map();

async function getProduct(id) {
  if (productCache.has(id)) {
    return productCache.get(id);
  }

  const product = await db.products.findById(id);
  productCache.set(id, product);
  return product;
}
```

- Here the database is still the source of truth. If the cache is empty, stale, or lost on restart, the request can still succeed by reading from the database.
- Health checks and autoscaling only work well when the service is stateless and shutdown is clean.
