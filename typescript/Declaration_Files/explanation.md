# Declaration Files (.d.ts) - Comprehensive Study Guide

## Introduction

Declaration files describe the shape of JavaScript code for TypeScript. They allow you to type libraries without TS source.

They are "type-only" artifacts: no runtime behavior, just declarations the compiler uses to type-check consumers.

## Ambient Declarations

```typescript
// globals.d.ts
declare const VERSION: string;
```

Ambient declarations describe values that exist at runtime but are not defined in TS code.

```typescript
declare function analytics(event: string): void;
```

Why they exist: some values are injected by the runtime or build tooling (globals, env, framework hooks). Ambient declarations let you describe those values so TypeScript can type-check usage without importing anything.

When to use them:

- Global variables injected by build tools or bundlers
- Runtime globals in browsers or Node that are not in your `lib` config
- "Virtual" modules that are resolved at build time (e.g., CSS modules, SVG imports)

Ambient declarations live in the global scope. Overusing them can create name collisions or leak types into unrelated modules, so prefer module declarations when possible.

## Namespaces

```typescript
namespace parse {
  export const version = '1.0';
}
```

`namespace` creates a named scope so you can group related members and avoid global name collisions. Members must be exported to be accessible from outside the namespace, so you access them as `parse.version`.

Namespaces are mainly for global (non-module) code. In modern TypeScript with ES modules, prefer regular `export`/`import` across files instead of namespaces.

## Function and Namespace Merging

You can merge a function with a namespace to attach "static" helpers to the function value.

```typescript
function parse(input: string) {
  return JSON.parse(input);
}

namespace parse {
  export const version = '1.0';
}

parse.version;
```

What it is: the function creates a runtime value (`parse`), and the namespace merges onto that value at compile time, adding extra properties you can access as `parse.version`.

Scope: the namespace shares the same name and scope as the function, but only exported members are visible outside the namespace. It does not create a new runtime object by itself; it augments the existing function.

How to use it:

- Group related static metadata/helpers with a function while keeping a single entry point.
- Access members with `parse.<member>` after the function declaration.
- Prefer ES module exports for new code; use function+namespace merging mainly in global or legacy patterns.

## Module Declarations

```typescript
declare module 'legacy-lib' {
  export function run(input: string): number;
}
```

Module declarations are useful when a library has no built-in typings.

They can also declare non-TS imports (like `.svg` or `.css` modules) so TS understands their shape. These are files that a bundler lets you import directly (e.g., `import styles from './styles.module.css'` or `import Logo from './logo.svg'`) even though they are not TypeScript/JavaScript files.

You need declarations because TypeScript does not know what type those imports resolve to. For example, CSS modules are objects of class names, and SVGs might be URLs or React components depending on your bundler.

```typescript
// styles.module.css.d.ts
declare const classes: Record<string, string>;
export default classes;
```

```typescript
// svg.d.ts (component loader)
import * as React from 'react';
declare const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
export default ReactComponent;
```

## Generating Declarations

Enable `declaration: true` in `tsconfig.json` to emit `.d.ts` files.

These files allow your library consumers to get type safety without your source.

## Package typing entry points

In libraries, point to your typings with `types` in `package.json`.

```json
{
  "types": "dist/index.d.ts"
}
```

`typeRoots` and `types` in `tsconfig.json` control where TypeScript looks for global and package typings.

## Distribution

You typically ship `.d.ts` files alongside the compiled JavaScript (e.g., `dist/` contains `.js` and `.d.ts`). Consumers install your package and TypeScript picks up the types via the `types` field or by matching the file structure.

```json
{
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"]
}
```

## Common pitfalls

- Keep `.d.ts` in sync with JS behavior; mismatches create false safety.
- Avoid polluting the global scope in libraries; prefer module declarations.
- Use `export {}` in `.d.ts` if you want to make it a module instead of a global script.

## Best practices

- Generate `.d.ts` from TS source (`declaration: true`) instead of hand-writing when possible.
- Keep typings close to implementations and update them with code changes.
- Prefer module declarations over ambient globals to avoid name conflicts.
- Add type tests (e.g., `tsc` or `tsd` tests) for public APIs.

## Type tests (API contracts)

Type tests catch breaking changes in your public typings without running the code. Two common approaches:

1) Use `tsc --noEmit` against a test file that exercises your public API types.

```typescript
// types.test.ts
import { createUser } from './index';

const user = createUser({ name: 'Ada' });
user.id.toFixed();
// createUser({ name: 123 }); // should fail
```

2) Use `tsd` with `.test-d.ts` files for expectation-based tests.

```typescript
// index.test-d.ts
import { expectType } from 'tsd';
import { createUser } from './index';

expectType<{ id: number; name: string }>(createUser({ name: 'Ada' }));
```

## Interview Questions and Answers

### 1. What problem do declaration files solve in library distribution?

They let you ship type information alongside JavaScript so consumers get static typing without needing your TS source.

### 2. When would you prefer module declarations over ambient globals?

When typing imports (including non-TS assets) to avoid polluting the global namespace.

### 3. What are common failure modes with `.d.ts` files?

They can drift from runtime behavior, creating false safety. Global declarations can also cause name conflicts.

Example:

```typescript
// runtime.js (actual behavior)
export function parseCount(input) {
  return Number.parseInt(input, 10); // can return NaN
}

// types.d.ts (drifted types)
export function parseCount(input: string): number;

// app.ts (false safety)
import { parseCount } from './runtime';
const count = parseCount("oops");
count.toFixed(); // runtime crash if count is NaN
```

If you declare a global like `declare const Buffer: any;` in one package, another package that defines `Buffer` differently can conflict in the global namespace.
