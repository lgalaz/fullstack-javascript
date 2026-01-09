# Domain, Application, and Infrastructure Services

## Introduction

Services organize logic that doesn't belong to a single entity or value object. DDD distinguishes domain services (pure domain logic) from application services (use-case orchestration) and infrastructure services (technical concerns).

## Examples

- Domain service: pricing rules applied across multiple aggregates.
- Application service: `PlaceOrder` orchestrating validation, persistence, events.
- Infrastructure service: email delivery, database adapters, external APIs.

## Practical Guidance

- Keep domain services free of persistence and IO.
- Application services coordinate work and manage transactions.
