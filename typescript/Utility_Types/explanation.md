# Utility Types 

## Introduction

Utility types help transform existing types.

## Why TypeScript

TypeScript catches type errors early, improves editor tooling (autocomplete, refactors), and documents intent with types. It does this at build time without changing JavaScript runtime behavior.

## Common Utility Types

```typescript
interface User {
  id: number;
  name: string;
  email?: string;
}

type UserPartial = Partial<User>;
type UserRequired = Required<User>;
type UserReadonly = Readonly<User>;
type UserPick = Pick<User, 'id' | 'name'>;
type UserOmit = Omit<User, 'email'>;
```

What each does:

- `Partial<T>`: makes all properties optional.
- `Required<T>`: makes all properties required (removes `?`).
- `Readonly<T>`: makes all properties `readonly` (compile-time only). It is not the same as `#private`, which enforces privacy at runtime for class fields.
- `Pick<T, K>`: keeps only the listed keys.
- `Omit<T, K>`: removes the listed keys.

These help express common transformations without rewriting types by hand.

```typescript
type UpdateUser = Partial<User> & Pick<User, 'id'>;
```

`UpdateUser` keeps `id` required and makes `name` and `email` optional.
This works because `Partial<User>` makes all properties optional, and `Pick<User, 'id'>` adds back a required `id`, so the intersection results in `id` required with the rest optional.

## Record

```typescript
type Flags = Record<string, boolean>;
```

`Record<K, V>` is useful for dictionaries and lookup tables. It guarantees the value type for any key of `K`, which a plain object literal doesn't enforce, and it's clearer than a tuple/array when keys are not numeric indices. Use arrays/tuples when order matters; use `Record` for key-to-value maps.

## Pick/Omit with unions

`Pick` and `Omit` distribute over unions, which can be useful or surprising.

```typescript
type Event =
  | { type: 'click'; x: number; y: number }
  | { type: 'keydown'; key: string };

type EventPayload = Omit<Event, 'type'>;
// { x: number; y: number } | { key: string }
```

## ReturnType and Parameters

```typescript
type Fn = (a: number, b: number) => number;

type Args = Parameters<Fn>; // [number, number]

type Result = ReturnType<Fn>; // number
```

Use `Parameters` and `ReturnType` to keep types in sync with function signatures.

Example use case: typing a wrapper function without repeating the signature.

```typescript
function logCall(fn: Fn, ...args: Parameters<Fn>): ReturnType<Fn> {
  console.log('calling with', args);
  return fn(...args);
}

const sum: Fn = (a, b) => a + b;
logCall(sum, 2, 3); // 5
```

Without `Parameters`/`ReturnType`, you'd have to repeat the signature:

```typescript
function logCallRepeat(fn: Fn, a: number, b: number): number {
  console.log('calling with', [a, b]);
  return fn(a, b);
}

logCallRepeat(sum, 4, 5); // 9
```

## Advanced utilities

`Awaited`, `NonNullable`, and `Extract` are common for real-world typing.

```typescript
type WithNull = string | null | undefined;
type WithoutNull = NonNullable<WithNull>; // string

type Resolved = Awaited<Promise<number>>; // number
// Awaited unwraps promise types to the value they resolve to.
const value: Resolved = 42;

type Id = Extract<string | number | boolean, string | number>;
// Id is string | number (boolean removed) because Extract keeps only members assignable to the second type.
const id1: Id = 'abc';
const id2: Id = 123;
```

## Custom utility types

```typescript
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

type ReadonlyUser = Readonly<{ id: number; name: string }>; // Readonly makes all keys readonly
type MutableUser = Mutable<ReadonlyUser>;

const user: MutableUser = { id: 1, name: 'Ada' };
user.name = 'Grace';
```

## Interview Questions and Answers

### 1. What does `Partial<T>` do?

It makes all properties of `T` optional.

### 2. What is `Record<K, V>` used for?

It creates an object type with keys of `K` and values of `V`.
