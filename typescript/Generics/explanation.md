# Generics - Comprehensive Study Guide

## Introduction

Generics let you write reusable, type-safe functions and classes.

## Generic Functions

```typescript
function identity<T>(value: T): T {
  return value;
}

const num = identity(42);
const str = identity('hello');
```

Type parameters are usually inferred from the arguments, so you rarely need to write `identity<number>(42)`.

## Generic Constraints

```typescript
function getLength<T extends { length: number }>(value: T) {
  return value.length;
}
```

Constraints ensure the generic type has the required shape.

## Generics with Arrays

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
```

## Generics with Interfaces

```typescript
interface ApiResponse<T> {
  data: T;
  error?: string;
}
```

You can add defaults to generics when a type parameter is optional:

```typescript
interface Box<T = string> {
  value: T;
}
```

## Interview Questions and Answers

### 1. Why use generics?

They preserve type information while keeping code reusable.

### 2. What does `T extends` mean?

It constrains a generic type to a specific shape.
