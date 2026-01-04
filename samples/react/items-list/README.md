# React Items List (CDN, No JSX)

## Overview

This sample is a minimal React app that renders a table of users fetched from a local JSON file. It uses ESM imports from a CDN (`esm.sh`) and does not use JSX, so it can run with just a single `index.html` file and no build step.

## File Layout

- `samples/react/items-list/index.html`
  - HTML entry point and all app code (React is imported from a CDN).
- `samples/react/items-list/data/users.json`
  - Local data source used by `fetch`.

## How It Works

1) The browser loads `index.html`.
2) React and ReactDOM are imported from the CDN using ES modules.
3) `fetch('./data/users.json')` loads the user list.
4) The app renders a table using `React.createElement` (no JSX).

## Why A Local Server Is Required

Opening `index.html` directly with `file://` blocks `fetch` in most browsers. A static server gives the page a proper origin (e.g., `http://localhost`) so the JSON request is allowed.

## Run It Locally

```bash
cd samples/react/items-list
npx serve
```

Open the URL printed by `serve`.
