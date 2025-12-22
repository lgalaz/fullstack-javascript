# Type Assertions - Comprehensive Study Guide

## Introduction

Type assertions tell the compiler to treat a value as a specific type. Use them when you know more than the compiler.

## Basic Assertions

```typescript
const value: unknown = 'text';
const len = (value as string).length;
```

Assertions do not perform runtime checks. If you assert the wrong type, you can still crash at runtime.

Prefer narrowing or validation over assertions when possible.

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

const value: unknown = 'text';
if (isString(value)) {
  console.log(value.length);
}
```

## Non-Null Assertion

```typescript
const input = document.getElementById('name')!;
input.textContent = 'Hello';
```

Use the non-null assertion sparingly; prefer explicit checks when possible.
It can still throw at runtime if the element doesn't exist.

```typescript
const input = document.getElementById('name');
if (input) {
  input.textContent = 'Hello';
}
```

## Assertion vs Casting

Assertions do not change runtime behavior; they only affect types.

You can also use assertions with DOM types when you know the element type:

```typescript
const input = document.getElementById('name') as HTMLInputElement;
input.value = 'Ada';
```

Prefer a guard when you can:

```typescript
const el = document.getElementById('name');
if (el instanceof HTMLInputElement) {
  el.value = 'Ada';
}
```

## Double assertions

Sometimes you must bridge incompatible types (e.g., external libs). `as unknown as` is a last resort.

```typescript
const data = '{"x":1}' as unknown as { x: number };
```

Safer JSON parsing with a type guard:

```typescript
function isObjWithX(value: unknown): value is { x: number } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'x' in value &&
    typeof (value as { x: unknown }).x === 'number'
  );
}

const raw = JSON.parse('{"x":1}') as unknown;
if (isObjWithX(raw)) {
  console.log(raw.x);
}
```

Zod (schema validation library) gives runtime validation plus inferred TypeScript types:

```typescript
import { z } from 'zod';

const DataSchema = z.object({ x: z.number() });
const raw = JSON.parse('{"x":1}');
const parsed = DataSchema.parse(raw);
console.log(parsed.x);
```

Zod defines schemas that validate data at runtime and automatically infer TypeScript types from those schemas. Use it when you need reliable validation for API responses, config files, or user input.

Use `satisfies` for safer shape checks when you want to keep literal types.

```typescript
const config = {
  env: 'prod',
  retry: 3,
} satisfies { env: 'dev' | 'prod'; retry: number };
```

## Interview Questions and Answers

### 1. When is a type assertion appropriate?

When runtime guarantees exist but the compiler cannot infer them.

### 2. Why can assertions be risky?

They can hide real type errors and cause runtime failures.
