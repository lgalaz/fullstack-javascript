# State

## Overview

Allows an object to change its behavior when its internal state changes.

## When to use

- Behavior depends on an internal state machine.
- You want to avoid large conditional blocks.
- State transitions should be explicit and encapsulated.

## Trade-offs

- More classes and indirection.
- State explosion for complex machines.
- Harder to track transitions without tooling.
