# Aggregates

## Introduction

Aggregates are clusters of entities and value objects with a clear consistency boundary. One entity is the aggregate root, and all changes go through it.

## Example

An `Order` aggregate may include `OrderItem` entities, but changes to items must go through `Order` to keep invariants.

## Practical Guidance

- Keep aggregates small to reduce transaction contention.
- Enforce invariants inside the aggregate root.
