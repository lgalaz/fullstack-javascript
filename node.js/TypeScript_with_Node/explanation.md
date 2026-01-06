# TypeScript with Node.js

## Introduction

TypeScript adds static typing, better tooling, and safer refactors. In Node.js, it is common for production services to be written in TypeScript.

## Minimal Setup

TypeScript requires a compiler and Node type definitions. `tsconfig.json` controls output module format, target JS version, and strictness.

Install dependencies:

```
npm install typescript @types/node --save-dev
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src"]
}
```

## Example: Simple Server

This example is a typed HTTP server. TypeScript checks your code at build time, then you run the compiled JavaScript output.

```typescript
// src/server.ts
import http from 'http';

const server = http.createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});

server.listen(3000, () => {
  console.log('Server running');
});
```

Build and run:

```
npx tsc
node dist/server.js
```

## Practical Guidance

- Use `@types/node` for accurate Node typings.
- Keep strict mode on for safer refactors.
- Align `module` output with your runtime (CJS vs. ESM).
