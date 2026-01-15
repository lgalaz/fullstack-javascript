# CQRS

## Overview

Separates read models from write models to optimize each independently.

## When to use

- Read and write workloads have different performance needs.
- You want to scale reads without affecting writes.
- Complex domain writes should stay in a rich model.

## Trade-offs

- Eventual consistency between models.
- Operational complexity with multiple stores.
- More code and infrastructure to maintain.
