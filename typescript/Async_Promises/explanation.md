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

## Promise Types

```typescript
const p: Promise<number> = Promise.resolve(42);
```

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

## Interview Questions and Answers

### 1. What does an async function return in TypeScript?

A Promise of the declared return type.

### 2. Why is `Promise<T>` useful?

It documents the resolved type and improves type safety in async flows.
