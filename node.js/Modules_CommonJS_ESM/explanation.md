# Modules in Node.js: CommonJS and ES Modules

## Introduction

Node.js supports two module systems:
- CommonJS (CJS): `require`, `module.exports`.
- ES Modules (ESM): `import`, `export`.

Understanding how they load, how they interop, and how resolution works avoids subtle production errors.

## Key Differences

- CJS loads synchronously and can be conditionally required.
- ESM loads asynchronously, supports static analysis, and enables tree-shaking.
- The module type is determined by file extension (`.mjs`, `.cjs`) or `package.json` `"type"` field.

## Choosing a Module System

- Use ESM for modern codebases, native `import`, and better tooling.
- Use CJS when you rely on older tooling or libraries that are CJS-only.
- In mixed environments, be explicit with extensions and interop patterns.

## Example: CommonJS Module

CommonJS uses `require` to load modules at runtime and `module.exports` to expose values. It is synchronous and allows conditional loading.

```javascript
// math.cjs
function add(a, b) {
  return a + b;
}

module.exports = { add };
```

```javascript
// app.cjs
const { add } = require('./math.cjs');

console.log(add(2, 3));
```

## Example: ES Module

ESM uses static `import`/`export` statements that can be analyzed by tooling and loaded asynchronously by the runtime.

```javascript
// math.mjs
export function add(a, b) {
  return a + b;
}
```

```javascript
// app.mjs
import { add } from './math.mjs';

console.log(add(2, 3));
```

## Interop Patterns

### Importing CJS from ESM

When an ESM file imports a CJS module, Node treats the CJS `module.exports` as the default export.

```javascript
// app.mjs
import cjsModule from './math.cjs';

console.log(cjsModule.add(2, 3));
```

### Importing ESM from CJS

CommonJS cannot use `import` at top-level. Instead, use dynamic `import()` which returns a promise.

```javascript
// app.cjs
(async () => {
  const esmModule = await import('./math.mjs');
  console.log(esmModule.add(2, 3));
})();
```

## Resolution Rules (Simplified)

- Relative paths must include extensions in ESM: `./math.mjs`.
- Package entry points use `package.json` fields like `"exports"` and `"main"`.
- The `"exports"` map can restrict or expose specific subpaths.

## Practical Guidance

- Prefer ESM for new code, but be consistent across a repo.
- Use `package.json` `"type": "module"` to make `.js` ESM by default.
- Avoid deep imports into node_modules without checking `"exports"`.
