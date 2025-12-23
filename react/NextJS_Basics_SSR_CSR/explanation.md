# Next.js Basics (SSR vs CSR) 

## Introduction

Next.js is a React framework that adds routing, data fetching, and rendering strategies. The key rendering modes are CSR, SSR, SSG, and ISR.

## CSR (Client-Side Rendering)

Meaning: the browser downloads a JS bundle and renders the UI on the client.

Pros: fast subsequent navigation, rich interactivity.
Cons: slower initial render, SEO challenges if no pre-render.

## SSR (Server-Side Rendering)

Meaning: render HTML on the server for every request, then hydrate on the client.

Pros: better SEO, faster first contentful paint.
Cons: more server load, slower TTFB if data is slow.

SSR still hydrates on the client. The server sends HTML, and the client attaches event handlers during hydration (React matches the server-rendered HTML to its virtual tree and makes it interactive without re-rendering everything).

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

## Interview Questions and Answers

### 1. What is the difference between SSR and CSR?

SSR renders HTML on the server per request, while CSR renders in the browser after JS loads.

### 2. When is SSG a good choice?

For content that changes infrequently and benefits from fast, cached delivery.
