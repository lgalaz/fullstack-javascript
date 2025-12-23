# Discriminated Unions 

## Introduction

A discriminated union uses a common literal field to narrow types safely. The "common literal field" is a shared key (like `status` or `type`) whose value is a string/number literal in each variant, so checking that field tells TypeScript exactly which variant you have.

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

```typescript
function renderSafe(state: State) {
  switch (state.status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return state.data.join(', ');
    case 'error':
      return state.message;
    default:
      return assertNever(state);
  }
}
```

## Action unions (common in reducers)

Reducers are a common state management pattern (popularized by Redux and `useReducer`) where you update state by dispatching an "action" object. Action unions model the allowed action shapes and make the reducer switch exhaustive and type-safe.

Important details:

- Use a literal `type` field (the discriminator) so TypeScript can narrow the payload for each case.
- Keep payloads specific to each action; avoid a single broad payload type that forces extra checks.

```typescript
type Action =
  | { type: 'add'; value: number }
  | { type: 'remove'; id: string };

function reducer(state: number[], action: Action) {
  switch (action.type) {
    case 'add':
      return [...state, action.value];
    case 'remove':
      return state.filter(x => x.toString() !== action.id);
  }
}
```

## Interview Questions and Answers

### 1. Why use discriminated unions?

They enable safe narrowing based on a shared literal field.

### 2. What is the discriminator?

A common field with literal values, such as `status`.
