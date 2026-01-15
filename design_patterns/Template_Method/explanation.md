# Template Method

## Overview

Defines the skeleton of an algorithm while letting subclasses override steps.

## When to use

- Overall algorithm is fixed but steps vary.
- You want to enforce invariants while allowing customization.
- You want to avoid duplicated algorithm structure.

## Trade-offs

- Inheritance makes change harder than composition.
- Subclasses can break assumptions if not careful.
- Overuse leads to rigid hierarchies.
