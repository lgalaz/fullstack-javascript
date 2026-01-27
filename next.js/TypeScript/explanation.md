# TypeScript in Next.js 

## Introduction

Next.js has first-class TypeScript support. It generates `tsconfig.json` and `next-env.d.ts` automatically.

Note: `next-env.d.ts` is an auto-generated TypeScript declaration file that includes Next.js types and JSX settings. You typically do not edit it; it just needs to exist for TS to recognize Next.js globals.

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

Bad practice: using `any` for page props.

```typescript
export default function Page(props: any) {

  return <div>{props.params.id}</div>;
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

Example with typed response:

```typescript
type User = { id: string; name: string };

export async function GET(): Promise<Response> {
  const user: User = { id: '1', name: 'Ada' };

  return Response.json(user);
}
```

## Metadata typing

Use the `Metadata` type when defining page metadata:

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Docs',
  description: 'API docs'
};
```

## Shared Types

Shared types are types you import in both server and client components (or route handlers). You can place them in `types/`, `lib/`, or any folder you prefer; the important part is keeping the file free of server-only or browser-only code so it can be safely imported on both sides.

```typescript
// types/user.ts (shared across server and client)
export type User = {
  id: string;
  name: string;
};

// app/users/page.tsx (server component)
import type { User } from '@/types/user';

async function getUsers(): Promise<User[]> {

  return [{ id: '1', name: 'Ada' }];
}

// app/users/UserList.tsx (client component)
'use client';
import type { User } from '@/types/user';

export default function UserList({ users }: { users: User[] }) {

  return users.map(user => <div key={user.id}>{user.name}</div>);
}
```

## Interview Questions and Answers

### 1. How does Next.js enable TypeScript?

On first run, Next.js detects TypeScript (e.g., a `tsconfig.json` or `.ts/.tsx` files), installs type packages if needed, and scaffolds `tsconfig.json` plus `next-env.d.ts` so the app compiles with proper Next.js types.

### 2. Why avoid using `any` in Next.js apps?

`any` erases contracts between layers, disables useful compiler checks, and lets invalid data flow across server/client boundaries and route handlers. In a Next.js app this increases the risk of runtime errors, bad API assumptions, and weaker refactors, especially when props and serialized data are involved.
