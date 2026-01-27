# Generics 

## Introduction

Generics let you write reusable code with type parameters — placeholders for types — so TypeScript can infer or enforce the relationship between inputs and outputs.

## Generic Functions

```typescript
function identity<T>(value: T): T {

  return value;
}

const num = identity(42);
const str = identity('hello');
```

Type parameters are usually inferred from the arguments, so you rarely need to write `identity<number>(42)`.

```typescript
const literal = identity('x'); // T inferred as "x" if context preserves literal
```

## Generic Constraints

```typescript
function getLength<T extends { length: number }>(value: T) {

  return value.length;
}
```

Constraints ensure the generic type has the required shape.

You can constrain based on keys with `keyof`:

```typescript
function getProp<T, K extends keyof T>(obj: T, key: K) {

  return obj[key];
}

const user = { id: 1, name: 'Ada' };
const name = getProp(user, 'name'); // string
```

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

## Generic Inference in Higher-Order Functions

```typescript
function mapValues<T, U>(values: T[], mapper: (value: T) => U): U[] {

  return values.map(mapper);
}

const lengths = mapValues(['a', 'bb'], s => s.length); // number[].
// It would return [1, 2] at runtime, since 'a' has length 1 and 'bb' has length 2.
```

## Avoiding over-constraints

Overly strict constraints can reduce reuse. Prefer structural constraints that describe what's required, not what the type "is".

## Interview Questions and Answers

### 1. Why use generics?

They preserve type information while keeping code reusable.

### 2. What does `T extends` mean?

It constrains a generic type to a specific shape.
