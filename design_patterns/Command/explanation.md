# Command

## Overview

Encapsulates a request as an object, allowing parameterization and queuing.

## When to use

- You need undo/redo or transactional operations.
- Requests should be queued, logged, or retried.
- You want to decouple invoker from receiver.

## Trade-offs

- Many small command classes can add overhead.
- Can be heavy for simple actions.
- Requires careful management of command state.
