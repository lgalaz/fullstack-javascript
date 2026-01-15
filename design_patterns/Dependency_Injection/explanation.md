# Dependency Injection

## Overview

Supplies an object with its dependencies rather than having it create them.

## When to use

- You want testable code with replaceable collaborators.
- Construction logic should live outside business logic.
- You need runtime configuration of implementations.

## Trade-offs

- Requires a wiring strategy or container.
- Can make flow harder to trace.
- Misuse can lead to service locator anti-patterns.
