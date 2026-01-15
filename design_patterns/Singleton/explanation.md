# Singleton

## Overview

Ensures a class has only one instance and provides a global access point.

## When to use

- There should be exactly one shared instance (for example, configuration).
- You want lazy initialization and central access.
- Shared state must be controlled and synchronized.

## Trade-offs

- Global state can hurt testability and coupling.
- Hidden dependencies complicate reasoning.
- Can become a concurrency bottleneck.
