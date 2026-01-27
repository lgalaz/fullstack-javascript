# Deployment and Caching 

## Introduction

Next.js apps are commonly deployed on Vercel, but can run on any Node or edge-compatible platform (for example, Node hosts like AWS EC2, Heroku, Render, or DigitalOcean; edge hosts like Cloudflare Workers, Vercel Edge, Netlify Edge, or Fastly Compute@Edge). Vercel is the company behind Next.js and provides a managed hosting platform with built-in CI/CD, CDN, and edge functions. An edge-compatible platform is one that supports running code at the network edge (close to users) using the Edge Runtime/Web APIs, not just a traditional Node server. Edge Runtime/Web APIs are the browser-like standard APIs (such as `fetch`, `Request`, `Response`, and `Headers`) available in edge environments, even though the code runs on the server. 

Caching strategy impacts performance and cost.

## Output Targets

- Node runtime for server rendering and route handlers
- Edge runtime for low-latency middleware and handlers
- Static export for fully static sites (`next export`)

Example (static export workflow):

```bash
npm run build
npx next export
# Output goes to the `out/` folder for static hosting.
```

Note: static export writes pre-rendered HTML for routes, plus JS/CSS bundles and assets (including `public/`), not just the `public/` folder.

Node runtime runs on a traditional Node.js server, giving full access to Node APIs (filesystem, native modules). Native modules are Node add-ons compiled for the host OS/CPU (for example, `bcrypt`, `sharp`, `sqlite3`, `canvas`), and the Node runtime is best for heavier server-side work. Edge runtime runs on distributed edge locations with the Web API surface, offering lower latency but fewer APIs and stricter limits, ideal for lightweight middleware and fast request handling.

Note: Edge runtime executes in a hosting provider's edge worker environment (not your Node web server process). In local dev, Next.js simulates the Edge Runtime for compatibility, but a real edge environment requires deploying to an edge-capable host or using provider-specific dev tools.

## Caching Layers

- CDN caching for static assets
- Server `fetch` caching for data
- ISR for background revalidation

Cache headers should align with your data freshness requirements. For static assets, long `max-age` with `immutable` is common. `max-age` tells caches how many seconds a response can be reused without revalidation; after it expires, caches must revalidate (and `must-revalidate` makes that requirement explicit). `immutable` tells the browser the asset will never change, so it can skip revalidation for the lifetime of the cache. CDN (content delivery network) caching means edge servers can serve assets closer to users.

```javascript
return new Response(body, {
  headers: {
    'Cache-Control': 'public, max-age=31536000, immutable'
  }
});
```

Bad practice: disabling caching for static assets increases latency and origin load.

```javascript
return new Response(body, {
  headers: {
    'Cache-Control': 'no-store'
  }
});
```

## Headers

You can set cache headers in route handlers or `next.config.js`.

Route handler example:

```javascript
// app/api/status/route.js
export async function GET() {

  return new Response('ok', {
    headers: {
      'Cache-Control': 'public, max-age=60'
    }
  });
}
```

`next.config.js` example:

```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
```

## Standalone output (self-hosting)

For Docker or minimal Node deployments, use `output: 'standalone'`:

```javascript
// next.config.js
module.exports = {
  output: 'standalone'
};
```

This creates a minimal `.next/standalone` bundle with only the files the server needs.

## Image optimization note

`next/image` optimization requires a server runtime. If you deploy fully static (`next export`), use a CDN image loader or disable optimization.

## Interview Questions and Answers

### 1. What is ISR (Incremental Static Regeneration) used for?

Refreshing static content without rebuilding the entire site.

### 2. Why is CDN caching important?

It reduces latency and offloads traffic from your origin.
