# Type Inference - Comprehensive Study Guide

## Introduction

TypeScript can infer types from values and return statements, reducing the need for annotations.

## Basic Inference

```typescript
let count = 0; // inferred as number
const name = 'Ada'; // inferred as "Ada" in some contexts
```

## Function Return Inference

```typescript
function makeUser(name: string) {
  return { name, active: true };
}
```

## Best Practices

- Let inference work for local variables.
- Add explicit types at API boundaries.

## Interview Questions and Answers

### 1. When should you add explicit types?

At public APIs, function boundaries, and shared module exports.

### 2. Why avoid over-annotating?

It adds noise and can block inference improvements.
