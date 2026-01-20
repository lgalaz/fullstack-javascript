# Memoization

## Introduction

Memoization is a performance technique where you cache the results of a function call and return the cached value when the same inputs occur again. It is most effective for pure, deterministic functions that are called repeatedly with the same arguments.

## How It Works

1. Compute the result for a given input.
2. Store that result in a cache keyed by the input.
3. On the next call with the same input, return the cached value instead of recomputing.

## Basic Implementation

```javascript
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const slowSquare = (n) => {
  for (let i = 0; i < 1e7; i++) {}
  return n * n;
};

const fastSquare = memoize(slowSquare);
console.log(fastSquare(5)); // slow
console.log(fastSquare(5)); // fast (cached)
```

## Cache Keying Strategies

The cache key is critical:

- For primitives, JSON stringification can be fine.
- For objects, JSON stringification can be unstable or expensive; prefer stable keys or a custom serializer.
- For reference identity, use a `Map` of arguments or nested `Map` structures.

## Memoization with Multiple Arguments (Stable Keys)

```javascript
function memoizeByArgs(fn) {
  const cache = new Map();
  return function(...args) {
    let node = cache;
    for (const arg of args) {
      if (!node.has(arg)) node.set(arg, new Map());
      node = node.get(arg);
    }
    if (node.has('value')) return node.get('value');
    const result = fn.apply(this, args);
    node.set('value', result);
    return result;
  };
}
```

## Memoizing Async Functions

Memoizing async work is usually done by caching the Promise so concurrent calls share a single in-flight request.

```javascript
function memoizeAsync(fn) {
  const cache = new Map();
  return async function(...args) {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, fn.apply(this, args));
    }
    return cache.get(key);
  };
}
```

Be careful to decide whether failures should be cached or evicted.

## Cache Invalidation and Size Limits

Memoization is only safe when inputs fully determine outputs. If the output depends on time, randomness, or external state, you need invalidation.

Common strategies:

- Time-based expiry (TTL)
- Manual invalidation when data changes
- Size limits (LRU) to avoid unbounded memory growth

## When to Use Memoization

- Expensive pure computations
- Derived data (formatting, transforms) used in many places
- Hot paths discovered by profiling

## When Not to Use It

- Functions with side effects (I/O, logging, mutations)
- Inputs that rarely repeat
- Cases where caching risks stale data or excess memory use
