# TypeScript in Next.js 

## Introduction

Next.js has first-class TypeScript support. It generates `tsconfig.json` and `next-env.d.ts` automatically.

## Server Component Types

```javascript
export default function Page({ params, searchParams }) {
  return <pre>{JSON.stringify({ params, searchParams }, null, 2)}</pre>;
}
```

You can type these props explicitly for better tooling.

```typescript
type PageProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function Page({ params }: PageProps) {
  return <div>{params.id}</div>;
}
```

## Route Handler Types

```javascript
export async function GET(request) {
  return Response.json({ ok: true });
}
```

Use `NextRequest` when you need cookies, headers, or URL utilities.

```typescript
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  return Response.json({ id });
}
```

## Shared Types

Place shared types in `types/` or `lib/` and import across server and client code.

## Interview Questions and Answers

### 1. How does Next.js enable TypeScript?

On first run, it detects TypeScript and creates the config files automatically.

### 2. Why avoid using `any` in Next.js apps?

It removes type safety and hides runtime errors in server and client code.
