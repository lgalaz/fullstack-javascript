# Type Compatibility and Structural Typing - Comprehensive Study Guide

## Introduction

TypeScript uses structural typing: types are compatible based on their shape, not their name.

## Example

```typescript
interface Point { x: number; y: number }

type Coord = { x: number; y: number };

const p: Point = { x: 1, y: 2 };
const c: Coord = p; // OK: same shape
```

This is why TypeScript is called structurally typed: names do not matter, shapes do.

## Excess Property Checks

```typescript
function draw(p: Point) {}

draw({ x: 1, y: 2, z: 3 }); // Error: extra prop
```

Use a variable to bypass excess checks:

```typescript
const temp = { x: 1, y: 2, z: 3 };
draw(temp); // OK
```

Excess property checks only apply to object literals, not variables.

## Interview Questions and Answers

### 1. What is structural typing?

Compatibility based on property shape rather than explicit declarations.

### 2. What are excess property checks?

Additional checks on object literals to prevent typos and unused fields.
