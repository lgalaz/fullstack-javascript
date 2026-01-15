# Bridge

## Overview

Decouples an abstraction from its implementation so both can vary independently.

## When to use

- You need to combine multiple abstractions with multiple implementations.
- You want to avoid class explosion from inheritance.
- You anticipate independent evolution of API and implementation.

## Trade-offs

- More indirection to understand.
- Extra abstraction can be unnecessary for small systems.
- Requires careful design of the bridge interface.
