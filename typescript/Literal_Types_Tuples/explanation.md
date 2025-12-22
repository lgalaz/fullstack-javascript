# Literal Types and Tuples - Comprehensive Study Guide

## Introduction

Literal types restrict values to exact strings or numbers. Tuples represent fixed-length arrays with specific types.

## Literal Types

```typescript
type Direction = 'up' | 'down' | 'left' | 'right';

function move(dir: Direction) {
  return dir;
}
```

## as const

```typescript
const roles = ['admin', 'user'] as const;
// roles is readonly ['admin', 'user']
```

## Tuples

```typescript
type Point = [number, number];

const p: Point = [10, 20];
```

## Labeled Tuples

```typescript
type Range = [start: number, end: number];
```

## Interview Questions and Answers

### 1. What is a literal type?

A type that only allows a specific value or set of values.

### 2. When would you use tuples?

When you need a fixed-size array with known element types.
