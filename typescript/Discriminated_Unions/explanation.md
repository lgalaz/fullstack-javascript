# Discriminated Unions - Comprehensive Study Guide

## Introduction

A discriminated union uses a common literal field to narrow types safely.

## Example

```typescript
type Loading = { status: 'loading' };
type Success = { status: 'success'; data: string[] };
type ErrorState = { status: 'error'; message: string };

type State = Loading | Success | ErrorState;

function render(state: State) {
  switch (state.status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return state.data.join(', ');
    case 'error':
      return state.message;
  }
}
```

You can enforce exhaustiveness with a `never` check:

```typescript
function assertNever(x: never): never {
  throw new Error('Unexpected state: ' + x);
}
```

## Interview Questions and Answers

### 1. Why use discriminated unions?

They enable safe narrowing based on a shared literal field.

### 2. What is the discriminator?

A common field with literal values, such as `status`.
