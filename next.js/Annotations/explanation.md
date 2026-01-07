# Annotations

## Introduction

Next.js does not add its own annotation system. In JavaScript, annotations are usually JSDoc comments or runtime metadata on functions. In TypeScript, annotations are just standard type annotations.

## JSDoc in Next.js

```javascript
/**
 * @param {{ params: { id: string } }} ctx
 */
export async function generateMetadata(ctx) {
  return { title: `User ${ctx.params.id}` };
}
```

## TypeScript Annotations

```typescript
type Params = { id: string };

type PageProps = { params: Params };

export default function Page({ params }: PageProps) {
  return <div>User {params.id}</div>;
}
```

## Metadata via Exported Config

```javascript
export const revalidate = 60;
export const dynamic = 'force-dynamic';
```

These are configuration exports, not annotations, but they are a common way to attach metadata in Next.js.

## When Annotations Are a Good Idea

- You want stronger tooling for route props and data shapes.
- You want to document public modules without converting everything to TypeScript.

## When to Avoid

- The annotations become a substitute for proper types or tests.
