# Strategy

## Overview

Defines a family of algorithms and makes them interchangeable at runtime.

## When to use

- You need multiple ways to perform a task.
- Algorithms should vary without changing clients.
- You want to swap behavior based on configuration.

## Trade-offs

- More types and wiring.
- Clients must choose or be configured with a strategy.
- Can lead to over-abstracted designs.
