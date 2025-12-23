# ESM vs CommonJS (CJS) 

## Introduction

JavaScript has two module systems in common use: ES Modules (ESM) and CommonJS (CJS). They have different syntax, loading behavior, and interop rules.

## Syntax and Loading

ESM (static, compile-time analyzable):

```javascript
import { readFile } from 'node:fs/promises';
export const version = '1.0';
```

CJS (dynamic, runtime evaluated):

```javascript
const { readFile } = require('node:fs/promises');
module.exports = { version: '1.0' };
```

ESM supports tree-shaking and top-level `await`, has static import/export that tooling can analyze, and aligns with the browser standard. CJS loads modules synchronously with `require`, allows conditional/dynamic requires, and is still common in older Node codebases.

## Interop: Importing CJS from ESM

```javascript
import pkg from 'some-cjs-package';
```

In ESM, a CJS default import maps to `module.exports`. Named imports only work if the CJS module sets them as properties on `module.exports` and your runtime/bundler supports synthetic named exports.

Note: "synthetic named exports" are a runtime/bundler feature that treats properties on `module.exports` as if they were real named exports, even though they do not exist as ESM exports in the module.

## Interop: Importing ESM from CJS

```javascript
const esm = await import('./esm-module.js');
```

CJS cannot `require()` ESM directly; you must use dynamic `import()` (async).

## Node.js Resolution Notes

- `.mjs` files are ESM, `.cjs` files are CJS.
- `.js` is ESM or CJS based on `"type"` in `package.json` (`"module"` for ESM, `"commonjs"` for CJS).

## Common Pitfalls

- Default vs named export mismatches (`module.exports` vs `export default`).
- Mixing module types without understanding async import requirements.
- Relying on bundler-specific interop that differs from Node.
