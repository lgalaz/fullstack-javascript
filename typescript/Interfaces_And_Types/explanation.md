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

Interfaces are open by default: they can be augmented across files (declaration merging), which is useful for library typings.

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
 - Interfaces are better for public API surfaces and class `implements` clauses.

```typescript
interface Admin extends User {
  role: 'admin';
}

type ID = string | number;
```

Interfaces can be reopened and merged later. Type aliases cannot.

```typescript
interface Window {
  appVersion: string;
}

interface Window {
  appMode: 'dev' | 'prod';
}
```

## Function and callable shapes

Interfaces can describe callable objects with properties; type aliases can do the same, but interfaces can be extended.

```typescript
interface Comparator {
  (a: number, b: number): number;
  label: string;
}

const compare: Comparator = Object.assign(
  (a: number, b: number) => a - b,
  { label: 'numeric' }
);
```

```typescript
type ComparatorType = {
  (a: number, b: number): number;
  label: string;
};

const compareType: ComparatorType = Object.assign(
  (a: number, b: number) => a - b,
  { label: 'numeric' }
);
```

```typescript
interface LabeledComparator extends Comparator {
  unit: 'ms' | 's';
}

const compareWithUnit: LabeledComparator = Object.assign(
  (a: number, b: number) => a - b,
  { label: 'numeric', unit: 'ms' }
);
```

## Index Signatures

```typescript
interface StringMap {
  [key: string]: string; // this line tells it that any key needs to be a string, and values need to be a string
  // union types can also be used: [key: string]: string | number
}
```

Index signatures are useful for dictionary-like objects with unknown keys.

Be careful: index signatures apply to all properties, so the value type must be compatible with declared properties.

```typescript
interface StringMap {
  [key: string]: string;
  name: string;
  // id: number; // Error: number not assignable to string
}
```

Correct variant (align property types with the index signature):

```typescript
interface StringMap {
  [key: string]: string;
  name: string;
  id: string;
}
```

## Interview Questions and Answers

### 1. When should you use an interface vs a type alias?

Use interfaces for object shapes that might be extended or merged; use type aliases for unions and more complex compositions.

### 2. What does `email?: string` mean?

The property is optional and may be absent.
