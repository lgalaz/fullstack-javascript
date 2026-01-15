# Specification

## Overview

Encapsulates business rules in reusable, composable specifications.

## When to use

- You need to combine rules with AND/OR/NOT logic.
- Validation rules should be reusable across the domain.
- Criteria should be expressed and tested independently.

## Trade-offs

- Extra abstraction for simple rules.
- Can be hard to map to efficient queries.
- Overuse can obscure straightforward logic.
