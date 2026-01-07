# Event Sourcing

## Introduction

Event sourcing stores state as a sequence of events rather than the latest snapshot. The current state is rebuilt by replaying events.

## What It Is

- The source of truth is an append-only event log.
- State is derived by replaying events in order.
- Provides an audit trail of changes.

## When It Is the Best Solution

- You need a complete history of changes.
- Auditing and traceability are critical (finance, compliance).
- Complex workflows where state transitions matter.

## Misuse and When It Is Overkill

- Overkill for simple CRUD data.
- Misuse when event schemas are unstable or poorly versioned.
- Requires careful migration and replay handling.

## Common Use Cases and Tech

- Audit trails and compliance (finance, healthcare) where every change must be traceable.
- Systems with complex workflows where replaying history is valuable.
- Debugging and “time travel” analysis for how state evolved.

Common providers/tools:
- EventStoreDB: database built for event sourcing and streams.
- Kafka: durable event log used as an append-only source of truth.
- PostgreSQL: append-only event tables with custom replay logic for smaller systems.

Note: EventStoreDB is purpose-built for append-only writes, ordered streams, and fast replay. NoSQL (like Kafka or DynamoDB with streams) is not automatically better; it can work, but you still need ordering, idempotency, and replay semantics.

## Example (Event Log)

```text
UserRegistered { id: 1 }
UserEmailUpdated { id: 1, email: "a@b.com" }
UserDeactivated { id: 1 }
```

```javascript
// pseudo: rebuild state
state = replay(events);
```
