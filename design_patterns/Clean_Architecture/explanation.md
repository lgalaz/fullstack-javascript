# Clean Architecture

## Overview

Structures code in concentric layers with dependencies pointing inward.

## When to use

- You want a stable domain model insulated from frameworks.
- Testability and long-term maintainability are priorities.
- You need clear separation of use cases and interfaces.

## Trade-offs

- Adds boilerplate and indirection.
- More files and layers to navigate.
- Can slow early development if over-applied.
