# Flyweight

## Overview

Shares common state to support large numbers of fine-grained objects efficiently.

## When to use

- You have many similar objects and memory is a concern.
- Intrinsic state can be shared across instances.
- You can externalize variable state to callers.

## Trade-offs

- Introduces shared state complexity.
- Externalizing state adds call-site burden.
- Thread safety can be harder to reason about.
