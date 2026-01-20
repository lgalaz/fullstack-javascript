# Aggregates

## Introduction

Aggregates are clusters of entities and value objects with a clear consistency boundary. One entity is the aggregate root, and all changes go through it.
You choose the aggregate root based on the consistency boundary and invariants you need to protect.

Common signals:

The entity that enforces invariants for the group (business rules that must always hold).
The only entry point for changes; other entities are modified through it.
The one referenced from outside the aggregate; internals are not.
The one that owns the lifecycle (creation/deletion) of the others.

Note: A consistency boundary is inside a bounded context: it’s the transactional/invariant boundary of a single aggregate

## Example

An `Order` aggregate may include `OrderItem` entities, but changes to items must go through `Order` to keep invariants.

## Practical Guidance

- Keep aggregates small to reduce transaction contention.
- Enforce invariants inside the aggregate root.
