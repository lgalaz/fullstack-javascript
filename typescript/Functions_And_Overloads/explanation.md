# Functions and Overloads - Comprehensive Study Guide

## Introduction

TypeScript lets you type function parameters, returns, and overloads.

## Basic Function Types

```typescript
function add(a: number, b: number): number {
  return a + b;
}

const multiply = (a: number, b: number): number => a * b;
```

Type annotations go on parameters and return types. When omitted, TypeScript tries to infer them.

## Optional and Default Parameters

```typescript
function greet(name: string, title?: string) {
  return title ? `${title} ${name}` : name;
}

function greet2(name: string, title = 'Dr.') {
  return `${title} ${name}`;
}
```

## Function Overloads

```typescript
function parse(input: string): string;
function parse(input: number): number;
function parse(input: string | number) {
  return input;
}
```

Only the overload signatures are visible to callers. The implementation signature must be compatible with all overloads.

Overloads are useful when behavior truly differs per input type. If behavior is the same, prefer a union type to reduce complexity.

```typescript
function toArray(input: string | string[]) {
  return Array.isArray(input) ? input : [input];
}
```

## `this` parameters

You can explicitly type `this` in function signatures to ensure correct usage.

```typescript
function setName(this: { name: string }, name: string) {
  this.name = name;
}
```

## Rest Parameters

```typescript
function sum(...nums: number[]) {
  return nums.reduce((a, b) => a + b, 0);
}
```

Rest parameters are typed as arrays, so `...nums: number[]` means any number of numbers.

## Variadic tuple types

```typescript
function concat<T extends unknown[], U extends unknown[]>(
  a: [...T],
  b: [...U]
): [...T, ...U] {
  return [...a, ...b];
}

const result = concat([1, 'a'], [true]); // [number, string, boolean]
```

These are called "variadic" because the tuple types can be any length, and "tuple" because the arrays preserve element positions and types (not just `any[]`). The spread syntax (`...T`, `...U`) lets TypeScript carry the exact element types through concatenation.

## Interview Questions and Answers

### 1. Why use overloads?

They provide multiple call signatures for better type safety and tooling.

### 2. What is the difference between optional and default parameters?

Optional parameters may be `undefined`; default parameters provide a fallback value.
