# Saga

## Overview

Manages distributed transactions using a series of local steps with compensations.

## When to use

- You need multi-service workflows without two-phase commit.
- Failure handling requires explicit compensation.
- Long-running processes should be resilient.

## Trade-offs

- Complexity in coordination and error handling.
- Compensating actions are not always perfect rollbacks.
- Observability is required to debug flows.
