# Event Sourcing

## Overview

Persists state as a sequence of events instead of storing only current state.

## When to use

- You need full audit history and replayability.
- Business changes should be traceable over time.
- You want to build projections for different read models.

## Trade-offs

- Event versioning and schema evolution complexity.
- Rehydration can be costly without snapshots.
- Harder to reason about current state without tooling.
