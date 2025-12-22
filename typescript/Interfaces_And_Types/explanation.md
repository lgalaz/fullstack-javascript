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

Interfaces are ideal for object shapes that may be extended or merged.

## Type Aliases

```typescript
type User = {
  id: number;
  name: string;
  email?: string;
};
```

Type aliases can represent unions, intersections, and primitives in addition to objects.

## Differences

- Interfaces can be extended and merged.
- Type aliases can represent unions, intersections, and primitives.

```typescript
interface Admin extends User {
  role: 'admin';
}

type ID = string | number;
```

Interfaces can be reopened and merged later. Type aliases cannot.

## Index Signatures

```typescript
interface StringMap {
  [key: string]: string;
}
```

Index signatures are useful for dictionary-like objects with unknown keys.

## Interview Questions and Answers

### 1. When should you use an interface vs a type alias?

Use interfaces for object shapes that might be extended or merged; use type aliases for unions and more complex compositions.

### 2. What does `email?: string` mean?

The property is optional and may be absent.
