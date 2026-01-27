# Literal Types and Tuples 

## Introduction

Literal types restrict values to exact strings or numbers. Tuples represent fixed-length arrays with specific types.

## Literal Types

```typescript
type Direction = 'up' | 'down' | 'left' | 'right';

function move(dir: Direction) {

  return dir;
}
```

Literal types restrict values to specific strings or numbers, which is useful for enums without runtime cost.

```typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

function request(method: HttpMethod, url: string) {

  return { method, url };
}
```

## as const

```typescript
const roles = ['admin', 'user'] as const;
// roles is readonly ['admin', 'user']
```

`as const` freezes the literal types and marks the array as readonly, so values don't widen (e.g., `'admin'` stays `'admin'` instead of `string`) and the array can't be mutated.

Widening vs `as const`:

```typescript
const rolesWide = ['admin', 'user'];
// rolesWide: string[]

const rolesNarrow = ['admin', 'user'] as const;
// rolesNarrow: readonly ['admin', 'user']
```

```typescript
const config = {
  env: 'prod',
  retries: 3,
} as const;
// env is "prod", retries is 3
```

## Tuples

```typescript
type Point = [number, number];

const p: Point = [10, 20];
```

Tuples enforce order and length, unlike regular arrays.

A tuple is a fixed-length array type where each position has its own specific type. It is not just a "2 dimensional array"; it can have any length and mix types per slot (e.g., `[string, number, boolean]`), and TypeScript checks both order and length.

Tuple: fixed length, specific types per position, order matters (e.g., [string, number]).

Array: variable length, one element type for all positions (e.g., string[]).

Tuples are for “structured records” in array form; arrays are for lists of same‑typed items.

Use tuples when position is the meaning and you want a compact, ordered record (e.g., [x, y], [status, value])—they’re lightweight and easy to pattern‑match/destructure. Use objects when you want named fields, optional properties, or clearer self‑documentation.

## Variadic and rest tuples

```typescript
type AtLeastOne<T> = [T, ...T[]];

const values: AtLeastOne<number> = [1, 2, 3];
```

## Tuple inference with functions

```typescript
function pair<T, U>(left: T, right: U): [T, U] {

  return [left, right];
}

const result = pair('x', 42); // [string, number]
```

Why use this: it preserves the relationship between the two inputs and guarantees order in the returned tuple. This is useful for returning structured pairs (like `[key, value]`, `[label, value]`, or `[start, end]`) without defining a named object type, while still keeping precise types for each position.

## Labeled Tuples

```typescript
type Range = [start: number, end: number];
```

Example usage (labels improve readability in tooling):

```typescript
function clamp(value: number, range: Range) {
  const [start, end] = range;

  return Math.min(Math.max(value, start), end);
}

clamp(10, [0, 5]);
```

## Interview Questions and Answers

### 1. What is a literal type?

A type that only allows a specific value or set of values (e.g., `'GET'`, `404`, `true`). Literal types are useful as discriminators in unions and to prevent accidental widening to general `string`/`number`.

### 2. When would you use tuples?

When you need a fixed-size, ordered grouping where each position has a specific meaning and type (e.g., `[start, end]`, `[status, value]`). Tuples give more structure and safety than plain arrays while staying lightweight.
