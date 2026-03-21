# Modules in Node.js: CommonJS and ES Modules

## What matters

- CommonJS uses `require` / `module.exports`.
- ESM uses `import` / `export`.
- Modern Node projects should prefer ESM unless tooling or dependencies force CJS.

## Interview points

- File type is controlled by `.mjs`, `.cjs`, or `package.json` `"type"`.
- ESM is statically analyzable and matches browser/module tooling better.
- CJS loads synchronously and is still common in older Node codebases.
- Interop is the pain point: CJS importing ESM usually needs dynamic `import()`.

### Interop example

```javascript
// math.mjs (ESM)
export function add(a, b) {
  return a + b;
}
```

```javascript
// app.cjs (CommonJS)
async function main() {
  // This usually fails for an ESM-only module:
  // const math = require('./math.mjs');

  // Dynamic import() is the usual CJS -> ESM bridge.
  const math = await import('./math.mjs');
  console.log(math.add(2, 3));
}

main().catch(console.error);
```

## Senior notes

- Be consistent inside one repo.
- In ESM, include file extensions in relative imports.
- Understand `"exports"` in `package.json`; deep imports may break if they are not exposed.

## Example

```javascript
// CommonJS
const fs = require('fs');

// ESM
import fs from 'fs';
```
