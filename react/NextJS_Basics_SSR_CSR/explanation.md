# Next.js Basics (SSR vs CSR) 

## Introduction

Next.js is a meta-framework (a framework over a framework) built on React. It adds routing, data fetching, and rendering strategies. The key rendering modes are CSR, SSR, SSG, and ISR. The first things that jump out are faster initial loads, SEO-friendly pages, and file-based routing. Also it has a unified full-stack model (UI + server logic in one codebase for BFF‑style needs: form handlers, lightweight CRUD, auth/session plumbing, and app‑specific endpoints close to the UI), built-in caching and streaming, strong conventions that scale teams, and production-ready tooling that standardizes performance and deployment.

Meta-frameworks add architecture by defining where and when code runs, conventions by enforcing file-based structure and implicit behavior, and runtime capabilities like SSR, streaming, and caching. If you don’t need those capabilities, the added constraints can outweigh the benefits.

In Next.js, rendering strategy is an emergent property of your data-fetching and caching choices, not a global switch.

Note: Props from Server Components to Client Components must be serializable because they cross a network boundary. In practice this means JSON-serializable data only — no functions, class instances, symbols, or non-data values.

## React Server Components (RSC)

React Server Components are React components that run only on the server. They are rendered on the server, and their result is streamed to the browser as a lightweight description of the UI, not as executable JavaScript for those components. This reduces the amount of JavaScript the browser needs to download and run.

Key ideas, from first principles:
- A component is a reusable function that returns UI.
- "Server" means code runs on the machine that hosts your app, not in the user's browser.
- "Client" means code runs in the user's browser and can handle clicks, form input, and other interactions.

What this means in practice:
- Server Components can read from databases, files, or private APIs directly because they run on the server.
- Server Components cannot use browser-only APIs like `window` or `document`, and they cannot attach event handlers.
- For interactivity (clicks, input), you use Client Components, which run in the browser.
- A page can mix Server and Client Components; the server renders the non-interactive parts, and the client hydrates the interactive parts.

```javascript
// Server Component (default)
import ClientWidget from './ClientWidget';

export default async function Page() {
  const data = await getServerData(); // DB, filesystem, etc.

  return <ClientWidget data={data} />;
}
```

RSC is a React capability, and frameworks like Next.js provide the tooling and defaults that make it practical to use.

Example (a simple Server Component):

```jsx
// app/products/page.jsx
import { db } from "@/lib/db";

export default async function ProductsPage() {
  const products = await db.products.findMany();

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

Note: Server Components can be `async` so they can `await` data on the server before rendering, and Next.js can stream the HTML as data resolves (often with `Suspense` boundaries).

## CSR (Client-Side Rendering)

Meaning: the browser downloads a JS bundle and renders the UI on the client.

Pros: fast subsequent navigation, rich interactivity.
Cons: slower initial render, SEO challenges if no pre-render.

## SSR (Server-Side Rendering)

Meaning: render HTML on the server for every request, then hydrate on the client.

Pros: better SEO, faster first contentful paint.
Cons: more server load, slower TTFB if data is slow.

SSR still hydrates on the client. The server sends HTML, and the client attaches event handlers during hydration (React matches the server-rendered HTML to its virtual tree and makes it interactive without re-rendering everything).

## Pages Router data fetching (getStaticProps / getServerSideProps)

These APIs are for the legacy Pages Router (`pages/`). They can only be exported from a page file and must return serializable `props`.

Use `getStaticProps` for build-time generation (SSG) and optional revalidation (ISR):

```javascript
// pages/blog.js
export async function getStaticProps() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());

  return {
    props: { posts },
    revalidate: 60, // ISR: re-generate in the background at most once per minute
  };
}

export default function Blog({ posts }) {

  return posts.map(p => <div key={p.id}>{p.title}</div>);
}
```

Use `getServerSideProps` for per-request data (auth, headers, geo, A/B, etc.):

```javascript
// pages/profile.js
export async function getServerSideProps({ req }) {
  const profile = await fetch('https://api.example.com/me', {
    headers: { cookie: req.headers.cookie ?? '' },
  }).then(r => r.json());

  return { props: { profile } };
}

export default function Profile({ profile }) {

  return <div>{profile.name}</div>;
}
```

## Streams, Streaming SSR, and Suspense

Streaming means the server sends HTML in chunks as soon as each part is ready, instead of waiting for the full page. In React, streaming SSR is enabled with `renderToPipeableStream` (Node) or `renderToReadableStream` (Web Streams), which progressively flush HTML to the client.

Suspense ties directly into streaming: a `Suspense` boundary tells React where it can pause and send a fallback while the real content is still loading. As data resolves, the server streams the completed HTML for that boundary without blocking the rest of the page.

This pairs naturally with partial hydration in frameworks like Next.js: the server streams HTML for fast first paint, and the client hydrates only interactive islands or Client Components when their code is ready. Suspense coordinates both the server streaming and the client hydration timing.

## SSG (Static Site Generation)

Meaning: render HTML at build time and serve the same file for every request.

Pros: very fast, cached on CDN.
Cons: content is fixed until rebuild.

## ISR (Incremental Static Regeneration)

Meaning: start with static HTML, then revalidate and rebuild pages in the background on a schedule or trigger.

ISR combines static delivery with background revalidation so you avoid full rebuilds.

## Choosing a Strategy

- Use SSR for personalized or frequently changing content.
- Use SSG/ISR for marketing pages and content-driven sites.
- Use CSR for highly interactive, user-specific dashboards.