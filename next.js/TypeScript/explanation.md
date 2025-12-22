# TypeScript in Next.js - Comprehensive Study Guide

## Introduction

Next.js has first-class TypeScript support. It generates `tsconfig.json` and `next-env.d.ts` automatically.

## Server Component Types

```javascript
export default function Page({ params, searchParams }) {
  return <pre>{JSON.stringify({ params, searchParams }, null, 2)}</pre>;
}
```

## Route Handler Types

```javascript
export async function GET(request) {
  return Response.json({ ok: true });
}
```

## Shared Types

Place shared types in `types/` or `lib/` and import across server and client code.

## Interview Questions and Answers

### 1. How does Next.js enable TypeScript?

On first run, it detects TypeScript and creates the config files automatically.

### 2. Why avoid using `any` in Next.js apps?

It removes type safety and hides runtime errors in server and client code.
