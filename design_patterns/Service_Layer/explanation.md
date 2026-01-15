# Service Layer

## Overview

Defines an application-level API that orchestrates use cases and transactions.

## When to use

- You want a clear boundary between UI and domain logic.
- Use cases must coordinate multiple domain objects.
- You need a single place for application policies.

## Trade-offs

- Can become a thin pass-through if not designed well.
- Too much logic here leads to an anemic domain.
- Requires discipline to keep responsibilities clear.
