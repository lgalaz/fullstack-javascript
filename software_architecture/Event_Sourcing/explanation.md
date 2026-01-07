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
