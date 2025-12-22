# Union and Intersection Types - Comprehensive Study Guide

## Introduction

Union types allow a value to be one of several types. Intersection types combine multiple types.

## Union Types

```typescript
type ID = string | number;

function printId(id: ID) {
  console.log(id);
}
```

With unions, you must narrow before using type-specific operations.

```typescript
function formatId(id: ID) {
  return typeof id === 'string' ? id.toUpperCase() : id.toFixed(0);
}
```

Unions are great for API surfaces and parsing. Pair them with discriminants for safer narrowing.

API surfaces are the public types and functions your module exposes to other code. API boundaries are points where data crosses into your system (e.g., network responses, user input, or JSON parsing). Unions help model these inputs explicitly so you can validate and narrow them safely.

```typescript
type ApiResult =
  | { ok: true; data: { id: number } }
  | { ok: false; error: string };

function handle(result: ApiResult) {
  if (!result.ok) {
    return result.error;
  }
  return result.data.id;
}
```

## Intersection Types

Type intersection (logical AND): a value must satisfy both types.

```typescript
type Timestamped = { createdAt: string };

type User = { id: number; name: string };

type UserWithTime = User & Timestamped;
```

Intersections combine all properties. If two types conflict (same key, different types), the result can become `never` for that property.

```typescript
type A = { value: string };
type B = { value: number };
type C = A & B;
// C["value"] is never
```

Intersections are often used for mixins and "composition" of capabilities. A mixin is a reusable set of properties or methods you combine with others, and composition means building a type by combining multiple smaller capabilities into one.

Mixins vs interfaces vs abstract classes:
- Mixin: reuse behavior by composing types/classes.
- Interface: declare a shape contract with no implementation.
- Abstract class: share implementation and enforce a contract via inheritance.

```typescript
type WithId = { id: string };
type WithTimestamps = { createdAt: string; updatedAt: string };

type Entity = WithId & WithTimestamps;
```

## Common keys (key intersection)

If you want only the keys shared by two types, intersect their keys and `Pick` from one side.

```typescript
type A = { id: number; name: string; active: boolean };
type B = { id: number; name: string; role: 'admin' };

type CommonKeys = keyof A & keyof B; // "id" | "name"
type Common = Pick<A, CommonKeys>; // { id: number; name: string }
```

`keyof A & keyof B` is a set intersection of keys, so it only keeps keys that appear in both types (not `active` or `role` here).
`Pick` turns that key union back into an object type by selecting those properties from `A`.
This is sometimes called "key intersection" or "shared keys" rather than type intersection, which means "must satisfy both types."

## Interview Questions and Answers

### 1. When would you use a union?

When a value can legitimately be one of several types.

### 2. When would you use an intersection?

When you need a type that satisfies multiple type requirements at once.
