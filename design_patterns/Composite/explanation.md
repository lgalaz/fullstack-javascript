# Composite

## Overview

Composes objects into tree structures to represent part-whole hierarchies.

## When to use

- You want to treat individual objects and groups uniformly.
- You need tree-like structures (for example, UI components or file systems).
- Operations should apply recursively.

## Trade-offs

- Can make it harder to enforce constraints on leaves vs composites.
- Debugging recursive operations can be complex.
- May hide performance costs of deep trees.
