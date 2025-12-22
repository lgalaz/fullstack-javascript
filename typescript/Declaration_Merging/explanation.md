# Declaration Merging - Comprehensive Study Guide

## Introduction

TypeScript can merge multiple declarations with the same name, especially interfaces and namespaces.

## Interface Merging

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

const u: User = { name: 'Ada', age: 36 };
```

## Module Augmentation

```typescript
// add a field to an existing type
declare module 'express' {
  interface Request {
    userId?: string;
  }
}
```

## Interview Questions and Answers

### 1. What can be merged in TypeScript?

Interfaces, namespaces, and enums can be merged by name.

### 2. Why use module augmentation?

To extend types from third-party libraries.
