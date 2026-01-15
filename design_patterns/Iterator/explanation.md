# Iterator

## Overview

Provides sequential access to elements without exposing the underlying structure.

## When to use

- Collections should expose traversal without leaking representation.
- You need multiple traversal strategies.
- Callers should not manage indexing or state.

## Trade-offs

- Additional objects for iteration state.
- Concurrent modification rules can be tricky.
- May hide performance characteristics.
