# Visitor

## Overview

Separates algorithms from object structures by moving operations into visitor objects.

## When to use

- You need many unrelated operations over a stable object structure.
- You want to add operations without changing element classes.
- Double-dispatch is useful for type-specific behavior.

## Trade-offs

- Adding new element types is expensive.
- Visitor interfaces can grow quickly.
- Less intuitive for many developers.
