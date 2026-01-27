# Modules and Imports 

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

Type-only imports are erased from the JS output, which helps avoid runtime dependency cycles and prevents pulling in modules purely for types. This keeps the emitted JS smaller and avoids side effects from modules that are only needed at type-check time.

```typescript
export type { User } from './types';
```

## Default Exports

```typescript
export default function main() {}
```

## Module Resolution

Configured via `tsconfig.json` with `moduleResolution`, `baseUrl`, and `paths`.

```typescript
// tsconfig.json\n// \"baseUrl\": \".\",\n// \"paths\": { \"@/*\": [\"src/*\"] }
```

Path mappings are a compile-time feature. Your runtime (Node, bundler) must be configured to understand them too.

## ESM vs CJS interop

TypeScript can emit ESM or CommonJS depending on `module`. `esModuleInterop` and `allowSyntheticDefaultImports` affect how default imports are interpreted from CommonJS modules.

```typescript
// With esModuleInterop
import express from 'express';
```

## Isolated modules

If you use `isolatedModules` (common in Babel/tsc transpile-only setups), avoid `const enum` and certain `namespace` patterns because each file must be independently transpileable.

## Interview Questions and Answers

### 1. Why use `import type`?

It avoids runtime imports and keeps types only in the type system.

### 2. What does `paths` in tsconfig do?

It defines module alias mappings for cleaner imports.
