# React CRUD Sample (Vite)

## What This Sample Includes

A standalone React CRUD app that manages an in-memory list of users seeded from a JSON file.

## Step-by-Step (If You Were Building It)

1) Create the project folder structure.
- `samples/react/crud/`
- `samples/react/crud/src/`
- `samples/react/crud/src/data/`

2) Add `package.json` with React + Vite dependencies and scripts.
- Scripts: `dev`, `build`, `preview`, plus SSR scripts (`dev:ssr`, `build:ssr`, `preview:ssr`)
- This example was created manually, but you could scaffold it with `npm create vite@latest` (React template) or `npx create-react-app` and then replace files as needed.

3) Add `index.html` as the HTML entry file.
- Contains a `<div id="root"><!--app-html--></div>` mount point for SSR.

4) Add `src/entry-client.jsx` to bootstrap React on the client.
- Hydrates when SSR markup exists, or falls back to `createRoot`.

5) Add `src/entry-server.jsx` to render the app to HTML on the server.
- Uses `renderToString` and returns the HTML string.

6) Add `src/App.jsx` for the CRUD UI.
- Uses `useState` for local state.
- Implements create, read, update, delete for users.

7) Add `src/data/users.json` for initial data.
- This is a simple seed list for the UI.

8) Add `src/App.css` for basic styling.

9) Add `vite.config.js` to enable React support.

10) Add `server.js` to run SSR in dev and production.

## File-by-File Purpose

- `samples/react/crud/package.json`
  - Declares dependencies and scripts.

- `samples/react/crud/index.html`
  - HTML entry point with the `#root` element.

- `samples/react/crud/src/entry-client.jsx`
  - Client entry (hydrates SSR markup or falls back to CSR).

- `samples/react/crud/src/entry-server.jsx`
  - Server entry (renders app to HTML string).

- `samples/react/crud/server.js`
  - SSR server (Vite middleware in dev, uses built assets in prod).

- `samples/react/crud/src/App.jsx`
  - Main UI component implementing CRUD.

- `samples/react/crud/src/data/users.json`
  - Seed data loaded into state on startup.

- `samples/react/crud/src/App.css`
  - Basic styling for layout and table.

- `samples/react/crud/vite.config.js`
  - Vite config enabling React plugin.

## How React Hooks Up To The Page

1) `index.html` defines the mount point: `<div id="root"><!--app-html--></div>`.
2) On the server, `entry-server.jsx` renders HTML into that placeholder.
3) On the client, `entry-client.jsx` hydrates the existing markup.

## Run It Locally (CSR)

```bash
npm install
npm run dev
```

## Run It Locally (SSR)

```bash
npm run dev:ssr
```

## Build + Run SSR

```bash
npm run build:ssr
npm run preview:ssr
```

## Tests

```bash
# Unit + component tests (Vitest)
npm run test

# One-off run
npm run test:run

# Coverage
npm run test:coverage

# End-to-end (Playwright)
npm run test:e2e
```
