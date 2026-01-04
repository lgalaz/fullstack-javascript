# React Items List (CDN + JSX)

## Overview

This sample is a minimal React app that renders a table of users fetched from a local JSON file. It uses React/ReactDOM Universal Module Definitions builds from a CDN and Babel Standalone to transform JSX in the browser.

## File Layout

- `samples/react/items-list-jsx/index.html`
  - HTML entry point with inline JSX code.
- `samples/react/items-list-jsx/data/users.json`
  - Local data source used by `fetch`.

## How It Works

1) The browser loads `index.html`.
2) React and ReactDOM are loaded from the CDN.
3) Babel Standalone compiles the inline JSX.
4) `fetch('./data/users.json')` loads the user list.
5) The app renders a table with JSX.

## Why A Local Server Is Required

Opening `index.html` directly with `file://` blocks `fetch` in most browsers. A static server gives the page a proper origin (e.g., `http://localhost`) so the JSON request is allowed.

## Run It Locally

```bash
cd samples/react/items-list-jsx
npx serve
```

Open the URL printed by `serve`.
