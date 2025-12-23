# Async and Promises in TypeScript 

## Introduction

TypeScript provides types for async functions and Promises.

## Async Functions

```typescript
async function fetchUser(id: number): Promise<{ id: number; name: string }> {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}
```

The `Promise<...>` return type describes the value you get after awaiting the function. Here, `await fetchUser(1)` resolves to `{ id: number; name: string }`, even though the function itself returns a promise at runtime.

```typescript
async function loadName() {
  const user = await fetchUser(1);
  return user.name; // string
}
```

## Promise Types

```typescript
const p: Promise<number> = Promise.resolve(42);
```

Use `Promise<T>` to be explicit about the resolved value type.

## Awaited and Promise utilities

TypeScript uses `Awaited<T>` to model what `await` produces.

```typescript
type A = Awaited<Promise<string>>; // string
type B = Awaited<Promise<Promise<number>>>; // number
```

Use `Awaited` when you want to derive the resolved type from a promise-returning function or compose async utilities.

```typescript
async function fetchUser() {
  return { id: 1, name: 'Ada' };
}

type User = Awaited<ReturnType<typeof fetchUser>>;
// User is { id: number; name: string }
```

```typescript
function withLoading<T>(promise: Promise<T>) {
  return promise.then(value => ({ loading: false, value }));
}

type Loaded<T> = {
  loading: boolean;
  value: Awaited<T>;
};

type UserLoaded = Loaded<ReturnType<typeof fetchUser>>;
```

Why `withLoading`: it is a helper that standardizes async results into a consistent shape for UI or data layers. Instead of passing a raw promise around, you return `{ loading, value }` so consumers can handle state uniformly.

```typescript
async function loadUser() {
  const result = await withLoading(fetchUser());
  return result.value; // typed as { id: number; name: string }
}
```

You could also annotate `fetchUser` directly.

```typescript
async function fetchUser(): Promise<{ id: number; name: string }> {
  return { id: 1, name: 'Ada' };
}
```

The `ReturnType` + `Awaited` pattern is useful when you want to avoid duplicating types, keep derived types in sync as implementations change, or when the function is imported from another module.

`ReturnType` is a built-in TypeScript utility type (not a runtime keyword). It extracts the return type of a function.

```typescript
type FetchUserReturn = ReturnType<typeof fetchUser>;
// FetchUserReturn is Promise<{ id: number; name: string }>
```

`Awaited<T>` unwraps the resolved type from a promise type, so `Awaited<Promise<X>>` becomes `X`.

```typescript
type FetchUserValue = Awaited<ReturnType<typeof fetchUser>>;
// FetchUserValue is { id: number; name: string }
```

## Promise.all with tuples

When you pass a tuple, TypeScript preserves element types.

```typescript
const result = await Promise.all([
  Promise.resolve(1),
  Promise.resolve('x'),
] as const);
// result is readonly [number, string]
```

`as const` makes the array a readonly tuple, so TypeScript preserves each element's type and order. Without it, the array would widen to `Array<Promise<number | string>>`, and `Promise.all` would infer `(number | string)[]` instead of a tuple.

## Error Handling

```typescript
async function load() {
  try {
    const user = await fetchUser(1);
    return user;
  } catch (err) {
    console.error(err);
  }
}
```

If you do not rethrow in the `catch`, the function's return type becomes `Promise<User | undefined>` because the error path returns `undefined`.

Prefer `unknown` for error typing, then narrow.

```typescript
async function loadSafe() {
  try {
    return await fetchUser(1);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { id: -1, name: err.message };
    }
    throw err;
  }
}
```

## Interview Questions and Answers

### 1. What does an async function return in TypeScript?

A Promise of the declared return type.

### 2. Why is `Promise<T>` useful?

It documents the resolved type and improves type safety in async flows.
