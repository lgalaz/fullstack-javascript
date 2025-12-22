# Modules and Imports - Comprehensive Study Guide

## Introduction

TypeScript uses ES module syntax with type-aware imports and exports.

## Basic Imports/Exports

```typescript
export function sum(a: number, b: number) {
  return a + b;
}

import { sum } from './math';
```

TypeScript uses the same syntax as modern JavaScript, but can also separate type-only imports.

## Type-Only Imports

```typescript
import type { User } from './types';
```

Type-only imports are erased from the JS output, which helps avoid runtime dependency cycles.

## Default Exports

```typescript
export default function main() {}
```

## Module Resolution

Configured via `tsconfig.json` with `moduleResolution`, `baseUrl`, and `paths`.

```typescript
// tsconfig.json\n// \"baseUrl\": \".\",\n// \"paths\": { \"@/*\": [\"src/*\"] }
```

## Interview Questions and Answers

### 1. Why use `import type`?

It avoids runtime imports and keeps types only in the type system.

### 2. What does `paths` in tsconfig do?

It defines module alias mappings for cleaner imports.
