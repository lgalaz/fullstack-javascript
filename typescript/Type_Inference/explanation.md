# Type Inference - Comprehensive Study Guide

## Introduction

TypeScript can infer types from values and return statements, reducing the need for annotations.

An annotation is an explicit type you write, like `name: string` or `const id: number = 1`. It is not the same as a type assertion (`value as Type`), which forces a type without checks.

```typescript
const id: number = 1; // annotation
const maybeId = '1' as unknown as number; // assertion (not recommended)
```

## Basic Inference

```typescript
let count = 0; // inferred as number
const name = 'Ada'; // inferred as "Ada" in some contexts
```

`const` preserves literal types because the value cannot change, while `let` widens to a general type since it can be reassigned.

```typescript
const id = 'Ada'; // "Ada"
let id2 = 'Ada'; // string
```

Inference can be widened (e.g., `let` to `string`) or kept literal with `const`.

```typescript
let role = 'admin'; // string (widened)
const mode = 'dark'; // "dark" (literal)
const flags = { debug: true }; // { debug: boolean }
```

Use `as const` to preserve literal types and readonly arrays/objects.

```typescript
const routes = ['/home', '/settings'] as const;
type Route = (typeof routes)[number]; // "/home" | "/settings"
```

`as const` turns the array into a readonly tuple and keeps each element as a literal type instead of widening to `string[]`. The indexed access `(typeof routes)[number]` uses `number` as the type of all possible numeric indices, so it extracts the union of all element types in the tuple. That makes `Route` become `"/home" | "/settings"`.

## Function Return Inference

```typescript
function makeUser(name: string) {
  return { name, active: true };
}
```

The return type here is inferred as `{ name: string; active: boolean }`.

## Contextual Typing

TypeScript can infer types from context, such as callback parameters.

```typescript
['a', 'b'].map(s => s.toUpperCase()); // s: string
```

The parameter type of `s` is inferred as `string` from the array's element type. This is especially important for event handlers and callbacks.

```typescript
type Handler = (event: { type: 'click'; x: number; y: number }) => void;
const onClick: Handler = event => {
  // event: { type: 'click'; x: number; y: number }
  console.log(event.x, event.y);
};
```

## Generic Inference

TypeScript infers generic type arguments from usage.

```typescript
function wrap<T>(value: T) {
  return { value };
}

const wrapped = wrap({ id: 1, name: 'Ada' });
// T inferred as { id: number; name: string }
```

If inference fails or you need a specific type, pass it explicitly:

```typescript
const wrappedExplicit = wrap<{ id: number; name: string }>({ id: 1, name: 'Ada' });
```

Use `satisfies` to validate shapes without losing literal types.

```typescript
const config = {
  mode: 'dev',
  retries: 3,
} satisfies { mode: 'dev' | 'prod'; retries: number };
```

## Best Practices

- Let inference work for local variables.
- Add explicit types at API boundaries.
 - Use `satisfies` to enforce constraints without widening literals.

## Interview Questions and Answers

### 1. When should you add explicit types?

At public APIs, function boundaries, and shared module exports.

### 2. Why avoid over-annotating?

It adds noise and can block inference improvements.
