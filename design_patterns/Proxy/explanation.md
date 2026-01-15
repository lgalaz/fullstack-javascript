# Proxy

## Overview

Provides a placeholder that controls access to another object.

## When to use

- You need lazy loading or access control.
- You want to add caching, logging, or remote access.
- You want to intercept calls without changing the target.

## Trade-offs

- Extra indirection can complicate debugging.
- Proxy behavior can diverge from the real object.
- Performance overhead for trivial operations.
