# Event Sourcing

## Introduction

Event sourcing stores state changes as a sequence of domain events rather than as a single current state. The current state is derived by replaying events.

## DDD Relationship

Event sourcing is not required for DDD, but it fits well when auditability and temporal queries are important.

## Practical Guidance

- Use when you need full history or strong audit trails.
- Be mindful of operational complexity and migration strategy.

## Symfony Tooling and How It Works

- EventSauce: provides event-sourced aggregates, message repositories, and upcasters; you plug in a storage backend and build projections.
- Symfony Messenger + Doctrine: build your own event store table (append-only), dispatch events via Messenger, and project into read models.
- EventStoreDB (external service) + client library: dedicated event store with streams, subscriptions, and projections; your app appends events and rebuilds state.
- Legacy options like Broadway or Prooph exist but are largely unmaintained; use with caution.

## Migration Strategy and Operational Complexity

Operational complexity includes replaying events, managing projections, handling large streams, and ensuring idempotent handlers. A migration strategy typically means:

- Prefer new event versions over mutating old events; treat old events as immutable facts.
- Use upcasters to transform older event payloads on read.
- Add new events to model new behavior instead of changing past ones.
- Rebuild projections when schemas change; snapshots can reduce replay cost.

You usually do not add fields retroactively to old events. Instead, version events and translate old versions forward when loading or replaying.
