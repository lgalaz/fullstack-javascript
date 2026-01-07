# Caching and Queues

## Introduction

Caching improves performance by avoiding repeated work. Queues decouple work from request/response paths, improving reliability and throughput.

## Example: Simple In-Memory TTL Cache

This cache stores values with an expiration timestamp. It is per-process and will reset on restart, which is why production apps often use Redis instead.

```javascript
// cache.js
class Cache {
  constructor() {
    this.store = new Map();
  }

  set(key, value, ttlMs) {
    const expiresAt = Date.now() + ttlMs;
    this.store.set(key, { value, expiresAt });
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }
}

const cache = new Cache();
cache.set('user:1', { id: 1, name: 'Ada' }, 5000);
console.log(cache.get('user:1'));
```

## Example: In-Process Queue

This queue runs tasks sequentially so you can control concurrency and avoid overloading downstream systems.

```javascript
// queue.js
class Queue {
  constructor() {
    this.items = [];
    this.running = false;
    this.idleResolvers = [];
  }

  push(task) {
    this.items.push(task);
    if (!this.running) this.run();
  }

  onIdle() {
    if (!this.running && this.items.length === 0) {
      return Promise.resolve();
    }
    return new Promise(resolve => this.idleResolvers.push(resolve));
  }

  async run() {
    this.running = true;
    while (this.items.length > 0) {
      const task = this.items.shift();
      await task();
    }
    this.running = false;
    this.idleResolvers.splice(0).forEach(resolve => resolve());
  }
}

const queue = new Queue();
queue.push(async () => {
  console.log('task 1');
});
queue.push(async () => {
  console.log('task 2');
});

queue.onIdle().then(() => {
  console.log('queue drained');
});
```

## Practical Guidance

- Use external caches for shared state across processes (Redis is an in-memory data store with persistence options and rich data types like lists/sets; Memcached is a simple, fast key/value cache without persistence). Common uses: Redis for sessions, rate limiting, and distributed locks; Memcached for read-heavy data like rendered pages or query results.
- Use a durable queue for critical workloads (RabbitMQ is a traditional message broker with routing and acknowledgments; SQS is a fully managed queue from AWS; Kafka is a distributed log optimized for high throughput and replay). Common uses: RabbitMQ for task queues and workflows, SQS for background jobs in AWS apps, Kafka for event streaming and analytics pipelines.
- Implement retries with backoff and dead-letter handling (backoff reduces load spikes when downstream services are failing; dead-letter queues capture poison messages so they do not block the main queue).
