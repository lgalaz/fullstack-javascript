# Error Handling in TypeScript - Comprehensive Study Guide

## Introduction

TypeScript can model error types, but JavaScript still throws any value. Good error handling uses type guards and narrowing.

## Narrowing Unknown Errors

```typescript
try {
  throw new Error('Failed');
} catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
  }
}
```

Since TypeScript treats caught errors as `unknown`, you must narrow before accessing properties.

## Custom Error Types

```typescript
class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
```

Custom errors help differentiate error cases and carry metadata like status codes.

## Interview Questions and Answers

### 1. Why catch errors as `unknown`?

It forces you to narrow safely before accessing properties.

### 2. Why create custom errors?

To attach metadata and distinguish error cases.
