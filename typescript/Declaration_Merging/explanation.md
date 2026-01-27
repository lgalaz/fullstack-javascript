# Declaration Merging 

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

This is useful for gradually extending types across files or modules.

Merging is additive. If properties have the same name, their types must be compatible or you get an error.

## Function and namespace merging

You can merge a function with a namespace to add static helpers.

```typescript
function parse(input: string) {

  return JSON.parse(input);
}

namespace parse {
  export const version = '1.0';
}

parse.version;
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

Module augmentation is common in server-side apps to attach request metadata.

## Global augmentation

```typescript
declare global {
  interface Window {
    appVersion: string;
  }
}
```

Avoid polluting global scope in libraries unless necessary.

## Interview Questions and Answers

### 1. What can be merged in TypeScript?

Interfaces, namespaces, and enums can be merged by name.

### 2. Why use module augmentation?

To extend types from third-party libraries.
