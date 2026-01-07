# Type Annotations

## Introduction

In TypeScript, "type annotations" are the syntax you use to declare types for variables, parameters, and return values. They are not the same thing as decorator-style metadata. Annotations are optional because the compiler can often infer types, but explicit annotations are useful at boundaries and for readability.
If you want runtime metadata, that is a separate feature usually handled by decorators and optional `emitDecoratorMetadata`.

See `typescript/Decorators/explanation.md` for metadata-style behavior.

## Variable and Parameter Annotations

```typescript
let count: number = 0;

function greet(name: string): string {
  return `Hello ${name}`;
}
```

## Object and Array Annotations

```typescript
type User = {
  id: number;
  name: string;
  roles: string[];
};

const user: User = { id: 1, name: 'Ada', roles: ['admin'] };
```

## Function Types

```typescript
const toUpper: (value: string) => string = (value) => value.toUpperCase();
```

## Union and Literal Annotations

```typescript
type Status = 'idle' | 'loading' | 'error';

function setStatus(status: Status) {
  return status;
}
```

## When Annotations Are a Good Idea

- Public APIs and module boundaries.
- Complex types that inference would make hard to read.
- Callback signatures that document expectations.

## When to Rely on Inference

- Local variables where the value is obvious.
- Expressions where annotations add noise.
- Refactors where inference keeps types in sync.

## Common Pitfall

```typescript
const ids = [];
// ids is inferred as never[] under noImplicitAny rules
```

Prefer a type annotation when starting with empty arrays or objects:

```typescript
const ids: number[] = [];
```

## Interview Questions and Answers

### 1. Why are type annotations optional in TypeScript?

Because the compiler can infer types from values and usage, so explicit annotations are not always needed.

### 2. Where are annotations most valuable?

At module boundaries and in public APIs where they act as documentation and prevent breaking changes.

### 3. What is a downside of over-annotating?

It creates redundant code that can become stale or harder to refactor.

### 4. How do annotations interact with inference?

Annotations constrain inference; the compiler uses them to check implementation details against the declared types.
