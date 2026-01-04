# React Auth with JWT (CDN + JSX)

## Overview

This sample is a client-only React demo that simulates JWT-based authentication. It loads a local JSON user list, lets you log in, generates a fake JWT in the browser, and stores it in localStorage. This is for learning only and is not secure.

## File Layout

- `samples/react/auth-jwt/index.html`
  - HTML entry point and all app code (React + Babel from CDN).
- `samples/react/auth-jwt/data/users.json`
  - Local user data used for login.

## How It Works

1) The browser loads `index.html`.
2) React and ReactDOM are loaded from a CDN, and Babel compiles JSX in the browser.
3) `fetch('./data/users.json')` loads the allowed user list.
4) Logging in generates a fake JWT and stores it in localStorage.
5) The UI shows the token and decoded payload.

## Why A Local Server Is Required

Opening `index.html` directly with `file://` blocks `fetch` in most browsers. Use a static server so the JSON request is allowed.

## Run It Locally

```bash
cd samples/react/auth-jwt
npx serve
```

Open the URL printed by `serve` and sign in with:

- name: `luis`
- password: `password`
