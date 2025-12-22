# Next.js Basics (SSR vs CSR) - Comprehensive Study Guide

## Introduction

Next.js is a React framework that adds routing, data fetching, and rendering strategies. The key rendering modes are CSR, SSR, SSG, and ISR.

## CSR (Client-Side Rendering)

The browser downloads a JS bundle and renders the UI on the client.

Pros: fast subsequent navigation, rich interactivity.
Cons: slower initial render, SEO challenges if no pre-render.

## SSR (Server-Side Rendering)

The server renders HTML per request.

Pros: better SEO, faster first contentful paint.
Cons: more server load, slower TTFB if data is slow.

## SSG (Static Site Generation)

Pages are generated at build time.

Pros: very fast, cached on CDN.
Cons: content is fixed until rebuild.

## ISR (Incremental Static Regeneration)

Pages are generated at build time but can be updated on a schedule.

## Choosing a Strategy

- Use SSR for personalized or frequently changing content.
- Use SSG/ISR for marketing pages and content-driven sites.
- Use CSR for highly interactive, user-specific dashboards.

## Interview Questions and Answers

### 1. What is the difference between SSR and CSR?

SSR renders HTML on the server per request, while CSR renders in the browser after JS loads.

### 2. When is SSG a good choice?

For content that changes infrequently and benefits from fast, cached delivery.
