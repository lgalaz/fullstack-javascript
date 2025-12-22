# Interfaces and Type Aliases - Comprehensive Study Guide

## Introduction

TypeScript uses interfaces and type aliases to describe object shapes.

## Interfaces

```typescript
interface User {
  id: number;
  name: string;
  email?: string;
}
```

## Type Aliases

```typescript
type User = {
  id: number;
  name: string;
  email?: string;
};
```

## Differences

- Interfaces can be extended and merged.
- Type aliases can represent unions, intersections, and primitives.

```typescript
interface Admin extends User {
  role: 'admin';
}

type ID = string | number;
```

## Index Signatures

```typescript
interface StringMap {
  [key: string]: string;
}
```

## Interview Questions and Answers

### 1. When should you use an interface vs a type alias?

Use interfaces for object shapes that might be extended or merged; use type aliases for unions and more complex compositions.

### 2. What does `email?: string` mean?

The property is optional and may be absent.
