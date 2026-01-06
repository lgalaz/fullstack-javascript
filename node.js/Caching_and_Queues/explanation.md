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
  }

  push(task) {
    this.items.push(task);
    if (!this.running) this.run();
  }

  async run() {
    this.running = true;
    while (this.items.length > 0) {
      const task = this.items.shift();
      await task();
    }
    this.running = false;
  }
}

const queue = new Queue();
queue.push(async () => {
  console.log('task 1');
});
queue.push(async () => {
  console.log('task 2');
});
```

## Practical Guidance

- Use external caches (Redis, Memcached) for shared state across processes.
- Use a durable queue (RabbitMQ, SQS, Kafka) for critical workloads.
- Implement retries with backoff and dead-letter handling.
