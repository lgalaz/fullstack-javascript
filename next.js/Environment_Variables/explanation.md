# Environment Variables 

## Introduction

Next.js supports environment variables via `.env` files and `process.env`.

## Server vs Client

- Server-only variables: any name (not exposed to the browser)
- Client-exposed variables must start with `NEXT_PUBLIC_` (they are inlined into the client bundle at build time)

```javascript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

Bad practice: putting secrets in `NEXT_PUBLIC_` variables exposes them to the browser.

```javascript
// BAD: this will be bundled into client code
const secret = process.env.NEXT_PUBLIC_SECRET_KEY;
```

## Files

- `.env.local` for local dev (not committed)
- `.env.production` for production (typically not committed if it contains secrets)
- Common convention: commit a `.env.example` template (not required by Next.js, but widely used)

Load order (highest priority wins):
- `.env.local`
- `.env.[environment]` (e.g., `.env.production`)
- `.env`

## Runtime Usage

Environment variables are inlined at build time for client bundles, so changes require rebuilds.

On the server, variables are read at runtime. Keep secrets server-only and never expose them via `NEXT_PUBLIC_`.

Example server-only usage:

```javascript
const dbUrl = process.env.DATABASE_URL;
```

You can also inline values at build time via `next.config.js`:

```javascript
// next.config.js
module.exports = {
  env: {
    BUILD_TIME_FLAG: 'true'
  }
};
```
