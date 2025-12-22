# Environment Variables - Comprehensive Study Guide

## Introduction

Next.js supports environment variables via `.env` files and `process.env`.

## Server vs Client

- Server-only variables: any name (not exposed to the browser)
- Client-exposed variables must start with `NEXT_PUBLIC_`

```javascript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## Files

- `.env.local` for local dev (not committed)
- `.env.production` for production

## Runtime Usage

Environment variables are inlined at build time for client bundles, so changes require rebuilds.

On the server, variables are read at runtime. Keep secrets server-only and never expose them via `NEXT_PUBLIC_`.

## Interview Questions and Answers

### 1. How do you expose an env var to the client?

Prefix it with `NEXT_PUBLIC_`.

### 2. Are env vars available at runtime on the client?

They are baked into the build; changes require a rebuild.
