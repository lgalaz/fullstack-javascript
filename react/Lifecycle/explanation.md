# React Lifecycle

## Introduction

This folder explains the full lifecycle of a React app: how you set it up, how it starts, how rendering works, how updates happen, and how to debug. Every term is defined as it appears.

## Core Terms (Quick Definitions)

- **React**: A UI library for building component-based interfaces.
- **Component**: A reusable UI unit, either a function or a class.
- **Render**: React calling a component to get UI output (usually JSX).
- **JSX**: A syntax that looks like HTML but compiles to JavaScript (for example `<button>Hi</button>` becomes `React.createElement('button', null, 'Hi')` or, with the modern transform, `_jsx('button', { children: 'Hi' })`).
- **Virtual DOM**: React's in-memory representation of the UI.
- **Reconciliation**: React's process to compare old and new UI trees (current and work‑in‑progress fiber trees) and decide what changed.
- **Commit**: The phase where React applies changes to the real DOM.
- **State**: Data owned by a component that can change over time.
- **Props**: Inputs passed to a component by its parent.
- **Hook**: A function that adds React features to function components (for example `useState`).
- **Effect**: Code that runs after a render (for example in `useEffect`).
- **Hydration**: Attaching interactivity to server-rendered HTML.

## Setup: What You Need

1. **Install Node.js**
   - React tooling runs on Node.js.
2. **Choose a package manager**
   - Use `npm`, `yarn`, or `pnpm`.
3. **Create a new project**
   - Common CLI: `npm create vite@latest` or `npx create-react-app`.
   - This creates the folder structure and installs dependencies.
4. **Know your tooling**
   - **Vite**: A fast dev server and build tool (not a runtime). It runs on Node.js to serve and build your app, but the app itself runs in the browser.
   - **Runtime**: The environment that executes JavaScript (for example Node.js on your machine or the browser for client code).
   - **Vite vs. Node.js**: Vite is the tool; Node.js is the runtime that executes Vite on your machine. The app Vite serves runs in the browser, not in Node.

## Project Structure (What the Tooling Reads)

React itself does not enforce a file structure. Your build tool does.

Common files and folders:

- **`package.json`**: Lists dependencies and scripts like `dev`, `build`, and `preview`/`start` (`preview` often serves the production build locally; `start` is just a script name and different tools use it differently, for example CRA (Create React App) uses `start` for dev, while some tools use `start` to serve a production build).
- **`src/`**: Your application source code.
- **`public/`**: Static files copied as-is.
- **`index.html`**: The HTML entry point (Vite and similar tools). This is the file your static server serves, and it contains the root element where React mounts the app (similar to Vue).

## Development Lifecycle (Local Work)

This is what happens when you run the dev server (for example `npm run dev`).

1. **Read configuration**
   - The dev server reads its config and `package.json` scripts.
2. **Serve the entry HTML**
   - `index.html` loads your JS entry (for example `src/main.jsx`).
3. **Create a React root**
   - Your code calls `createRoot` and renders your app.
4. **Compile on demand**
   - The dev server transforms JSX and other files as they are requested.
5. **Watch for file changes**
   - The dev server listens for changes and triggers hot updates. It uses file-system watchers (OS events like macOS FSEvents, Linux inotify, Windows ReadDirectoryChangesW) and falls back to polling if events are unreliable.
6. **Render updates**
   - React re-renders components and applies changes to the DOM. If the page was server-rendered, the first client render is hydration, which attaches event handlers to the existing HTML instead of replacing it. The opposite is client-only rendering (no SSR), where the initial HTML is mostly empty and React builds the UI entirely in the browser. Note: both paths attach event handlers; hydration is specifically about reusing existing HTML instead of creating it from scratch and attaching handlers as it creates nodes. Hydration = attach handlers to already-rendered HTML + reconcile it without replacing it. Client-only render = create the HTML and handlers together.

## Production Build Lifecycle (Creating the Build)

This is what happens when you run `npm run build`.

1. **Compile and bundle**
   - JSX and modern JS are compiled for browsers.
   - Files are bundled for efficient loading.
2. **Optimize assets**
   - Minify JS and CSS, split code, and add hashes for caching.
3. **Write build output**
   - Output is written to the tool's build folder (often `dist/`). If you are using React through Next.js, the build output is written to `.next/` instead.

## Production Runtime (Serving Users)

In production, you serve the built files with a static server or CDN.

1. **Serve static assets**
   - HTML, JS, and CSS are served from `dist/`.
2. **Hydrate (if SSR is used)**
   - If you server-rendered HTML, React hydrates it on the client.
3. **Run in the browser**
   - React runs in the browser and handles updates.

## React Render Lifecycle (Step by Step)

This is the typical lifecycle for a render:

1. **Render phase (reconciliation happens here)**
   - React calls your components, builds the element tree, prepares a work-in-progress fiber tree, and reconciles it against the current fiber tree.
2. **Commit phase (hydration on first render if SSR)**
   - React applies DOM mutations or attaches to existing DOM, and updates the current fiber tree.
3. **Effects**
   3.1 `useLayoutEffect`
   3.2 paint
   3.3 `useEffect` runs after the DOM updates and paint.

## State and Updates

- **State updates** schedule a re-render. React does not mutate UI directly.
- **Immutability** matters because React detects updates by reference.
- **Batching** groups multiple updates into one render for performance.

## Where Code Runs

- **Client components**: Run in the browser.
- **Effects**: Run in the browser after commit (`useLayoutEffect` before paint, `useEffect` after paint).
- **SSR (if used)**: React renders components on the server to HTML. The same component code runs on the server for the initial render, then in the browser during hydration.

## Debugging and Troubleshooting (React Specific)

This section lists common options and a simple workflow for debugging issues without specialized tools.

### Common Debugging Options

- **React DevTools**: Inspect component tree, props, and state.
- **React DevTools Profiler**: Measure render time and re-render frequency.
- **Browser DevTools**: Network, Performance, and Console panels.
- **Console logs**: `console.log` in render and effects for quick tracing.

### Common Debugging Workflow for a Slow App

1. **Decide if the slowness is network or rendering**
   - Check Network timings and JS bundle size in DevTools.
2. **Check render cost**
   - Use React DevTools Profiler to find expensive components.
3. **Reduce unnecessary renders**
   - Memoize expensive components or stabilize props and callbacks.
4. **Confirm the fix**
   - Rebuild and re-measure in the Performance panel.

## Common Start Commands

- **`npm run dev`**: Start the dev server.
- **`npm run build`**: Create a production build.
- **`npm run preview`**: Serve the production build (Vite).
- **`npm start`**: Start the dev server (Create React App). To serve the production build, use a static server (for example `npx serve -s build`).

## Typical Lifecycle Summary

1. Create a project and start the dev server.
2. The browser loads `index.html` and the JS entry file.
3. React renders the app and updates the DOM.
4. Build the app for production to get optimized assets.
5. Serve the build and hydrate if SSR is used.

## Plain React SSR (no framework)

What you need:
- A server entry that renders HTML with `react-dom/server`.
- An HTML template that injects the rendered markup.
- A client entry that hydrates with `react-dom/client`.

Server example (Node):

```javascript
import express from 'express';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';

const app = express();

app.get('*', (req, res) => {
  const appHtml = renderToString(<App />);
  res.send(`
    <!doctype html>
    <html>
      <head><title>SSR App</title></head>
      <body>
        <div id="root">${appHtml}</div>
        <script type="module" src="/client-entry.js"></script>
      </body>
    </html>
  `);
});

app.listen(3000);
```

Client example:

```javascript
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';

hydrateRoot(document.getElementById('root'), <App />);
```

Server: handle all routes, render <App /> to HTML, inject into the template.
Client: hydrateRoot the same container to attach events.
If you add routing, you also need the router to use the same URL on server/client (e.g., StaticRouter on the server, BrowserRouter on the client).
Doing SSR “by hand” is a lot of boilerplate, which is why people use frameworks like Next.js, Remix/React Router, or TanStack Start.

Key point: the server renders the initial HTML, then the client hydrates the same markup to attach event handlers.
