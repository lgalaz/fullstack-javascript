# Error Handling in TypeScript 

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

If you are not handling the error (e.g., after logging), rethrow it so upstream code can react:

```typescript
try {
  throw new Error('Failed');
} catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
  }
  throw err;
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

## Result types over exceptions

For predictable flows (validation, parsing), return a discriminated union instead of throwing. A discriminated union gives you an explicit success/failure shape, forces callers to handle both cases, and keeps control flow visible (no hidden jumps like exceptions). It is often more maintainable because the intent is clear at the call site and you can make the `switch` exhaustive.

```typescript
type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function parseIntSafe(input: string): Result<number> {
  const value = Number(input);
  if (Number.isNaN(value)) {
    return { ok: false, error: 'Not a number' };
  }
  return { ok: true, value };
}
```

## Preserve cause

In modern runtimes, prefer `cause` for error chaining.

```typescript
try {
  throw new Error('db failed');
} catch (err) {
  throw new Error('service failed', { cause: err });
}
```

## Interview Questions and Answers

### 1. Why catch errors as `unknown`?

It forces you to narrow safely before accessing properties.

### 2. Why create custom errors?

To attach metadata and distinguish error cases.
