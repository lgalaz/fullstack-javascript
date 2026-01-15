# Repository

## Overview

Mediates between the domain and data mapping layers using a collection-like interface.

## When to use

- You want to decouple domain logic from persistence details.
- You need testable data access behind interfaces.
- Aggregates should be retrieved and saved consistently.

## Trade-offs

- Can hide performance characteristics of queries.
- Complex queries may not fit a repository abstraction.
- Requires careful boundary between domain and persistence.
