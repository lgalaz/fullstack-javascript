# Async and Promises in TypeScript - Comprehensive Study Guide

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

## Interview Questions and Answers

### 1. What does an async function return in TypeScript?

A Promise of the declared return type.

### 2. Why is `Promise<T>` useful?

It documents the resolved type and improves type safety in async flows.
