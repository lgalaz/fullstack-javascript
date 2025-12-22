# TypeScript Basics and Primitives - Comprehensive Study Guide

## Introduction

TypeScript adds static typing to JavaScript. It helps catch errors early and improves tooling.

## Primitive Types

```typescript
let name: string = 'Ada';
let age: number = 36;
let isActive: boolean = true;
let nothing: null = null;
let notSet: undefined = undefined;
let big: bigint = 9007199254740991n;
let unique: symbol = Symbol('id');
```

Primitives are immutable values. When you pass them around, you pass the value itself, not a reference.

## Arrays

```typescript
let nums: number[] = [1, 2, 3];
let names: Array<string> = ['Ada', 'Grace'];
```

Both syntaxes are equivalent; use the one your team prefers.

## any vs unknown

`any` disables type checking; `unknown` forces you to narrow before use.

```typescript
let value: unknown = 'text';
if (typeof value === 'string') {
  console.log(value.toUpperCase());
}
```

Prefer `unknown` at boundaries (like JSON parsing) so you must validate before use.

## void and never

- `void` means no return value.
- `never` means a function never returns.

```typescript
function log(msg: string): void {
  console.log(msg);
}

function fail(message: string): never {
  throw new Error(message);
}
```

Use `never` in exhaustive checks to ensure all cases are handled.

## Interview Questions and Answers

### 1. What is the difference between `any` and `unknown`?

`any` skips type checking; `unknown` requires type narrowing before use.

### 2. When would you use `never`?

For functions that always throw or never finish (infinite loops).
