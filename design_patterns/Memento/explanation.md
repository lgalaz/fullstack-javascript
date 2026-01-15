# Memento

## Overview

Captures and externalizes an object state so it can be restored later.

## When to use

- You need undo/rollback support.
- State snapshots must not violate encapsulation.
- You want to checkpoint before risky operations.

## Trade-offs

- Snapshot storage can be expensive.
- Serialization can be complex for large object graphs.
- Requires careful lifecycle management of mementos.
