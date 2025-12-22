# Type Assertions - Comprehensive Study Guide

## Introduction

Type assertions tell the compiler to treat a value as a specific type. Use them when you know more than the compiler.

## Basic Assertions

```typescript
const value: unknown = 'text';
const len = (value as string).length;
```

Assertions do not perform runtime checks. If you assert the wrong type, you can still crash at runtime.

## Non-Null Assertion

```typescript
const input = document.getElementById('name')!;
```

Use the non-null assertion sparingly; prefer explicit checks when possible.

## Assertion vs Casting

Assertions do not change runtime behavior; they only affect types.

You can also use assertions with DOM types when you know the element type:

```typescript
const input = document.getElementById('name') as HTMLInputElement;
input.value = 'Ada';
```

## Interview Questions and Answers

### 1. When is a type assertion appropriate?

When runtime guarantees exist but the compiler cannot infer them.

### 2. Why can assertions be risky?

They can hide real type errors and cause runtime failures.
