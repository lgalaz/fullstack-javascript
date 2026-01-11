1) App Router mental model

Interviewer: You join a team migrating from Pages Router to App Router. What’s the core mental model change?

Candidate:
Pages Router is “route = page component + data fetching function” (SSR/SSG/ISR) and everything is basically React on the client plus server rendering hooks.
In the Pages Router, a route is defined by a page component plus optional data-fetching functions, and those functions determine whether the page is SSR, SSG, or ISR.
App Router is “route = a tree of Server Components by default,” where you compose layouts, segments, loading/error boundaries, and choose where code runs (server vs client) explicitly. Data fetching is no longer special Next functions; it’s “fetch on the server by default,” with caching/revalidation semantics on fetch and segment level. You think in terms of rendering boundaries, streaming, and cache invalidation, not just “getServerSideProps vs getStaticProps”.

2) Server Components vs Client Components boundaries

Interviewer: Explain how you decide what is a Server Component vs Client Component, and the common mistakes.

Candidate:
Default: Server Component. I only mark "use client" when I need browser-only capabilities: stateful interactivity (useState/useEffect), event handlers, browser APIs, refs, certain client-only libs.

Common mistakes:

Making huge component subtrees client because of one button → instead isolate the interactive leaf and pass data down as props.

Importing server-only modules (fs, server secrets) into client components or shared modules used by client components.

Forgetting that Client Components can’t directly import Server Components; you pass Server Component output as children/props patterns.

Overusing client-side fetching when server can fetch once and stream HTML.

3) Data fetching, caching, and revalidation

Interviewer: In App Router, what determines whether fetch() is cached? How do you implement ISR-like behavior now?

Candidate:
Caching is driven by:

fetch options (cache, next: { revalidate, tags })

whether the route is considered static or dynamic (e.g., reading cookies/headers/searchParams can make it dynamic)

segment config like export const revalidate = ... or dynamic = 'force-dynamic'.

ISR-like behavior is revalidate:

Per-request caching: fetch(url, { next: { revalidate: 60 }})

Or segment-level: export const revalidate = 60 for the route.
Then you can invalidate via on-demand revalidation with tags:

fetch(..., { next: { tags: ['post:123'] } })

Later revalidateTag('post:123') in a server action/route handler after publishing.

Interviewer: How do you "precache" a subset of dynamic routes like blog posts?

Candidate:
Use generateStaticParams in the dynamic segment to pre-render specific entries at build time, then layer ISR/revalidation for freshness.
Example (app/posts/[id]/page.tsx):
```tsx
export async function generateStaticParams() {
  const posts = await fetch('https://example.com/api/posts').then((res) => res.json());
  return posts.slice(0, 20).map((post: { id: number }) => ({
    id: post.id.toString(),
  }));
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await fetch(`https://example.com/api/posts/${params.id}`).then((res) => res.json());
  return <article>{post.title}</article>;
}
```

4) Dynamic rendering triggers

Interviewer: What are the most common reasons a route unexpectedly becomes dynamic, and how do you debug it?

Candidate:
Triggers:

- Reading cookies(), headers(), draftMode()
- Using searchParams in certain ways (often forces dynamic rendering depending on usage)
- fetch with cache: 'no-store'
- Using export const dynamic = 'force-dynamic' explicitly (or a dependency doing dynamic things)

Debug:

- Inspect route output in build logs (static vs dynamic)
- Search for cookies(), headers(), no-store
- Confirm fetch settings
- Use minimal reproduction: comment out suspected code and see if it becomes static again

Verify segment configs (dynamic, revalidate) and middleware effects

5) Streaming and loading.tsx

Interviewer: How does streaming work in App Router, and what does loading.tsx actually do?

Candidate:
App Router can stream HTML progressively as server work completes. loading.tsx provides an instant fallback UI for a segment while the server is still producing the real UI (often waiting for data). It’s like a built-in Suspense boundary for that route segment.
You get faster perceived performance: shell renders quickly; slow parts fill in later. You can also compose streaming boundaries via nested layouts/segments.

6) Error handling: error.tsx vs not-found.tsx

Interviewer: Compare error.tsx, not-found.tsx, and global-error.tsx. When do you use each?

Candidate:

not-found.tsx: for 404s — either returned by notFound() or unmatched routes. It’s not a “crash,” it’s a deliberate “resource missing.”

error.tsx: per-segment error boundary UI for runtime errors thrown during rendering/data fetching in that segment. It resets with reset() typically.
Example:
```tsx
'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button type="button" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
```

global-error.tsx: last-resort top-level error UI (e.g. root layout issues). Use sparingly; prefer segment error.tsx so failures are isolated.

7) Route Handlers vs Server Actions vs “real backend”

Interviewer: Where’s the boundary? When is a Server Action enough vs a Route Handler vs a separate API service?

Candidate:

Server Actions: best for UI-driven mutations tightly coupled to a page: form submissions, simple CRUD, validated on server, returns typed results, avoids extra client fetch boilerplate.

Route Handlers: best when you need a conventional HTTP API surface: used by multiple pages, external clients, webhooks, file streaming, non-form clients, or when you need custom methods/headers/caching.

Separate backend: when you have multiple consumers (mobile, partners), long-lived processes (queues, websockets), complex domain services, independent scaling/governance, or you want a stable API boundary across multiple frontends.

8) Middleware: what it’s good for and what it’s not

Interviewer: What do you use middleware for, and what are the footguns?

Candidate:
Good for:

- Authentication/authorization gates (lightweight)
- Redirects/rewrites, locale handling, A/B routing
- Setting headers/cookies (careful)

Footguns:

- It runs on many requests; keep it fast.
- Limited runtime APIs (edge constraints depending on setup).
- Over-fetching in middleware can kill performance.

Middleware can inadvertently make routes dynamic or complicate caching assumptions.

9) Images, fonts, scripts

Interviewer: Give me an overview of next/image, next/font, and next/script—what problems they solve.

Candidate:

- next/image: automatic responsive sizing, lazy loading, optimization pipeline, helps CLS/LCP when used correctly (width/height or fill with proper container sizing).
- next/font: self-hosts fonts by default, avoids layout shift from late font loading, generates optimized CSS, integrates with build for consistent preloading behavior.
- next/script: controls script loading strategy (beforeInteractive, afterInteractive, lazyOnload) so you don’t nuke performance or block rendering.
  - beforeInteractive: runs before hydration; only for must-run early scripts (rare).
  - afterInteractive: default; loads once the page is interactive and hydration has begun.
  - lazyOnload: waits until window load; lowest priority (analytics/widgets).

10) SEO and Metadata API

Interviewer: How do you handle metadata in App Router for dynamic routes? What’s the difference between static and dynamic metadata?

Candidate:
Use export const metadata for static metadata. For dynamic, implement generateMetadata({ params }) and fetch the resource title/description server-side.
The key is: metadata generation runs on server, and should align with caching/revalidation strategy so you don’t fetch on every request unnecessarily. Also: handle not-found cases (if post doesn’t exist) by calling notFound() in generateMetadata or returning safe fallback metadata, and avoid leaking private data into metadata.

11) Authentication in Next.js

Interviewer: What’s your approach to auth in App Router, and how do you protect server-only secrets?

Candidate:
Auth is best enforced server-side: in middleware for coarse gating + in server components/actions/route handlers for the real enforcement.
Secrets live in server-only env vars and are only referenced in server-only modules. I structure code so the client never imports a module that touches secrets (avoid “shared utils” importing server-only libs). Also, use secure cookies, rotate tokens, and validate sessions on the server.

12) Performance: what do you measure and what do you optimize in Next specifically?

Interviewer: Next.js-specific performance levers—what do you actually do in practice?

Candidate:

- Prefer Server Components for data-heavy pages to reduce client JS.
- Stream with segment boundaries (loading.tsx) for perceived performance.
- Use caching + tags correctly to avoid re-fetching on every request.
- Use next/image and correct sizing to reduce CLS/LCP regressions.
  Example next.config.js:
  ```js
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    images: {
      deviceSizes: [360, 768, 1024, 1440, 1920],
      imageSizes: [40, 48, 64, 80, 96, 128],
      // Pair with <Image sizes="(max-width: 768px) 40px, (max-width: 1024px) 64px, 96px" /> for avatar breakpoints.
      formats: ['image/avif', 'image/webp'],
      remotePatterns: [
        { protocol: 'https', hostname: 'images.example.com' },
      ],
    },
  };

  module.exports = nextConfig;
  ```
- Control third-party scripts with next/script strategies.
- Avoid accidental dynamic routes when static would do.
- Check bundle output (route-level JS), watch for a single "use client" pulling big deps.
- Instrument: Web Vitals (LCP/INP/CLS), server timings, and Next logs for cache hits/misses.

13) Deployment and runtime choices

Interviewer: Edge runtime vs Node runtime—how do you choose?

Candidate:
Edge: great for low-latency, geo-distributed, lightweight logic (redirects, auth gates, simple API). Constraints: limited Node APIs, some libs don’t work.
Node: full compatibility (ORMs, crypto libs, file ops, heavy transforms). I choose Node for anything that needs richer dependencies or compute; Edge for fast request shaping.

14) Migration strategy from Pages Router

Interviewer: You have a big Pages Router app. What’s your migration plan that minimizes risk?

Candidate:
Incremental:

- Keep Pages Router running, add App Router alongside where possible.
- Start with non-critical routes and shared layouts.
- Identify data fetching patterns (GSSP/GSP) and map to server fetch + revalidate.
- Create a consistent auth pattern (middleware + server enforcement).
- Audit client bundles to avoid ballooning with "use client".
- Ensure analytics, error reporting, and caching behavior are correct before moving high-traffic routes.
- Note: if the same route exists in both /app and /pages, App Router wins. To A/B test, create a parallel path (e.g., /new or /app-variant) and use rewrites/middleware flags or a subdomain to split traffic, then cut over once stable.

