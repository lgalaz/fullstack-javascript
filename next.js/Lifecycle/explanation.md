# Next.js Lifecycle

## Introduction

This folder explains the full lifecycle of a Next.js app: how you set it up, how it starts, what it reads, how it builds, and how it serves a response. Every term is defined as it appears.

## Core Terms (Quick Definitions)

- **Node.js**: A runtime that executes JavaScript outside the browser. Next.js runs on Node.js.
- **Package manager**: A tool that downloads and runs dependencies. Common ones are `npm`, `yarn`, and `pnpm`.
- **CLI (Command Line Interface)**: A text-based program you run in a terminal, such as `npx` or `next`.
- **Dependency**: A third-party library your project uses (for example, `react` or `next`).
- **Dev server**: A local server used during development that watches files and updates quickly.
- **Build**: A production-ready version of your app, created by compiling and bundling code.
- **Compile**: Transform source code into a form that can run. In Next.js, this includes TypeScript to JavaScript.
- **Bundle**: Combine multiple files into fewer files for efficient loading.
- **Render**: Turn components into HTML output.
- **Hydration**: The browser attaches interactivity to server-rendered HTML.
- **Request**: A message from a browser or API client asking the server for a page or data.
- **Response**: The server's reply to a request (HTML, JSON, or other content).

## Setup: What You Need

1. **Install Node.js**
   - Next.js runs on Node.js. Without it, the `next` CLI cannot start.
2. **Choose a package manager**
   - Use `npm` (bundled with Node.js) or install `yarn` or `pnpm`.
3. **Create a new project**
   - Example command (CLI): `npx create-next-app`.
   - This creates the folder structure and installs dependencies.

## Project Structure (What Next.js Reads)

Next.js looks for specific files and folders when it starts.

- **`package.json`**: Lists dependencies and scripts like `dev`, `build`, and `start`.
- **`next.config.js`**: Optional configuration file for Next.js behavior.
- **`app/`**: The App Router (modern default) with file-based routing.
- **`pages/`**: The Pages Router (older routing system).
- **`public/`**: Static files served as-is (images, icons, robots.txt).

If both `app/` and `pages/` exist, Next.js can support both routing systems, but they are separate trees.

There is no single React entry point file like `index.js` in a plain React app. Next.js uses file-based routing: in the App Router the entry is `app/page.js` (or `app/layout.js` for shared root layout), and in the Pages Router it is `pages/index.js`.

Example:

```javascript
// app/page.js
export default function Home() {

  return <h1>Home</h1>;
}
```

## Route Collisions (Same URL in Both Routers)

If the same URL path is defined in both routers (for example `app/about/page.js` and `pages/about.js`), Next.js treats it as a conflict. The dev server and the build process will throw a route collision error because they cannot decide which file should own that path. The fix is to keep that URL in only one router.

## Development Lifecycle (Local Work)

This is what happens when you run the dev server (usually `npm run dev`).

1. **Read configuration**
   - Next.js loads `next.config.js` and checks `package.json` for settings and scripts.
2. **Scan the file system**
   - It detects routes by reading `app/` or `pages/`.
3. **Start the dev server**
   - A local server opens, usually on `http://localhost:3000`.
4. **Compile on demand**
   - Files are compiled when they are first requested. This is called "on-demand compilation."
5. **Watch for file changes**
   - The dev server listens for changes and recompiles only what changed.
6. **Send responses**
   - When a request comes in, Next.js renders the page and returns HTML (and JS if needed).

## File Watchers and Hot Reloading

When the dev server is running, it uses file-system watchers to detect changes. The watcher listens to OS-level file change events and tells Next.js which files changed:

- **macOS**: FSEvents
- **Linux**: inotify
- **Windows**: ReadDirectoryChangesW

If OS events are unreliable (for example on networked file systems), the watcher falls back to polling, which checks for changes at intervals.

Common dev-time watcher errors you might see while hot reloading (especially on macOS) include:
- `ENOSPC: System limit for number of file watchers reached` (too many files; increase watcher limits or reduce watched paths).
- `EMFILE: too many open files` (OS file descriptor limit).
- `FSEvents unavailable` or `watchman`/`chokidar` fallback messages (watcher backend issues).
- HMR compile errors (syntax/type errors) that appear after saving a file and prevent hot reload until fixed.

When a change is detected:

1. **Invalidate cached modules**
   - Next.js marks the changed files and any files that depend on them as stale.
2. **Recompile only the affected parts**
   - This is an incremental rebuild, not a full rebuild.
3. **Update the browser**
   - Next.js uses Hot Module Replacement (HMR) to swap only the changed code.

Important terms:

- **Live reload**: Refreshes the whole page after a change.
- **Hot Module Replacement (HMR)**: Replaces only the changed modules without a full refresh.
- **Fast Refresh**: Next.js and React's HMR system that tries to preserve component state.

## Production Build Lifecycle (Creating the Build)

This is what happens when you run `npm run build`.

1. **Read configuration and routes**
   - Next.js loads config and identifies all routes.
2. **Compile and bundle**
   - TypeScript (if used) becomes JavaScript.
   - JavaScript is bundled for server and client.
3. **Pre-render pages**
   - Static routes are rendered to HTML at build time.
4. **Write build output**
   - Output is stored in `.next/`, the build directory. This is Next.js' default build folder (similar to `dist` in other tools) and holds framework-specific artifacts like server bundles, client assets, manifests, and any generated source maps.

## Production Runtime (Serving Users)

This is what happens when you run `npm run start`.

1. **Start the Next.js server**
   - This starts a Node.js process that runs Next.js and loads the build output from `.next/`. In production you either run this yourself (often behind a reverse proxy like Nginx) or use a hosting provider that runs the server/runtime for you. Locally, `npm run start` does not build assets; you run `npm run build` first, then `npm run start` runs the server in the foreground of your terminal until you stop it.
2. **Handle incoming requests**
   - Each request is matched to a route (from `app/` or `pages/`).
3. **Render and respond**
   - For static pages, Next.js serves pre-rendered HTML.
   - For dynamic pages, Next.js renders on the server and returns fresh HTML.
4. **Send client JavaScript**
   - The browser downloads JS bundles to enable client-side navigation and hydration.

## Request Lifecycle (Step by Step)

This is the typical flow for a page request in the App Router. The `/about` path is just an example.

1. **Request arrives**
   - A browser asks for `/about`.
   - run middleware here if there is any
2. **Route match**
   - Next.js maps `/about` to `app/about/page.js`.
3. **Load server components**
   - Server components are executed on the server to produce HTML.
4. **Fetch data**
   - If the route calls `fetch`, the server loads data during rendering.
5. **Generate HTML**
   - The server creates HTML and a payload for the client.
6. **Send response**
   - HTML is sent to the browser as the response.
7. **Hydrate in the browser**
   - Client components run in the browser to add interactivity.

## Where Code Runs (Server vs Client)

- **Server components**: Run on the server (a Node.js runtime that executes Next.js). In local dev, this is the dev server started by `npm run dev`. In production, it is either your own Node.js server running `npm run start` or a hosting provider's server runtime (for example Vercel's serverless or edge environment).
- **Client components**: Run in the browser. They handle events like clicks and form input.
- **API routes / route handlers**: Server-side endpoints that return JSON or other data.

**Edge runtime note**: Some code can run on the edge instead of Node.js. Examples include `middleware` and route handlers that opt into the edge runtime (via `runtime = 'edge'`). In local dev, edge code is still served by `npm run dev`, but Next.js runs it in an edge-like runtime, which means it behaves like the edge environment (same APIs and restrictions) even though it is still running on your local machine. In production, the edge runtime is provided by the hosting platform (for example Vercel Edge Runtime).

**How you opt in**:

- **Client components**: Add `'use client'` at the top of a file to make it a client component.
- **Server components**: No directive is needed; server is the default in the App Router.
- **Edge runtime**: Set `export const runtime = 'edge'` in supported files (for example route handlers). Middleware runs on the edge by default.

Example for a client component:

```javascript
'use client';
```

Example for edge runtime (route handler):

```javascript
export const runtime = 'edge';
```

## Debugging and Troubleshooting (Next.js Specific)

This section lists common options and a simple workflow for debugging issues without specialized tools.

### Common Debugging Options

- **Dev error overlay**: In `npm run dev`, Next.js shows a browser overlay with stack traces and error details.
- **Server logs**: `console.log` in server components, route handlers, or middleware appears in the terminal running `next dev` or `next start`.
- **Client logs**: `console.log` in client components appears in the browser console.
- **Route segment error boundaries**: `app/.../error.js` lets you isolate errors to a specific route segment.
- **Build output**: The terminal output from `npm run build` (which runs `next build`) prints a route table and bundle sizes. This helps spot heavy routes. The compiled files themselves are written to `.next/`.

### Common Debugging Workflow for a Slow App

1. **Decide if the slowness is server or client**
   - If the initial request (TTFB) is slow, the server or data fetching is slow. In DevTools, click the request in the Network panel: Chrome shows a "Timing" tab, Firefox shows "Timings," and Safari shows timing details in the request pane/waterfall.
   - If the page loads fast but feels slow to interact, client-side JS or hydration is the issue.
2. **Check server-side bottlenecks**
   - Look for slow `fetch` calls in server components or route handlers by timing the call (log start/end in the server logs).
   - Use caching or revalidation where possible to avoid per-request work. Inspect your `fetch` options (`cache`, `next.revalidate`) and confirm behavior in logs.
   - Add a `loading.js` to stream UI while slow data resolves, then confirm it appears in the browser while the request is in flight.
3. **Check client-side bottlenecks**
   - Reduce `use client` usage so more rendering happens on the server. Verify by searching for `'use client'` directives in your code and compare bundle size changes in the build output.
   - Split large client bundles with dynamic imports when appropriate (code-splitting with `import()` or `next/dynamic`, similar to `React.lazy` but with Next.js-specific options). Confirm bundle size changes in the `npm run build` output.
   - Use React DevTools Profiler to find expensive components and confirm their render cost (how long they take to render and how often they re-render).
4. **Confirm the fix**
   - Re-run `npm run build` to verify bundle size changes.
   - Refresh and measure again in the browser's Network and Performance panels (check TTFB, JS size, and long tasks).

### Common Observability Tools (Optional)

If you do add tooling later, these are common in Next.js apps:

- **Error tracking**: Sentry, Bugsnag
- **Performance monitoring**: Datadog, New Relic
- **Logs**: Provider logs (Vercel, AWS, etc.) or structured logs to a log platform

Free options (self-hosted or free tiers):

- **Error tracking**: GlitchTip (self-hosted), Sentry free tier
- **Tracing/metrics**: OpenTelemetry + Jaeger or Zipkin (self-hosted)
- **Logs/metrics stack**: Grafana + Loki (logs) + Prometheus (metrics) + Tempo (traces) (self-hosted)

## Common Start Commands

- **`npm run dev`**: Start the dev server for local development.
- **`npm run build`**: Create a production build.
- **`npm run start`**: Serve the production build.

## Typical Lifecycle Summary

1. Install Node.js and create a Next.js project.
2. Start the dev server and build features locally.
3. Build the app for production.
4. Start the production server.
5. For each request, Next.js matches a route, renders, and responds.
