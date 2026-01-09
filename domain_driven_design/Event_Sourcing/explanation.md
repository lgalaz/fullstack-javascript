# Event Sourcing

## Introduction

Event sourcing stores state changes as a sequence of domain events rather than as a single current state. The current state is derived by replaying events.

## DDD Relationship

Event sourcing is not required for DDD, but it fits well when auditability and temporal queries are important.

## Practical Guidance

- Use when you need full history or strong audit trails.
- Be mindful of operational complexity and migration strategy.
